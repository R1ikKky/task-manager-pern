
import { Task } from '../../interfaces/task.interface';
import Button from './Button';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-5 rounded-2xl flex items-center justify-between shadow-md">
      <div className="flex items-center gap-6">
        <div className="font-semibold text-lg text-white/90">{task.title}</div>
        <div className="text-sm text-yellow-300 bg-yellow-500/10 px-2 py-0.5 rounded-full">
          {task.importance}
        </div>
        <div className="text-sm text-neutral-300 text-center">
          <div className="text-xs">Deadline</div>
          <div>{task.deadline || '–'}</div>
        </div>
        <div className={task.completed ? 'text-green-400' : 'text-red-400'}>
          {task.completed ? 'Completed ✅' : 'Incomplete'}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant={task.completed ? 'danger' : 'success'}>
          {task.completed ? 'Undo' : 'Complete'}
        </Button>
        <button className="text-red-400 hover:text-red-300 text-xl">✖</button>
      </div>
    </div>
  );
};

export default TaskItem;