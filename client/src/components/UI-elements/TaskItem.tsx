// --- TaskItem.tsx ---
import { Task } from "../../interfaces/task.interface";
import { useTaskStore } from "../../store/task.store";
import Button from "./Button";
import clsx from "clsx";
import { deleteTask } from "../../api/tasks.api";
import { updateTask as updateTaskApi } from "../../api/tasks.api";
import { useState, useEffect, useRef } from "react"; // 👈 добавили useRef
import TaskCard from "./TaskCard";
import { useDrag, DragSourceMonitor } from "react-dnd";

interface TaskItemProps {
  task: Task;
  /**
   * Когда компонент рендерится внутри Table‑view —
   * его можно перетаскивать (drag & drop)
   */
  isTableView?: boolean;
}

const TaskItem = ({ task, isTableView = false }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    updateTask: updateTaskStore,
    removeTask: deleteTaskStore,
  } = useTaskStore.getState();

  /* ------------------------------------------------------------------
     React‑DnD
     ------------------------------------------------------------------ */
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { ...task }, // объект, который получит drop‑таргет
    canDrag: () => isTableView, // перетаскиваем только в Table‑view
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 👉 собственный ref, который мы «оборачиваем» в drag(...)
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      drag(elementRef.current); // прикрепляем drag‑source к DOM‑элементу
    }
  }, [drag]);

  /* ------------------------------------------------------------------
     Handlers
     ------------------------------------------------------------------ */
  const toggleComplete = async () => {
    try {
      await updateTaskApi(task.id, {
        ...task,
        completed: !task.completed,
      });
      updateTaskStore({
        ...task,
        completed: !task.completed,
      });
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      deleteTaskStore(task.id);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isTableView) setIsEditing(true);
  };

  /* ------------------------------------------------------------------
     Render
     ------------------------------------------------------------------ */
  return (
    <>
      <div
        ref={elementRef}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: isTableView ? "move" : "pointer",
        }}
        className={clsx(
          "backdrop-blur-md border border-white/30 rounded-2xl p-4",
          "flex flex-col md:flex-row md:items-center md:justify-between gap-3",
          "transition-all duration-200 hover:shadow-lg",
          task.completed
            ? "bg-gray-500/40 hover:bg-gray-500/45 opacity-75"
            : clsx(
                task.importance === "high" && "bg-red-500/40 hover:bg-red-500/45",
                task.importance === "medium" && "bg-yellow-500/40 hover:bg-yellow-500/45",
                task.importance === "low" && "bg-green-500/40 hover:bg-green-500/45"
              )
        )}
        onClick={handleEdit}
      >
        {/* ─── Левая часть ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-1.5 break-words">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-white/90 break-words mb-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <span className="bg-white/20 px-3 py-1.5 rounded-full">
              Важность: {task.importance === "high" ? "Высокая" : task.importance === "medium" ? "Средняя" : "Низкая"}
            </span>
            {task.deadline && (
              <span className="bg-white/30 text-white px-3 py-1.5 rounded-full">
                {new Date(task.deadline).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* ─── Правая часть ────────────────────────────────────────── */}
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={toggleComplete}
            className={clsx(
              "px-4 py-2 font-medium transition-all duration-200",
              task.completed
                ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-100"
                : "bg-green-500/20 hover:bg-green-500/30 text-green-100"
            )}
          >
            {task.completed ? "Отменить" : "Выполнить"}
          </Button>

          <button
            onClick={handleDelete}
            className={clsx(
              "w-10 h-10 flex items-center justify-center",
              "rounded-full text-xl font-bold",
              "bg-red-500/20 hover:bg-red-500/30 text-red-100",
              "transition-all duration-200"
            )}
            aria-label="Удалить задачу"
          >
            ×
          </button>
        </div>
      </div>

      {/* ─── Модалка редактирования ───────────────────────────────── */}
      <TaskCard task={task} isOpen={isEditing} onClose={() => setIsEditing(false)} />
    </>
  );
};

export default TaskItem;
