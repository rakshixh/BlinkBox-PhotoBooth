'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { boothCopy, stripSettings } from '@/data/data';

const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export function usePhotoBoothSession({ format, onFormatChange }) {
  const [mode, setMode] = useState('upload');
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [busy, setBusy] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cameraRequestRef = useRef(0);
  const imageUrlsRef = useRef(new Set());

  const createImageUrl = useCallback((blob) => {
    const url = URL.createObjectURL(blob);
    imageUrlsRef.current.add(url);
    return url;
  }, []);

  const releaseUnusedImages = useCallback((nextImages) => {
    const inUse = new Set(nextImages);
    imageUrlsRef.current.forEach((url) => {
      if (!inUse.has(url)) {
        URL.revokeObjectURL(url);
        imageUrlsRef.current.delete(url);
      }
    });
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  const changeFormat = (nextFormat) => {
    if (nextFormat === format) return;
    onFormatChange(nextFormat);
    setImages([]);
    releaseUnusedImages([]);
    setActiveIndex(null);
    setUploadError('');
    setCameraError('');
  };

  const changeMode = async (nextMode) => {
    const requestId = ++cameraRequestRef.current;
    setMode(nextMode);
    setCameraError('');
    setUploadError('');

    if (nextMode === 'upload') {
      stopCamera();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(boothCopy.cameraUnavailable);
      return;
    }

    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      if (requestId !== cameraRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch {
      if (requestId === cameraRequestRef.current) setCameraError(boothCopy.cameraDenied);
    }
  };

  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      imageUrlsRef.current.forEach(URL.revokeObjectURL);
      imageUrlsRef.current.clear();
      cameraRequestRef.current += 1;
    },
    [],
  );

  const handleUpload = (event) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';
    setUploadError('');
    if (files.length === 0) return;
    if (files.some((file) => !file.type.startsWith('image/'))) {
      setUploadError(boothCopy.uploadTypeError);
      return;
    }

    const frameCount = format === 'strip' ? stripSettings.frameCount : 1;
    const isReplacingSingleFrame =
      format === 'strip' &&
      files.length === 1 &&
      activeIndex !== null &&
      images.length === frameCount;
    if (!isReplacingSingleFrame && files.length !== frameCount) {
      setUploadError(boothCopy.uploadCountError);
      return;
    }

    const nextImages = isReplacingSingleFrame
      ? images.map((image, index) => (index === activeIndex ? createImageUrl(files[0]) : image))
      : files.map(createImageUrl);
    setImages(nextImages);
    releaseUnusedImages(nextImages);
    setActiveIndex(null);
  };

  const captureFrame = () =>
    new Promise((resolve, reject) => {
      const video = videoRef.current;
      if (!video?.videoWidth || !video?.videoHeight) {
        reject(new Error('Camera is not ready'));
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) =>
          blob ? resolve(createImageUrl(blob)) : reject(new Error('Could not capture photo')),
        'image/jpeg',
        0.94,
      );
    });

  const startCapture = async () => {
    if (!cameraReady || busy) return;
    setBusy(true);
    const captured = [];
    try {
      const frameCount = format === 'strip' ? stripSettings.frameCount : 1;
      for (let photo = 0; photo < frameCount; photo += 1) {
        for (let number = 3; number > 0; number -= 1) {
          setCountdown(number);
          await wait(850);
        }
        setCountdown(0);
        await wait(220);
        captured.push(await captureFrame());
        setCountdown(null);
        if (photo < frameCount - 1) await wait(650);
      }
      setImages(captured);
      releaseUnusedImages(captured);
      setActiveIndex(null);
    } catch {
      releaseUnusedImages(images);
      setCameraError(boothCopy.captureFailed);
    } finally {
      setCountdown(null);
      setBusy(false);
    }
  };

  return {
    mode,
    images,
    setImages,
    activeIndex,
    setActiveIndex,
    cameraReady,
    cameraError,
    uploadError,
    countdown,
    busy,
    videoRef,
    changeFormat,
    changeMode,
    handleUpload,
    startCapture,
  };
}
