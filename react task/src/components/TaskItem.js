import { formatDate, isOverdue } from '../utils/taskUtils';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);
  return (
    <li
      className={`task-item ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}
    >
      <label className="checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${
            task.completed ? 'active' : 'completed'
          }`}
        />
      </label>

      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          <span className="badge">{task.category}</span>
          <span className={`badge priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          <span className="due">Due: {formatDate(task.dueDate)}</span>
          {overdue && <span className="overdue-tag">Overdue</span>}
        </div>
      </div>

      <div className="task-actions">
        <button type="button" className="btn btn-ghost" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="btn btn-danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}