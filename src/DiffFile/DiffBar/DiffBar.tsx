import styles from "./DiffBar.module.css";

type DiffBarProps = {
  deleted: number;
  inserted: number;
};

export const DiffBar = ({ deleted, inserted }: DiffBarProps) => {
  const total = deleted + inserted;

  const deletedPercent = total === 0 ? 0 : (deleted / total) * 100;
  const insertedPercent = total === 0 ? 0 : (inserted / total) * 100;

  return (
    <div className={styles.wrapper}>
      <span>{deleted}</span>
      <div className={styles.bar}>
        <div
          className={styles.deleted}
          style={{ width: `${deletedPercent}%` }}
        />
        <div
          className={styles.inserted}
          style={{ width: `${insertedPercent}%` }}
        />
      </div>
      <span>{inserted}</span>
    </div>
  );
};
