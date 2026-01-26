import { Reorder, useDragControls, motion } from "framer-motion";
import type { TaskCategory } from "../../../types/types";
import { useState, useRef, useEffect } from "react";
import { DragHandleIcon, TrashIcon, EditIcon } from "../../../../icons";

interface TaskCategoryToggleRowProps {
  category: TaskCategory;
  isActive: boolean;
  isEditMode: boolean;
  onToggle: (newState: boolean) => void;
  onDelete: () => void;
  onEdit: (newName: string) => void;
}

// A bit simplifeid version of CategoryToggleRow from Finance
// basically, just no icons and colors
export function TaskCategoryToggleRow({
  category,
  isActive,
  isEditMode,
  onToggle,
  onDelete,
  onEdit,
}: TaskCategoryToggleRowProps) {
  const dragControls = useDragControls();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedName.trim() !== "") {
      onEdit(editedName.trim());
    } else {
      setEditedName(category.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditedName(category.name);
      setIsEditing(false);
    }
  };

  return (
    <Reorder.Item
      value={category}
      dragListener={false}
      dragControls={dragControls}
    >
      <div className="flex items-center justify-between p-3 bg-brand-neutral-dark/30 rounded-xl border border-brand-depth/50">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="cursor-grab active:cursor-grabbing text-brand-neutral-light/50 hover:text-brand-neutral-light transition-colors"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <DragHandleIcon />
          </div>

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-b border-brand-accent-1 text-brand-neutral-light focus:outline-none w-full mr-2"
            />
          ) : (
            <div className="flex items-center gap-2 group flex-1">
              <span className="font-medium text-sm md:text-base text-brand-neutral-light pr-2">
                {category.name}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2">
          {isEditMode ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-brand-neutral-light/70 hover:text-brand-accent-1 transition-colors flex items-center justify-center 
                  rounded-md hover:bg-brand-accent-1/10 cursor-pointer"
                title="Edytuj nazwę"
              >
                <EditIcon className="scale-85" />
              </button>
              <button
                onClick={onDelete}
                // TODO: adjust later
                className="p-2 text-brand-negative hover:text-brand-negative/80 transition-colors flex items-center justify-center 
                      rounded-md hover:bg-brand-negative/10 cursor-pointer"
                title="Delete Category"
              >
                <TrashIcon className="!text-[20px]" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onToggle(!isActive)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                isActive ? "bg-brand-accent-1" : "bg-brand-neutral-dark"
              }`}
            >
              <motion.div
                initial={false}
                animate={{ x: isActive ? 26 : 7 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          )}
        </div>
      </div>
    </Reorder.Item>
  );
}
