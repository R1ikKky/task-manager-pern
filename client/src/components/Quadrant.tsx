// Quadrant.tsx
import { useRef, useEffect }      from "react";
import { useDrop }                from "react-dnd";
import clsx                       from "clsx";
import { Task }     from "../interfaces/task.interface";
import TaskItem                   from "./UI-elements/TaskItem";

interface QuadrantProps {
  title:       string;
  description: string;
  tasks:       Task[];
  onDrop:      (item: Task) => void;
  gradient:    string;
  isTableView: boolean;
}

const Quadrant = ({
  title,
  description,
  tasks,
  onDrop,
  gradient,
  isTableView,
}: QuadrantProps) => {
  /* ---------- DnD --------------------------------------------------- */
  const [{ isOver }, drop] = useDrop(() => ({
    accept : "task",
    drop   : onDrop,          // вызывается при отпускании
    collect: monitor => ({ isOver: monitor.isOver() }),
  }), [onDrop]);

  // собственный ref, который «оборачиваем» в drop(...)
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      drop(elementRef.current);          // прикрепляем drop-target
    }
  }, [drop]);

  /* ---------- Render ------------------------------------------------- */
  return (
    <div
      ref={elementRef}
      className={clsx(
        "p-6 rounded-2xl backdrop-blur-md",
        `bg-gradient-to-br ${gradient}`,
        "border border-white/20",
        isOver && "border-white/50 shadow-lg",
        "transition-all duration-200"
      )}
    >
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p  className="text-white/70 text-sm mb-4">{description}</p>

      <div className="space-y-3 min-h-[100px]">
        {tasks.map(t => (
          <TaskItem
            key={t.id}
            task={t}
            isTableView={isTableView}   // чтобы drag был активен
          />
        ))}
      </div>
    </div>
  );
};

export default Quadrant;
