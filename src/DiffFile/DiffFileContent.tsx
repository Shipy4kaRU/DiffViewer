import { useMemo, type ReactElement } from "react";
import { useComments } from "./CommentsContext/useComments";
import type { FileData, ViewType } from "react-diff-view";
import type { ChangeKey } from "./types";
import { CommentWidget } from "./CommentWidget/CommentWidget";
import { DiffView } from "./DiffView";
import { createRenderToken } from "./createRenderToken";
import { getTokenizeWorker } from "./tokenizeDiff";

type DiffFileContentProps = {
  diffFile: FileData;
  viewType: ViewType;
};

export const DiffFileContent = ({
  diffFile,
  viewType,
}: DiffFileContentProps) => {
  const {
    comments,
    handleCreateComment,
    handleSaveComment,
    handleEditComment,
    handleCloseCommentForm,
    handleDeleteComment,
  } = useComments();

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

  const commentsWorker = useMemo(() => getTokenizeWorker(), []);

  const renderToken = useMemo(
    () => createRenderToken({ handleCreateComment }),
    [handleCreateComment]
  );

  return (
    <DiffView
      diffFile={diffFile}
      viewType={viewType}
      widgets={widgets}
      renderToken={renderToken}
      enableComments
      tokenizeWorker={commentsWorker}
    />
  );
};
