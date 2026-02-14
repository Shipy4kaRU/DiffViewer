import { Comment, AddCommentForm, type CommentProps } from "./Comment/Comment";

type LineWidgetProps = {
  comments: CommentProps[];
  showAddForm: boolean;
  onClose: (changeKey: string) => void;
  onSave: (changeKey: string, content: string) => void;
  onNewComment: (changeKey: string) => void;
  changeKey: string;
};

export const LineWidget = ({
  comments,
  showAddForm,
  onClose,
  onSave,
  onNewComment,
  changeKey,
}: LineWidgetProps) => (
  <div className="diff-widget-container">
    {comments.map((comment) => (
      <Comment {...comment} onNewComment={onNewComment} />
    ))}

    {showAddForm && (
      <AddCommentForm
        onSave={(text) => onSave(changeKey, text)}
        onCancel={() => onClose(changeKey)}
      />
    )}
  </div>
);
