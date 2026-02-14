import styles from "./Comment.module.css";
import { type ChangeType } from "react-diff-view";

type CommentProps = {
  type: ChangeType;
};

export const Comment = ({ type }: CommentProps) => {
  return <div className={styles.comment}>{type === "delete" ? "-" : "+"}</div>;
};
