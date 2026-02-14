import type { RenderToken } from "react-diff-view";
import styles from "./DiffFile.module.css";
import { NewComment } from "./Comment/Comment";
import { getChangeKey } from "react-diff-view";

type CreateRenderTokenProps = {
  handleNewComment: (key: string) => void;
};

export const createRenderToken = ({
  handleNewComment,
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
            <NewComment
              type={changeType}
              id={getChangeKey(token.properties.change)}
              onClick={handleNewComment}
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
