import Clouds from "./components/Clouds";
import AppRoutes from "./routes/router";

const App = () => {
  return (
    <main className="relative z-0 min-h-screen bg-gradient-to-b from-sky-500 via-blue-300 to-sky-600 text-white overflow-hidden">
      <Clouds />
      <AppRoutes />
    </main>
  );
};

export default App;
