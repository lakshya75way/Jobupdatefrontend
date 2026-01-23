import { Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";

interface CreateTodoFormProps {
  onAdd: (text: string) => void;
}

export const CreateTodoForm = ({ onAdd }: CreateTodoFormProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-2">
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pr-24 py-3 text-lg" 
        autoFocus
      />
      <div className="absolute right-1 top-1 bottom-1">
        <Button
          type="submit"
          size="sm"
          className="h-full rounded-lg"
          disabled={!inputValue.trim()}
        >
          <Plus size={20} className="mr-1" />
          Add
        </Button>
      </div>
    </form>
  );
};
