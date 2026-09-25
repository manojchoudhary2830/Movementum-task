import {
  normalizeTitle,
  validateTaskInput,
  filterTasks,
  sortTasks,
  calculateStats,
  isOverdue,
  formatDate,
} from './taskUtils';

const mk = (over = {}) => ({
  id: 'x',
  title: 'Task',
  description: '',
  category: 'Work',
  priority: 'Medium',
  dueDate: '',
  completed: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...over,
});

test('normalizeTitle collapses whitespace', () => {
  expect(normalizeTitle('  hello   world  ')).toBe('hello world');
});

test('validateTaskInput rejects empty title', () => {
  const r = validateTaskInput({ title: '   ' });
  expect(r.isValid).toBe(false);
  expect(r.errors.title).toBeDefined();
});

test('filterTasks by status', () => {
  const tasks = [mk({ completed: false }), mk({ id: 'y', completed: true })];
  expect(filterTasks(tasks, { status: 'Active' })).toHaveLength(1);
  expect(filterTasks(tasks, { status: 'Completed' })).toHaveLength(1);
});

test('sortTasks alphabetical', () => {
  const tasks = [mk({ title: 'B' }), mk({ id: 'y', title: 'A' })];
  expect(sortTasks(tasks, 'alphabetical')[0].title).toBe('A');
});

test('calculateStats', () => {
  const tasks = [mk(), mk({ id: 'y', completed: true })];
  expect(calculateStats(tasks)).toEqual({
    total: 2,
    active: 1,
    completed: 1,
    percent: 50,
  });
});

test('isOverdue false for completed', () => {
  expect(isOverdue(mk({ dueDate: '2000-01-01', completed: true }))).toBe(false);
});

test('formatDate handles missing', () => {
  expect(formatDate('')).toBe('—');
});