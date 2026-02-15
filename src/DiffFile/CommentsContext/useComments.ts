import { useContext } from "react";
import { CommentsContext } from "./CommentsContext";

export const useComments = () => {
  const data = useContext(CommentsContext);

  if (!data) {
    throw new Error("CommentsContextProvider not found");
  }

  return data;
};
