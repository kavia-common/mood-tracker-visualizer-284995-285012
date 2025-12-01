import React, { useMemo } from 'react';
import { moodToColor } from '../utils/colors';

function moodIcon(m) {
  switch (m) {
    case 1:
      return '😞';
    case 2:
      return '🙁';
    case 3:
      return '😐';
    case 4:
      return '🙂';
    case 5:
      return '😄';
    default:
      return '😐';
  }
}

// PUBLIC_INTERFACE
export default function MoodList({ moods, onDelete }) {
  /** List of recent entries, latest first */
  const list = useMemo(() => {
    const sorted = [...moods].sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
    return sorted.slice(0, 20);
  }, [moods]);

  if (!list.length) {
    return (
      <section className="surface card empty-state" aria-label="Recent entries">
        <div style={{ fontSize: '1.1rem', marginBottom: 6 }}>No entries yet</div>
        <div>Start by logging your first mood above.</div>
      </section>
    );
  }

  return (
    <section className="surface card" aria-label="Recent entries">
      <div className="card-header">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Recent entries</h2>
      </div>
      <div className="mood-list">
        {list.map((e) => (
          <article key={e.id} className="mood-item" aria-label={`Mood entry ${e.dateISO}`}>
            <div
              aria-hidden="true"
              style={{
                width: 44,
                height: 44,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 12,
                border: '1px solid rgba(17,24,39,0.08)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(249,250,251,1))',
              }}
            >
              <span style={{ fontSize: 22 }}>{moodIcon(e.mood)}</span>
            </div>

            <div>
              <div style={{ fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: moodToColor(e.mood) }}>Mood {e.mood}</span>
                <span className="meta">
                  {new Date(e.dateISO).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="meta" style={{ marginTop: 4 }}>
                {e.tags && e.tags.length ? (
                  <span>
                    {e.tags.map((t, i) => (
                      <span
                        key={`${e.id}-tag-${i}`}
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          background: 'rgba(37,99,235,0.08)',
                          border: '1px solid rgba(37,99,235,0.2)',
                          color: '#1d4ed8',
                          borderRadius: 999,
                          marginRight: 6,
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span>No tags</span>
                )}
              </div>
              {e.note ? (
                <div style={{ marginTop: 6, color: 'var(--color-text)' }}>
                  {e.note.length > 120 ? `${e.note.slice(0, 120)}…` : e.note}
                </div>
              ) : null}
            </div>

            <div>
              <button
                className="btn delete-btn"
                onClick={() => onDelete(e.id)}
                aria-label={`Delete entry on ${e.dateISO}`}
                title="Delete entry"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
