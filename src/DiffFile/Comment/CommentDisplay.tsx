import styles from "./Comment.module.css";
import type { CommentType } from "./types";

export type CommentDisplayProps = Omit<CommentType, "changeKey" | "state"> & {
  onEdit: () => void;
  onDelete: () => void;
};

export const CommentDisplay = ({
  commentId,
  content,
  time,
  onEdit,
  onDelete,
}: CommentDisplayProps) => (
  <div className={styles.comments}>
    <p>ID: {commentId}</p>
    <p>CONTENT: {content}</p>
    <p>TIME: {time.toLocaleString()}</p>
    <button onClick={onEdit}>Редактировать комментарий</button>
    <button onClick={onDelete}>Удалить комментарий</button>
  </div>
);
