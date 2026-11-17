'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import BoothHeader from '@/components/BoothHeader/BoothHeader';
import BoothArtifact from '@/components/BoothArtifact/BoothArtifact';
import StripPreview from '@/components/StripPreview/StripPreview';
import CaptureControls from '@/components/CaptureControls/CaptureControls';
import BackdropPicker from '@/components/BackdropPicker/BackdropPicker';
import FilterGallery from '@/components/FilterGallery/FilterGallery';
import StripCustomization from '@/components/StripCustomization/StripCustomization';
import Icon from '@/components/Icon/Icon';
import styles from './PhotoBooth.module.scss';
import {
  backgrounds,
  borderStyles,
  boothCopy,
  captionStyles,
  filters,
  stripSettings,
} from '@/data/data';
import { formatPhotoDate } from '@/lib/formatPhotoDate';

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

export default function PhotoBooth() {
  const [format, setFormat] = useState('strip');
  const [mode, setMode] = useState('upload');
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [selectedBackdrop, setSelectedBackdrop] = useState(
    backgrounds.find((background) => background.id === 'paper-classic'),
  );
  const [selectedBorder, setSelectedBorder] = useState(borderStyles[0]);
  const [edgeEnabled, setEdgeEnabled] = useState(false);
  const [caption, setCaption] = useState(boothCopy.defaultCaption);
  const [includeDate, setIncludeDate] = useState(true);
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState(captionStyles[0]);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [busy, setBusy] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cameraRequestRef = useRef(0);
  const imageUrlsRef = useRef(new Set());

  const createImageUrl = (blob) => {
    const url = URL.createObjectURL(blob);
    imageUrlsRef.current.add(url);
    return url;
  };

  const releaseUnusedImages = (nextImages) => {
    const inUse = new Set(nextImages);
    imageUrlsRef.current.forEach((url) => {
      if (!inUse.has(url)) {
        URL.revokeObjectURL(url);
        imageUrlsRef.current.delete(url);
      }
    });
  };

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);
  const changeFormat = (nextFormat) => {
    if (nextFormat === format) return;
    setFormat(nextFormat);
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

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        const workerUrl = new URL('/service-worker.js', location.origin).href;
        registrations
          .filter((registration) =>
            [registration.active, registration.waiting, registration.installing].some(
              (worker) => worker?.scriptURL === workerUrl,
            ),
          )
          .forEach((registration) => registration.unregister());
      });
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith('blinkbox-shell-'))
              .map((key) => caches.delete(key)),
          ),
        );
      return;
    }

    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() =>
        navigator.serviceWorker.ready.then((registration) => {
          const assets = performance
            .getEntriesByType('resource')
            .map((entry) => new URL(entry.name))
            .filter(
              (url) => url.origin === location.origin && url.pathname.startsWith('/_next/static/'),
            )
            .map((url) => url.href);
          registration.active?.postMessage({ type: 'CACHE_APP_ASSETS', assets });
        }),
      )
      .catch(() => {});
  }, []);

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
      if (!video?.videoWidth || !video?.videoHeight)
        return reject(new Error('Camera is not ready'));
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

  const downloadStrip = async () => {
    if (images.length === 0) return;
    if (format === 'photo') {
      await downloadBarePhoto(images[0], selectedFilter);
      return;
    }
    const canvas = document.createElement('canvas');
    const singlePhoto = format === 'polaroid';
    const settings = singlePhoto ? stripSettings.polaroid : stripSettings;
    const { width, height, padding, gap = 0, photoHeight } = settings;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    const rootStyles = getComputedStyle(document.documentElement);
    const paperBackgroundToken = selectedBackdrop.baseToken;
    context.fillStyle = rootStyles.getPropertyValue(paperBackgroundToken).trim();
    context.fillRect(0, 0, width, height);
    drawBackdropPattern(context, selectedBackdrop, rootStyles, width, height);
    const photoWidth = width - padding * 2;

    for (let index = 0; index < images.length; index += 1) {
      const image = new Image();
      image.src = images[index];
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });
      const x = padding;
      const y = padding + index * (photoHeight + gap);
      const scale = Math.max(photoWidth / image.width, photoHeight / image.height);
      const cropWidth = photoWidth / scale;
      const cropHeight = photoHeight / scale;
      const sourceX = (image.width - cropWidth) / 2;
      const sourceY = (image.height - cropHeight) / 2;
      context.save();
      context.beginPath();
      context.rect(x, y, photoWidth, photoHeight);
      context.clip();
      context.filter = selectedFilter.css;
      context.drawImage(
        image,
        sourceX,
        sourceY,
        cropWidth,
        cropHeight,
        x,
        y,
        photoWidth,
        photoHeight,
      );
      context.restore();
      if (selectedFilter.grade)
        applyFilmGrade(context, x, y, photoWidth, photoHeight, selectedFilter.grade);
      if (selectedFilter.grain > 0)
        addGrain(context, x, y, photoWidth, photoHeight, selectedFilter.grain, index + 1);
      if (selectedFilter.vignette > 0)
        addVignette(context, x, y, photoWidth, photoHeight, selectedFilter.vignette, rootStyles);
      if (edgeEnabled) {
        context.strokeStyle = rootStyles.getPropertyValue(selectedBorder.edgeToken).trim();
        context.lineWidth = selectedBorder.edgeWidth;
        context.strokeRect(
          x + context.lineWidth / 2,
          y + context.lineWidth / 2,
          photoWidth - context.lineWidth,
          photoHeight - context.lineWidth,
        );
      }
    }

    const paperInkToken = selectedBackdrop.inkToken;
    context.fillStyle = rootStyles.getPropertyValue(paperInkToken).trim();
    context.textBaseline = 'middle';
    const rootFontSize = Number.parseFloat(rootStyles.fontSize);
    const monoFont = rootStyles.getPropertyValue('--mono').trim();
    const stampFontSize =
      Number.parseFloat(rootStyles.getPropertyValue('--font-export-stamp')) * rootFontSize;
    const metaFontSize =
      Number.parseFloat(rootStyles.getPropertyValue('--font-export-meta')) * rootFontSize;
    const captionFont = rootStyles.getPropertyValue(selectedCaptionStyle.fontToken).trim();
    const dateStamp = includeDate ? formatPhotoDate() : '';
    context.font = `${selectedCaptionStyle.fontStyle} 500 ${stampFontSize}px ${captionFont}`;
    context.textAlign = 'left';
    const dateWidth = includeDate ? metaFontSize * dateStamp.length * 0.62 : 0;
    const captionMaxWidth = width - padding * 2 - dateWidth - (includeDate ? 24 : 0);
    if (caption.trim()) context.fillText(caption.trim(), padding, height - 41, captionMaxWidth);
    if (includeDate) {
      context.textAlign = 'right';
      context.font = `${metaFontSize}px ${monoFont}`;
      context.fillText(dateStamp, width - padding, height - 41);
    }
    downloadCanvas(canvas, createOutputFilename(singlePhoto ? 'polaroid' : 'strip'));
  };

  return (
    <main className={styles.page} id="top">
      <div className={styles.shell}>
        <BoothHeader />
        <section className={styles.intro}>
          <div className={styles.introCopy}>
            <span className={styles.eyebrow}>
              <i />
              {boothCopy.eyebrow}
            </span>
            <div className={styles.artifactSlot}>
              <BoothArtifact />
            </div>
            <h1>
              {boothCopy.title.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p>{boothCopy.intro}</p>
          </div>
        </section>

        <section className={styles.booth} aria-label={boothCopy.boothSectionLabel}>
          <div className={styles.previewColumn}>
            <StripPreview
              format={format}
              images={images}
              filter={selectedFilter}
              activeIndex={activeIndex}
              onSelectImage={setActiveIndex}
              border={selectedBorder}
              edgeEnabled={edgeEnabled}
              background={selectedBackdrop}
              caption={caption}
              includeDate={includeDate}
              captionStyle={selectedCaptionStyle}
            />
          </div>
          <div className={styles.editorColumn}>
            <div className={styles.editorIntro}>
              <h2>{boothCopy.editorHeading}</h2>
              <p>{boothCopy.editorHint}</p>
            </div>
            <div
              className={styles.formatPicker}
              role="group"
              aria-label={boothCopy.formatPickerLabel}
            >
              {[
                {
                  id: 'photo',
                  title: boothCopy.singleFormatLabel,
                  detail: boothCopy.singleFormatHint,
                },
                {
                  id: 'polaroid',
                  title: boothCopy.polaroidFormatLabel,
                  detail: boothCopy.polaroidFormatHint,
                },
                {
                  id: 'strip',
                  title: boothCopy.stripFormatLabel,
                  detail: boothCopy.stripFormatHint,
                },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={busy}
                  aria-pressed={format === option.id}
                  className={format === option.id ? styles.selectedFormat : ''}
                  onClick={() => changeFormat(option.id)}
                >
                  <span className={styles.formatMark}>
                    <Icon name={option.id} size={22} />
                  </span>
                  <span>
                    <b>{option.title}</b>
                    <small>{option.detail}</small>
                  </span>
                </button>
              ))}
            </div>
            <div className={styles.sourceEditor}>
              <CaptureControls
                mode={mode}
                setMode={changeMode}
                format={format}
                videoRef={videoRef}
                cameraReady={cameraReady}
                busy={busy}
                countdown={countdown}
                onUpload={handleUpload}
                uploadError={uploadError}
                onStartCapture={startCapture}
                onDownload={downloadStrip}
                downloadLabel={
                  format === 'photo'
                    ? boothCopy.downloadPhotoLabel
                    : format === 'polaroid'
                      ? boothCopy.downloadPolaroidLabel
                      : boothCopy.downloadLabel
                }
                canDownload={images.length === (format === 'strip' ? stripSettings.frameCount : 1)}
                cameraError={cameraError}
              />
            </div>
            <div className={styles.liveEditor}>
              <FilterGallery selected={selectedFilter} onSelect={setSelectedFilter} />
              {format !== 'photo' && (
                <BackdropPicker selected={selectedBackdrop} onSelect={setSelectedBackdrop} />
              )}
              {format !== 'photo' && (
                <StripCustomization
                  border={selectedBorder}
                  onBorderChange={setSelectedBorder}
                  edgeEnabled={edgeEnabled}
                  onEdgeEnabledChange={setEdgeEnabled}
                  caption={caption}
                  onCaptionChange={setCaption}
                  includeDate={includeDate}
                  onIncludeDateChange={setIncludeDate}
                  captionStyle={selectedCaptionStyle}
                  onCaptionStyleChange={setSelectedCaptionStyle}
                />
              )}
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>{boothCopy.footerNote}</span>
          <span>{boothCopy.footerMeta}</span>
        </footer>
      </div>
    </main>
  );
}

function addGrain(context, x, y, width, height, amount, seed) {
  const pixels = context.getImageData(x, y, width, height);
  let value = seed * 7919;
  for (let i = 0; i < pixels.data.length; i += 4) {
    value = (value * 16807) % 2147483647;
    const noise = (value / 2147483647 - 0.5) * amount * 105;
    pixels.data[i] = Math.max(0, Math.min(255, pixels.data[i] + noise));
    pixels.data[i + 1] = Math.max(0, Math.min(255, pixels.data[i + 1] + noise));
    pixels.data[i + 2] = Math.max(0, Math.min(255, pixels.data[i + 2] + noise));
  }
  context.putImageData(pixels, x, y);
}

function addVignette(
  context,
  x,
  y,
  width,
  height,
  strength,
  rootStyles = getComputedStyle(document.documentElement),
) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const radius = Math.hypot(width / 2, height / 2);
  const vignette = context.createRadialGradient(
    centerX,
    centerY,
    radius * 0.38,
    centerX,
    centerY,
    radius,
  );
  const ink = rootStyles.getPropertyValue('--film-vignette-ink').trim();
  vignette.addColorStop(0, rootStyles.getPropertyValue('--transparent').trim());
  vignette.addColorStop(0.72, withAlpha(ink, strength * 0.35));
  vignette.addColorStop(1, withAlpha(ink, strength));
  context.fillStyle = vignette;
  context.fillRect(x, y, width, height);
}

async function downloadBarePhoto(source, filter) {
  const image = await loadImage(source);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d');
  context.save();
  context.filter = filter.css;
  context.drawImage(image, 0, 0);
  context.restore();
  if (filter.grade) applyFilmGrade(context, 0, 0, canvas.width, canvas.height, filter.grade);
  if (filter.grain > 0) addGrain(context, 0, 0, canvas.width, canvas.height, filter.grain, 1);
  if (filter.vignette > 0) addVignette(context, 0, 0, canvas.width, canvas.height, filter.vignette);
  downloadCanvas(canvas, createOutputFilename('photo'));
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, 'image/png');
}

function createOutputFilename(layout) {
  const date = new Date();
  const two = (value) => String(value).padStart(2, '0');
  const three = (value) => String(value).padStart(3, '0');
  const timestamp = `${date.getFullYear()}${two(date.getMonth() + 1)}${two(date.getDate())}-${two(date.getHours())}${two(date.getMinutes())}${two(date.getSeconds())}${three(date.getMilliseconds())}`;
  const unique =
    globalThis.crypto?.randomUUID?.().slice(0, 6) ?? Math.random().toString(36).slice(2, 8);
  return boothCopy.outputFilenameTemplate
    .replace('{layout}', layout)
    .replace('{timestamp}', timestamp)
    .replace('{unique}', unique);
}

function withAlpha(hexColor, alpha) {
  const hex = hexColor.replace('#', '');
  const alphaHex = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${hex}${alphaHex}`;
}

function drawBackdropPattern(context, backdrop, rootStyles, width, height) {
  const accent = rootStyles.getPropertyValue(backdrop.accentToken).trim();
  if (backdrop.pattern === 'dots') {
    context.fillStyle = accent;
    for (let y = 14; y < height; y += 28) {
      for (let x = 14; x < width; x += 28) {
        context.beginPath();
        context.arc(x, y, 2.2, 0, Math.PI * 2);
        context.fill();
      }
    }
  } else if (backdrop.pattern === 'stars') {
    context.fillStyle = accent;
    for (let y = 16; y < height; y += 34) {
      for (let x = y % 68 ? 16 : 33; x < width; x += 34) drawStar(context, x, y, 5, 6, 2.5);
    }
  } else if (backdrop.pattern === 'velvet' || backdrop.pattern === 'curtain') {
    const spacing = backdrop.pattern === 'velvet' ? 135 : 105;
    for (let x = 0; x < width; x += spacing) {
      const fold = context.createLinearGradient(x, 0, x + spacing * 0.55, 0);
      fold.addColorStop(0, rootStyles.getPropertyValue('--transparent').trim());
      fold.addColorStop(0.35, accent);
      fold.addColorStop(1, rootStyles.getPropertyValue('--transparent').trim());
      context.fillStyle = fold;
      context.fillRect(x, 0, spacing * 0.75, height);
    }
  }
}

function drawStar(context, centerX, centerY, points, outerRadius, innerRadius) {
  context.beginPath();
  for (let point = 0; point < points * 2; point += 1) {
    const angle = (Math.PI * point) / points - Math.PI / 2;
    const radius = point % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (point === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
  context.fill();
}

function applyFilmGrade(context, x, y, width, height, grade) {
  const pixels = context.getImageData(x, y, width, height);
  const data = pixels.data;
  for (let index = 0; index < data.length; index += 4) {
    const luminance =
      (data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722) / 255;
    if (grade === 'fxn-r') {
      const highlights = luminance;
      const shadows = 1 - luminance;
      data[index] += 5 * highlights - 2 * shadows;
      data[index + 1] += 2 * highlights + 3 * shadows;
      data[index + 2] -= 4 * highlights - 5 * shadows;
    } else if (grade === 'classic-u') {
      data[index] = (data[index] - 128) * 1.08 + 128 + 5;
      data[index + 1] = (data[index + 1] - 128) * 1.06 + 128 + 1;
      data[index + 2] = (data[index + 2] - 128) * 1.04 + 128 - 5;
    } else if (grade === 's67-fc100') {
      const highlights = luminance;
      const shadows = 1 - luminance;
      data[index] += 2 * highlights + 3 * shadows;
      data[index + 1] -= 1 * highlights;
      data[index + 2] += 5 * highlights + 7 * shadows;
    }
    data[index] = Math.max(0, Math.min(255, data[index]));
    data[index + 1] = Math.max(0, Math.min(255, data[index + 1]));
    data[index + 2] = Math.max(0, Math.min(255, data[index + 2]));
  }
  context.putImageData(pixels, x, y);
}
