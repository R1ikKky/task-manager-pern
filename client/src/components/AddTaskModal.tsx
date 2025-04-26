import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createTask } from "../api/tasks.api";
import { useAuthStore } from "../store/user.store";
import CustomSelect from "./UI-elements/CustomSelect";
import CustomDatePicker from "./UI-elements/CustomDatePicker";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type ImportanceType = "low" | "medium" | "high";

interface ImportanceOption {
  value: ImportanceType;
  label: string;
}

const importanceOptions: ImportanceOption[] = [
  { value: "low", label: "Низкая" },
  { value: "medium", label: "Средняя" },
  { value: "high", label: "Высокая" }
];

export default function AddTaskModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [importance, setImportance] = useState<ImportanceType>("low");
  const [loading, setLoading] = useState(false);
  const isAuthReady = useAuthStore((s) => s.isAuthReady);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setImportance("low");
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || loading || !isAuthReady) return;

    setLoading(true);
    try {
      await createTask(title, description, deadline, importance);
      handleClose();
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Оверлей с обработчиком клика */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          >
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-lg bg-gradient-to-br from-white/20 to-white/10 
                       border border-white/30 backdrop-blur-md rounded-2xl p-8 
                       shadow-2xl text-white"
              onClick={(e) => e.stopPropagation()} // Останавливаем всплытие только на форме
            >
              <h2 className="text-2xl font-bold mb-6">Новая задача</h2>

              {/* Title Input */}
              <input
                type="text"
                placeholder="Название задачи"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="w-full mb-4 px-4 py-3 rounded-xl 
                         bg-black/10 backdrop-blur-sm
                         placeholder:text-white/50 border border-white/20
                         focus:outline-none focus:border-white/40 
                         transition-colors"
              />

              {/* Description Textarea */}
              <textarea
                placeholder="Описание (необязательно)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-xl 
                         bg-black/10 backdrop-blur-sm
                         placeholder:text-white/50 border border-white/20
                         h-28 resize-none
                         focus:outline-none focus:border-white/40
                         transition-colors"
              />

              {/* Deadline & Importance */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <CustomDatePicker
                    value={deadline}
                    onChange={setDeadline}
                    label="Срок выполнения"
                  />
                </div>

                <div className="flex-1 relative">
                  <label className="block text-sm text-white/70 mb-2">
                    Важность
                  </label>
                  <CustomSelect
                    value={importance}
                    onChange={setImportance}
                    options={importanceOptions}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl 
                           bg-white/10 hover:bg-white/20
                           border border-white/20 
                           transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim() || !isAuthReady}
                  className="px-6 py-2.5 rounded-xl 
                           bg-gradient-to-r from-blue-500/80 to-indigo-500/80
                           hover:from-blue-500 hover:to-indigo-500
                           shadow-lg hover:shadow-blue-500/25
                           font-medium disabled:opacity-50
                           disabled:hover:shadow-none
                           transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Сохранение...
                    </span>
                  ) : (
                    "Создать"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
