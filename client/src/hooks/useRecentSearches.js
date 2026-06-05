import { useState } from "react";

const STORAGE_KEY = "gh_recent_searches";
const MAX_ITEMS = 5;

export function useRecentSearches() {
  const [searches, setSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  function addSearch(username) {
    setSearches((prev) => {
      const filtered = prev.filter((s) => s !== username);
      const next = [username, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearSearches() {
    localStorage.removeItem(STORAGE_KEY);
    setSearches([]);
  }

  return { searches, addSearch, clearSearches };
}
