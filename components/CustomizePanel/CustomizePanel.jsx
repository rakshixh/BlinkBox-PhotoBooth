"use client";

import { useEffect, useRef, useState } from "react";
import BackdropPicker from "@/components/BackdropPicker/BackdropPicker";
import FilterGallery from "@/components/FilterGallery/FilterGallery";
import StripCustomization from "@/components/StripCustomization/StripCustomization";
import { boothCopy, customizeTabs } from "@/data/data";
import styles from "./CustomizePanel.module.scss";

export default function CustomizePanel({
  open,
  onClose,
  selectedBackdrop,
  onBackdropChange,
  backgroundEnabled,
  onBackgroundEnabledChange,
  selectedFilter,
  onFilterChange,
  border,
  onBorderChange,
  caption,
  onCaptionChange,
  includeDate,
  onIncludeDateChange,
  captionStyle,
  onCaptionStyleChange,
  singlePhoto,
}) {
  const [activeTab, setActiveTab] = useState(customizeTabs[0].id);
  const panelRef = useRef(null);
  const visibleTabs = customizeTabs.filter(
    (tab) => !(tab.id === "print" && singlePhoto && !backgroundEnabled),
  );

  useEffect(() => {
    if (activeTab === "print" && singlePhoto && !backgroundEnabled) setActiveTab("background");
  }, [activeTab, singlePhoto, backgroundEnabled]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (
        ["ArrowLeft", "ArrowRight"].includes(event.key) &&
        event.target.getAttribute("role") === "tab"
      ) {
        const tabs = Array.from(panelRef.current?.querySelectorAll('[role="tab"]') ?? []);
        const currentIndex = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
        if (currentIndex < 0 || tabs.length === 0) return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextTab = tabs[(currentIndex + direction + tabs.length) % tabs.length];
        nextTab.focus();
        nextTab.click();
      }
      if (event.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.scrim}
        aria-label={boothCopy.closeCustomizeLabel}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={boothCopy.customizeDialogLabel}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>{boothCopy.customizeEyebrow}</span>
            <h2>{boothCopy.customizationHeading}</h2>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={boothCopy.closeCustomizeLabel}
          >
            ×
          </button>
        </header>
        <nav className={styles.tabs} role="tablist" aria-label={boothCopy.customizeTabsLabel}>
          {visibleTabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              id={`customize-tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="customize-panel-content"
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={activeTab === tab.id ? styles.activeTab : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
        <div
          className={styles.content}
          id="customize-panel-content"
          role="tabpanel"
          aria-labelledby={`customize-tab-${activeTab}`}
          tabIndex={0}
        >
          {activeTab === "background" && (
            <BackdropPicker
              selected={selectedBackdrop}
              onSelect={onBackdropChange}
              enabled={backgroundEnabled}
              onEnabledChange={onBackgroundEnabledChange}
              singlePhoto={singlePhoto}
            />
          )}
          {activeTab === "film" && (
            <FilterGallery selected={selectedFilter} onSelect={onFilterChange} />
          )}
          {activeTab === "print" && (
            <StripCustomization
              border={border}
              onBorderChange={onBorderChange}
              caption={caption}
              onCaptionChange={onCaptionChange}
              includeDate={includeDate}
              onIncludeDateChange={onIncludeDateChange}
              captionStyle={captionStyle}
              onCaptionStyleChange={onCaptionStyleChange}
            />
          )}
        </div>
        <footer className={styles.footer}>
          <span>{boothCopy.previewLiveHint}</span>
          <button type="button" onClick={onClose}>
            {boothCopy.customizeDoneLabel}
          </button>
        </footer>
      </aside>
    </div>
  );
}
