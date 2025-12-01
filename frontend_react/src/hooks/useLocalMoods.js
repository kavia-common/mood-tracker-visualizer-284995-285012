import { useCallback, useEffect, useMemo, useState } from 'react';

// LocalStorage keys
const ENTRIES_KEY = 'mood-tracker:entries';

// Optional future API base URL. TODO: switch to API when available.
// eslint-disable-next-line no-undef
const baseURL = process.env.REACT_APP_API_BASE || null;

/**
 * MoodEntry type:
 * { id: string, dateISO: string, mood: number (1-5), tags: string[], note: string }
 */

// Helpers
function readEntries() {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function writeEntries(entries) {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

function normalizeEntry(partial) {
  const now = new Date();
  const iso = new Date(partial?.dateISO || now.toISOString()).toISOString().slice(0, 10);
  return {
    id: partial?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    dateISO: iso,
    mood: Math.min(5, Math.max(1, Number(partial?.mood || 3))),
    tags: Array.isArray(partial?.tags)
      ? partial.tags
      : typeof partial?.tags === 'string'
      ? partial.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    note: partial?.note || '',
  };
}

function startOfDayISO(dateISO) {
  const d = new Date(dateISO);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
}

function getDateRange(days) {
  const arr = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

function averageMood(entries) {
  if (!entries.length) return 0;
  const sum = entries.reduce((a, e) => a + (Number(e.mood) || 0), 0);
  return sum / entries.length;
}

function bestStreak(entries) {
  // Longest consecutive days with mood >= 3
  if (!entries.length) return 0;
  // Map dateISO -> max mood for day
  const dayMax = new Map();
  for (const e of entries) {
    const day = startOfDayISO(e.dateISO);
    const cur = dayMax.get(day) || 0;
    dayMax.set(day, Math.max(cur, Number(e.mood) || 0));
  }
  const allDays = Array.from(dayMax.keys()).sort();
  let best = 0;
  let current = 0;
  let prev = null;
  for (const day of allDays) {
    const pass = (dayMax.get(day) || 0) >= 3;
    if (!prev) {
      current = pass ? 1 : 0;
    } else {
      const prevDate = new Date(prev);
      const curDate = new Date(day);
      const diff = (curDate - prevDate) / (1000 * 60 * 60 * 24);
      if (diff === 1 && pass) {
        current += 1;
      } else if (pass) {
        current = 1;
      } else {
        current = 0;
      }
    }
    best = Math.max(best, current);
    prev = day;
  }
  return best;
}

function distribution(entries) {
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const e of entries) {
    const m = Math.min(5, Math.max(1, Number(e.mood) || 0));
    dist[m] += 1;
  }
  return dist;
}

// PUBLIC_INTERFACE
export function useLocalMoods() {
  /**
   * React hook providing:
   * - moods: list of entries sorted by date asc
   * - addMood(entryPartial)
   * - deleteMood(id)
   * - selectors: avg7, avg30, streakBest, total, dist
   * - chart data: timeSeriesPoints, last7Bars
   * Persists to localStorage. Future: optional baseURL can be used to fetch/POST.
   */
  const [moods, setMoods] = useState(() => {
    const loaded = readEntries();
    // Sort by date ascending
    return loaded.sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO));
  });

  useEffect(() => {
    writeEntries(moods);
  }, [moods]);

  const addMood = useCallback(
    async (entryPartial) => {
      const entry = normalizeEntry(entryPartial);
      // If baseURL exists, this is where API POST would go.
      // TODO: When API is available, replace local write with POST and subsequent refresh.
      setMoods((prev) => {
        const next = [...prev, entry].sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO));
        return next;
      });
      return entry;
    },
    [setMoods]
  );

  const deleteMood = useCallback(
    async (id) => {
      setMoods((prev) => prev.filter((e) => e.id !== id));
    },
    [setMoods]
  );

  const total = moods.length;

  const last7 = useMemo(() => {
    const days = getDateRange(7);
    const byDay = new Map(days.map((d) => [d, []]));
    for (const e of moods) {
      const day = startOfDayISO(e.dateISO);
      if (byDay.has(day)) {
        byDay.get(day).push(e);
      }
    }
    const flat = days.flatMap((d) => byDay.get(d));
    return flat;
  }, [moods]);

  const last30 = useMemo(() => {
    const days = getDateRange(30);
    const byDay = new Map(days.map((d) => [d, []]));
    for (const e of moods) {
      const day = startOfDayISO(e.dateISO);
      if (byDay.has(day)) {
        byDay.get(day).push(e);
      }
    }
    return days.flatMap((d) => byDay.get(d));
  }, [moods]);

  const avg7 = useMemo(() => Number(averageMood(last7).toFixed(2)), [last7]);
  const avg30 = useMemo(() => Number(averageMood(last30).toFixed(2)), [last30]);
  const streakBest = useMemo(() => bestStreak(moods), [moods]);
  const dist = useMemo(() => distribution(moods), [moods]);

  const timeSeriesPoints = useMemo(() => {
    // Aggregate by date: average mood per day
    const map = new Map();
    for (const e of moods) {
      const day = startOfDayISO(e.dateISO);
      if (!map.has(day)) map.set(day, []);
      map.get(day).push(Number(e.mood) || 0);
    }
    const arr = Array.from(map.entries())
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([day, arrM]) => ({
        x: day,
        y: arrM.reduce((a, m) => a + m, 0) / arrM.length,
      }));
    return arr;
  }, [moods]);

  const last7Bars = useMemo(() => {
    const days = getDateRange(7);
    const map = new Map(days.map((d) => [d, []]));
    for (const e of moods) {
      const day = startOfDayISO(e.dateISO);
      if (map.has(day)) map.get(day).push(Number(e.mood) || 0);
    }
    return days.map((d) => {
      const arr = map.get(d);
      const val = arr.length ? arr.reduce((a, m) => a + m, 0) / arr.length : 0;
      return { x: d, y: val };
    });
  }, [moods]);

  return {
    moods,
    addMood,
    deleteMood,
    total,
    avg7,
    avg30,
    streakBest,
    dist,
    timeSeriesPoints,
    last7Bars,
  };
}
