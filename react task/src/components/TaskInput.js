import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, PRIORITIES, validateTaskInput } from '../utils/taskUtils';

const empty = {
  title: '',
  description: '',
  category: 'Personal',
  priority: 'Medium',
  dueDate: '',
};

export default function TaskInput({ initialValues, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues || empty);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = validateTaskInput(values);
    setErrors(result.errors);
    if (!result.isValid) return;

    setBusy(true);
    try {
      await onSubmit({ ...values, title: result.normalizedTitle });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          ref={titleRef}
          value={values.title}
          onChange={handleChange}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <span id="title-error" role="alert" className="error">
            {errors.title}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={3}
        />
        {errors.description && (
          <span role="alert" className="error">
            {errors.description}
          </span>
        )}
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={values.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={values.priority} onChange={handleChange}>
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="actions">
        <button type="button" className="btn" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Saving…' : initialValues ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </form>
  );
}