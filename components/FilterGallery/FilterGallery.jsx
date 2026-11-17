"use client";

import styles from "./FilterGallery.module.scss";
import { boothCopy, filters } from "@/data/data";
import Icon from "@/components/Icon/Icon";

export default function FilterGallery({ selected, onSelect }) {
  return (
    <section className={styles.section} aria-labelledby="filter-heading">
      <div className={styles.headingRow}>
        <div>
          <h2 id="filter-heading">{boothCopy.filterHeading}</h2>
          <p>{boothCopy.filterSubheading}</p>
        </div>
        <span className={styles.count}>
          {String(filters.length).padStart(2, "0")} {boothCopy.filterCountSuffix}
        </span>
      </div>
      <div className={styles.grid}>
        {filters.map((filter) => (
          <button
            type="button"
            key={filter.id}
            onClick={() => onSelect(filter)}
            className={`${styles.filter} ${selected.id === filter.id ? styles.active : ""}`}
            aria-pressed={selected.id === filter.id}
          >
            <span className={`${styles.swatch} ${styles[filter.id] ?? ""}`}>
              <span>{boothCopy.filterPreviewLabel}</span>
            </span>
            <span className={styles.filterName}>{filter.name}</span>
            <span className={styles.filterNote}>{filter.note}</span>
            {selected.id === filter.id && (
              <span className={styles.check} aria-hidden="true">
                <Icon name="check" size={14} />
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
