import { useState } from "react";
import type { ChangeEvent } from "react";
import type { CommentContent, CommentType } from "./types";

import styles from "./Comment.module.css";

export type CommentEditorProps = Omit<
  CommentType,
  "commentId" | "changeKey" | "time"
> & {
  onSave: (content: CommentContent) => void;
  onClose: () => void;
  onDelete: () => void;
};

export const CommentEditor = ({
  content,
  state,
  onSave,
  onClose,
  onDelete,
}: CommentEditorProps) => {
  const [newContent, setNewContent] = useState(content);

  const handleSave = () => {
    onSave(newContent);
  };

  const handleCancel = () => {
    if (state === "create") {
      onDelete();
    } else {
      onClose();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewContent(e.target.value);
  };

  return (
    <div className={styles.commentEditor}>
      <h4>Комментарий к строке</h4>
      <textarea value={newContent} onChange={handleChange} />
      <button onClick={handleSave}>Сохранить</button>
      <button onClick={handleCancel}>Закрыть</button>
    </div>
  );
};
