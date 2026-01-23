import { useState } from "react";
import { useTodos } from "../modules/todos/useTodos";
import { useBoards } from "../modules/boards/useBoards";
import { TodoList } from "../components/organisms/TodoList";
import { StatusIndicator } from "../components/molecules/StatusIndicator";
import { UserMenu } from "../components/molecules/UserMenu";
import { CollaborationModal } from "../components/molecules/CollaborationModal";
import { TodoCreateModal } from "../components/molecules/TodoCreateModal";
import { TodoEditModal } from "../components/molecules/TodoEditModal";
import { BoardSelector } from "../components/molecules/BoardSelector";
import { PendingInvitations } from "../components/molecules/PendingInvitations";
import { BoardSettingsModal } from "../components/molecules/BoardSettingsModal";
import * as authService from "../services/auth.service";
import { Plus } from "lucide-react";
import type { ITodo } from "../types/common.types";

export const TodoPage = () => {
  const {
    boards,
    pendingInvites,
    currentBoardId,
    selectBoard,
    createBoard,
    inviteToBoard,
    acceptInvite,
    isLoading: isLoadingBoards,
  } = useBoards();

  const {
    todos,
    isOnline,
    isLoading: isLoadingTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    moveTodo,
    updateTodoText,
  } = useTodos(currentBoardId);

  const user = authService.getUser();
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);

  const currentBoard = boards.find((b) => b._id === currentBoardId);
  
  const userRole = currentBoard?.collaborators.find(
    (c) =>
      c.userId && typeof c.userId === "object" && c.userId._id === user?._id
  )?.role;

  const isOwner =
    currentBoard?.owner === user?._id ||
    (!!currentBoard?.owner &&
      typeof currentBoard?.owner === "object" &&
      currentBoard?.owner._id === user?._id);
  const canEdit = isOwner || userRole === "editor" || userRole === "admin";

  const handleCreateBoard = async () => {
    const name = prompt("Enter board name:");
    if (name) {
      await createBoard(name);
    }
  };

  const handleInvite = async (
    email: string,
    role: "viewer" | "editor" | "admin"
  ): Promise<{ success: boolean; message?: string }> => {
    if (currentBoardId) {
      const result = await inviteToBoard(currentBoardId, email, role);
      if (result.success) {
        setIsCollabModalOpen(false);
      }
      return result;
    }
    return { success: false, message: "No board selected" };
  };

  const handleCreateTodo = async (text: string, description?: string) => {
    await addTodo(text, description);
  };

  const handleEditTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setEditingTodo(todo);
    }
  };

  const handleSaveTodo = async (updates: {
    text?: string;
    description?: string;
  }) => {
    if (editingTodo) {
      await updateTodoText(editingTodo.id, updates);
    }
  };

  if (isLoadingBoards || (currentBoardId && isLoadingTodos)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"></div>
          <div className="text-lg font-medium text-gray-400">
            {isLoadingBoards ? "Loading boards..." : "Loading tasks..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none fixed"></div>

      <header className="sticky top-0 z-10 backdrop-blur-xl bg-gray-900/50 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
              </div>

              <BoardSelector
                boards={boards}
                currentBoardId={currentBoardId}
                onSelect={selectBoard}
                onCreateClick={handleCreateBoard}
                onInviteClick={() => setIsSettingsModalOpen(true)}
              />
            </div>

            <div className="flex items-center gap-4">
              <StatusIndicator isOnline={isOnline} />
              <UserMenu userName={user?.name} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 relative z-0">
        <PendingInvitations invites={pendingInvites} onAccept={acceptInvite} />

        {!currentBoardId ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Plus size={40} className="text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to TaskFlow</h2>
            <p className="text-gray-400 mb-8 max-w-sm">
              Get started by creating your first board or accepting an
              invitation.
            </p>
            <button
              onClick={handleCreateBoard}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-medium transition-colors"
            >
              Create First Board
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={!canEdit}
                className="w-full px-6 py-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                {canEdit ? "Add New Task" : "View Only (No Edit Permission)"}
              </button>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/5 p-1">
              <TodoList
                todos={todos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={handleEditTodo}
                onMoveUp={(id) => moveTodo(id, "up")}
                onMoveDown={(id) => moveTodo(id, "down")}
                canEdit={canEdit}
              />
            </div>
          </>
        )}
      </main>

      <CollaborationModal
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
        onAdd={handleInvite}
      />

      <TodoCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTodo}
      />

      {editingTodo && (
        <TodoEditModal
          todo={editingTodo}
          isOpen={!!editingTodo}
          onClose={() => setEditingTodo(null)}
          onSave={handleSaveTodo}
          canEdit={canEdit}
        />
      )}

      {currentBoard && (
        <BoardSettingsModal
          board={currentBoard}
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onInvite={() => {
            setIsSettingsModalOpen(false);
            setIsCollabModalOpen(true);
          }}
        />
      )}
    </div>
  );
};
