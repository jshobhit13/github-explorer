import styles from "./RecentSearches.module.css";

export function RecentSearches({ searches, onSelect, onClear }) {
  if (searches.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Recent:</span>
      {searches.map((s) => (
        <button key={s} className={styles.chip} onClick={() => onSelect(s)}>
          {s}
        </button>
      ))}
      <button className={styles.clear} onClick={onClear} aria-label="Clear recent searches">
        ✕
      </button>
    </div>
  );
}
