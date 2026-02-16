import { type HunkData, markEdits, tokenize, markWord } from "react-diff-view";
import refractor from "refractor";
import { markIndentGuides } from "./markIndentGuides";

let workerInstance: Worker | null = null;

export const getDefaultTokenizeWorker = (): Worker => {
  if (!workerInstance) {
    workerInstance = new Worker(
      new URL("./tokenizeDefaultDiff.worker.ts", import.meta.url),
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
    highlight: lang !== "txt", // Включаем подсветку синтаксиса
    refractor, // Передаем библиотеку-парсер
    language: lang, // Указываем язык
    // oldSource: oldCode, (Опциональное) Полный исходник для точности (чтобы библиотека смогла точнее определить различия построчно)
    enhancers: [
      markEdits(hunks), // Вычисление inline-различий
      markWord("\t", "tab"), // Помечаем табуляцию
      markIndentGuides(hunks, { indentSize: 4 }), // Полосы вложенности
    ],
  };

  try {
    return tokenize(hunks, options);
  } catch (err) {
    console.error("[tokenizeDiff] error: ", err);
    return undefined;
  }
};
