import { useState } from "react";
import { timeAgo } from "../../utils/formatDate";
import styles from "./RepoCard.module.css";

const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  Java: "#b07219", "C++": "#f34b7d", Go: "#00ADD8", Rust: "#dea584",
  Ruby: "#701516", PHP: "#4F5D95", CSS: "#563d7c", HTML: "#e34c26",
  Shell: "#89e051", Kotlin: "#A97BFF", Swift: "#FA7343", Dart: "#00B4AB",
};

export function RepoCard({ repo }) {
  const [expanded, setExpanded] = useState(false);
  const langColor = LANG_COLORS[repo.language] || "#8b949e";

  return (
    <div className={styles.card}>
      <div
        className={styles.header}
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className={styles.titleRow}>
          <a
            className={styles.repoName}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {repo.name}
          </a>
          {repo.topics?.slice(0, 3).map((t) => (
            <span key={t} className={styles.topic}>{t}</span>
          ))}
        </div>
        {repo.description && (
          <p className={styles.description}>{repo.description}</p>
        )}
        <div className={styles.meta}>
          {repo.language && (
            <span className={styles.lang}>
              <span className={styles.langDot} style={{ background: langColor }} />
              {repo.language}
            </span>
          )}
          <span className={styles.stat}>⭐ {repo.stargazers_count.toLocaleString()}</span>
          <span className={styles.stat}>🍴 {repo.forks_count.toLocaleString()}</span>
          <span className={styles.updated}>Updated {timeAgo(repo.updated_at)}</span>
        </div>
      </div>

      {expanded && (
        <div className={styles.detail}>
          <div className={styles.detailGrid}>
            <DetailItem label="Open issues" value={repo.open_issues_count} />
            <DetailItem label="Default branch" value={repo.default_branch} />
            <DetailItem label="Last updated" value={new Date(repo.updated_at).toLocaleDateString("en-IN")} />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{value ?? "—"}</div>
    </div>
  );
}
