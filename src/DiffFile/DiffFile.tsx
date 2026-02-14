import { useState, useMemo, useCallback } from "react";

import {
  parseDiff,
  Diff,
  Hunk,
  Decoration,
  isDelete,
  isInsert,
  useTokenizeWorker,
} from "react-diff-view";
import type { HunkData, FileData, ViewType, HunkTokens } from "react-diff-view";

import styles from "./DiffFile.module.css";
import "react-diff-view/style/index.css";
// import "prismjs/themes/prism.css";
import "prism-color-variables/variables.css";
import { DiffFileHeader } from "./DiffFileHeader";
import { getTokenizeWorker } from "./tokenizeDiff";
import { createRenderToken } from "./createRenderToken";
import { LineWidget } from "./DiffWidget";
import type { CommentProps } from "./Comment/Comment";

type DiffFileProps = {
  diff: string;
};

const renderHunk = (hunk: HunkData) => (
  <>
    <Decoration
      key={"decoration-" + hunk.content}
      className={styles.decoration}
    >
      {hunk.content}
    </Decoration>
    <Hunk key={hunk.content} hunk={hunk} />
  </>
);

const countDiffLines = (hunks: HunkData[]) => {
  let deleted = 0;
  let inserted = 0;

  console.log("I AM COUNTING!!!");

  for (const hunk of hunks) {
    for (const change of hunk.changes) {
      if (isDelete(change)) deleted++;
      else if (isInsert(change)) inserted++;
    }
  }

  return { deleted, inserted };
};

type RenderFileProps = FileData & {
  viewType: ViewType;
  tokens: HunkTokens | null;
};

type DiffFileContentProps = RenderFileProps & {};

const DiffFileContent = ({
  oldRevision,
  newRevision,
  type,
  hunks = [],
  viewType,
  newPath,
}: DiffFileContentProps) => {
  const [commentsData, setCommentsData] = useState<
    Record<string, CommentProps[]>
  >({});
  const [activeAddForms, setActiveAddForms] = useState<Record<string, boolean>>(
    {}
  );
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

  console.log("[DiffFileContent] commentsData: ", commentsData);
  console.log("[DiffFileContent] activeAddForms: ", activeAddForms);

  const handleNewComment = useCallback((key: string) => {
    setActiveAddForms((prev) => ({
      ...prev,
      [key]: true,
    }));
  }, []);

  const handleAddComment = useCallback((key: string, content: string) => {
    setCommentsData((prev) => ({
      ...prev,
      [key]: [
        ...(prev[key] || []),
        { changeKey: key, content, time: new Date() },
      ],
    }));
  }, []);

  const handleCloseForm = useCallback((key: string) => {
    setActiveAddForms((prev) => ({
      ...prev,
      [key]: false,
    }));
  }, []);

  const widgets = useMemo(() => {
    const allKeys = new Set([
      ...Object.keys(commentsData),
      ...Object.keys(activeAddForms),
    ]);

    return Array.from(allKeys).reduce((acc, key) => {
      acc[key] = (
        <LineWidget
          changeKey={key}
          comments={commentsData[key] || []}
          showAddForm={!!activeAddForms[key]}
          onClose={handleCloseForm}
          onSave={handleAddComment}
          onNewComment={handleNewComment}
        />
      );
      return acc;
    }, {});
  }, [
    commentsData,
    activeAddForms,
    handleCloseForm,
    handleAddComment,
    handleNewComment,
  ]);

  const renderToken = useMemo(
    () => createRenderToken({ handleNewComment }),
    [handleNewComment]
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

const getFileExtension = (filePath: string) => {
  return filePath.split(".").pop() ?? "";
};

export const DiffFile = ({ diff }: DiffFileProps) => {
  const [isSplit, setIsSplit] = useState(false);
  const [file] = useMemo(
    () => parseDiff(diff, { nearbySequences: "zip" }), // рекомендуется
    [diff]
  );

  console.log("[DiffFile] file: ", file);

  const count = useMemo(() => countDiffLines(file.hunks), [file.hunks]);

  console.log("[DiffFile] count: ", count);

  return (
    <div>
      <DiffFileHeader
        lines={count}
        filename={file.newPath}
        isSplit={isSplit}
        setSplit={() => setIsSplit(true)}
        setUnified={() => setIsSplit(false)}
      />
      <DiffFileContent
        {...file}
        viewType={isSplit ? "split" : "unified"}
        tokens={null}
      />
    </div>
  );
};
