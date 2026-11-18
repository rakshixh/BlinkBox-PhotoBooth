'use client';

import styles from './StripCustomization.module.scss';
import { boothCopy, captionStyles } from '@/data/data';

export default function StripCustomization({
  caption,
  onCaptionChange,
  includeDate,
  onIncludeDateChange,
  captionStyle,
  onCaptionStyleChange,
}) {
  const captionLimit = includeDate
    ? boothCopy.captionMaxLength
    : boothCopy.captionMaxLengthWithoutDate;
  const handleDateChange = (checked) => {
    if (checked && caption.length > boothCopy.captionMaxLength) {
      onCaptionChange(caption.slice(0, boothCopy.captionMaxLength));
    }
    onIncludeDateChange(checked);
  };

  return (
    <section className={styles.section} aria-label={boothCopy.customizationLabel}>
      <div className={styles.heading}>
        <h2 id="custom-caption-heading">{boothCopy.customizationHeading}</h2>
      </div>

      <div className={styles.captionField}>
        <input
          id="strip-caption"
          type="text"
          aria-labelledby="custom-caption-heading"
          maxLength={captionLimit}
          value={caption}
          placeholder={boothCopy.captionPlaceholder}
          onChange={(event) => onCaptionChange(event.target.value)}
        />
        <div className={styles.captionMeta}>
          <span>{boothCopy.captionHelper}</span>
          <span>
            {caption.length}/{captionLimit}
          </span>
        </div>
      </div>

      <div className={styles.optionRow}>
        <fieldset className={styles.captionStyle}>
          <legend>{boothCopy.captionStyleHeading}</legend>
          <div>
            {captionStyles.map((option) => (
              <button
                className={captionStyle.id === option.id ? styles.active : ''}
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
        <label className={styles.dateToggle}>
          <input
            type="checkbox"
            checked={includeDate}
            onChange={(event) => handleDateChange(event.target.checked)}
          />
          <span className={styles.checkmark} aria-hidden="true" />
          <span>{boothCopy.includeDateLabel}</span>
        </label>
      </div>
    </section>
  );
}
