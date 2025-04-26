import { useState } from "react";
import { useTaskStore } from "../store/task.store";
import TaskItem from "./UI-elements/TaskItem";
import Button from "./UI-elements/Button";
import AddTaskModal from "./AddTaskModal";

/* helper for importance sorting */
const importanceRank = (imp: string) =>
  imp === "high" ? 3 : imp === "medium" ? 2 : 1;

const Body = () => {
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState<"date" | "importance">("date");

  const tasks = useTaskStore((s) => s.tasks);

  /* sort & group tasks */
  const visibleTasks = tasks.slice().sort((a, b) => {
    // невыполненные сверху
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // сортировка по выбранному критерию
    if (sort === "importance") {
      return importanceRank(b.importance) - importanceRank(a.importance);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex flex-col items-center px-6 py-8 w-full min-h-screen">
      {/* toolbar */}
      <div className="w-full max-w-4xl mb-8 flex flex-wrap items-center justify-between gap-4">
        <Button
          onClick={() => setShowModal(true)}
          className="text-lg font-semibold px-6 py-3 bg-white/25 hover:bg-white/30 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          + Add Task
        </Button>

        <Button
          onClick={() => setSort(sort === "date" ? "importance" : "date")}
          className="text-lg font-semibold px-6 py-3 bg-white/25 hover:bg-white/30 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Sort by:&nbsp;{sort === "date" ? "Latest" : "Importance"}
        </Button>
      </div>

      {/* empty‑state */}
      {visibleTasks.length === 0 && (
        <div className="text-center text-white/70 mt-12">
          <p className="text-xl font-semibold mb-2">No tasks yet</p>
          <p className="text-lg">Click "Add Task" to create your first task</p>
        </div>
      )}

      {/* list */}
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {visibleTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      {/* modal */}
      <AddTaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Body;
