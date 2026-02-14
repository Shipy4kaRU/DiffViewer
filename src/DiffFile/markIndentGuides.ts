import {
  type HunkData,
  type ChangeData,
  pickRanges,
  computeOldLineNumber,
  computeNewLineNumber,
  isDelete,
  isNormal,
} from "react-diff-view";
import type { RangeTokenNode, TokenizeEnhancer } from "react-diff-view";

const INDENT_GUIDE_TYPE = "indent-guide";

function getIndentRanges(
  content: string,
  lineNumber: number,
  indentSize: number
): RangeTokenNode[] {
  const indentMatch = content.match(/^[\s\t]*/);
  if (!indentMatch || indentMatch[0].length === 0) {
    return [];
  }

  const indentStr = indentMatch[0];
  const ranges: RangeTokenNode[] = [];
  let offset = 0;

  // Считаем таб как один уровень отступа
  let i = 0;
  while (i < indentStr.length) {
    if (indentStr[i] === "\t") {
      ranges.push({
        type: INDENT_GUIDE_TYPE,
        lineNumber,
        start: offset,
        length: 1,
      });
      offset += 1;
      i += 1;
    } else {
      // Пробелы — каждый indentSize пробелов = один уровень
      const chunkEnd = Math.min(i + indentSize, indentStr.length);
      const chunkLen = chunkEnd - i;
      ranges.push({
        type: INDENT_GUIDE_TYPE,
        lineNumber,
        start: offset,
        length: chunkLen,
      });
      offset += chunkLen;
      i = chunkEnd;
    }
  }

  return ranges;
}

function groupChanges(hunks: HunkData[]): [ChangeData[], ChangeData[]] {
  const changes = hunks.flatMap((hunk) => hunk.changes);
  return changes.reduce<[ChangeData[], ChangeData[]]>(
    ([oldChanges, newChanges], change) => {
      if (isNormal(change)) {
        oldChanges.push(change);
        newChanges.push(change);
      } else if (isDelete(change)) {
        oldChanges.push(change);
      } else {
        newChanges.push(change);
      }
      return [oldChanges, newChanges];
    },
    [[], []]
  );
}

function mapChangesToContent(
  changes: ChangeData[],
  side: "old" | "new"
): string[] {
  if (!changes.length) return [];

  const computeLineNumber =
    side === "old" ? computeOldLineNumber : computeNewLineNumber;
  const changesByLineNumber = changes.reduce((acc, change) => {
    acc[computeLineNumber(change)] = change;
    return acc;
  }, {} as Record<number, ChangeData>);
  const maxLineNumber = computeLineNumber(changes[changes.length - 1]);

  return Array.from({ length: maxLineNumber }).map(
    (_, i) => changesByLineNumber[i + 1]?.content ?? ""
  );
}

export type MarkIndentGuidesOptions = {
  indentSize?: number;
};

/**
 * Enhancer, использующий pickRanges для пометки ведущих пробелов/табов
 * как indent-guide. Требует renderToken в Diff для кастомного отображения.
 */
export function markIndentGuides(
  hunks: HunkData[],
  { indentSize = 4 }: MarkIndentGuidesOptions = {}
): TokenizeEnhancer {
  const [oldChanges, newChanges] = groupChanges(hunks);
  const oldLines = mapChangesToContent(oldChanges, "old");
  const newLines = mapChangesToContent(newChanges, "new");

  const oldRanges = oldLines.flatMap((content, i) =>
    getIndentRanges(content, i + 1, indentSize)
  );
  const newRanges = newLines.flatMap((content, i) =>
    getIndentRanges(content, i + 1, indentSize)
  );

  return pickRanges(oldRanges, newRanges);
}
