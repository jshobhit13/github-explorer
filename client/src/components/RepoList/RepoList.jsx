import { useState, useEffect, useCallback } from "react";
import { fetchRepos } from "../../services/githubService";
import { RepoCard } from "../RepoCard/RepoCard";
import { RepoSkeleton } from "../Skeleton/Skeleton";
import styles from "./RepoList.module.css";

const SORT_OPTIONS = [
  { value: "updated", label: "Recently updated" },
  { value: "stars", label: "Most stars" },
  { value: "full_name", label: "Name (A–Z)" },
];

export function RepoList({ username }) {
  const [repos, setRepos] = useState([]);
  const [sort, setSort] = useState("updated");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRepos = useCallback(
    async (newSort, newPage) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchRepos(username, newSort, newPage);
        setRepos((prev) => (newPage === 1 ? data.repos : [...prev, ...data.repos]));
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load repos");
      } finally {
        setLoading(false);
      }
    },
    [username]
  );

  useEffect(() => {
    setRepos([]);
    setPage(1);
    loadRepos(sort, 1);
  }, [username, sort, loadRepos]);

  function handleSortChange(newSort) {
    setSort(newSort);
    setPage(1);
  }

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    loadRepos(sort, nextPage);
  }

  return (
    <section>
      <div className={styles.toolbar}>
        <h3 className={styles.heading}>Repositories</h3>
        <div className={styles.sortGroup}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.sortBtn} ${sort === opt.value ? styles.active : ""}`}
              onClick={() => handleSortChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.list}>
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
        {loading && Array.from({ length: 3 }).map((_, i) => <RepoSkeleton key={i} />)}
      </div>

      {repos.length === 0 && !loading && !error && (
        <p className={styles.empty}>No repositories found.</p>
      )}

      {hasMore && !loading && (
        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMore} onClick={handleLoadMore}>
            Load more
          </button>
        </div>
      )}
    </section>
  );
}
