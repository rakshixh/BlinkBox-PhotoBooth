import { useEffect, useRef, useState } from 'react';
import styles from './DownloadCountdownModal.module.scss';

export default function DownloadCountdownModal({
  open,
  seconds = 8,
  title,
  message,
  countdownMessage,
  contributionLabel,
  contributionHref,
  onComplete,
}) {
  const [remaining, setRemaining] = useState(seconds);
  const dialogRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    setRemaining(seconds);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    let current = seconds;
    const timer = window.setInterval(() => {
      current -= 1;
      setRemaining(current);
      if (current <= 0) {
        window.clearInterval(timer);
        onCompleteRef.current?.();
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [open, seconds]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <section
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-countdown-title"
        aria-describedby="download-countdown-message"
        tabIndex={-1}
      >
        <span className={styles.eyebrow}>BLINKBOX PHOTO BOOTH</span>
        <h2 id="download-countdown-title">{title}</h2>
        <p id="download-countdown-message">{message}</p>
        <a href={contributionHref} target="_blank" rel="noopener noreferrer">
          {contributionLabel}
        </a>
        <div className={styles.countdown} aria-live="polite" aria-atomic="true">
          <span>{countdownMessage}</span>
          <b>{remaining}</b>
        </div>
      </section>
    </div>
  );
}
