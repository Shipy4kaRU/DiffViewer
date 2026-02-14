import { useState } from "react";
import styles from "./Comment.module.css";
import { type ChangeType } from "react-diff-view";

type NewCommentProps = {
  type: ChangeType;
  id: string;
  onClick: (id: string) => void;
};

export const NewComment = ({ type, id, onClick }: NewCommentProps) => {
  return (
    <button className={styles.comment} onClick={() => onClick(id)}>
      {type === "delete" ? "-" : "+"}
    </button>
  );
};

type AddCommentProps = {
  onSave: (text: string) => void;
  onCancel: () => void;
};

export const AddCommentForm = ({ onSave, onCancel }: AddCommentProps) => {
  const [content, setContent] = useState("");

  const handleSave = () => {
    onSave(content);
    onCancel();
  };

  return (
    <div className="my-widget">
      <h4>Комментарий к строке</h4>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSave}>Сохранить</button>
      <button onClick={onCancel}>Закрыть</button>
    </div>
  );
};

export type CommentProps = {
  changeKey: string;
  content: string;
  time: Date;
  onNewComment: (changeKey: string) => void;
};

export const Comment = ({
  changeKey,
  content,
  time,
  onNewComment,
}: CommentProps) => {
  return (
    <div className={styles.comments}>
      <p>KEY: {changeKey}</p>
      <p>CONTENT: {content}</p>
      <p>TIME: {time.toLocaleString()}</p>
      <button onClick={() => onNewComment(changeKey)}>Новый комментарий</button>
    </div>
  );
};
