'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import BoothHeader from '@/components/BoothHeader/BoothHeader';
import BoothArtifact from '@/components/BoothArtifact/BoothArtifact';
import StripPreview from '@/components/StripPreview/StripPreview';
import CaptureControls from '@/components/CaptureControls/CaptureControls';
import FilterGallery from '@/components/FilterGallery/FilterGallery';
import FormatPicker from '@/components/FormatPicker/FormatPicker';
import { usePhotoBoothSession } from '@/hooks/usePhotoBoothSession';
import { useOfflineAppCache } from '@/hooks/useOfflineAppCache';
import styles from './PhotoBooth.module.scss';
import { backgrounds, boothCopy, captionStyles, filters, stripSettings } from '@/data/data';

const BackdropPicker = dynamic(() => import('@/components/BackdropPicker/BackdropPicker'));
const StripCustomization = dynamic(
  () => import('@/components/StripCustomization/StripCustomization'),
);
const DownloadCountdownModal = dynamic(
  () => import('@/components/DownloadCountdownModal/DownloadCountdownModal'),
);

export default function PhotoBooth() {
  const [format, setFormat] = useState('strip');
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [selectedBackdrop, setSelectedBackdrop] = useState(backgrounds[0]);
  const [caption, setCaption] = useState(boothCopy.defaultCaption);
  const [includeDate, setIncludeDate] = useState(true);
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState(captionStyles[0]);
  const [downloadNoticeOpen, setDownloadNoticeOpen] = useState(false);
  const session = usePhotoBoothSession({ format, onFormatChange: setFormat });
  const {
    mode,
    images,
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
  } = session;

  useOfflineAppCache();

  const requestDownload = () => setDownloadNoticeOpen(true);

  const completeDownload = async () => {
    setDownloadNoticeOpen(false);
    const { exportPhotoDesign } = await import('@/lib/photoExport');
    await exportPhotoDesign({
      images,
      format,
      filter: selectedFilter,
      background: selectedBackdrop,
      caption,
      includeDate,
      captionStyle: selectedCaptionStyle,
    });
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
            <FormatPicker format={format} busy={busy} onChange={changeFormat} />
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
                onDownload={requestDownload}
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
      {downloadNoticeOpen && (
        <DownloadCountdownModal
          open
          seconds={boothCopy.downloadCountdownSeconds}
          title={boothCopy.downloadCountdownTitle}
          message={boothCopy.downloadCountdownMessage}
          countdownMessage={boothCopy.downloadCountdownLabel}
          contributionLabel={boothCopy.downloadContributionLabel}
          contributionHref={boothCopy.githubRepositoryUrl}
          onComplete={completeDownload}
        />
      )}
    </main>
  );
}
