import TaskItem from './TaskItem';

export default function TaskList({ id, tasks, onToggle, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <section id={id} className="empty-state">
        <p>Loading tasks…</p>
      </section>
    );
  }

  if (!tasks.length) {
    return (
      <section id={id} className="empty-state" aria-live="polite">
        <p>No tasks to show.</p>
        <p className="muted">Add a task or adjust your filters.</p>
      </section>
    );
  }

  return (
    <ul id={id} className="task-list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}