// NoMatchPage.tsx
import { Link } from 'react-router-dom';

const NoMatchPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white">
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 p-8 rounded-xl backdrop-blur-lg bg-white/10 border border-white/30 shadow-xl max-w-md text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NoMatchPage;