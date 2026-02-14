import styles from "./DiffFile.module.css";
import { DiffBar } from "./DiffBar/DiffBar";

type DiffFileHeaderProps = {
  lines: { deleted: number; inserted: number };
  filename: string;
  isSplit: boolean;
  setSplit: () => void;
  setUnified: () => void;
};

export const DiffFileHeader = ({
  lines,
  filename,
  isSplit,
  setSplit,
  setUnified,
}: DiffFileHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.info}>
        <DiffBar deleted={lines.deleted} inserted={lines.inserted} />
        <span>{filename}</span>
      </div>
      <div className={styles.controls}>
        <div className={styles.control}>
          <input type="checkbox" id="checked" />
          <label htmlFor="checked">Просмотрен</label>
        </div>
        <button>Код</button>
        <button onClick={setUnified} className={isSplit ? "" : styles.active}>
          Один
        </button>
        <button onClick={setSplit} className={isSplit ? styles.active : ""}>
          Два
        </button>
      </div>
    </div>
  );
};
