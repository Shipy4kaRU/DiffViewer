import { Fragment, useMemo, type ReactElement } from "react";
import { getTokenizeWorker } from "./tokenizeDiff";
import { useComments } from "./CommentsContext/useComments";
import { Decoration, Diff, Hunk, useTokenizeWorker } from "react-diff-view";
import type { FileData, HunkData, HunkTokens, ViewType } from "react-diff-view";
import styles from "./DiffFile.module.css";
import type { ChangeKey } from "./types";
import { CommentWidget } from "./CommentWidget/CommentWidget";
import { createRenderToken } from "./createRenderToken";

const renderHunk = (hunk: HunkData) => (
  <Fragment key={hunk.content}>
    <Decoration className={styles.decoration}>{hunk.content}</Decoration>
    <Hunk key={hunk.content} hunk={hunk} />
  </Fragment>
);

const getFileExtension = (filePath: string) => {
  return filePath.split(".").pop() ?? "";
};

type DiffFileContentProps = FileData & {
  viewType: ViewType;
  tokens: HunkTokens | null;
};

export const DiffFileContent = ({
  oldRevision,
  newRevision,
  type,
  hunks = [],
  viewType,
  newPath,
}: DiffFileContentProps) => {
  const {
    comments,
    handleCreateComment,
    handleSaveComment,
    handleEditComment,
    handleCloseCommentForm,
    handleDeleteComment,
  } = useComments();
  const tokenizeWorker = useMemo(() => getTokenizeWorker(), []);
  const tokenizePayload = useMemo(
    () => ({
      hunks: hunks,
      oldSource: null,
      language: getFileExtension(newPath),
    }),
    [hunks, newPath]
  );
  const { tokens } = useTokenizeWorker(tokenizeWorker, tokenizePayload);

  console.debug("[DiffFileContent] commentsData: ", comments);

  const widgets = useMemo(() => {
    return Object.keys(comments).reduce<Record<ChangeKey, ReactElement>>(
      (acc, key) => {
        acc[key] = (
          <CommentWidget
            changeKey={key}
            comments={comments[key] || []}
            onCreate={handleCreateComment}
            onSave={handleSaveComment}
            onEdit={handleEditComment}
            onClose={handleCloseCommentForm}
            onDelete={handleDeleteComment}
          />
        );
        return acc;
      },
      {}
    );
  }, [
    comments,
    handleCreateComment,
    handleSaveComment,
    handleEditComment,
    handleCloseCommentForm,
    handleDeleteComment,
  ]);

  const renderToken = useMemo(
    () => createRenderToken({ handleCreateComment }),
    [handleCreateComment]
  );

  return (
    <Diff
      key={`${oldRevision}-${newRevision}`}
      viewType={viewType}
      diffType={type}
      hunks={hunks}
      tokens={tokens}
      renderToken={renderToken}
      optimizeSelection
      className={styles.diff}
      widgets={widgets}
    >
      {(hunks) => hunks.map(renderHunk)}
    </Diff>
  );
};
