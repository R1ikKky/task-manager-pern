import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../interfaces/task.interface';
import { updateTask } from '../../api/tasks.api';
import CustomSelect from './CustomSelect';
import CustomDatePicker from './CustomDatePicker';
import Portal from './Portal';

interface TaskCardProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

type ImportanceType = "low" | "medium" | "high";

const importanceOptions: Array<{ value: ImportanceType; label: string }> = [
  { value: "low", label: "Низкая" },
  { value: "medium", label: "Средняя" },
  { value: "high", label: "Высокая" }
];

const TaskCard = ({ task, isOpen, onClose }: TaskCardProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [deadline, setDeadline] = useState(task.deadline || '');
  const [importance, setImportance] = useState<ImportanceType>(task.importance);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDeadline(task.deadline || '');
    setImportance(task.importance);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, task]);

  const handleClose = (e: React.MouseEvent) => {
    // Проверяем, что клик был именно по оверлею
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || loading) return;

    setLoading(true);
    try {
      await updateTask(task.id, {
        title,
        description,
        deadline,
        importance
      });
      onClose();
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose} // Добавляем обработчик
            />

            {/* Modal Container */}
            <div 
              className="fixed inset-0 flex items-center justify-center z-[101]"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  onClose();
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-lg mx-4"
                onClick={(e) => e.stopPropagation()} // Добавляем это
              >
                <form
                  onSubmit={handleSubmit}
                  className="w-full bg-gradient-to-br from-white/20 to-white/10 
                         border border-white/30 backdrop-blur-md rounded-2xl p-8 
                         shadow-2xl text-white"
                >
                  <h2 className="text-2xl font-bold mb-6">Редактировать задачу</h2>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-4 px-4 py-3 rounded-xl 
                           bg-black/10 backdrop-blur-sm
                           placeholder:text-white/50 border border-white/20
                           focus:outline-none focus:border-white/40 
                           transition-colors"
                  />

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Описание (необязательно)"
                    className="w-full mb-4 px-4 py-3 rounded-xl 
                           bg-black/10 backdrop-blur-sm
                           placeholder:text-white/50 border border-white/20
                           h-28 resize-none
                           focus:outline-none focus:border-white/40
                           transition-colors"
                  />

                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <CustomDatePicker
                        value={deadline}
                        onChange={setDeadline}
                        label="Срок выполнения"
                      />
                    </div>

                    <div className="flex-1">
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
                      disabled={loading || !title.trim()}
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
                              cx="12" cy="12" r="10" 
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
                        "Сохранить"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default TaskCard;