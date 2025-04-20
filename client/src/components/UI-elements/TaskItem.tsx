import { Task } from "../../interfaces/task.interface";
import { useTaskStore } from "../../store/task.store";
import Button from "./Button";
import clsx from "clsx";
import { deleteTask } from "../../api/tasks.api";

interface TaskItemProps { task: Task }

const TaskItem = ({ task }: TaskItemProps) => {
  const { updateTask, removeTask } = useTaskStore.getState();

  const toggleComplete = () => updateTask({ ...task, completed: !task.completed });
  const handleDelete   = () => {
    deleteTask(task.id)
    removeTask(task.id)
  }

  return (
    <div
      className={clsx(
        "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5",
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
        task.completed && "opacity-50"
      )}
    >
      {/* left section */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold break-words">{task.title}</h3>
        {task.description && (
          <p className="mt-1 text-sm text-white/75 break-words line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          <span className="text-yellow-300 bg-yellow-500/10 px-2 py-0.5 rounded-full">
            {task.importance}
          </span>
          <span className="text-neutral-300">
            Deadline: {task.deadline || "—"}
          </span>
          <span className={task.completed ? "text-green-400" : "text-red-400"}>
            {task.completed ? "Completed ✅" : "Incomplete"}
          </span>
        </div>
      </div>

      {/* right section */}
      <div className="flex-shrink-0 flex gap-3">
        <Button
          variant={task.completed ? "danger" : "success"}
          onClick={toggleComplete}
        >
          {task.completed ? "Undo" : "Complete"}
        </Button>
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 text-xl"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
