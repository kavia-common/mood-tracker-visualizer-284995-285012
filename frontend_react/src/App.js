import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import MoodForm from './components/MoodForm';
import MoodSummary from './components/MoodSummary';
import MoodChart from './components/MoodChart';
import MoodList from './components/MoodList';
import { useLocalMoods } from './hooks/useLocalMoods';

// PUBLIC_INTERFACE
function App() {
  /** Root App composing components and layout. */
  const {
    moods,
    addMood,
    deleteMood,
    total,
    avg7,
    avg30,
    streakBest,
    timeSeriesPoints,
    last7Bars,
  } = useLocalMoods();

  return (
    <div>
      <NavBar />
      <main className="container" style={{ paddingTop: 16, paddingBottom: 24 }}>
        <div className="row two">
          <section>
            <MoodForm onAdd={addMood} />
          </section>
          <section>
            <MoodSummary avg7={avg7} avg30={avg30} streakBest={streakBest} total={total} />
          </section>
        </div>

        <div className="section">
          <MoodChart timeSeriesPoints={timeSeriesPoints} last7Bars={last7Bars} />
        </div>

        <div className="section">
          <MoodList moods={moods} onDelete={deleteMood} />
        </div>
      </main>
    </div>
  );
}

export default App;
