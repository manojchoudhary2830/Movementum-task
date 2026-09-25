import { useMemo, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import TaskInput from './components/TaskInput';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import Toast from './components/Toast';
import useTasks from './hooks/useTasks';
import { calculateStats, filterTasks, sortTasks } from './utils/taskUtils';
import './App.css';

function AppInner() {
  const { user, loading: authLoading } = useAuth();
  const {
    tasks,
    loading: tasksLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [toast, setToast] = useState(null);

  const stats = useMemo(() => calculateStats(tasks), [tasks]);
  const visibleTasks = useMemo(
    () => sortTasks(filterTasks(tasks, { status, category, search }), sortBy),
    [tasks, status, category, search, sortBy]
  );

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (authLoading) {
    return <div className="loading-screen">Loading…</div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleSubmit = async (values) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, values);
        notify('Task updated');
        setEditingTask(null);
      } else {
        await addTask(values);
        notify('Task added');
      }
      setShowForm(false);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      notify('Task deleted', 'info');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="app">
      <a href="#task-list" className="skip-link">
        Skip to task list
      </a>

      <Header
        onAddClick={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
      />

      <main className="container">
        <StatsBar stats={stats} />

        {error && (
          <p role="alert" className="error-banner">
            {error}
          </p>
        )}

        {showForm && (
          <TaskInput
            initialValues={editingTask}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}

        <FilterBar
          status={status}
          setStatus={setStatus}
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <TaskList
          id="task-list"
          tasks={visibleTasks}
          loading={tasksLoading}
          onToggle={toggleTask}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <Toast toast={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}