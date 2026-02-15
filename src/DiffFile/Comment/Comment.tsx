import { useState, useId } from "react";
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
  defaultContent?: string;
  onSave: (id: string, text: string) => void;
  onCancel: () => void;
};

export const AddCommentForm = ({
  defaultContent,
  onSave,
  onCancel,
}: AddCommentProps) => {
  const [content, setContent] = useState(defaultContent ?? "");
  const id = useId();

  const handleSave = () => {
    onSave(id, content);
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
  id: string;
  changeKey: string;
  content: string;
  time: Date;
  onNewComment: (changeKey: string) => void;
  onEdit: (id: string, changeKey: string, content: string) => void;
  onDelete: (id: string, changeKey: string) => void;
};

export const Comment = ({
  id,
  changeKey,
  content,
  time,
  onNewComment,
  onEdit,
  onDelete,
}: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <AddCommentForm
        onSave={(_, text) => onEdit(id, changeKey, text)}
        onCancel={() => setIsEditing(false)}
        defaultContent={content}
      />
    );
  }

  return (
    <div className={styles.comments}>
      <p>ID: {id}</p>
      <p>KEY: {changeKey}</p>
      <p>CONTENT: {content}</p>
      <p>TIME: {time.toLocaleString()}</p>
      <button onClick={() => onNewComment(changeKey)}>
        Ответить на комментарий
      </button>
      <button onClick={handleEdit}>Редактировать комментарий</button>
      <button onClick={() => onDelete(id, changeKey)}>
        Удалить комментарий
      </button>
    </div>
  );
};
