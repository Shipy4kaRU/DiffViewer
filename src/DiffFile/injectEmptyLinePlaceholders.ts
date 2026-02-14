import {
  type HunkData,
  computeOldLineNumber,
  computeNewLineNumber,
  isDelete,
  isInsert,
} from "react-diff-view";
import type { TokenizeEnhancer } from "react-diff-view";
import type { TokenPath } from "react-diff-view";

const EMPTY_LINE_PLACEHOLDER = "\u200B";

const getEmptyLineNumbers = (hunks: HunkData[]) => {
  const oldLineNumbers = new Set<number>();
  const newLineNumbers = new Set<number>();

  for (const hunk of hunks) {
    for (const change of hunk.changes) {
      if (isDelete(change) && change.content.length === 0) {
        oldLineNumbers.add(computeOldLineNumber(change));
      } else if (isInsert(change) && change.content.length === 0) {
        newLineNumbers.add(computeNewLineNumber(change));
      }
    }
  }

  return { oldLineNumbers, newLineNumbers };
};

const EMPTY_LINE_PLACEHOLDER_PATH: TokenPath = [
  { type: "text", value: EMPTY_LINE_PLACEHOLDER },
];

export const injectEmptyLinePlaceholders = (
  hunks: HunkData[]
): TokenizeEnhancer => {
  const { oldLineNumbers, newLineNumbers } = getEmptyLineNumbers(hunks);

  return ([oldLinesOfPaths, newLinesOfPaths]) => [
    oldLinesOfPaths.map((paths, i) =>
      oldLineNumbers.has(i + 1) ? [EMPTY_LINE_PLACEHOLDER_PATH] : paths
    ),
    newLinesOfPaths.map((paths, i) =>
      newLineNumbers.has(i + 1) ? [EMPTY_LINE_PLACEHOLDER_PATH] : paths
    ),
  ];
};
