import { CATEGORIES } from '../utils/taskUtils';

const STATUSES = ['All', 'Active', 'Completed'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'alphabetical', label: 'A–Z' },
];

export default function FilterBar({
  status,
  setStatus,
  category,
  setCategory,
  search,
  setSearch,
  sortBy,
  setSortBy,
}) {
  return (
    <section className="filter-bar" aria-label="Filters and sorting">
      <input
        className="search"
        type="search"
        placeholder="Search tasks…"
        aria-label="Search tasks"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="tabs" role="tablist" aria-label="Status filter">
        {STATUSES.map((s) => (
          <button
            key={s}
            role="tab"
            type="button"
            aria-selected={status === s}
            className={status === s ? 'tab active' : 'tab'}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="All">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort tasks">
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </section>
  );
}