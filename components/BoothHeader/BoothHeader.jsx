import styles from './BoothHeader.module.scss';
import BrandMark from '@/components/BrandMark/BrandMark';
import { boothCopy } from '@/data/data';

export default function BoothHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="#top" aria-label={`${boothCopy.brand} home`}>
        <span className={styles.brandMark} aria-hidden="true">
          <BrandMark />
        </span>
        {boothCopy.brand}
        <span className={styles.period}>.</span>
      </a>
    </header>
  );
}
