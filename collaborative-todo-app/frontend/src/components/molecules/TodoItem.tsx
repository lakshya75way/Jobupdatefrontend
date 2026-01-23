import {
  Trash2,
  CheckCircle2,
  Circle,
  ArrowUp,
  ArrowDown,
  Edit2,
} from "lucide-react";
import type { ITodo } from "../../types/common.types";
import { Button } from "../atoms/Button";

interface TodoItemProps {
  todo: ITodo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  canEdit: boolean;
}

export const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  canEdit,
}: TodoItemProps) => {
  return (
    <div
      className={`
      group flex items-center gap-3 p-4 rounded-xl border transition-all duration-200
      ${
        todo.completed
          ? "bg-emerald-500/5 border-emerald-500/20"
          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
      }
    `}
    >
      <div className="flex flex-col gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onMoveUp(todo.id)}
          className="text-gray-500 hover:text-accent-primary disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={!canEdit}
        >
          <ArrowUp size={16} />
        </button>
        <button
          onClick={() => onMoveDown(todo.id)}
          className="text-gray-500 hover:text-accent-primary disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={!canEdit}
        >
          <ArrowDown size={16} />
        </button>
      </div>

      <button
        onClick={() => onToggle(todo.id)}
        className={`
          flex-shrink-0 transition-colors duration-200
          ${
            todo.completed
              ? "text-emerald-400"
              : "text-gray-500 hover:text-accent-primary"
          }
        `}
        disabled={!canEdit}
      >
        {todo.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`
          text-base transition-all duration-200
          ${todo.completed ? "line-through text-gray-500" : "text-white"}
        `}
        >
          {todo.text}
        </p>
        {todo.description && (
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {todo.description}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
          {todo.createdByName && (
            <p className="text-xs text-gray-500">
              Created by{" "}
              <span className="text-gray-400">{todo.createdByName}</span>
            </p>
          )}
          {todo.lastModifiedByName && (
            <p className="text-xs text-gray-500">
              Last changed by{" "}
              <span className="text-gray-400">{todo.lastModifiedByName}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(todo.id)}
          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
          title={canEdit ? "Edit task" : "View task"}
        >
          <Edit2 size={18} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(todo.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          disabled={!canEdit}
          title="Delete task"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
};
