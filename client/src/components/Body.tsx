import { useState, useEffect } from "react";
import { useTaskStore } from "../store/task.store";
import { fetchTasks } from "../api/tasks.api";
import AddTaskModal from "./AddTaskModal";
import TaskItem from "./UI-elements/TaskItem";
import SearchBar from "./UI-elements/SearchBar";
import Button from "./UI-elements/Button";
import { useAuthStore } from "../store/user.store";

const Body = () => {
  /* local UI‑state */
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery]         = useState("");
  const [sort,  setSort]          = useState<"date" | "importance">("date");

  /* global state (tasks) */
  const tasks      = useTaskStore((s) => s.tasks);
  const setTasks   = useTaskStore((s) => s.setTasks);
  const isAuthReady = useAuthStore((s) => s.isAuthReady)
  const accessToken = useAuthStore((s) => s.accessToken)


  /* fetch once on mount */
  useEffect(() => {
    console.log("[Body] isAuthReady:", isAuthReady, "token:", accessToken);
    if (isAuthReady) {
      fetchTasks().catch(console.error);
    }
  }, [isAuthReady, accessToken]);

  /* simple search + sort */
  const visibleTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sort === "importance") return importanceRank(b.importance) - importanceRank(a.importance);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="flex flex-col items-center px-6 py-8 w-full">
      {/* toolbar */}
      <div className="w-full max-w-4xl mb-4 flex flex-wrap gap-2 items-center justify-between">
        <Button onClick={() => setShowModal(true)}>+ Add Task</Button>
        <div className="flex-1 max-w-[320px]">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <Button onClick={() => setSort(sort === "date" ? "importance" : "date")}
                className="whitespace-nowrap">
          Sort: {sort === "date" ? "Latest" : "Importance"}
        </Button>
      </div>

      {/* task list */}
      <div className="w-full max-w-4xl flex flex-col gap-4">
        {visibleTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      {/* modal */}
      <AddTaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

/* helper for importance sort */
const importanceRank = (imp: "low" | "medium" | "high") =>
  imp === "high" ? 2 : imp === "medium" ? 1 : 0;

export default Body;