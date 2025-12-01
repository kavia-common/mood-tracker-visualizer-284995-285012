import { useEffect, useId, useMemo, useState } from 'react';
import { moodToColor } from '../utils/colors';

// PUBLIC_INTERFACE
export default function MoodForm({ onAdd }) {
  /**
   * Mood entry form.
   * Props:
   * - onAdd: function(entryPartial) -> Promise
   */
  const moodId = useId();
  const dateId = useId();
  const tagsId = useId();
  const noteId = useId();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [mood, setMood] = useState(3);
  const [dateISO, setDateISO] = useState(today);
  const [tags, setTags] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setDateISO(today);
  }, [today]);

  function validate() {
    if (!dateISO) return 'Please select a date.';
    const m = Number(mood);
    if (!(m >= 1 && m <= 5)) return 'Please select a mood between 1 and 5.';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    await onAdd({ mood: Number(mood), dateISO, tags, note });
    // reset note and tags only
    setTags('');
    setNote('');
  }

  const moods = [
    { value: 1, label: '😞' },
    { value: 2, label: '🙁' },
    { value: 3, label: '😐' },
    { value: 4, label: '🙂' },
    { value: 5, label: '😄' },
  ];

  return (
    <form className="surface card" onSubmit={handleSubmit} aria-labelledby={`${moodId}-legend`}>
      <div className="card-header">
        <h2 id={`${moodId}-legend`} style={{ margin: 0, fontSize: '1.05rem' }}>
          Log your mood
        </h2>
      </div>

      <div className="section">
        <div className="label" id={`${moodId}-label`}>Mood</div>
        <div className="mood-segment" role="group" aria-labelledby={`${moodId}-label`}>
          {moods.map((m) => (
            <button
              key={m.value}
              type="button"
              className="segment-btn"
              style={{ borderColor: mood === m.value ? moodToColor(m.value) : undefined }}
              aria-pressed={mood === m.value}
              aria-label={`Mood ${m.value}`}
              onClick={() => setMood(m.value)}
            >
              <div style={{ fontSize: '1.2rem' }}>{m.label}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{m.value}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="section form-grid">
        <div>
          <label className="label" htmlFor={dateId}>
            Date
          </label>
          <input
            id={dateId}
            className="input"
            type="date"
            value={dateISO}
            onChange={(e) => setDateISO(e.target.value)}
            aria-invalid={!dateISO}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor={tagsId}>
            Tags (comma separated)
          </label>
          <input
            id={tagsId}
            className="input"
            type="text"
            placeholder="work, exercise, friends"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            aria-describedby={`${tagsId}-help`}
          />
          <div id={`${tagsId}-help`} className="visually-hidden">
            Enter optional tags separated by commas.
          </div>
        </div>
      </div>

      <div className="section">
        <label className="label" htmlFor={noteId}>
          Note (optional)
        </label>
        <textarea
          id={noteId}
          className="textarea"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add some context..."
        />
      </div>

      {error && (
        <div role="alert" style={{ color: '#EF4444', margin: '8px 0' }}>
          {error}
        </div>
      )}

      <div className="actions">
        <button type="submit" className="btn" aria-label="Add mood entry">
          Add Entry
        </button>
      </div>
    </form>
  );
}
