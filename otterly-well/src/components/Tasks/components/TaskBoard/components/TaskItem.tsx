import { useState } from "react";
import { motion } from "framer-motion";
import type { Task, TaskCategory } from "../../../types/types";
import { CheckIcon, DeleteIcon, EditIcon } from "../../../../icons";
import ConfirmDeleteDialog from "../../../../UI/ConfirmDeleteDialog";
import { AddTaskModal } from "../../AddTaskModal";

interface TaskItemProps {
  task: Task;
  categories: TaskCategory[];
  onComplete: (taskId: string) => void;
  onDismiss: (taskId: string) => void;

  onEdit: (taskId: string, updates: Partial<Task>) => void;
  currentDate: Date;
}

export default function TaskItem({
  task,
  categories,
  onComplete,
  onDismiss,
  onEdit,
  currentDate,
}: TaskItemProps) {
  const priorityColors = {
    1: "border-brand-accent-2/50 bg-brand-accent-2/10",
    2: "border-brand-accent-1/50 bg-brand-accent-1/10",
    3: "border-brand-negative/50 bg-brand-negative/10",
  };

  const priorityLabel = {
    1: "Niski",
    2: "Normalny",
    3: "Wysoki",
  };

  const getDeadlineStatus = (deadlineString?: string) => {
    if (!deadlineString) return null;

    const deadline = new Date(deadlineString);
    const referenceDate = new Date(currentDate);

    // comparing only dates, tasks don't have time
    deadline.setHours(0, 0, 0, 0);
    referenceDate.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - referenceDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `Dni opóźnienia: ${Math.abs(diffDays)}`,
        className: "text-brand-negative font-bold",
      };
    } else if (diffDays === 0) {
      return {
        text: "Dzisiaj",
        className: "text-brand-accent-3 font-bold",
      };
    } else if (diffDays === 1) {
      return {
        text: "Jutro",
        className: "text-brand-neutral-light/80",
      };
    } else {
      return {
        text: `Pozostałe dni: ${diffDays}`,
        className: "text-brand-neutral-light/60",
      };
    }
  };

  const deadlineInfo = getDeadlineStatus(task.deadline);

  const isCompleted = task.is_completed;
  const containerStyle = isCompleted
    ? "bg-brand-neutral-dark/40 border-brand-neutral-light/20 opacity-70"
    : priorityColors[task.priority];

  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`relative p-3 rounded-xl border ${containerStyle} 
                    group hover:shadow-md transition-all cursor-pointer select-none`}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task.id);
            }}
            aria-label={
              isCompleted ? "Oznacz jako nieukończone" : "Oznacz jako ukończone"
            }
            className="group/complete -ml-3.5 -mr-3.5 -mt-2.5 w-12 h-12 flex flex-shrink-0 
              items-center justify-center rounded-full cursor-pointer focus:outline-none"
          >
            <div
              className={`w-5 h-5 p-2 rounded-full border-2 transition-all flex items-center justify-center
                       ${
                         isCompleted
                           ? "bg-brand-positive border-brand-positive group-hover/complete:bg-brand-secondary group-hover/complete:border-brand-secondary text-brand-neutral-darker"
                           : "border-brand-neutral-light/50 group-hover/complete:border-brand-accent-1 group-hover/complete:bg-brand-accent-1/20"
                       }`}
            >
              {isCompleted && <CheckIcon className="scale-75" />}
            </div>
          </button>

          <div className="flex-grow min-w-0">
            <p
              className={`text-brand-neutral-light text-sm font-medium leading-tight break-words transition-all
                        ${
                          isCompleted
                            ? "line-through text-brand-neutral-light/50 truncate pr-17"
                            : "truncate pr-17"
                        }`}
            >
              {/* we cut this to fit the buttons, the full description visible when expanded */}
              {task.description}
            </p>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 text-xs text-brand-neutral-light/70 whitespace-pre-wrap border-l-2 border-brand-neutral-light/20 pl-2"
              >
                <span className="block mt-1 pt-1 border-t border-brand-neutral-light/10">
                  {task.description}
                </span>
              </motion.div>
            )}

            <div className="flex items-center gap-2 mt-2">
              {!isCompleted && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded
                               ${
                                 task.priority === 3
                                   ? "text-brand-negative-darker/60 bg-brand-negative/30"
                                   : task.priority === 2
                                     ? "text-brand-accent-1/90 bg-brand-accent-3/30"
                                     : "text-brand-neutral-light/80 bg-brand-accent-2/30"
                               }`}
                >
                  {priorityLabel[task.priority]} priorytet
                </span>
              )}

              {deadlineInfo && !isCompleted && (
                <span className={`text-[10px] ${deadlineInfo.className}`}>
                  {deadlineInfo.text}
                </span>
              )}

              {isCompleted && task.completed_at && (
                <span className="text-[10px] text-brand-neutral-light/40">
                  Ukończono: {new Date(task.completed_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {!isCompleted && isExpanded && (
          <div className="absolute top-1 right-2 flex gap-1 opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModalOpen(true);
              }}
              className="p-1 hover:bg-brand-neutral-light/20 rounded-full text-brand-neutral-light/60 hover:text-brand-neutral-light 
                     text-xs transition-all cursor-pointer flex items-center justify-center"
              title="Edytuj"
            >
              <EditIcon className="scale-75" />
            </button>
          </div>
        )}

        {/* TODO: make better for mobile, icons are over the name */}
        {isCompleted && (
          <div className="absolute top-1 right-2 flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            {/* <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(task.id);
            }}
            className="p-1 hover:bg-brand-accent-1/20 rounded-full text-brand-neutral-light/60 hover:text-brand-accent-1/70
                    text-xs transition-all cursor-pointer flex items-center justify-center"
            title="Usuń"
          >
            <ClipBoardIcon className="scale-85" />
          </button> */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="p-1 hover:bg-brand-negative/20 rounded-full text-brand-neutral-light/60 hover:text-brand-negative-darker 
                    text-xs transition-all cursor-pointer flex items-center justify-center"
              title="Usuń"
            >
              <DeleteIcon className="scale-85" />
            </button>
          </div>
        )}
      </motion.div>

      <ConfirmDeleteDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => onDismiss(task.id)}
        title="Przenieś do historii"
        confirmLabel="Przenieś"
        description={
          <p>
            Czy na pewno chcesz przenieść to zadanie{" "}
            {task.description ? (
              <>
                (
                <strong className="text-brand-neutral-light truncate inline-block max-w-[200px] align-bottom">
                  {task.description}
                </strong>
                )
              </>
            ) : (
              ""
            )}{" "}
            do historii?
          </p>
        }
      />

      <AddTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(updatedTask) => onEdit(task.id, updatedTask)}
        categories={categories}
        initialData={task}
      />
    </>
  );
}
