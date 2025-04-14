// src/pages/Profile.tsx
import { useAuthStore } from '../store/user.store';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return <div className="text-white text-center">No user data available.</div>;

  return (
    <div className="relative w-full min-h-screen p-4 text-white flex flex-col items-center justify-center bg-black/30 backdrop-blur-md">
      {/* Back button */}
      <button
        className="absolute top-4 right-4 text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="w-full max-w-3xl bg-white/10 border border-white/30 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-7xl text-white mb-4" />
          <h2 className="text-2xl font-bold mb-2">{user.userName}</h2>
          <p className="text-sm text-white/80 mb-6">{user.email}</p>

          <div className="w-full text-left">
            <h3 className="text-lg font-semibold mb-2">Fun facts:</h3>
            <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
              <li>You joined TaskSpace to get things done 🧠</li>
              <li>You love clean UIs ✨</li>
              <li>Your favorite cloud is probably cirrus ☁️</li>
              {/* <li>You're tracking tasks since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'unknown'} ⌚</li> */}
            </ul>
          </div>

          <button
            className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-colors"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
