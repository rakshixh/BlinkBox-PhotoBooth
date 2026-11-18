import Icon from '@/components/Icon/Icon';
import styles from './HorizontalPicker.module.scss';

export default function HorizontalPicker({
  ariaLabel,
  title,
  count,
  items,
  selectedId,
  onSelect,
  getSwatchClassName,
  renderSwatch,
  previewLabel,
  className = '',
}) {
  return (
    <section className={`${styles.section} ${className}`} aria-label={ariaLabel}>
      <div className={styles.headingRow}>
        <h2>{title}</h2>
        <span className={styles.count}>{count}</span>
      </div>
      <div className={styles.options}>
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`${styles.option} ${selectedId === item.id ? styles.selected : ''}`}
            aria-pressed={selectedId === item.id}
            onClick={() => onSelect(item)}
          >
            {renderSwatch ? (
              renderSwatch(item, styles.swatch)
            ) : (
              <span
                className={`${styles.swatch} ${getSwatchClassName?.(item) ?? ''}`}
                aria-hidden="true"
              >
                {previewLabel && <span className={styles.previewLabel}>{previewLabel}</span>}
              </span>
            )}
            <span className={styles.name}>{item.name}</span>
            <span className={styles.note}>{item.note}</span>
            {selectedId === item.id && (
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
