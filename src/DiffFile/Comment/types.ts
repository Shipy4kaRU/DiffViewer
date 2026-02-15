import type { ChangeKey } from "../types";

export type CommentType = {
  commentId: string;
  changeKey: ChangeKey;
  content: string;
  time: Date;
  state: "create" | "edit" | "display";
};

export type CommentState = CommentType["state"];

export type CommentContent = CommentType["content"];

export type CommentId = CommentType["commentId"];
