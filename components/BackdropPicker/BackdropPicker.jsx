"use client";

import { backgroundGroups, backgrounds, boothCopy } from "@/data/data";
import styles from "./BackdropPicker.module.scss";

export default function BackdropPicker({
  selected,
  onSelect,
  enabled,
  onEnabledChange,
  singlePhoto,
}) {
  return (
    <section className={styles.section} aria-label={boothCopy.activeBackgroundLabel}>
      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => onEnabledChange(event.target.checked)}
        />
        <span className={styles.checkmark} aria-hidden="true" />
        <span className={styles.toggleCopy}>
          <b>{boothCopy.backgroundToggleLabel}</b>
          <small>
            {singlePhoto ? boothCopy.backgroundSinglePhotoHint : boothCopy.backgroundStripHint}
          </small>
        </span>
      </label>

      <div className={`${styles.groups} ${!enabled ? styles.disabled : ""}`}>
        {backgroundGroups.map((group) => (
          <section className={styles.group} key={group.id} aria-label={boothCopy[group.label]}>
            <h3>{boothCopy[group.label]}</h3>
            <div className={styles.options}>
              {backgrounds
                .filter((background) => background.group === group.id)
                .map((background) => (
                  <button
                    type="button"
                    key={background.id}
                    className={`${styles.option} ${selected.id === background.id ? styles.selected : ""}`}
                    aria-pressed={selected.id === background.id}
                    disabled={!enabled}
                    onClick={() => onSelect(background)}
                  >
                    <span
                      className={`${styles.swatch} ${styles[background.id]}`}
                      aria-hidden="true"
                    >
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className={styles.name}>{background.name}</span>
                    <span className={styles.note}>{background.note}</span>
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
