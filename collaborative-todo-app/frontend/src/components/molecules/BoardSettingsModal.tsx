import { useState } from "react";
import { X, UserMinus, UserPlus } from "lucide-react";
import { Button } from "../atoms/Button";
import { useBoards } from "../../modules/boards/useBoards";
import type { IBoard } from "../../types/common.types";
import { getUser } from "../../services/auth.service";

interface BoardSettingsModalProps {
  board: IBoard;
  isOpen: boolean;
  onClose: () => void;
  onInvite: () => void;
}

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

interface PopulatedBoard extends Omit<IBoard, "owner" | "collaborators"> {
  owner: PopulatedUser;
  collaborators: {
    userId: PopulatedUser;
    role: "viewer" | "editor" | "admin";
    status: "pending" | "accepted";
  }[];
}

export const BoardSettingsModal = ({
  board: initialBoard,
  isOpen,
  onClose,
  onInvite,
}: BoardSettingsModalProps) => {
  const board = initialBoard as unknown as PopulatedBoard;
  const { removeCollaborator, updateCollaboratorRole } = useBoards();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const currentUser = getUser();

  const isOwner = currentUser?._id === board.owner._id;
  const isAdmin = board.collaborators.some(
    (c) =>
      c.userId &&
      c.userId._id === currentUser?._id &&
      c.role === "admin" &&
      c.status === "accepted"
  );

  const canInvite = isOwner || isAdmin;

  if (!isOpen) return null;

  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this collaborator?")) return;
    setLoadingId(userId);
    await removeCollaborator(board._id, userId);
    setLoadingId(null);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingId(userId);
    await updateCollaboratorRole(board._id, userId, newRole);
    setLoadingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#1a1f2e] rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Board Members</h2>
          <div className="flex items-center gap-2">
            {canInvite && (
              <Button
                onClick={onInvite}
                size="sm"
                variant="primary"
                className="flex items-center gap-2"
              >
                <UserPlus size={16} />
                Invite
              </Button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {}
          {board.owner && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  {board.owner.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-white font-medium">
                    {board.owner.name || "Unknown Owner"}{" "}
                    <span className="text-xs text-indigo-400">(Owner)</span>
                  </p>
                  <p className="text-sm text-gray-400">{board.owner.email}</p>
                </div>
              </div>
            </div>
          )}

          {}
          {board?.collaborators
            ?.filter(
              (collab) =>
                collab &&
                collab.userId &&
                collab.userId._id !== board.owner?._id
            ) 
            .map((collab) => (
              <div
                key={collab.userId._id || Math.random()}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">
                    {collab.userId.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {collab.userId.name || "Unknown User"}{" "}
                      {collab.status === "pending" && (
                        <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full ml-2">
                          Pending
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-400">
                      {collab.userId.email}
                    </p>
                  </div>
                </div>

                {isOwner && (
                  <div className="flex items-center gap-3">
                    <select
                      value={collab.role}
                      onChange={(e) =>
                        handleRoleChange(collab.userId._id, e.target.value)
                      }
                      disabled={loadingId === collab.userId._id}
                      className="bg-black/20 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      onClick={() => handleRemove(collab.userId._id)}
                      disabled={loadingId === collab.userId._id}
                      className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Remove User"
                    >
                      <UserMinus size={18} />
                    </button>
                  </div>
                )}

                {!isOwner && (
                  <span className="text-sm text-gray-500 capitalize px-3 py-1 bg-white/5 rounded-lg">
                    {collab.role}
                  </span>
                )}
              </div>
            ))}

          {(!board.collaborators || board.collaborators.length === 0) && (
            <p className="text-center text-gray-500 py-8">
              No other members yet. Invite someone!
            </p>
          )}
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
