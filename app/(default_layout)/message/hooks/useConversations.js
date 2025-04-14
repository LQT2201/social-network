import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchConversations,
  fetchPinnedConversations,
} from "@/redux/features/message";

export const useConversations = (clientId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (clientId) {
      dispatch(fetchConversations({ page: 1, limit: 20 }));
      dispatch(fetchPinnedConversations({ page: 1, limit: 20 }));
    }
  }, [clientId, dispatch]);
};
