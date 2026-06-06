import styles from "./Skeleton.module.css";

function Bone({ width = "100%", height = 16, radius = 6, style = {} }) {
  return (
    <div
      className={styles.bone}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

export function ProfileSkeleton() {
  return (
    <div className={styles.profileCard}>
      <Bone width={80} height={80} radius={40} />
      <div className={styles.profileLines}>
        <Bone width={160} height={22} />
        <Bone width={240} height={14} />
        <Bone width={200} height={14} />
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {[1, 2, 3, 4].map((k) => <Bone key={k} width={70} height={52} radius={10} />)}
        </div>
      </div>
    </div>
  );
}

export function RepoSkeleton() {
  return (
    <div className={styles.repoCard}>
      <Bone width="55%" height={18} />
      <Bone width="80%" height={13} style={{ marginTop: 8 }} />
      <Bone width="60%" height={13} style={{ marginTop: 4 }} />
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <Bone width={80} height={12} />
        <Bone width={60} height={12} />
        <Bone width={60} height={12} />
      </div>
    </div>
  );
}
