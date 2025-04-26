import Clouds from "./components/Clouds";
import AppRoutes from "./routes/router";
import { useEffect } from "react";
import { refreshUser } from "./api/refresh.user";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const App = () => {
  
  useEffect(() => {
    refreshUser()
  },[])
  
  return (
    <DndProvider backend={HTML5Backend}>
      <main className="relative z-0 min-h-screen bg-gradient-to-b from-sky-500 via-blue-300 to-sky-600 text-white overflow-hidden">
        <Clouds />
        <AppRoutes />
      </main>
    </DndProvider>
  );
};

export default App;
