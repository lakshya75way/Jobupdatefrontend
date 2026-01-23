import { Button } from "../atoms/Button";
import { Users } from "lucide-react";
import type { IBoard } from "../../types/common.types";

interface PendingInvitationsProps {
  invites: IBoard[];
  onAccept: (boardId: string) => void;
}

export const PendingInvitations = ({
  invites,
  onAccept,
}: PendingInvitationsProps) => {
  if (invites.length === 0) return null;

  return (
    <div className="mb-8 space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">
        Pending Invitations ({invites.length})
      </h3>
      {invites.map((board) => (
        <div
          key={board._id}
          className="flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
              <Users size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Invitation to join{" "}
                <span className="text-indigo-400">"{board.name}"</span>
              </p>
              <p className="text-xs text-gray-400">
                Invited by{" "}
                {typeof board.owner === "object" ? board.owner.name : "someone"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onAccept(board._id)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Accept
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
