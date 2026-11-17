import styles from './BoothHeader.module.scss';
import BrandMark from '@/components/BrandMark/BrandMark';
import { boothCopy } from '@/data/data';
import Icon from '@/components/Icon/Icon';

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
      <a
        className={styles.githubButton}
        href={boothCopy.githubRepositoryUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View this project on GitHub"
      >
        <Icon name="github" size={18} />
        <span>GitHub</span>
      </a>
    </header>
  );
}
