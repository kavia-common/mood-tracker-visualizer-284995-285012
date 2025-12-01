import React from 'react';

// PUBLIC_INTERFACE
export default function MoodSummary({ avg7, avg30, streakBest, total }) {
  /** Summary metrics cards */
  const items = [
    { label: 'Avg (7d)', value: avg7 || 0 },
    { label: 'Avg (30d)', value: avg30 || 0 },
    { label: 'Best streak', value: streakBest || 0 },
    { label: 'Total entries', value: total || 0 },
  ];

  return (
    <section className="surface card" aria-label="Summary">
      <div className="card-header">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Summary</h2>
      </div>
      <div className="summary-grid">
        {items.map((it) => (
          <div className="summary-item" key={it.label} role="group" aria-label={it.label}>
            <div className="summary-value">{it.value}</div>
            <div className="summary-label">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
