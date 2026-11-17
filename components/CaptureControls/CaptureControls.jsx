"use client";

import styles from "./CaptureControls.module.scss";
import { boothCopy } from "@/data/data";
import Icon from "@/components/Icon/Icon";

export default function CaptureControls({
  mode,
  setMode,
  format,
  videoRef,
  cameraReady,
  busy,
  countdown,
  onUpload,
  uploadError,
  onStartCapture,
  onDownload,
  downloadLabel,
  canDownload,
  cameraError,
}) {
  return (
    <section className={styles.controls} aria-label={boothCopy.controlsLabel}>
      <div className={styles.sourceTabs} role="tablist" aria-label={boothCopy.sourceTabsLabel}>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "upload"}
          className={mode === "upload" ? styles.activeTab : ""}
          onClick={() => setMode("upload")}
        >
          <span><Icon name="upload" /></span> {format === "strip" ? boothCopy.uploadThreePhotosLabel : boothCopy.uploadTabLabel}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "camera"}
          className={mode === "camera" ? styles.activeTab : ""}
          onClick={() => setMode("camera")}
        >
          <span><Icon name="camera" /></span> {format === "strip" ? boothCopy.cameraThreePhotosLabel : boothCopy.cameraSinglePhotoLabel}
        </button>
      </div>

      {mode === "upload" ? (
        <label className={styles.uploadBox}>
          <input type="file" accept="image/*" multiple={format === "strip"} onChange={onUpload} />
          <span className={styles.uploadIcon}><Icon name="upload" size={23} /></span>
          <span className={styles.uploadTitle}>{format === "strip" ? boothCopy.uploadStripLabel : boothCopy.uploadSingleLabel}</span>
          <span className={styles.uploadHint} id="upload-help">
            {format === "strip" ? boothCopy.uploadHintStrip : boothCopy.uploadHintSingle}
          </span>
          <span className={styles.fileTypes} id="upload-formats">
            {format === "strip" ? boothCopy.fileTypesStrip : boothCopy.fileTypesSingle}
          </span>
          {uploadError && (
            <span className={styles.uploadError} id="upload-error" role="alert">
              {uploadError}
            </span>
          )}
        </label>
      ) : (
        <div className={styles.cameraBox}>
          <div className={styles.cameraView}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              aria-label={boothCopy.cameraPreviewLabel}
            />
            {!cameraReady && (
              <div className={styles.cameraPlaceholder}>
                <span><Icon name="camera" size={34} /></span>
                <b>{boothCopy.cameraPreviewTitle}</b>
                <small>{boothCopy.cameraPermissionHint}</small>
              </div>
            )}
            {countdown !== null && (
              <div className={styles.countdown}>{countdown === 0 ? <Icon name="check" size={42} /> : countdown}</div>
            )}
            {cameraError && <div className={styles.cameraError}>{cameraError}</div>}
          </div>
          <p>{format === "strip" ? boothCopy.cameraHint : boothCopy.cameraSingleHint}</p>
          <button
            className={styles.captureButton}
            type="button"
            disabled={!cameraReady || busy}
            onClick={onStartCapture}
          >
            <span className={styles.shutter} />
            {busy
              ? boothCopy.cameraBusyLabel
              : canDownload
                ? boothCopy.retakeLabel
                : format === "strip" ? boothCopy.captureLabel : boothCopy.captureSingleLabel}
          </button>
        </div>
      )}

      <div className={styles.lowerRow}>
        <button
          className={styles.download}
          type="button"
          disabled={!canDownload || busy}
          onClick={onDownload}
        >
          <span className={styles.downloadIcon}><Icon name="download" /></span>
          <span>{downloadLabel || boothCopy.downloadLabel}</span>
        </button>
        <span className={styles.privacy}>
          <span className={styles.privacyIcon} aria-hidden="true"><Icon name="lock" size={14} /></span>
          <span>{boothCopy.privacyNote}</span>
        </span>
      </div>
    </section>
  );
}
