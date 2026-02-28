export const reactDiff = `
diff --git a/src/DiffFile/DiffView.tsx b/src/DiffFile/DiffView.tsx
index fa97fa8..bb89650 100644
--- a/src/DiffFile/DiffView.tsx
+++ b/src/DiffFile/DiffView.tsx
@@ -1,4 +1,4 @@
-import { Fragment, useMemo } from "react";
+import { Fragment, useMemo, useState } from "react";
 import {
   useTokenizeWorker,
   type FileData,
@@ -7,6 +7,10 @@ import {
   Decoration,
   Hunk,
   parseDiff,
+  getCollapsedLinesCountBetween,
+  expandFromRawCode,
+  textLinesToHunk,
+  insertHunk,
 } from "react-diff-view";
 import { Diff } from "react-diff-view";
 import type { RenderToken } from "react-diff-view";
@@ -18,14 +22,101 @@ const getFileExtension = (filePath: string) => {
   return filePath.split(".").pop() ?? "";
 };
 
-const renderHunk = (hunk: HunkData) => (
-  <Fragment key={hunk.content}>
-    <Decoration className={styles.decoration}>{hunk.content}</Decoration>
-    <Hunk key={hunk.content} hunk={hunk} />
-  </Fragment>
-);
+type ExpandType = 'up' | 'down' | "up&down" | 'all' | "none";
 
-const renderDiffChildren = (hunks: HunkData[]) => hunks.map(renderHunk);
+const ExpandButton = ({expand, onClick}: {expand: ExpandType, onClick: (type?: "up" | "down") => void}) => {
+  if (expand === "up&down") {
+    return (<div className={styles.decorationGutterButtonsWrapper}>
+      <button style={{backgroundColor: 'rgb(133, 206, 255)'}} className={styles.decorationGutterButton} onClick={() => onClick("down")}>↓</button>
+      <button style={{backgroundColor: 'rgb(133, 206, 255)'}} className={styles.decorationGutterButton} onClick={() => onClick("up")}>↑</button>
+    </div>)
+  }
+  if (expand === "up") return <button style={{backgroundColor: 'rgb(133, 206, 255)'}} className={styles.decorationGutterButton} onClick={() => onClick()}>↑</button>;
+  if (expand === "down") return <button style={{backgroundColor: 'rgb(133, 206, 255)'}} className={styles.decorationGutterButton} onClick={() => onClick()}>↓</button>;
+  if (expand === "none") return null;
+  return <button style={{backgroundColor: 'rgb(133, 206, 255)'}} className={styles.decorationGutterButton} onClick={() => onClick()}>↓↑</button>;
+};
+
+const ExpandedDecoratedHunk = ({hunk, expand, onClick}: {hunk?: HunkData, expand: ExpandType, onClick?: (type?: "up" | "down") => void} ) => {
+  return (<Fragment>
+  <Decoration className={styles.decoration} gutterClassName={styles.decorationGutter} contentClassName={styles.decorationContent}>
+    <ExpandButton expand={expand} onClick={(type) => onClick?.(type)} />
+    {hunk && hunk.content}
+  </Decoration>
+  {hunk && <Hunk key={hunk.content} hunk={hunk} />}
+</Fragment>)
+}
+
+const TOTAL_NUMBER = 1000; // TODO: какое-то число от бэка нужно
+
+const renderDiffChildren = (hunks: HunkData[], setHunks: (hunk: HunkData) => void) => {
+  const expand = (start: number, end: number) => {
+    console.log("DIFF EXPAND REQUEST: ", start, end);
+    // const mockResponse = {
+    //   // Начинаем строго со следующей строки после 1-го ханга
+    //   start: 5, 
+    //   // Заканчиваем строго перед началом 2-го ханга
+    //   end: 6,   
+    //   // Количество строк должно быть ровно 2 (6 - 5 + 1)
+    //   lines: [
+    //     "  useTokenizeWorker,", // это реальная 5-я строка из твоего файла
+    //     "  type FileData,"      // это реальная 6-я строка
+    //   ]
+    // };
+  
+    // const newHunk = textLinesToHunk(mockResponse.lines, mockResponse.start, mockResponse.start);
+
+    // if (newHunk) {
+    //   const nextHunks = insertHunk(hunks, newHunk)
+    //   setHunks(nextHunks);
+    // };
+  };
+
+  const elements = hunks.reduce<React.ReactElement[]>((acc, hunk, ind) => {
+    if (ind === 0) {
+      if (hunk.oldStart > 1) {
+        acc.push(
+          <ExpandedDecoratedHunk hunk={hunk} expand="up" onClick={() => expand(hunk.oldStart, hunk.oldStart - 20 >= 1 ? hunk.oldStart - 20 : 1)}/>
+        );
+      }
+      else {
+        acc.push(
+          <ExpandedDecoratedHunk hunk={hunk} expand="none" />
+        );
+      }
+    }
+
+    const prevHunk = hunks[ind - 1]
+
+    if (ind > 0 && prevHunk) {
+      const collapsedCount = getCollapsedLinesCountBetween(prevHunk, hunk);
+
+      if (collapsedCount > 0 && collapsedCount <= 20) {
+        acc.push(
+          <ExpandedDecoratedHunk hunk={hunk} expand="all" onClick={() => expand(prevHunk.oldStart + prevHunk.oldLines, hunk.oldStart - 1)} />
+        );
+      };
+
+      if (collapsedCount > 20) {
+        acc.push(
+          <ExpandedDecoratedHunk hunk={hunk} expand="up&down" onClick={(type) => {
+            if (type === "up") expand(hunk.oldStart - 20, hunk.oldStart - 1)
+            if (type === "down") expand(prevHunk.oldStart + prevHunk.oldLines, prevHunk.oldStart + prevHunk.oldLines + 19);
+          }} />
+        );
+      };
+    };
+
+    if (hunks.length - 1 === ind && hunk.oldStart + hunk.oldLines < TOTAL_NUMBER) {
+      acc.push(<ExpandedDecoratedHunk expand="down" onClick={() => expand(hunk.oldStart + hunk.oldLines, hunk.oldStart + hunk.oldLines <= TOTAL_NUMBER ?  hunk.oldStart + hunk.oldLines + 19 : TOTAL_NUMBER)}/>)
+    }
+
+    return acc;
+  }, []);
+  
+
+  return elements;
+};
 
 const defaultRenderToken: RenderToken = (token, defaultRender, i) => {
   if (token.type === "indent-guide") {
@@ -73,36 +164,36 @@ export const DiffView = ({
     () => tokenizeWorkerProp ?? getDefaultTokenizeWorker(),
     [tokenizeWorkerProp]
   );
+
+  const { oldRevision, newRevision, type, hunks } = file;
+  const [diffHunks, setHunks] = useState(hunks);
+
   const tokenizePayload = useMemo(
     () => ({
-      hunks: file.hunks ?? "",
+      hunks: diffHunks ?? "",
       oldSource: null,
       language: getFileExtension(file.newPath ?? ""),
       enableComments,
     }),
-    [file.hunks, file.newPath, enableComments]
+    [diffHunks, file.newPath, enableComments]
   );
   const { tokens } = useTokenizeWorker(tokenizeWorker, tokenizePayload);
 
-  if (!file) {
-    return null;
-  }
-
-  const { oldRevision, newRevision, type, hunks } = file;
+  console.log("DIFF HUNKS===", diffHunks);
 
   return (
     <Diff
       key={{oldRevision}-{newRevision}}
       viewType={viewType}
       diffType={type}
-      hunks={hunks}
+      hunks={diffHunks}
       tokens={tokens}
       renderToken={renderToken ?? defaultRenderToken}
       optimizeSelection
       className={styles.diff}
       widgets={widgets}
     >
-      {renderDiffChildren}
+      {(diffHunks) => renderDiffChildren(diffHunks, setHunks)}
     </Diff>
   );
 };
`;
