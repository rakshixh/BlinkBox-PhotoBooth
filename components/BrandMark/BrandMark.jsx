import styles from "./BrandMark.module.scss";

export default function BrandMark() {
  return (
    <svg
      className={styles.mark}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path className={styles.echo} d="M14 4.5h15a3 3 0 0 1 3 3v20" />
      <path className={styles.frame} d="M8 8.5h17a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-20a3 3 0 0 1 3-3Z" />
      <path className={styles.viewfinder} d="M9.5 12h14v13h-14z" />
      <path className={styles.flash} d="m18.5 12.5-5.1 8h4.3l-1.2 6.1 7.2-9.2h-4.5l2.1-4.9z" />
      <circle className={styles.status} cx="29.5" cy="9" r="2.2" />
      <path className={styles.captionLine} d="M10 29h7m3 0h3" />
    </svg>
  );
}
