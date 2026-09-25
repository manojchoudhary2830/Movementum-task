export const CATEGORIES = ['Work', 'Personal', 'Study', 'Shopping', 'Health'];
export const PRIORITIES = ['Low', 'Medium', 'High'];
export const PRIORITY_ORDER = { High: 3, Medium: 2, Low: 1 };

export const normalizeTitle = (title = '') => title.trim().replace(/\s+/g, ' ');

export const validateTaskInput = (values) => {
  const errors = {};
  const title = normalizeTitle(values.title);
  if (!title) errors.title = 'Title is required.';
  else if (title.length > 100) errors.title = 'Title must be 100 characters or fewer.';

  if (values.description && values.description.length > 500)
    errors.description = 'Description must be 500 characters or fewer.';

  if (values.dueDate && Number.isNaN(Date.parse(values.dueDate)))
    errors.dueDate = 'Due date is invalid.';

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    normalizedTitle: title,
  };
};

export const isOverdue = (task) => {
  if (!task || task.completed || !task.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate) < today;
};

export const filterTasks = (tasks, { status = 'All', category = 'All', search = '' } = {}) => {
  const q = search.trim().toLowerCase();
  return tasks.filter((t) => {
    if (status === 'Active' && t.completed) return false;
    if (status === 'Completed' && !t.completed) return false;
    if (category !== 'All' && t.category !== category) return false;
    if (q && !`${t.title} ${t.description}`.toLowerCase().includes(q)) return false;
    return true;
  });
};

export const sortTasks = (tasks, sortBy = 'newest') => {
  const copy = [...tasks];
  switch (sortBy) {
    case 'oldest':
      return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'dueDate':
      return copy.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case 'priority':
      return copy.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
    case 'alphabetical':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'newest':
    default:
      return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

export const calculateStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, active, completed, percent };
};

export const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};