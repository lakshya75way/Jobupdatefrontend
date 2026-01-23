import type { ITodo } from "../../types/common.types";
import { TodoItem } from "../molecules/TodoItem";
import { ClipboardList } from "lucide-react";

interface TodoListProps {
  todos: ITodo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  canEdit: boolean;
}

export const TodoList = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  canEdit,
}: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <ClipboardList size={32} className="text-gray-500" />
        </div>
        <h3 className="text-xl font-medium text-white mb-1">No todos yet</h3>
        <p className="text-gray-400">Create a task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
};
