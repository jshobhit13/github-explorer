import { useState, useCallback } from "react";
import { fetchUser, fetchRepos } from "./services/githubService";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { UserProfile } from "./components/UserProfile/UserProfile";
import { RepoList } from "./components/RepoList/RepoList";
import { LangChart } from "./components/LangChart/LangChart";
import { RecentSearches } from "./components/RecentSearches/RecentSearches";
import { ProfileSkeleton } from "./components/Skeleton/Skeleton";
import { useRecentSearches } from "./hooks/useRecentSearches";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [allRepos, setAllRepos] = useState([]);
  const [activeUsername, setActiveUsername] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState(null);

  const { searches, addSearch, clearSearches } = useRecentSearches();

  const handleSearch = useCallback(async (username) => {
    if (username === activeUsername) return;
    setLoadingProfile(true);
    setError(null);
    setUser(null);
    setAllRepos([]);

    try {
      const [userRes, reposRes] = await Promise.all([
        fetchUser(username),
        fetchRepos(username, "updated", 1),
      ]);
      setUser(userRes.data);
      setAllRepos(reposRes.data.repos);
      setActiveUsername(username);
      addSearch(username);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoadingProfile(false);
    }
  }, [activeUsername, addSearch]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="app-title-accent">GitHub</span> Explorer
        </h1>
        <p className="app-subtitle">Search any GitHub user and explore their repositories.</p>
      </header>

      <main className="app-main">
        <div className="search-section">
          <SearchBar onSearch={handleSearch} loading={loadingProfile} />
          <RecentSearches
            searches={searches}
            onSelect={handleSearch}
            onClear={clearSearches}
          />
        </div>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {loadingProfile && <ProfileSkeleton />}

        {!loadingProfile && user && (
          <>
            <UserProfile user={user} />
            <div className="content-grid">
              <div className="repos-col">
                <RepoList username={activeUsername} />
              </div>
              {allRepos.length > 0 && (
                <div className="chart-col">
                  <LangChart repos={allRepos} />
                </div>
              )}
            </div>
          </>
        )}

        {!loadingProfile && !user && !error && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p>Enter a GitHub username to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
