import { type HunkData, markEdits, tokenize, markWord } from "react-diff-view";
import refractor from "refractor";
import { markIndentGuides } from "./markIndentGuides";
import { injectEmptyLinePlaceholders } from "./injectEmptyLinePlaceholders";
import { markLineComments } from "./markLineComments";

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

export const tokenizeDiff = (
  hunks: HunkData[],
  lang: string,
  enableComments: boolean
) => {
  console.log("[tokenizeDiff] hunks: ", hunks);

  if (!hunks.length) {
    return undefined;
  }

  const enhancers = [
    markEdits(hunks), // Вычисление inline-различий
    markWord("\t", "tab"), // Помечаем табуляцию
    ...(enableComments
      ? [injectEmptyLinePlaceholders(hunks), markLineComments(hunks)] // Пустые +/- строки: подставляем placeholder для Comment и маркер +/-
      : []),
    markIndentGuides(hunks, { indentSize: 4 }), // Полосы вложенности
  ];

  const options = {
    highlight: lang !== "txt", // Включаем подсветку синтаксиса
    refractor, // Передаем библиотеку-парсер
    language: lang, // Указываем язык
    // oldSource: oldCode, (Опциональное) Полный исходник для точности (чтобы библиотека смогла точнее определить различия построчно)
    enhancers,
  };

  try {
    return tokenize(hunks, options);
  } catch (err) {
    console.error("[tokenizeDiff] error: ", err);
    return undefined;
  }
};
