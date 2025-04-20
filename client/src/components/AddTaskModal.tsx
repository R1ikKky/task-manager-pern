import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { createTask } from "../api/tasks.api";
import { useAuthStore } from "../store/user.store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const importanceList = ["low", "medium", "high"] as const;

export default function AddTaskModal({ isOpen, onClose }: Props) {
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline]       = useState("");
  const [importance, setImportance]   = useState<typeof importanceList[number]>("low");
  const [loading, setLoading]         = useState(false);
  const isAuthReady = useAuthStore((s) => s.isAuthReady);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await createTask(title, description, deadline, importance);
    setLoading(false);
    // очистить поля + закрыть
    setTitle("");
    setDescription("");
    setDeadline("");
    setImportance("low");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* тёмный фон */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* само окно */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1,  opacity: 1 }}
            exit={{   scale: 0.8, opacity: 0 }}
          >
            <div
              className="w-full max-w-lg bg-white/10 border border-white/30
                         backdrop-blur-md rounded-2xl p-8 text-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6">New Task</h2>

              {/* Title */}
              <input
                className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10
                           placeholder:text-white/50 border border-white/20
                           focus:outline-none"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Description */}
              <textarea
                className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10
                           placeholder:text-white/50 border border-white/20
                           h-24 resize-none focus:outline-none"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Deadline & Importance */}
              <div className="flex gap-4 mb-6">
                <input
                  type="date"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10
                             border border-white/20 focus:outline-none"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />

                <select
                  className="px-4 py-3 rounded-xl bg-white/10
                             border border-white/20 focus:outline-none"
                  value={importance}
                  onChange={(e) => setImportance(e.target.value as any)}
                >
                  {importanceList.map((imp) => (
                    <option key={imp} value={imp}>
                      {imp.charAt(0).toUpperCase() + imp.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30
                             border border-white/20"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500
                             font-semibold disabled:opacity-50"
                  disabled={loading || !title.trim() || !isAuthReady}
                  onClick={handleCreate}
                >
                  {loading ? "Saving…" : "Create"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
