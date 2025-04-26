import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosMail } from 'react-icons/io';
import { IoLockClosed } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { registerUser } from '../api/user.api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError("")

  const result = await registerUser(email, username, password)

  if(result.success){
    navigate("/")
  } else {
    setError(result.message || "Register Failed")
  }

  setLoading(false)
}

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="relative w-[400px] bg-white/10 border border-white/30 rounded-[20px] backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] p-10">
        <h2 className="text-[30px] font-extrabold text-center text-white mb-8">Register</h2>
        <form onSubmit={handleRegister}>
          {/* Username */}
          <div className="relative w-full h-[50px] border-b-2 border-white/40 mb-8">
            <span className="absolute right-[10px] text-white text-xl leading-[57px]">
              <FaUser className="text-[20px]" />
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="peer w-full h-full bg-transparent text-white placeholder-transparent border-none outline-none px-2"
            />
            <label
              className={`absolute left-[5px] text-white/60 transition-all pointer-events-none ${
                username.length > 0
                  ? 'top-[-5px] text-sm'
                  : 'top-1/2 translate-y-[-50%] text-base'
              }`}
            >
              Username
            </label>
          </div>

          {/* Email */}
          <div className="relative w-full h-[50px] border-b-2 border-white/40 mb-8">
            <span className="absolute right-[10px] text-white text-xl leading-[57px]">
              <IoIosMail className="text-[20px]" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="peer w-full h-full bg-transparent text-white placeholder-transparent border-none outline-none px-2"
            />
            <label
              className={`absolute left-[5px] text-white/60 transition-all pointer-events-none ${
                email.length > 0
                  ? 'top-[-5px] text-sm'
                  : 'top-1/2 translate-y-[-50%] text-base'
              }`}
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative w-full h-[50px] border-b-2 border-white/40 mb-8">
            <span className="absolute right-[10px] text-white text-xl leading-[57px]">
              <IoLockClosed className="text-[20px]" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="peer w-full h-full bg-transparent text-white placeholder-transparent border-none outline-none px-2"
            />
            <label
              className={`absolute left-[5px] text-white/60 transition-all pointer-events-none ${
                password.length > 0
                  ? 'top-[-5px] text-sm'
                  : 'top-1/2 translate-y-[-50%] text-base'
              }`}
            >
              Password
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors mb-4"
          >
            Register
          </button>

          {/* Back to login */}
          <p className="text-center text-sm text-white/90">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-300 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;