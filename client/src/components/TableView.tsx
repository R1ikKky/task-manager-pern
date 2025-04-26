// ——— TableView.tsx ———
import { useCallback } from "react";
import Quadrant from "./Quadrant";
import { QuadrantType, Task } from "../interfaces/task.interface";
import { useTaskStore } from "../store/task.store";
import { updateTask as updateTaskApi } from "../api/tasks.api";

const TableView = () => {
  const tasks       = useTaskStore((s) => s.tasks);
  const updateTask  = useTaskStore((s) => s.updateTask);

  const handleDrop = useCallback(
    async (quadrant: QuadrantType, task: Task) => {
      try {
        const updated = { ...task, quadrant };
        await updateTaskApi(task.id, updated);
        updateTask(updated);
      } catch (e) {
        console.error("Update quadrant failed:", e);
      }
    },
    [updateTask]
  );

  const inboxTasks = tasks.filter(t => !t.quadrant || t.quadrant === "inbox");

  return (
    <div className="px-8 py-6 space-y-6">
      {/* 2 × 2 матрица */}
      <div className="grid grid-cols-2 gap-6">
        <Quadrant
          title="Целенаправленная деятельность"
          description="Продуктивные и привлекательные задачи"
          tasks={tasks.filter(t => t.quadrant === "productive_attractive")}
          onDrop={(t) => handleDrop("productive_attractive", t)}
          gradient="from-green-500/20 to-emerald-600/20"
          isTableView
        />

        <Quadrant
          title="Развитие"
          description="Продуктивные, но непривлекательные задачи"
          tasks={tasks.filter(t => t.quadrant === "productive_unattractive")}
          onDrop={(t) => handleDrop("productive_unattractive", t)}
          gradient="from-blue-500/20 to-cyan-600/20"
          isTableView
        />

        <Quadrant
          title="Отдых"
          description="Непродуктивные, но привлекательные задачи"
          tasks={tasks.filter(t => t.quadrant === "unproductive_attractive")}
          onDrop={(t) => handleDrop("unproductive_attractive", t)}
          gradient="from-amber-500/20 to-orange-600/20"
          isTableView
        />

        <Quadrant
          title="Пустая трата времени"
          description="Непродуктивные и непривлекательные задачи"
          tasks={tasks.filter(t => t.quadrant === "unproductive_unattractive")}
          onDrop={(t) => handleDrop("unproductive_unattractive", t)}
          gradient="from-red-500/20 to-rose-600/20"
          isTableView
        />
      </div>

      {/* Inbox – всякое непривязанное */}
      <Quadrant
        title="Inbox"
        description="Перетащи сюда, чтобы убрать из таблицы"
        tasks={inboxTasks}
        onDrop={(t) => handleDrop("inbox", t)}
        gradient="from-sky-500/25 to-blue-600/25"
        isTableView
      />
    </div>
  );
};

export default TableView;
