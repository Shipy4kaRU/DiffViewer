import {
  type HunkData,
  pickRanges,
  computeOldLineNumber,
  computeNewLineNumber,
  isDelete,
  isInsert,
} from "react-diff-view";
import type {
  ChangeData,
  RangeTokenNode,
  TokenizeEnhancer,
} from "react-diff-view";

const LINE_COMMENT_TYPE = "line-comment";

type ChangeType = "insert" | "delete";

type LineCommentRange = RangeTokenNode & {
  changeType: ChangeType;
  properties: { change: ChangeData };
};

export const markLineComments = (hunks: HunkData[]): TokenizeEnhancer => {
  const oldRanges: LineCommentRange[] = [];
  const newRanges: LineCommentRange[] = [];

  for (const hunk of hunks) {
    for (const change of hunk.changes) {
      if (isDelete(change)) {
        oldRanges.push({
          type: LINE_COMMENT_TYPE,
          lineNumber: computeOldLineNumber(change),
          start: 0,
          length: 1,
          changeType: "delete",
          properties: { change },
        });
      } else if (isInsert(change)) {
        newRanges.push({
          type: LINE_COMMENT_TYPE,
          lineNumber: computeNewLineNumber(change),
          start: 0,
          length: 1,
          changeType: "insert",
          properties: { change },
        });
      }
    }
  }

  return pickRanges(oldRanges, newRanges);
};
