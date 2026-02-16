import { Fragment, useMemo } from "react";
import {
  useTokenizeWorker,
  type FileData,
  type ViewType,
  type HunkData,
  Decoration,
  Hunk,
  parseDiff,
} from "react-diff-view";
import { Diff } from "react-diff-view";
import type { RenderToken } from "react-diff-view";
import { getDefaultTokenizeWorker } from "./tokenizeDefaultDiff";
import styles from "./DiffFile.module.css";
import type { ReactNode } from "react";

const getFileExtension = (filePath: string) => {
  return filePath.split(".").pop() ?? "";
};

const renderHunk = (hunk: HunkData) => (
  <Fragment key={hunk.content}>
    <Decoration className={styles.decoration}>{hunk.content}</Decoration>
    <Hunk key={hunk.content} hunk={hunk} />
  </Fragment>
);

const renderDiffChildren = (hunks: HunkData[]) => hunks.map(renderHunk);

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
  const tokenizePayload = useMemo(
    () => ({
      hunks: file.hunks ?? "",
      oldSource: null,
      language: getFileExtension(file.newPath ?? ""),
      enableComments,
    }),
    [file.hunks, file.newPath, enableComments]
  );
  const { tokens } = useTokenizeWorker(tokenizeWorker, tokenizePayload);

  if (!file) {
    return null;
  }

  const { oldRevision, newRevision, type, hunks } = file;

  return (
    <Diff
      key={`${oldRevision}-${newRevision}`}
      viewType={viewType}
      diffType={type}
      hunks={hunks}
      tokens={tokens}
      renderToken={renderToken ?? defaultRenderToken}
      optimizeSelection
      className={styles.diff}
      widgets={widgets}
    >
      {renderDiffChildren}
    </Diff>
  );
};
