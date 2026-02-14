import { useState, useMemo } from "react";

import {
  parseDiff,
  Diff,
  Hunk,
  Decoration,
  useTokenizeWorker,
} from "react-diff-view";
import type { HunkData, FileData, ViewType, HunkTokens } from "react-diff-view";

import styles from "./DiffFile.module.css";
import "react-diff-view/style/index.css";
// import "prismjs/themes/prism.css";
import "prism-color-variables/variables.css";
import { DiffFileHeader } from "./DiffFileHeader";
import { getTokenizeWorker } from "./tokenizeDiff";

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
      if (change.type === "delete") deleted++;
      else if (change.type === "insert") inserted++;
    }
  }

  return { deleted, inserted };
};

type RenderFileProps = FileData & {
  viewType: ViewType;
  tokens: HunkTokens | null;
};

const renderFile = ({
  oldRevision,
  newRevision,
  type,
  hunks = [],
  viewType,
  tokens,
}: RenderFileProps) => {
  return (
    <Diff
      key={`${oldRevision}-${newRevision}`}
      viewType={viewType}
      diffType={type}
      hunks={hunks}
      tokens={tokens}
      optimizeSelection
      className={styles.diff}
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

  const tokenizeWorker = useMemo(() => getTokenizeWorker(), []);
  const tokenizePayload = useMemo(
    () => ({
      hunks: file.hunks,
      oldSource: null,
      language: getFileExtension(file.newPath),
    }),
    [file.hunks, file.newPath]
  );
  const { tokens } = useTokenizeWorker(tokenizeWorker, tokenizePayload);

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
      {renderFile({
        ...file,
        viewType: isSplit ? "split" : "unified",
        tokens,
      })}
    </div>
  );
};
