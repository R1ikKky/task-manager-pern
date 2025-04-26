import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ImportanceType = "low" | "medium" | "high";

interface Option {
  value: ImportanceType;
  label: string;
}

interface CustomSelectProps {
  value: ImportanceType;
  onChange: (value: ImportanceType) => void;
  options: Option[];
}

export default function CustomSelect({ value, onChange, options }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentLabel = () => {
    return options.find(opt => opt.value === value)?.label || '';
  };

  const getOptionColor = (optValue: ImportanceType) => {
    switch (optValue) {
      case 'high': return 'from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30';
      case 'medium': return 'from-yellow-500/20 to-yellow-600/20 hover:from-yellow-500/30 hover:to-yellow-600/30';
      case 'low': return 'from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30';
      default: return '';
    }
  };

  return (
    <div className="relative" ref={selectRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl 
                  bg-black/10 backdrop-blur-sm
                  border border-white/20 
                  focus:border-white/40
                  transition-colors
                  cursor-pointer
                  flex justify-between items-center"
      >
        <span>{getCurrentLabel()}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden
                      border border-white/20 backdrop-blur-md
                      shadow-lg"
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  px-4 py-3 cursor-pointer
                  bg-gradient-to-r ${getOptionColor(option.value)}
                  transition-colors
                  ${value === option.value ? 'bg-white/20' : ''}
                `}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}