const SearchBar = () => {
  return (
    <input
      type="text"
      placeholder="Search tasks..."
      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none backdrop-blur-md"
    />
  );
};

export default SearchBar;