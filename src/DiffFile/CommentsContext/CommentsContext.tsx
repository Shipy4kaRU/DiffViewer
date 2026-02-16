/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  type ReactNode,
  useMemo,
  useCallback,
} from "react";
import type { CommentContent, CommentId, CommentType } from "../Comment/types";
import type { ChangeKey } from "../types";
import { nanoid } from "nanoid";
import type { DiffComment } from "../../CommentChecking/types";
import {
  findChangeByNewLineNumber,
  findChangeByOldLineNumber,
  getChangeKey,
  type HunkData,
} from "react-diff-view";

type CommentsContextValue = {
  comments: Record<ChangeKey, CommentType[]>;
  handleCreateComment: (changeKey: ChangeKey) => void;
  handleSaveComment: (
    changeKey: ChangeKey,
    commentId: CommentId,
    content: CommentContent
  ) => void;
  handleEditComment: (changeKey: ChangeKey, commentId: CommentId) => void;
  handleCloseCommentForm: (changeKey: ChangeKey, commentId: CommentId) => void;
  handleDeleteComment: (changeKey: ChangeKey, commentId: CommentId) => void;
} | null;

export const CommentsContext = createContext<CommentsContextValue>(null);

type CommentsProviderProps = {
  hunks: HunkData[];
  commentsDTO: DiffComment[];
  children: ReactNode;
};

type Change =
  | {
      type: "insert";
      content: string;
      lineNumber: number;
      isInsert: true;
    }
  | {
      type: "delete";
      content: string;
      lineNumber: number;
      isDelete: true;
    }
  | {
      type: "normal";
      content: string;
      isNormal: true;
      oldLineNumber: number;
      newLineNumber: number;
    }
  | undefined;

const parseDTOToComments = (
  hunks: HunkData[],
  comments: DiffComment[]
): Record<ChangeKey, CommentType[]> => {
  return comments.reduce((acc, { commit_id, line, side, content, author }) => {
    let changeKey: ChangeKey | null = null;
    let change: Change | undefined;

    if (side === "proposed") {
      change = findChangeByNewLineNumber(hunks, +line);
      changeKey = change ? getChangeKey(change) : null;
    } else if (side === "base") {
      change = findChangeByOldLineNumber(hunks, +line);
      changeKey = change ? getChangeKey(change) : null;
    }

    console.log(JSON.stringify(author), change, changeKey, line, side);

    if (author.name === "Sergey Volkov") {
      changeKey = "I21";
    }

    if (!changeKey) {
      return acc;
    }

    if (!acc[changeKey]) {
      acc[changeKey] = [];
    }

    acc[changeKey].push({
      commentId: commit_id,
      changeKey,
      content,
      time: new Date(),
      state: "display",
    });

    return acc;
  }, {} as Record<ChangeKey, CommentType[]>);
};

export const CommentsProvider = ({
  hunks,
  commentsDTO,
  children,
}: CommentsProviderProps) => {
  const [comments, setComments] = useState<Record<ChangeKey, CommentType[]>>(
    () => parseDTOToComments(hunks, commentsDTO)
  );

  const handleCreateComment = useCallback((changeKey: ChangeKey) => {
    setComments((prev) => ({
      ...prev,
      [changeKey]: [
        ...(prev[changeKey] || []),
        {
          commentId: nanoid(),
          changeKey,
          content: "",
          time: new Date(),
          state: "create",
        },
      ],
    }));
  }, []);

  const handleSaveComment = useCallback(
    (changeKey: ChangeKey, commentId: CommentId, content: CommentContent) => {
      setComments((prev) => {
        const comments = prev[changeKey];

        if (!comments) {
          return prev;
        }

        let updated = false;

        const nextComments = comments.map((comment) => {
          if (comment.commentId !== commentId) return comment;

          updated = true;

          return {
            ...comment,
            content,
            time: new Date(),
            state: "display",
          } satisfies CommentType;
        });

        if (!updated) {
          return prev;
        }

        return {
          ...prev,
          [changeKey]: nextComments,
        };
      });
    },
    []
  );

  const handleEditComment = useCallback(
    (changeKey: ChangeKey, commentId: CommentId) => {
      setComments((prev) => {
        const comments = prev[changeKey];

        if (!comments) {
          return prev;
        }

        let updated = false;

        const nextComments = comments.map((comment) => {
          if (comment.commentId !== commentId) return comment;

          updated = true;

          return {
            ...comment,
            state: "edit",
          } satisfies CommentType;
        });

        if (!updated) {
          return prev;
        }

        return {
          ...prev,
          [changeKey]: nextComments,
        };
      });
    },
    []
  );

  const handleCloseCommentForm = useCallback(
    (changeKey: ChangeKey, commentId: CommentId) => {
      setComments((prev) => {
        const comments = prev[changeKey];

        if (!comments) {
          return prev;
        }

        let updated = false;

        const nextComments = comments.map((comment) => {
          if (comment.commentId !== commentId) return comment;

          updated = true;

          return {
            ...comment,
            state: "display",
          } satisfies CommentType;
        });

        if (!updated) {
          return prev;
        }

        return {
          ...prev,
          [changeKey]: nextComments,
        };
      });
    },
    []
  );

  const handleDeleteComment = useCallback(
    (changeKey: ChangeKey, commentId: CommentId) => {
      setComments((prev) => {
        const comments = prev[changeKey];

        if (!comments) {
          return prev;
        }

        const nextComments = comments.filter(
          (comment) => comment.commentId !== commentId
        );

        if (nextComments.length === comments.length) {
          return prev;
        }

        return {
          ...prev,
          [changeKey]: nextComments,
        };
      });
    },
    []
  );

  const commentsData = useMemo(
    () => ({
      comments,
      handleCreateComment,
      handleSaveComment,
      handleEditComment,
      handleCloseCommentForm,
      handleDeleteComment,
    }),
    [
      comments,
      handleCloseCommentForm,
      handleCreateComment,
      handleDeleteComment,
      handleEditComment,
      handleSaveComment,
    ]
  );

  return (
    <CommentsContext.Provider value={commentsData}>
      {children}
    </CommentsContext.Provider>
  );
};
