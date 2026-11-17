"use client";

import styles from "./StripCustomization.module.scss";
import { borderStyles, boothCopy, captionStyles } from "@/data/data";

export default function StripCustomization({
  border,
  onBorderChange,
  edgeEnabled,
  onEdgeEnabledChange,
  caption,
  onCaptionChange,
  includeDate,
  onIncludeDateChange,
  captionStyle,
  onCaptionStyleChange,
}) {
  return (
    <section className={styles.section} aria-label={boothCopy.customizationLabel}>
      <div className={styles.heading}>
        <div>
          <h2>{boothCopy.customizationHeading}</h2>
          <p>{boothCopy.borderHint}</p>
        </div>
      </div>

      <label className={styles.edgeToggle}>
        <input type="checkbox" checked={edgeEnabled} onChange={(event) => onEdgeEnabledChange(event.target.checked)} />
        <span className={styles.switch} aria-hidden="true" />
        <span>{boothCopy.borderFieldLabel}</span>
      </label>
      {edgeEnabled && <fieldset className={styles.fieldset}>
        <legend>{boothCopy.edgeStyleLabel}</legend>
        <div className={styles.borderGrid}>
          {borderStyles.map((option) => (
            <button
              className={styles.borderOption}
              type="button"
              key={option.id}
              onClick={() => onBorderChange(option)}
              aria-pressed={border.id === option.id}
            >
              <span className={`${styles.borderSwatch} ${styles[option.id]}`} aria-hidden="true">
                <i />
                <i />
                <i />
                <b />
              </span>
              <span className={styles.optionName}>{option.name}</span>
              <span className={styles.optionNote}>{option.note}</span>
            </button>
          ))}
        </div>
      </fieldset>}

      <div className={styles.captionField}>
        <label htmlFor="strip-caption">{boothCopy.captionHeading}</label>
        <input
          id="strip-caption"
          type="text"
          maxLength={boothCopy.captionMaxLength}
          value={caption}
          placeholder={boothCopy.captionPlaceholder}
          onChange={(event) => onCaptionChange(event.target.value)}
        />
        <div className={styles.captionMeta}>
          <span>{boothCopy.captionHelper}</span>
          <span>
            {caption.length}/{boothCopy.captionMaxLength}
          </span>
        </div>
      </div>

      <div className={styles.optionRow}>
        <label className={styles.dateToggle}>
          <input
            type="checkbox"
            checked={includeDate}
            onChange={(event) => onIncludeDateChange(event.target.checked)}
          />
          <span className={styles.checkmark} aria-hidden="true" />
          <span>{boothCopy.includeDateLabel}</span>
        </label>
        <fieldset className={styles.captionStyle}>
          <legend>{boothCopy.captionStyleHeading}</legend>
          <div>
            {captionStyles.map((option) => (
              <button
                className={captionStyle.id === option.id ? styles.active : ""}
                type="button"
                key={option.id}
                onClick={() => onCaptionStyleChange(option)}
                aria-pressed={captionStyle.id === option.id}
                style={{ fontFamily: `var(${option.fontToken})`, fontStyle: option.fontStyle }}
              >
                {option.name}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </section>
  );
}
