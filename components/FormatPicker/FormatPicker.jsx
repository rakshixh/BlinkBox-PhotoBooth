'use client';

import Icon from '@/components/Icon/Icon';
import { boothCopy } from '@/data/data';
import styles from './FormatPicker.module.scss';

const formats = [
  {
    id: 'photo',
    title: boothCopy.singleFormatLabel,
    detail: boothCopy.singleFormatHint,
  },
  {
    id: 'polaroid',
    title: boothCopy.polaroidFormatLabel,
    detail: boothCopy.polaroidFormatHint,
  },
  {
    id: 'strip',
    title: boothCopy.stripFormatLabel,
    detail: boothCopy.stripFormatHint,
    mobileDetail: boothCopy.stripFormatMobileHint,
  },
];

export default function FormatPicker({ format, busy, onChange }) {
  return (
    <div className={styles.picker} role="group" aria-label={boothCopy.formatPickerLabel}>
      {formats.map((option) => (
        <button
          key={option.id}
          type="button"
          disabled={busy}
          aria-pressed={format === option.id}
          className={format === option.id ? styles.selected : ''}
          onClick={() => onChange(option.id)}
        >
          <span className={styles.mark}>
            <Icon name={option.id} size={22} />
          </span>
          <span>
            <b>{option.title}</b>
            <small>
              <span className={option.mobileDetail ? styles.desktopHint : undefined}>
                {option.detail}
              </span>
              {option.mobileDetail && (
                <span className={styles.mobileHint}>{option.mobileDetail}</span>
              )}
            </small>
          </span>
        </button>
      ))}
    </div>
  );
}
