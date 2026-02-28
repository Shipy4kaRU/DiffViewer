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
import type { ExtendedChange } from "./types";

const LINE_COMMENT_TYPE = "line-comment";

export type ChangeType = "insert" | "delete" | "no-changes" | "explanded";

type LineCommentRange = RangeTokenNode & {
  changeType: ChangeType;
  properties: { change: ChangeData };
};

export const markLineComments = (hunks: HunkData[]): TokenizeEnhancer => {
  const oldRanges: LineCommentRange[] = [];
  const newRanges: LineCommentRange[] = [];

  for (const hunk of hunks) {
    for (const change of hunk.changes) {
      const isExpanded = (change as ExtendedChange).isExpanded;

      if (isDelete(change) && !isExpanded) {
        oldRanges.push({
          type: LINE_COMMENT_TYPE,
          lineNumber: computeOldLineNumber(change),
          start: 0,
          length: 1,
          changeType: "delete",
          properties: { change },
        });
      } else if (isInsert(change) && !isExpanded) {
        newRanges.push({
          type: LINE_COMMENT_TYPE,
          lineNumber: computeNewLineNumber(change),
          start: 0,
          length: 1,
          changeType: "insert",
          properties: { change },
        });
      } else if (!isExpanded) {
        newRanges.push({
          type: LINE_COMMENT_TYPE,
          lineNumber: computeNewLineNumber(change),
          start: 0,
          length: 1,
          changeType: "no-changes",
          properties: { change },
        })
      } else {
        newRanges.push({
          type: LINE_COMMENT_TYPE,
          lineNumber: computeNewLineNumber(change),
          start: 0,
          length: 1,
          changeType: "explanded",
          properties: { change },
        })
      }
    }
  }

  return pickRanges(oldRanges, newRanges);
};
