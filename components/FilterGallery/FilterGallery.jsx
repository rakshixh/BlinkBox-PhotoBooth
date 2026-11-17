'use client';

import styles from './FilterGallery.module.scss';
import { boothCopy, filters } from '@/data/data';
import HorizontalPicker from '@/components/HorizontalPicker/HorizontalPicker';

export default function FilterGallery({ selected, onSelect }) {
  return (
    <HorizontalPicker
      ariaLabel={boothCopy.filterPickerLabel}
      title={boothCopy.filterHeading}
      count={`${String(filters.length).padStart(2, '0')} ${boothCopy.filterCountSuffix}`}
      items={filters}
      selectedId={selected.id}
      onSelect={onSelect}
      getSwatchClassName={(filter) => styles[filter.id] ?? ''}
      previewLabel={boothCopy.filterPreviewLabel}
      className={styles.filterPicker}
    />
  );
}
