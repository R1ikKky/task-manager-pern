import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../store/user.store";
import { useTaskStore } from "../store/task.store";
import { fetchTasks } from "../api/tasks.api";
import NavBar from "../components/NavBar";
import Body from "../components/Body";
import TableView from "../components/TableView";

// возможные режимы отображения
export type View = "list" | "table" | "calendar";

const Dashboard = () => {
  /* ───────── current view (persisted in localStorage) ───────── */
  const [view, setView] = useState<View>(() => {
    const saved = localStorage.getItem("dashboard_view");
    return saved === "table" || saved === "calendar" ? saved : "list";
  });

  const changeView = useCallback((v: View) => {
    setView(v);
    localStorage.setItem("dashboard_view", v);
  }, []);

  /* ───────── one‑time task loading ───────── */
  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const tasksLoaded = useTaskStore((s) => s.tasks.length > 0);

  useEffect(() => {
    if (isAuthReady && !tasksLoaded) {
      fetchTasks().catch(console.error);
    }
  }, [isAuthReady, tasksLoaded]);

  /* ───────── render chosen view ───────── */
  const renderContent = () => {
    switch (view) {
      case "table":
        return <TableView />;
      case "calendar":
        return <div>Calendar View (Coming&nbsp;Soon)</div>;
      default:
        return <Body />;
    }
  };

  return (
    <div className="min-h-screen text-white">
      <NavBar view={view} onViewChange={changeView} />
      {renderContent()}
    </div>
  );
};

export default Dashboard;