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
  type: ChangeType;
  id: string;
  onClick: (id: string) => void;
};

export const AddComment = () => {
  return (
    <div className="my-widget">
      <h4>Комментарий к строке</h4>
      <textarea />
      <button onClick={() => console.log("closing")}>Закрыть</button>
    </div>
  );
};

type CommentProps = {
  id: string;
  onClick: (id: string) => void;
};

export const Comments = ({ id, onClick }: CommentProps) => {
  return (
    <div className={styles.comments}>
      <ul>
        <li>
          <button onClick={() => onClick(id)}>Новый комментарий</button>
        </li>
      </ul>
      <button onClick={() => onClick(id)}>Новый комментарий</button>
    </div>
  );
};
