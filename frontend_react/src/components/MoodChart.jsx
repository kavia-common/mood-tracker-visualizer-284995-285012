import React, { useMemo } from 'react';
import { moodToColor } from '../utils/colors';

// PUBLIC_INTERFACE
export default function MoodChart({ timeSeriesPoints, last7Bars }) {
  /**
   * Charts:
   * - SVG line chart for time series (avg mood per day).
   * - SVG bar chart for last 7 days.
   */
  return (
    <section className="surface card" aria-label="Charts">
      <div className="card-header">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Mood over time</h2>
      </div>
      <div className="chart-wrapper" role="figure" aria-label="Line chart of mood over time">
        <LineChart data={timeSeriesPoints} />
      </div>
      <div className="card-header" style={{ marginTop: 8 }}>
        <h3 style={{ margin: 0, fontSize: '1.0rem' }}>Last 7 days</h3>
      </div>
      <div className="chart-wrapper" role="figure" aria-label="Bar chart of last 7 days average mood">
        <BarChart data={last7Bars} />
      </div>
    </section>
  );
}

function LineChart({ data }) {
  const width = 720;
  const height = 200;
  const pad = 24;

  const prepared = useMemo(() => {
    if (!data || !data.length) return { path: '', points: [] };
    const xs = data.map((d) => new Date(d.x).getTime());
    const ys = data.map((d) => Number(d.y) || 0);

    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = 1;
    const yMax = 5;

    const scaleX = (x) =>
      xMax === xMin ? pad + (width - 2 * pad) / 2 : pad + ((x - xMin) / (xMax - xMin)) * (width - 2 * pad);
    const scaleY = (y) => pad + (height - 2 * pad) - ((y - yMin) / (yMax - yMin)) * (height - 2 * pad);

    const pts = xs.map((x, i) => [scaleX(x), scaleY(ys[i])]);
    const d = pts.map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(' ');
    return { path: d, points: pts };
  }, [data]);

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Mood line chart">
      {/* Y grid lines */}
      {[1, 2, 3, 4, 5].map((y) => (
        <line
          key={y}
          x1={0}
          x2={width}
          y1={(height - 48) - ((y - 1) / 4) * (height - 48) + 24}
          y2={(height - 48) - ((y - 1) / 4) * (height - 48) + 24}
          stroke="rgba(17,24,39,0.08)"
          strokeWidth="1"
        />
      ))}

      {/* Path */}
      {prepared.path ? (
        <>
          <path d={prepared.path} fill="none" stroke="#2563EB" strokeWidth="2.5" />
          {prepared.points.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#2563EB" />
          ))}
        </>
      ) : (
        <text x={width / 2} y={height / 2} textAnchor="middle" fill="#6b7280">
          No data yet
        </text>
      )}
    </svg>
  );
}

function BarChart({ data }) {
  const width = 720;
  const height = 140;
  const pad = 24;

  const prepared = useMemo(() => {
    if (!data || !data.length) return [];
    const barW = (width - 2 * pad) / data.length - 8;
    return data.map((d, i) => {
      const x = pad + i * ((width - 2 * pad) / data.length);
      const value = Math.max(0, Math.min(5, Number(d.y) || 0));
      const h = ((value - 0) / (5 - 0)) * (height - 2 * pad);
      const y = height - pad - h;
      return { x, y, h, w: barW, value, date: d.x };
    });
  }, [data]);

  return (
    <svg className="bars-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Last 7 days bar chart">
      {/* X grid baseline */}
      <line x1={0} x2={width} y1={height - 24} y2={height - 24} stroke="rgba(17,24,39,0.08)" strokeWidth="1" />

      {prepared.length ? (
        prepared.map((b, i) => (
          <g key={i}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="6"
              fill={moodToColor(Math.round(b.value || 0) || 3)}
              aria-label={`Day ${b.date}, mood ${b.value.toFixed(1)}`}
            />
            <text x={b.x + b.w / 2} y={height - 6} fontSize="10" fill="#6b7280" textAnchor="middle">
              {new Date(b.date).toLocaleDateString(undefined, { weekday: 'short' })}
            </text>
          </g>
        ))
      ) : (
        <text x={width / 2} y={height / 2} textAnchor="middle" fill="#6b7280">
          No data yet
        </text>
      )}
    </svg>
  );
}
