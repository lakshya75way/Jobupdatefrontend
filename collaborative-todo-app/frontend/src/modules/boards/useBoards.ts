import { useState, useEffect, useCallback } from "react";
import * as apiService from "../../services/api.service";
import * as socketService from "../../services/socket.service";
import type { IBoard } from "../../types/common.types";


export const useBoards = () => {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [pendingInvites, setPendingInvites] = useState<IBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(() => {
    return localStorage.getItem("currentBoardId");
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [boardsRes, invitesRes] = await Promise.all([
        apiService.getBoards(),
        apiService.getPendingInvites(),
      ]);

      if (boardsRes.success && boardsRes.data?.boards) {
        const fetchedBoards = boardsRes.data.boards;
        setBoards(fetchedBoards);

        
        if (currentBoardId) {
          const isAccessible = fetchedBoards.some(
            (b: IBoard) => b._id === currentBoardId
          );
          if (!isAccessible) {
            const nextId =
              fetchedBoards.length > 0 ? fetchedBoards[0]._id : null;
            setCurrentBoardId(nextId);
            if (nextId) {
              localStorage.setItem("currentBoardId", nextId);
            } else {
              localStorage.removeItem("currentBoardId");
            }
          }
        } else if (fetchedBoards.length > 0) {
          const firstId = fetchedBoards[0]._id;
          setCurrentBoardId(firstId);
          localStorage.setItem("currentBoardId", firstId);
        }
      }

      if (invitesRes.success && invitesRes.data?.boards) {
        setPendingInvites(invitesRes.data.boards);
      }
    } catch (e) {
      console.error("Failed to load board data", e);
    } finally {
      setIsLoading(false);
    }
  }, [currentBoardId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  
  useEffect(() => {
    socketService.connect(); 
    const handleBoardUpdate = (updatedBoard: IBoard) => {
      setBoards((prev) =>
        prev.map((b) => (b._id === updatedBoard._id ? updatedBoard : b))
      );
    };

    socketService.onBoardUpdated(handleBoardUpdate);

    return () => {
      socketService.offBoardUpdated();
    };
  }, []);

  const selectBoard = (id: string) => {
    setCurrentBoardId(id);
    localStorage.setItem("currentBoardId", id);
  };

  const createBoard = async (name: string) => {
    try {
      const response = await apiService.createBoard(name);
      if (response.success && response.data?.board) {
        await loadData();
        selectBoard(response.data.board._id);
        return response.data.board;
      }
    } catch (e) {
      console.error("Failed to create board", e);
    }
  };

  const inviteToBoard = async (
    boardId: string,
    email: string,
    role: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiService.inviteToBoard(boardId, email, role);
      if (response.success && response.data?.board) {
        const updatedBoard = response.data.board;
        setBoards((prev) =>
          prev.map((b) => (b._id === boardId ? updatedBoard : b))
        );
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (e) {
      console.error("Failed to invite to board", e);
      return { success: false, message: "Network error" };
    }
  };

  const acceptInvite = async (boardId: string) => {
    try {
      const response = await apiService.acceptInvite(boardId);
      if (response.success) {
        localStorage.setItem("currentBoardId", boardId);
        setCurrentBoardId(boardId);
        await loadData(); 
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to accept invite", e);
      return false;
    }
  };

  const removeCollaborator = async (boardId: string, userId: string) => {
    try {
      const response = await apiService.removeCollaborator(boardId, userId);
      if (response.success && response.data?.board) {
        const updatedBoard = response.data.board;
        setBoards((prev) =>
          prev.map((b) => (b._id === boardId ? updatedBoard : b))
        );
        return { success: true, message: "Collaborator removed" };
      }
      return { success: false, message: response.message };
    } catch (e) {
      console.error("Failed to remove collaborator", e);
      return { success: false, message: "Network error" };
    }
  };

  const updateCollaboratorRole = async (
    boardId: string,
    userId: string,
    role: string
  ) => {
    try {
      const response = await apiService.updateCollaboratorRole(
        boardId,
        userId,
        role
      );
      if (response.success && response.data?.board) {
        const updatedBoard = response.data.board;
        setBoards((prev) =>
          prev.map((b) => (b._id === boardId ? updatedBoard : b))
        );
        return { success: true, message: "Role updated" };
      }
      return { success: false, message: response.message };
    } catch (e) {
      console.error("Failed to update role", e);
      return { success: false, message: "Network error" };
    }
  };

  return {
    boards,
    pendingInvites,
    currentBoardId,
    isLoading,
    selectBoard,
    createBoard,
    inviteToBoard,
    acceptInvite,
    removeCollaborator,
    updateCollaboratorRole,
    refreshBoards: loadData,
  };
};
