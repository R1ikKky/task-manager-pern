// Login.tsx без облачной анимации
import { useState } from 'react';
import { IoIosMail } from 'react-icons/io';
import { IoLockClosed } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { loginUser } from '../api/user.api';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
  
    const result = await loginUser(email, password)
    
    if (result.success) {
      navigate("/")
    } else {
      setError(result.message || "Login Failed")
    }
  
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative z-10">
      <div className="relative w-[400px] bg-white/10 border border-white/30 rounded-[20px] backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] p-10">
        <h2 className="text-[30px] font-extrabold text-center text-white mb-8">Login</h2>
        <form onSubmit={handleLogin}>
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

          {/* Options */}
          <div className="flex justify-between items-center text-sm text-white/80 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-blue-500 w-4 h-4 rounded" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline text-blue-200">Forgot Password?</a>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors mb-4"
          >
            Login
          </button>

          {/* Register */}
          <p className="text-center text-sm text-white/90">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-300 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
