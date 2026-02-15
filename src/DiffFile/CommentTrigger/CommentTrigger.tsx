import type { ChangeData } from "react-diff-view";
import { getChangeKey } from "react-diff-view";
import styles from "./CommentTrigger.module.css";
import type { ChangeKey } from "../types";
import { useComments } from "../CommentsContext/useComments";

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
  const { comments } = useComments();
  const changeKey = getChangeKey(change);

  const isDisabled =
    comments[changeKey]?.filter(
      (comment) => comment.state === "display" || comment.state === "edit"
    ).length > 0;

  const handleTrigger = () => {
    onTrigger(changeKey);
  };

  return (
    <button
      className={styles.trigger}
      onClick={handleTrigger}
      disabled={isDisabled}
    >
      {type === "delete" ? "-" : "+"}
    </button>
  );
};
