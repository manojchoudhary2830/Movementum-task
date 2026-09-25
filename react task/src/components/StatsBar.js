export default function StatsBar({ stats }) {
  const cards = [
    { label: 'Total', value: stats.total },
    { label: 'Active', value: stats.active },
    { label: 'Completed', value: stats.completed },
    { label: 'Progress', value: `${stats.percent}%` },
  ];
  return (
    <section className="stats" aria-label="Task statistics">
      {cards.map((c) => (
        <div key={c.label} className="stat-card">
          <span className="stat-value">{c.value}</span>
          <span className="stat-label">{c.label}</span>
        </div>
      ))}
    </section>
  );
}