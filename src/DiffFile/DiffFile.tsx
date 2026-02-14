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
  const [comments, setComments] = useState({});
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

  const addComment = useCallback((key: string) => {
    setComments((prev) => ({
      ...prev,
      [key]: (
        <div className="my-widget">
          <h4>Комментарий к строке</h4>
          <textarea />
          <button onClick={() => console.log("closing")}>Закрыть</button>
        </div>
      ),
    }));
  }, []);

  const renderToken = useMemo(
    () => createRenderToken({ addComment }),
    [addComment]
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
      widgets={comments}
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
