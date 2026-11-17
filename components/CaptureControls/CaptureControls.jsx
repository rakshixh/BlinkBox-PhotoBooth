"use client";

import styles from "./CaptureControls.module.scss";
import { boothCopy, icons } from "@/data/data";

export default function CaptureControls({
  mode,
  setMode,
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
          <span>{icons.upload}</span> {boothCopy.uploadTabLabel}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "camera"}
          className={mode === "camera" ? styles.activeTab : ""}
          onClick={() => setMode("camera")}
        >
          <span>{icons.camera}</span> {boothCopy.cameraTabLabel}
        </button>
      </div>

      {mode === "upload" ? (
        <label className={styles.uploadBox}>
          <input type="file" accept="image/*" multiple onChange={onUpload} />
          <span className={styles.uploadIcon}>{icons.upload}</span>
          <span className={styles.uploadTitle}>{boothCopy.uploadLabel}</span>
          <span className={styles.uploadHint} id="upload-help">
            {boothCopy.uploadHint}
          </span>
          <span className={styles.fileTypes} id="upload-formats">
            {boothCopy.fileTypes}
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
                <span>{icons.camera}</span>
                <b>{boothCopy.cameraPreviewTitle}</b>
                <small>{boothCopy.cameraPermissionHint}</small>
              </div>
            )}
            {countdown !== null && (
              <div className={styles.countdown}>{countdown === 0 ? icons.sparkle : countdown}</div>
            )}
            {cameraError && <div className={styles.cameraError}>{cameraError}</div>}
          </div>
          <p>{boothCopy.cameraHint}</p>
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
                : boothCopy.captureLabel}
          </button>
        </div>
      )}

      <div className={styles.lowerRow}>
        <span className={styles.privacy}>
          <span>●</span> {boothCopy.privacyNote}
        </span>
        <button
          className={styles.download}
          type="button"
          disabled={!canDownload || busy}
          onClick={onDownload}
        >
          <span>{icons.download}</span>
          {downloadLabel || boothCopy.downloadLabel}
        </button>
      </div>
    </section>
  );
}
