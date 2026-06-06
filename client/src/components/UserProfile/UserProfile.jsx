import { formatDate } from "../../utils/formatDate";
import styles from "./UserProfile.module.css";

export function UserProfile({ user }) {
  return (
    <div className={styles.card}>
      <img className={styles.avatar} src={user.avatar_url} alt={`${user.login}'s avatar`} />
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <h2 className={styles.name}>{user.name || user.login}</h2>
          <a
            className={styles.handle}
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
          >
            @{user.login} ↗
          </a>
        </div>
        {user.bio && <p className={styles.bio}>{user.bio}</p>}
        {user.location && <p className={styles.location}>📍 {user.location}</p>}
        <div className={styles.stats}>
          <StatPill label="Repos" value={user.public_repos} />
          <StatPill label="Followers" value={user.followers} />
          <StatPill label="Following" value={user.following} />
          <StatPill label="Joined" value={formatDate(user.created_at)} />
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className={styles.pill}>
      <span className={styles.pillValue}>{value ?? "—"}</span>
      <span className={styles.pillLabel}>{label}</span>
    </div>
  );
}
