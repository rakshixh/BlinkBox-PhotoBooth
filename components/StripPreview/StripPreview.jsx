"use client";

import styles from "./StripPreview.module.scss";
import { boothCopy, stripSettings } from "@/data/data";
import { formatPhotoDate } from "@/lib/formatPhotoDate";

export default function StripPreview({
  images,
  filter,
  activeIndex,
  onSelectImage,
  border,
  background,
  backgroundEnabled,
  caption,
  includeDate,
  captionStyle,
}) {
  const cssFilter = filter?.css ?? "none";
  const singlePhoto = images.length === 1;
  const barePhoto = singlePhoto && !backgroundEnabled;
  const previewSettings = singlePhoto ? stripSettings.polaroid : stripSettings;
  const frameCount = images.length || stripSettings.frameCount;

  return (
    <div className={styles.previewArea}>
      <div className={styles.stageLabel}>
        <span>{singlePhoto ? boothCopy.polaroidLabel : boothCopy.stripLabel}</span>
        <span>{singlePhoto ? boothCopy.polaroidSequence : boothCopy.stripSequence}</span>
      </div>
      {barePhoto ? (
        <div className={styles.barePhoto}>
          <div
            className={styles.bareFrame}
            style={{
              "--photo-filter": cssFilter,
              "--photo-grain": filter?.grain ?? 0,
              "--photo-vignette-soft": `${(filter?.vignette ?? 0) * 35}%`,
              "--photo-vignette-full": `${(filter?.vignette ?? 0) * 100}%`,
            }}
          >
            <img src={images[0]} alt={`${boothCopy.photoAltPrefix} 1`} />
            {filter?.grade && (
              <span className={`${styles.gradeOverlay} ${styles[filter.grade] ?? ""}`} />
            )}
          </div>
        </div>
      ) : (
        <div className={`${styles.paperWrap} ${singlePhoto ? styles.polaroidWrap : ""}`}>
          <div
            className={`${styles.paper} ${styles[border.id] ?? ""} ${backgroundEnabled ? (styles[background.id] ?? "") : styles.plainPaper} ${singlePhoto ? styles.polaroid : ""}`}
            style={{
              "--photo-ratio": `${previewSettings.width - previewSettings.padding * 2} / ${previewSettings.photoHeight}`,
              "--photo-grain": filter?.grain ?? 0,
              "--photo-vignette-soft": `${(filter?.vignette ?? 0) * 35}%`,
              "--photo-vignette-full": `${(filter?.vignette ?? 0) * 100}%`,
              "--photo-pattern-size": background?.patternSize ?? "auto",
              "--photo-edge-width": border.edgeCssWidth,
            }}
          >
            {Array.from({ length: frameCount }, (_, index) => {
              const image = images[index];
              return (
                <button
                  className={`${styles.photo} ${activeIndex === index ? styles.selected : ""} ${image ? styles.filled : ""}`}
                  key={index}
                  type="button"
                  onClick={() => image && onSelectImage(index)}
                  aria-label={
                    image
                      ? `${boothCopy.selectPhotoLabel} ${index + 1}`
                      : `${boothCopy.emptyPhotoLabel} ${index + 1}`
                  }
                  style={{ "--photo-filter": cssFilter }}
                >
                  {image ? (
                    <img src={image} alt={`${boothCopy.photoAltPrefix} ${index + 1}`} />
                  ) : (
                    <span className={styles.placeholder}>
                      <i>{String(index + 1).padStart(2, "0")}</i>
                      <b>{boothCopy.emptyCaption}</b>
                    </span>
                  )}
                  {image && filter?.grade && (
                    <span className={`${styles.gradeOverlay} ${styles[filter.grade] ?? ""}`} />
                  )}
                  <span className={styles.frameNumber}>{String(index + 1).padStart(2, "0")}</span>
                </button>
              );
            })}
            {(!singlePhoto || backgroundEnabled) && (
              <div className={styles.paperFooter}>
                <span
                  className={
                    captionStyle.id === "serif" ? styles.captionSerif : styles.captionStamp
                  }
                >
                  {caption}
                </span>
                {includeDate && <span>{formatPhotoDate()}</span>}
              </div>
            )}
          </div>
        </div>
      )}
      <p className={styles.previewHint}>
        {barePhoto
          ? boothCopy.barePhotoHint
          : images.length
            ? boothCopy.frameSelectHint
            : boothCopy.stripPreviewHint}
      </p>
    </div>
  );
}
