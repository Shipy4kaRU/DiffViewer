import { useCallback, useMemo, useState } from "react";
import type { CommentContent, CommentId, CommentType } from "./Comment/types";
import type { ChangeKey } from "./types";
import { nanoid } from "nanoid";

export const useComments = () => {
  const [comments, setComments] = useState<Record<ChangeKey, CommentType[]>>(
    {}
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

  return commentsData;
};
