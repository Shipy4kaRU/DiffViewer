// import { DiffView } from "./DiffFile";
// import { parseDiff } from "react-diff-view";

import { DiffFile } from "./DiffFile/DiffFile";
import { yamldiff } from "./textDiffs/yamlDiff";
import { reactDiff } from "./textDiffs/reactDiff";
import { pythonDiff } from "./textDiffs/pythonDiff";

export default function App() {
  return <DiffFile diff={yamldiff} />;
}

// import type { HunkData, DiffType } from "react-diff-view";

// export const exampleOldSource = `import React from 'react';

// export const exampleDiffType: DiffType = "modify";
