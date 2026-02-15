import type { CommentEditorProps } from "./CommentEditor";
import type { CommentDisplayProps } from "./CommentDisplay";
import { CommentDisplay } from "./CommentDisplay";
import { CommentEditor } from "./CommentEditor";

type CommentProps = CommentEditorProps & CommentDisplayProps;

export const Comment = (props: CommentProps) => {
  if (props.state === "display") {
    return <CommentDisplay {...props} />;
  } else {
    return <CommentEditor {...props} />;
  }
};
