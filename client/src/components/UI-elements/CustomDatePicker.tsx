import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomDatePickerProps {
  value: string;                       // ISO-дата YYYY-MM-DD
  onChange: (value: string) => void;   // callback вверх
  label: string;
}

type NullableDate = Date | null;

export default function CustomDatePicker({ value, onChange, label }: CustomDatePickerProps) {
  /* local-state ------------------------------------------------------------- */
  const [isOpen, setIsOpen]     = useState(false);
  const [currentDate, setDate]  = useState<NullableDate>(value ? new Date(value) : new Date());
  const pickerRef               = useRef<HTMLDivElement>(null);

  /* click-outside ----------------------------------------------------------- */
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  /* helpers ----------------------------------------------------------------- */
  const formatDate = (iso: string) =>
    !iso
      ? ""
      : new Date(iso).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" });

  const daysInMonth  = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstWeekday = (y: number, m: number) => new Date(y, m, 1).getDay();

  const months = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];

  /* month switch ------------------------------------------------------------ */
  const prevMonth = () => setDate(new Date(currentDate!.setMonth(currentDate!.getMonth() - 1)));
  const nextMonth = () => setDate(new Date(currentDate!.setMonth(currentDate!.getMonth() + 1)));

  /* date select ------------------------------------------------------------- */
  const handleSelect = (day: number) => {
    const y   = currentDate!.getFullYear();
    const m   = currentDate!.getMonth();        // 0-based
    const iso = `${y}-${String(m + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    onChange(iso);
    setIsOpen(false);
  };

  /* render grid ------------------------------------------------------------- */
  const renderDays = () => {
    const total = daysInMonth(currentDate!.getFullYear(), currentDate!.getMonth());
    const first = firstWeekday(currentDate!.getFullYear(), currentDate!.getMonth());
    const sel   = value ? new Date(value) : null;
    const cells: React.ReactNode[] = [];

    // пустые ячейки до 1-го
    for (let i = 0; i < (first === 0 ? 6 : first - 1); i++) cells.push(<div key={`e${i}`} className="h-7" />);

    // сами дни
    for (let d = 1; d <= total; d++) {
      const cur      = new Date(currentDate!.getFullYear(), currentDate!.getMonth(), d);
      const isSel    = sel && cur.toDateString() === sel.toDateString();
      const isToday  = cur.toDateString() === new Date().toDateString();

      cells.push(
        <button
          key={d}
          type="button"
          onClick={() => handleSelect(d)}
          className={`h-7 w-7 rounded-full flex items-center justify-center text-sm transition-colors
            ${isSel ? "bg-blue-500/80 text-white" : "hover:bg-white/20"}
            ${isToday && !isSel ? "border border-white/40" : ""}`}
        >
          {d}
        </button>
      );
    }
    return cells;
  };

  /* UI ---------------------------------------------------------------------- */
  return (
    <div ref={pickerRef} onClick={(e) => e.stopPropagation()} className="relative">
      <label className="block text-sm text-white/70 mb-2">{label}</label>

      {/* поле-тогглер */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-black/10 backdrop-blur-sm
                   border border-white/20 hover:border-white/30 transition-colors
                   flex justify-between items-center cursor-pointer group"
      >
        <span className={value ? "text-white" : "text-white/50"}>
          {value ? formatDate(value) : "Выберите дату"}
        </span>
        <svg className="w-5 h-5 text-white/50 group-hover:text-white/70 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-[280px] mt-2 rounded-xl
                       bg-gradient-to-br from-gray-900/85 to-gray-800/85
                       border border-white/20 backdrop-blur-md
                       shadow-xl shadow-black/30
                       left-1 transform -translate-x-1/2"
          >
            {/* header */}
            <div className="flex justify-between items-center mb-4">
              <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="font-medium text-white/90 text-sm">
                {months[currentDate!.getMonth()]} {currentDate!.getFullYear()}
              </div>
              <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* weekdays */}
            <div className="grid grid-cols-7 gap-1 mb-1 text-xs font-medium text-white/50">
              {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((d) => (
                <div key={d} className="h-7 flex items-center justify-center">{d}</div>
              ))}
            </div>

            {/* grid */}
            <div className="grid grid-cols-7 gap-1">{renderDays()}</div>

            {/* quick-actions */}
            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between">
              {/* «Сегодня» — без UTC-сдвига */}
              <button
                type="button"
                onClick={() => {
                  const now       = new Date();
                  const todayIso  = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
                  onChange(todayIso);
                  setIsOpen(false);
                }}
                className="text-xs text-white/70 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                Сегодня
              </button>

              {/* «Очистить» */}
              <button
                type="button"
                onClick={() => { onChange(""); setIsOpen(false); }}
                className="text-xs text-white/70 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                Очистить
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
