import BrandMark from '@/components/BrandMark/BrandMark';
import { boothCopy } from '@/data/data';
import styles from './BoothArtifact.module.scss';

export default function BoothArtifact() {
  return (
    <div className={styles.artifact} role="img" aria-label={boothCopy.heroArtifactLabel}>
      <span className={`${styles.backPrint} ${styles.backPrintBlush}`} aria-hidden="true" />
      <span className={`${styles.backPrint} ${styles.backPrintKraft}`} aria-hidden="true" />
      <article className={styles.print}>
        <header className={styles.printHeader}>
          <span>{boothCopy.brand}</span>
          <span>{boothCopy.heroArtifactTopline}</span>
        </header>
        <div className={styles.frames}>
          {boothCopy.heroArtifactFrames.map((frame) => (
            <div
              className={`${styles.photo} ${styles[frame.id] ?? ''}`}
              key={frame.id}
              aria-hidden="true"
            >
              <span>{frame.count}</span>
            </div>
          ))}
        </div>
        <footer className={styles.printFooter}>
          <span>{boothCopy.heroArtifactCaption}</span>
          <BrandMark />
        </footer>
      </article>
      <span className={styles.flashSticker} aria-hidden="true">
        <BrandMark />
      </span>
    </div>
  );
}
