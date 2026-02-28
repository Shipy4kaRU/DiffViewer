import type { RenderToken } from "react-diff-view";
import styles from "./DiffFile.module.css";
import { CommentTrigger } from "./CommentTrigger/CommentTrigger";
import type { ChangeKey } from "./types";
import type { ChangeType } from "./markLineComments";

type CreateRenderTokenProps = {
  handleCreateComment?: (changeKey: ChangeKey) => void;
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

    if (token.type === "line-comment" && handleCreateComment) {
      const changeType = (token as { changeType?: ChangeType })
        .changeType;

      return (
        <span key={i} className={styles.lineCommentWrap}>
          {changeType && changeType !== "explanded" ?  (
            <CommentTrigger
              type={changeType}
              onTrigger={handleCreateComment}
              change={token.properties.change}
            />
          ) : <div style={{width: "20px", height: "20px"}}/>}
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
