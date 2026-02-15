import { Comment, AddCommentForm, type CommentProps } from "./Comment/Comment";

type LineWidgetProps = {
  comments: CommentProps[];
  showAddForm: boolean;
  onClose: (changeKey: string) => void;
  onSave: (id: string, changeKey: string, content: string) => void;
  onNewComment: (changeKey: string) => void;
  onEdit: (id: string, changeKey: string, content: string) => void;
  onDelete: (id: string, changeKey: string) => void;
  changeKey: string;
};

export const LineWidget = ({
  comments,
  showAddForm,
  onClose,
  onSave,
  onEdit,
  onDelete,
  onNewComment,
  changeKey,
}: LineWidgetProps) => (
  <div className="diff-widget-container">
    {comments.map((comment) => (
      <Comment
        {...comment}
        onNewComment={onNewComment}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}

    {showAddForm && (
      <AddCommentForm
        onSave={(id, text) => onSave(id, changeKey, text)}
        onCancel={() => onClose(changeKey)}
      />
    )}
  </div>
);
