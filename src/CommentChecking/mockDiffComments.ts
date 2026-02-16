import type { DiffComment } from "./types";

export const mockDiffComments: DiffComment[] = [
  {
    id: "c1",
    author: {
      name: "Alex Ivanov",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    content:
      "Можно вынести эту логику в отдельный хук, чтобы не дублировать код.",
    line: 2,
    side: "proposed",
    commit_id: "a1b2c3d4",
    status: "active",
  },
  {
    id: "c2",
    author: {
      name: "Maria Petrova",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    content:
      "Здесь возможен undefined — стоит добавить дополнительную проверку.",
    line: 4,
    side: "base",
    commit_id: "a1b2c3d4",
    status: "resolved",
  },
  {
    id: "c3",
    author: {
      name: "Dmitry Sokolov",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    content:
      "Название переменной не совсем отражает суть. Может переименовать?",
    line: 12,
    side: "proposed",
    commit_id: "e5f6g7h8",
    status: "active",
  },
  {
    id: "c4",
    author: {
      name: "Elena Smirnova",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    content: "Стоит добавить unit-тест на этот кейс.",
    line: 3,
    side: "base",
    commit_id: "e5f6g7h8",
    status: "active",
  },
  {
    id: "c5",
    author: {
      name: "Sergey Volkov",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    content: "Можно оптимизировать этот участок, сейчас сложность O(n^2).",
    line: 21,
    side: "proposed",
    commit_id: "z9y8x7w6",
    status: "resolved",
  },
];
