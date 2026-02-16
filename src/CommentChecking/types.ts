//  Тип комментария для страницы просмотра диффов пр
export type DiffComment = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  line: number;
  side: "proposed" | "base";
  commit_id: string;
  status: "active" | "resolved";
};

// Тип DTO для страницы обсуждения пр
export type PRComment = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
};

export type PRCommentDTO = {
  file_info: {
    path: string;
    from_commit: string;
    to_commit: string;
  };
  diff: string;
  comments: PRComment[];
};
