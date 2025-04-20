import clsx from "clsx";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchBar = ({ value, onChange, className }: SearchBarProps) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Search tasks…"
    className={clsx(
      "w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50",
      "border border-white/20 backdrop-blur-md focus:outline-none",
      className
    )}
  />
);

export default SearchBar;