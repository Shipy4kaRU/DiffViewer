import { type HunkData, markEdits, tokenize, markWord } from "react-diff-view";
import refractor from "refractor";

export type TokenizePayload = {
  hunks: HunkData[];
  oldSource: string | null;
  language?: string;
};

let workerInstance: Worker | null = null;

export const getTokenizeWorker = (): Worker => {
  if (!workerInstance) {
    workerInstance = new Worker(
      new URL("./tokenizeDiff.worker.ts", import.meta.url),
      { type: "module" }
    );
  }

  return workerInstance;
};

export const tokenizeDiff = (hunks: HunkData[], lang: string) => {
  console.log("[tokenizeDiff] hunks: ", hunks);

  if (!hunks.length) {
    return undefined;
  }

  const options = {
    highlight: true, // Включаем подсветку синтаксиса
    refractor, // Передаем библиотеку-парсер
    language: lang, // Указываем язык
    // oldSource: oldCode, (Опциональное) Полный исходник для точности (чтобы библиотека смогла точнее определить различия построчно)
    enhancers: [
      markEdits(hunks), // Добавляем вычисление inline-различий
      markWord("\t", "tab"), // Помечаем табуляцию
    ],
  };

  try {
    return tokenize(hunks, options);
  } catch (err) {
    console.error("[tokenizeDiff] error: ", err);
    return undefined;
  }
};
