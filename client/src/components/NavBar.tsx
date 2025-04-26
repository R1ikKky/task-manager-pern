import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/TaskSpaceInvB.svg"

interface NavBarProps {
  view: "list" | "table" | "calendar";
  onViewChange: (v: "list" | "table" | "calendar") => void;
}


const NavBar = ({ view, onViewChange }: NavBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="w-full px-6 flex justify-between items-center bg-white/10 backdrop-blur-md text-white border-b border-white/20 shadow">
      <div className="flex items-center gap-6">
        <img src={logo} alt="logo" className="w-20 h-20 shrink-0 select-none" />
      </div>

      <div className="flex gap-2 font-bold text-lg">
        <button 
          className={`px-4 py-1.5 rounded-xl ${
            view === 'list' 
              ? 'bg-white/20 text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          onClick={() => onViewChange('list')}
        >
          List
        </button>
        <button 
          className={`px-4 py-1.5 rounded-xl ${
            view === 'table' 
              ? 'bg-white/20 text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          onClick={() => onViewChange('table')}
        >
          Table
        </button>
        <button 
          className={`px-4 py-1.5 rounded-xl ${
            view === 'calendar' 
              ? 'bg-white/20 text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          onClick={() => onViewChange('calendar')}
        >
          Calendar
        </button>
      </div>

      <div className="text-2xl text-white/70 hover:text-white cursor-pointer transition-colors" 
           onClick={() => navigate("/profile")}>
        <FaUserCircle />
      </div>
    </header>
  );
};

export default NavBar;