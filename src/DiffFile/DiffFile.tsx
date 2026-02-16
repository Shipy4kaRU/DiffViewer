import { useState, useMemo } from "react";

import { parseDiff, isDelete, isInsert } from "react-diff-view";
import type { HunkData } from "react-diff-view";

import styles from "./DiffFile.module.css";
import "react-diff-view/style/index.css";
// import "prismjs/themes/prism.css";
import "prism-color-variables/variables.css";
import { DiffFileHeader } from "./DiffFileHeader";
import { DiffFileContent } from "./DiffFileContent";
import { CommentsProvider } from "./CommentsContext/CommentsContext";
import { mockDiffComments } from "../CommentChecking/mockDiffComments";

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

type DiffFileProps = {
  diff: string;
};

export const DiffFile = ({ diff }: DiffFileProps) => {
  const [isSplit, setIsSplit] = useState(false);
  const [file] = useMemo(
    () => parseDiff(diff, { nearbySequences: "zip" }), // рекомендуется
    [diff]
  );
  const count = useMemo(() => countDiffLines(file.hunks), [file.hunks]);

  console.log("[DiffFile] file: ", file);
  console.log("[DiffFile] count: ", count);

  return (
    <CommentsProvider hunks={file.hunks} commentsDTO={mockDiffComments}>
      <div className={styles.diffFile}>
        <DiffFileHeader
          lines={count}
          filename={file.newPath}
          isSplit={isSplit}
          setSplit={() => setIsSplit(true)}
          setUnified={() => setIsSplit(false)}
        />
        <DiffFileContent
          diffFile={file}
          viewType={isSplit ? "split" : "unified"}
        />
      </div>
    </CommentsProvider>
  );
};
