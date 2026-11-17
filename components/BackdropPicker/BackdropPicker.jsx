"use client";

import { backgroundGroups, backgrounds, boothCopy } from "@/data/data";
import styles from "./BackdropPicker.module.scss";

export default function BackdropPicker({
  selected,
  onSelect,
}) {
  return (
    <section className={styles.section} aria-label={boothCopy.activeBackgroundLabel}>
      <div className={styles.groups}>
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
