import styles from './BackdropSurface.module.scss';

export default function BackdropSurface({
  background,
  as: Element = 'div',
  className = '',
  style = {},
  children,
  ariaHidden,
}) {
  return (
    <Element
      className={`${styles.surface} ${styles[background.id] ?? ''} ${className}`}
      aria-hidden={ariaHidden}
      style={{ '--photo-pattern-size': background.patternSize ?? 'auto', ...style }}
    >
      {children}
    </Element>
  );
}
