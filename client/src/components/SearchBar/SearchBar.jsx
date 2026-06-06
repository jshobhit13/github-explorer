import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import styles from "./SearchBar.module.css";

export function SearchBar({ onSearch, loading }) {
  const [input, setInput] = useState("");
  const debounced = useDebounce(input, 500);

  useEffect(() => {
    const trimmed = debounced.trim();
    if (trimmed.length > 0) onSearch(trimmed);
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          className={styles.input}
          type="text"
          placeholder="Search GitHub username…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="GitHub username"
          autoComplete="off"
          spellCheck={false}
        />
        {loading && <span className={styles.spinner} aria-label="Loading" />}
      </div>
      <button className={styles.button} type="submit" disabled={loading || !input.trim()}>
        Search
      </button>
    </form>
  );
}
