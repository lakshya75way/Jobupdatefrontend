import React, { useState } from "react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";
import { inviteUserSchema } from "../../validation/board.validation";
import { X } from "lucide-react";

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    email: string,
    role: "viewer" | "editor" | "admin"
  ) => Promise<{ success: boolean; message?: string }>;
}

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"viewer" | "editor" | "admin">("viewer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const validated = inviteUserSchema.parse({ email, role });
      const result = await onAdd(validated.email, validated.role);
      if (result.success) {
        onClose();
        setEmail("");
      } else {
        setError(result.message || "Failed to add collaborator");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-gray-900 p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-white">
          Invite Collaborator
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Share this board with others to work together in real-time.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="collab-email">Email Address</Label>
            <Input
              id="collab-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="collab-role">Role</Label>
            <select
              id="collab-role"
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "viewer" | "editor" | "admin")
              }
            >
              <option value="viewer" className="bg-gray-900">
                Viewer (Read Only)
              </option>
              <option value="editor" className="bg-gray-900">
                Editor (Edit Tasks)
              </option>
              <option value="admin" className="bg-gray-900">
                Admin (Manage Board)
              </option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="px-8">
              Send Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
