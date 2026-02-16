import { type HunkData } from "react-diff-view";
import { tokenizeDiff } from "./tokenizeDiff";

export type TokenizeDefaultWorkerPayload = {
  hunks: HunkData[];
  language?: string;
};

self.onmessage = (
  e: MessageEvent<{
    type: string;
    payload: TokenizeDefaultWorkerPayload;
    id: number;
  }>
) => {
  const { type, payload, id } = e.data;
  if (type !== "tokenize") return;

  const { hunks, language = "text" } = payload;

  if (!hunks?.length) {
    self.postMessage({ payload: { success: true, tokens: null }, id });
    return;
  }

  try {
    const tokens = tokenizeDiff(hunks, language);
    self.postMessage({ payload: { success: true, tokens }, id });
  } catch (err) {
    self.postMessage({
      payload: {
        success: false,
        reason: err instanceof Error ? err.message : String(err),
      },
      id,
    });
  }
};
