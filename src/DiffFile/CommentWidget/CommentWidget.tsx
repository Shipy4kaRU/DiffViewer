import type { CommentType, CommentId, CommentContent } from "../Comment/types";
import type { ChangeKey } from "../types";
import { Comment } from "../Comment/Comment";
import styles from "./CommentWidget.module.css";

type CommentWidgetProps = {
  changeKey: ChangeKey;
  comments: CommentType[];
  onCreate: (changeKey: ChangeKey) => void;
  onSave: (
    changeKey: ChangeKey,
    commentId: CommentId,
    content: CommentContent
  ) => void;
  onEdit: (changeKey: ChangeKey, commentId: CommentId) => void;
  onClose: (changeKey: ChangeKey, commentId: CommentId) => void;
  onDelete: (changeKey: ChangeKey, commentId: CommentId) => void;
};

export const CommentWidget = ({
  changeKey,
  comments,
  onCreate,
  onSave,
  onEdit,
  onClose,
  onDelete,
}: CommentWidgetProps) => {
  if (comments.length === 0) {
    return null;
  }

  const isExistCommentsAlready =
    comments.filter(
      (comment) => comment.state === "display" || comment.state === "edit"
    ).length > 0;

  return (
    <div className={styles.widget}>
      {comments.map((comment) => (
        <Comment
          {...comment}
          onSave={(content: CommentContent) =>
            onSave(comment.changeKey, comment.commentId, content)
          }
          onClose={() => onClose(comment.changeKey, comment.commentId)}
          onEdit={() => onEdit(comment.changeKey, comment.commentId)}
          onDelete={() => onDelete(comment.changeKey, comment.commentId)}
          key={comment.commentId}
        />
      ))}
      {isExistCommentsAlready && (
        <button onClick={() => onCreate(changeKey)} className={styles.answer}>
          ADD NEW COMMENT
        </button>
      )}
    </div>
  );
};
