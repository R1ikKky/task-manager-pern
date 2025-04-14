import { FaUserCircle } from 'react-icons/fa';

const NavBar = () => {
  return (
    <header className="w-full px-6 py-4 flex justify-between items-center bg-white/10 backdrop-blur-md text-white border-b border-white/20 shadow">
      {/* Левая часть: иконка и переключатели */}
      <div className="flex items-center gap-6">
        <img src="/logo.svg" alt="logo" className="w-8 h-8" />
      </div>

      <div className="flex gap-2 font-bold text-lg">
        <button className="px-4 py-1.5 rounded-xl bg-white/20 text-white">List</button>
        <button className="px-4 py-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10">Table</button>
        <button className="px-4 py-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10">Calendar</button>
      </div>

      <div className="text-2xl text-white/70">
        <FaUserCircle />
      </div>
    </header>
  );
};

export default NavBar;