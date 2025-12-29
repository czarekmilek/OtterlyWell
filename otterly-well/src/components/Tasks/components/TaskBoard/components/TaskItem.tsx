import { useState } from "react";
import { motion } from "framer-motion";
import type { Task } from "../../../types/types";
import {
  ArchiveIcon,
  CheckIcon,
  ClipBoardIcon,
  DeleteIcon,
} from "../../../../icons";

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDismiss: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  currentDate: Date;
}

export default function TaskItem({
  task,
  onComplete,
  onDismiss,
  onDelete,
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

  return (
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
          className={`mt-1 w-5 h-5 rounded-full border-2 transition-all flex-shrink-0 flex items-center justify-center cursor-pointer
                     ${
                       isCompleted
                         ? "bg-brand-positive border-brand-positive text-brand-neutral-darker"
                         : "border-brand-neutral-light/50 hover:border-brand-accent-1 hover:bg-brand-accent-1/20"
                     }`}
        >
          {isCompleted && <CheckIcon className="scale-75" />}
        </button>

        <div className="flex-grow min-w-0">
          <p
            className={`text-brand-neutral-light text-sm font-medium leading-tight break-words transition-all
                      ${
                        isCompleted
                          ? "line-through text-brand-neutral-light/50 truncate pr-17"
                          : "truncate"
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

      {/* <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(task.id);
          }}
          className="p-1 rounded-full hover:bg-brand-neutral-light/20 text-brand-neutral-light/60 hover:text-brand-neutral-light 
                    text-xs transition-all cursor-pointer"
          title="Archiwizuj"
        >
          <DeleteIcon className="scale-75" />
        </button>
      </div> */}

      {/* TODO: make better for mobile, icons are over the name */}
      {isCompleted && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
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
              onDismiss(task.id);
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
  );
}
