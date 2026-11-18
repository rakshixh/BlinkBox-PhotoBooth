'use client';

import { backgrounds, boothCopy } from '@/data/data';
import HorizontalPicker from '@/components/HorizontalPicker/HorizontalPicker';
import BackdropSurface from '@/components/BackdropSurface/BackdropSurface';

export default function BackdropPicker({ selected, onSelect }) {
  return (
    <HorizontalPicker
      ariaLabel={boothCopy.activeBackgroundLabel}
      title={boothCopy.backgroundHeading}
      count={`${String(backgrounds.length).padStart(2, '0')} ${boothCopy.backgroundCountSuffix}`}
      items={backgrounds}
      selectedId={selected.id}
      onSelect={onSelect}
      renderSwatch={(background, className) => (
        <BackdropSurface as="span" background={background} className={className} ariaHidden />
      )}
    />
  );
}
