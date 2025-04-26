import { logoutUser } from "../api/user.api";
import { useAuthStore } from '../store/user.store';
import { useTaskStore } from '../store/task.store';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useAuthStore();
  const tasks = useTaskStore(s => s.tasks);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (!user) return null;

  // Статистика задач
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const tasksByImportance = {
    high: tasks.filter(t => t.importance === 'high').length,
    medium: tasks.filter(t => t.importance === 'medium').length,
    low: tasks.filter(t => t.importance === 'low').length
  };

  const upcomingTasks = tasks.filter(t => {
    if (!t.deadline || t.completed) return false;
    return new Date(t.deadline) > new Date();
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 to-indigo-900 overflow-y-auto overscroll-none">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header остается без изменений */}
        <div className="sticky top-4 z-10 flex justify-between items-center mb-12 
                      bg-gradient-to-r from-sky-900/95 to-indigo-900/95 
                      backdrop-blur-sm py-4 px-6
                      rounded-2xl border border-white/10
                      mx-[-1rem]">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-white hover:text-white/80 transition-colors"
          >
            ← Назад к задачам
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/30 hover:bg-red-500/40 text-white 
                     rounded-xl transition-colors"
          >
            Выйти
          </button>
        </div>

        {/* Content секция */}
        <div className="py-8 px-4 space-y-8"> {/* Добавили space-y-8 */}
          {/* Основные блоки в сетке */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Левая колонка с информацией о пользователе */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 h-full"
            >
              <div className="bg-white/15 border border-white/30 rounded-2xl p-8 backdrop-blur-sm h-full">
                <div className="flex flex-col items-center text-center h-full justify-between">
                  <div className="flex flex-col items-center">
                    <FaUserCircle className="text-8xl text-white mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">{user.userName}</h2>
                    <p className="text-white/90 mb-6">{user.email}</p>
                  </div>
                  <div className="w-full border-t border-white/20 pt-6">
                    <p className="text-sm text-white/80">Аккаунт создан</p>
                    <p className="text-white">Апрель 2024</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Правая колонка со статистикой */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Основная статистика - обновили градиенты */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Всего задач"
                  value={totalTasks}
                  footer="создано"
                  gradient="from-blue-500/30 to-blue-600/30"
                />
                <StatCard
                  title="Выполнено"
                  value={`${completionRate}%`}
                  footer={`${completedTasks} из ${totalTasks}`}
                  gradient="from-green-500/30 to-green-600/30"
                />
                <StatCard
                  title="Предстоит"
                  value={upcomingTasks}
                  footer="задач"
                  gradient="from-yellow-500/30 to-yellow-600/30"
                />
                <StatCard
                  title="Важных"
                  value={tasksByImportance.high}
                  footer="задач"
                  gradient="from-red-500/30 to-red-600/30"
                />
              </div>

              {/* График распределения - обновили контрастность */}
              <div className="bg-white/15 border border-white/30 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-6">Распределение по важности</h3>
                <div className="space-y-4">
                  <ImportanceBar
                    label="Высокая"
                    value={tasksByImportance.high}
                    total={totalTasks}
                    color="bg-red-500/80"
                  />
                  <ImportanceBar
                    label="Средняя"
                    value={tasksByImportance.medium}
                    total={totalTasks}
                    color="bg-yellow-500/80"
                  />
                  <ImportanceBar
                    label="Низкая"
                    value={tasksByImportance.low}
                    total={totalTasks}
                    color="bg-green-500/80"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Достижения отдельным блоком */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <div className="bg-white/15 border border-white/30 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-6">Достижения</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <Achievement
                  title="Начало пути"
                  description="Создана первая задача"
                  unlocked={totalTasks > 0}
                />
                <Achievement
                  title="Продуктивность"
                  description="Выполнено 5 задач"
                  unlocked={completedTasks >= 5}
                />
                <Achievement
                  title="Мастер"
                  description="Выполнено 20 задач"
                  unlocked={completedTasks >= 20}
                />
                <Achievement
                  title="Организованность"
                  description="Добавлено 3 важных задачи"
                  unlocked={tasksByImportance.high >= 3}
                />
                <Achievement
                  title="Баланс"
                  description="Есть задачи всех уровней важности"
                  unlocked={Object.values(tasksByImportance).every(v => v > 0)}
                />
                <Achievement
                  title="Эффективность"
                  description="Достигнут показатель 80% выполнения"
                  unlocked={completionRate >= 80}
                />
                <Achievement
                  title="Планирование"
                  description="Добавлено 5 задач со сроком"
                  unlocked={tasks.filter(t => t.deadline).length >= 5}
                />
                <Achievement
                  title="Регулярность"
                  description="3 задачи выполнены в срок"
                  unlocked={tasks.filter(t => t.completed && t.deadline && new Date(t.deadline) >= new Date()).length >= 3}
                />
                <Achievement
                  title="Чистота"
                  description="Нет просроченных задач"
                  unlocked={!tasks.some(t => !t.completed && t.deadline && new Date(t.deadline) < new Date())}
                />
                <Achievement
                  title="Легенда"
                  description="100 выполненных задач"
                  unlocked={completedTasks >= 100}
                />
                <Achievement
                  title="Ночной страж"
                  description="???"
                  unlocked={tasks.some(t => {
                    const created = new Date(t.createdAt);
                    return created.getHours() >= 0 && created.getHours() <= 4;
                  })}
                />
                <Achievement
                  title="Перфекционист"
                  description="???"
                  unlocked={tasks.length >= 5 && tasks.every(t => t.completed)}
                />
                <Achievement
                  title="Спринтер"
                  description="???"
                  unlocked={tasks.some(t => {
                    const created = new Date(t.createdAt);
                    const now = new Date();
                    return t.completed && (now.getTime() - created.getTime() <= 5 * 60 * 1000);
                  })}
                />
                <Achievement
                  title="Воскресенье"
                  description="???"
                  unlocked={tasks.some(t => {
                    const date = new Date(t.createdAt);
                    return date.getDay() === 0 && t.completed;
                  })}
                />
                <Achievement
                  title="Идеальный месяц"
                  description="???"
                  unlocked={(() => {
                    const now = new Date();
                    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                    const monthTasks = tasks.filter(t => new Date(t.createdAt) >= monthStart);
                    return monthTasks.length >= 10 && monthTasks.every(t => t.completed);
                  })()}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Компонент статистической карточки
const StatCard = ({ title, value, footer, gradient }: { 
  title: string; 
  value: number | string; 
  footer: string;
  gradient: string;
}) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 backdrop-blur-sm
                   border border-white/30`}>
    <h4 className="text-sm text-white mb-1">{title}</h4>
    <p className="text-3xl font-bold text-white mb-2">{value}</p>
    <p className="text-sm text-white/90">{footer}</p>
  </div>
);

// Компонент полосы важности
const ImportanceBar = ({ label, value, total, color }: {
  label: string;
  value: number;
  total: number;
  color: string;
}) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span>{total ? Math.round((value / total) * 100) : 0}%</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${total ? (value / total) * 100 : 0}%` }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);

// Компонент достижения
const Achievement = ({ title, description, unlocked }: {
  title: string;
  description: string;
  unlocked: boolean;
}) => (
  <div className={`p-4 rounded-xl border ${
    unlocked 
      ? 'border-white/30 bg-white/15 shadow-lg shadow-white/5' 
      : 'border-white/10 bg-white/5'
  }`}>
    <div className={`text-lg mb-1 ${unlocked ? 'text-white' : 'text-white/30'}`}>
      {unlocked ? '🏆 ' : '🔒 '}{title}
    </div>
    <p className={`text-sm ${unlocked ? 'text-white/90' : 'text-white/20'}`}>
      {description}
    </p>
  </div>
);

export default Profile;
