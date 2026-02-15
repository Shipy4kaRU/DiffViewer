import type { RenderToken } from "react-diff-view";
import styles from "./DiffFile.module.css";
import { CommentTrigger } from "./CommentTrigger/CommentTrigger";

type CreateRenderTokenProps = {
  handleCreateComment: (key: string) => void;
};

export const createRenderToken = ({
  handleCreateComment,
}: CreateRenderTokenProps) => {
  const renderToken: RenderToken = (token, defaultRender, i) => {
    if (token.type === "indent-guide") {
      return (
        <span key={i} className={styles.indentGuide}>
          {token.children?.map((child, j) =>
            renderToken(child, defaultRender, j)
          )}
        </span>
      );
    }

    if (token.type === "line-comment") {
      const changeType = (token as { changeType?: "insert" | "delete" })
        .changeType;

      return (
        <span key={i} className={styles.lineCommentWrap}>
          {changeType != null && (
            <CommentTrigger
              type={changeType}
              onTrigger={handleCreateComment}
              change={token.properties.change}
            />
          )}
          {token.children?.map((child, j) =>
            renderToken(child, defaultRender, j)
          )}
        </span>
      );
    }

    return defaultRender(token, i);
  };

  return renderToken;
};
