import { Plus, ChevronDown, Users } from "lucide-react";
import type { IBoard } from "../../types/common.types";

interface BoardSelectorProps {
  boards: IBoard[];
  currentBoardId: string | null;
  onSelect: (id: string) => void;
  onCreateClick: () => void;
  onInviteClick: () => void;
}

export const BoardSelector = ({
  boards,
  currentBoardId,
  onSelect,
  onCreateClick,
  onInviteClick,
}: BoardSelectorProps) => {
  const currentBoard = boards.find((b) => b._id === currentBoardId);

  return (
    <div className="flex items-center gap-2">
      <div className="relative group">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
          <span className="font-medium text-white">
            {currentBoard ? currentBoard.name : "Select Board"}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>

        <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
          <div className="max-h-60 overflow-y-auto space-y-1 mb-2">
            {boards.map((board) => (
              <button
                key={board._id}
                onClick={() => onSelect(board._id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  board._id === currentBoardId
                    ? "bg-indigo-500 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {board.name}
              </button>
            ))}
          </div>

          <button
            onClick={onCreateClick}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors border-t border-white/5 mt-1 pt-2"
          >
            <Plus size={16} />
            <span>New Board</span>
          </button>
        </div>
      </div>

      {currentBoardId && (
        <button
          onClick={onInviteClick}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          title="Invite collaborators to this board"
        >
          <Users size={20} />
        </button>
      )}
    </div>
  );
};
