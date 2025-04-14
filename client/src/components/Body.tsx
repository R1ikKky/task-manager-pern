import { useTaskStore } from '../store/task.store';
import TaskItem from './UI-elements/TaskItem';
import SearchBar from './UI-elements/SearchBar';
import Button from './UI-elements/Button';

const Body = () => {
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <div className="flex flex-col items-center px-6 py-8 w-full">
      <div className="w-full max-w-4xl mb-4 flex justify-between items-center">
        <Button className="whitespace-nowrap">+ Add Task</Button>
        <div className="flex-1 px-4">
          <SearchBar />
        </div>
        <Button className="whitespace-nowrap">Sort by</Button>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Body;