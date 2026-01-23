import React, { useState } from "react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";
import { updateTodoSchema } from "../../validation/todo.validation";
import { X } from "lucide-react";
import type { ITodo } from "../../types/common.types";

interface TodoEditModalProps {
  todo: ITodo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { text?: string; description?: string }) => Promise<void>;
  canEdit: boolean;
}

export const TodoEditModal: React.FC<TodoEditModalProps> = ({
  todo,
  isOpen,
  onClose,
  onSave,
  canEdit,
}) => {
  const [text, setText] = useState(todo.text);
  const [description, setDescription] = useState(todo.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const updates: { text?: string; description?: string } = {};
      if (text !== todo.text) updates.text = text;
      if (description !== (todo.description || ""))
        updates.description = description;

      updateTodoSchema.parse(updates);
      await onSave(updates);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update task");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-gray-900 p-8 rounded-2xl border border-white/10 w-full max-w-2xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-white">
          {canEdit ? "Edit Task" : "View Task"}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {canEdit
            ? "Update task details and description"
            : "You have view-only access to this task"}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="task-text">Task</Label>
            <Input
              id="task-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              className="mt-1"
              disabled={!canEdit}
            />
          </div>

          <div>
            <Label htmlFor="task-description">Description (Optional)</Label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[120px] resize-y disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canEdit}
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {description.length}/2000 characters
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={onClose} type="button">
              {canEdit ? "Cancel" : "Close"}
            </Button>
            {canEdit && (
              <Button type="submit" isLoading={loading} className="px-8">
                Save Changes
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
