import type { ChangeData } from "react-diff-view";
import { getChangeKey } from "react-diff-view";
import styles from "./CommentTrigger.module.css";
import type { ChangeKey } from "../types";

type CommentTriggerProps = {
  type: "delete" | "insert";
  change: ChangeData;
  onTrigger: (changeKey: ChangeKey) => void;
};

export const CommentTrigger = ({
  type,
  change,
  onTrigger,
}: CommentTriggerProps) => {
  const changeKey = getChangeKey(change);

  const handleTrigger = () => {
    onTrigger(changeKey);
  };

  return (
    <button className={styles.comment} onClick={handleTrigger}>
      {type === "delete" ? "-" : "+"}
    </button>
  );
};
