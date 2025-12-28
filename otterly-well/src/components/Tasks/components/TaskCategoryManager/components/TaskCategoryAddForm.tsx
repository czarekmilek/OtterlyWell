import { useState } from "react";

interface TaskCategoryAddFormProps {
  onAdd: (name: string) => void;
  onCancel: () => void;
}

export function TaskCategoryAddForm({
  onAdd,
  onCancel,
}: TaskCategoryAddFormProps) {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    onAdd(newCategoryName);
    setNewCategoryName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 flex flex-col sm:flex-row gap-2"
    >
      <input
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        placeholder="Nazwa kategorii..."
        className="flex-1 px-4 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl 
                       text-brand-neutral-light focus:outline-none focus:border-brand-primary"
        autoFocus
      />
      <button
        type="submit"
        className="bg-brand-primary px-4 py-2 rounded-xl text-brand-neutral-light font-bold
                  hover:bg-brand-primary/80 transition-all cursor-pointer"
      >
        Dodaj
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-brand-neutral-dark px-4 py-2 rounded-xl text-brand-neutral-light 
                  hover:bg-brand-neutral-dark/80 transition-all cursor-pointer"
      >
        Anuluj
      </button>
    </form>
  );
}
