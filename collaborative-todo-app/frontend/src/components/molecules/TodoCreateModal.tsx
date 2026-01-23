import React, { useState } from "react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";
import { createTodoSchema } from "../../validation/todo.validation";
import { X } from "lucide-react";

interface TodoCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (text: string, description?: string) => Promise<void>;
}

export const TodoCreateModal: React.FC<TodoCreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      createTodoSchema.parse({ text, description: description || undefined });
      await onCreate(text, description || undefined);
      setText("");
      setDescription("");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create task");
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

        <h2 className="text-2xl font-bold mb-2 text-white">Create New Task</h2>
        <p className="text-gray-400 text-sm mb-6">
          Add a new task to your board with optional details
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="new-task-text">Task *</Label>
            <Input
              id="new-task-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              className="mt-1"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="new-task-description">Description (Optional)</Label>
            <textarea
              id="new-task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[120px] resize-y"
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {description.length}/2000 characters
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="px-8">
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
