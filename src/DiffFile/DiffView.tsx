import {  useMemo, useState } from "react";
import {
  useTokenizeWorker,
  type FileData,
  type ViewType,
  type HunkData,
  Decoration,
  Hunk,
  parseDiff,
  getCollapsedLinesCountBetween,
  textLinesToHunk,
  insertHunk,
} from "react-diff-view";
import { Diff } from "react-diff-view";
import type { RenderToken } from "react-diff-view";
import { getDefaultTokenizeWorker } from "./tokenizeDefaultDiff";
import styles from "./DiffFile.module.css";
import type { ReactNode } from "react";
import { getLines, lines } from "../baseFile";
import type { ExtendedChange } from "./types";

const getFileExtension = (filePath: string) => {
  return filePath.split(".").pop() ?? "";
};

type ExpandType = 'up' | 'down' | "up&down" | 'all' | "none";

const ExpandButton = ({expand, onClick}: {expand: ExpandType, onClick: (type?: "up" | "down") => void}) => {
  if (expand === "up&down") {
    return (<div className={styles.decorationGutterButtonsWrapper}>
      <button style={{backgroundColor: 'rgb(133, 206, 255)'}} className={styles.decorationGutterButton} onClick={() => onClick("down")}>↓</button>
      <button style={{backgroundColor: 'rgb(133, 206, 255)'}} className={styles.decorationGutterButton} onClick={() => onClick("up")}>↑</button>
    </div>)
  }
  if (expand === "up") return <button style={{backgroundColor: 'rgb(133, 206, 255)'}} className={styles.decorationGutterButton} onClick={() => onClick()}>↑</button>;
  if (expand === "down") return <button style={{backgroundColor: 'rgb(133, 206, 255)'}} className={styles.decorationGutterButton} onClick={() => onClick()}>↓</button>;
  if (expand === "none") return null;
  return <button style={{backgroundColor: 'rgb(133, 206, 255)'}} className={styles.decorationGutterButton} onClick={() => onClick()}>↓↑</button>;
};

const ExpandedDecoratedHunk = ({hunk, expand, onClick}: {hunk?: HunkData, expand: ExpandType, onClick?: (type?: "up" | "down") => void} ) => {
  return (<>
  <Decoration className={styles.decoration} gutterClassName={styles.decorationGutter} contentClassName={styles.decorationContent}>
    <ExpandButton expand={expand} onClick={(type) => onClick?.(type)} />
    {hunk && hunk.content}
  </Decoration>
  {hunk && <Hunk hunk={hunk} />}
</>)
}

const TOTAL_NUMBER = lines.length - 1; // TODO: какое-то число от бэка нужно

console.log("TOTAL_NUMBER: ", TOTAL_NUMBER, lines);

const renderDiffChildren = (hunks: HunkData[], setHunks: (hunk: HunkData[]) => void) => {
  const expand = async (startOld: number, endOld: number, startNew: number) => {
    console.log("DIFF EXPAND REQUEST: ", startOld, endOld);

    // Тип запрос
    const getReponse = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));

      return getLines(startOld, endOld);
    }

    const lines = await getReponse();

    console.log(lines);
  
    const newHunk = textLinesToHunk(lines, startOld, startNew);

    if (newHunk) {
      newHunk.changes.forEach(change => {
        (change as ExtendedChange).isExpanded = true;
      })

      const nextHunks = insertHunk(hunks, newHunk)
      setHunks(nextHunks);
    };
  };

  const elements = hunks.reduce<React.ReactElement[]>((acc, hunk, ind) => {
    if (ind === 0) {
      if (hunk.oldStart > 1) {
        const startOld = Math.max(1, hunk.oldStart - 20);
        const endOld = hunk.oldStart - 1;

        acc.push(
          <ExpandedDecoratedHunk key={hunk.content} hunk={hunk} expand="up" onClick={() => expand(startOld, endOld, startOld)}/>
        );
      }
      else {
        acc.push(
          <ExpandedDecoratedHunk key={hunk.content} hunk={hunk} expand="none" />
        );
      }
    }

    const prevHunk = hunks[ind - 1]

    if (ind > 0 && prevHunk) {
      const collapsedCount = getCollapsedLinesCountBetween(prevHunk, hunk);

      if (collapsedCount > 0 && collapsedCount <= 20) {
        const startOld = prevHunk.oldStart + prevHunk.oldLines;
        const endOld = hunk.oldStart - 1;
        const startNew = prevHunk.newStart + prevHunk.newLines;

        acc.push(
          <ExpandedDecoratedHunk key={hunk.content} hunk={hunk} expand="all" onClick={() => expand(startOld, endOld, startNew)} />
        );
      };

      if (collapsedCount > 20) {
        acc.push(
          <ExpandedDecoratedHunk key={hunk.content} hunk={hunk} expand="up&down" onClick={(type) => {
            if (type === "up") {
              const startOld = hunk.oldStart - 20;
              const endOld = hunk.oldStart - 1;
              const startNew = hunk.newStart - (hunk.oldStart - startOld);
              
              expand(startOld, endOld, startNew)};
            if (type === "down") {
              const startOld = prevHunk.oldStart + prevHunk.oldLines;
              const endOld = startOld + 19;
              const startNew = prevHunk.newStart + prevHunk.newLines;
              
              expand(startOld, endOld, startNew)};
          }} />
        );
      };
    };

    if (hunks.length - 1 === ind && hunk.oldStart + hunk.oldLines < TOTAL_NUMBER) {
      const startOld = hunk.oldStart + hunk.oldLines;
      const endOld = Math.min(startOld + 19, TOTAL_NUMBER);
      const startNew = hunk.newStart + hunk.newLines;

      acc.push(<ExpandedDecoratedHunk key={`${hunk.content}-down`} expand="down" onClick={() => expand(startOld, endOld, startNew)}/>)
    }

    return acc;
  }, []);
  

  return elements;
};

const defaultRenderToken: RenderToken = (token, defaultRender, i) => {
  if (token.type === "indent-guide") {
    return (
      <span key={i} className={styles.indentGuide}>
        {token.children?.map((child, j) =>
          defaultRenderToken(child, defaultRender, j)
        )}
      </span>
    );
  }

  return defaultRender(token, i);
};

type DiffViewProps =
  | (DiffViewBaseProps & { diff: string; diffFile?: never })
  | (DiffViewBaseProps & { diffFile: FileData; diff?: never });

type DiffViewBaseProps = {
  viewType?: ViewType;
  enableComments?: boolean;
  widgets?: Record<string, ReactNode>;
  renderToken?: RenderToken;
  tokenizeWorker?: Worker;
};

export const DiffView = ({
  diff,
  diffFile,
  viewType = "unified",
  enableComments = false,
  widgets,
  renderToken,
  tokenizeWorker: tokenizeWorkerProp,
}: DiffViewProps) => {
  const file = useMemo(() => {
    if (diffFile) {
      return diffFile;
    }

    return parseDiff(diff, { nearbySequences: "zip" })[0];
  }, [diffFile, diff]);
  const tokenizeWorker = useMemo(
    () => tokenizeWorkerProp ?? getDefaultTokenizeWorker(),
    [tokenizeWorkerProp]
  );

  const { oldRevision, newRevision, type, hunks } = file;
  const [diffHunks, setHunks] = useState(hunks);

  const tokenizePayload = useMemo(
    () => ({
      hunks: diffHunks ?? "",
      oldSource: null,
      language: getFileExtension(file.newPath ?? ""),
      enableComments,
    }),
    [diffHunks, file.newPath, enableComments]
  );
  const { tokens } = useTokenizeWorker(tokenizeWorker, tokenizePayload);

  console.log("DIFF HUNKS===", diffHunks);

  return (
    <Diff
      key={`${oldRevision}-${newRevision}`}
      viewType={viewType}
      diffType={type}
      hunks={diffHunks}
      tokens={tokens}
      renderToken={renderToken ?? defaultRenderToken}
      optimizeSelection
      className={styles.diff}
      widgets={widgets}
    >
      {(diffHunks) => renderDiffChildren(diffHunks, setHunks)}
    </Diff>
  );
};
