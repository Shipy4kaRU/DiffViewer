import type { ChangeData } from "react-diff-view";

export type ChangeKey = string;

export type ExtendedChange = ChangeData & { isExpanded?: boolean };