import { useState, useEffect } from 'react';
import { generateTzolkinMatrix, generateTzolkinSequence, daySigns, getCurrentTzolkinDate } from './data/tzolkinData';

import './styles/global.css';
import MatrixView from './components/MatrixView/MatrixView';
import CircularView from './components/CircularView/CircularView';
import SpiralView from './components/SpiralView/SpiralView';
import TimelineView from './components/TimelineView/TimelineView';
import InfoPanel from './components/InfoPanel/InfoPanel';
import Navbar from './components/Navbar/Navbar';
import Controls from './components/Controls/Control';
import TodayView from './components/TodayView/TodayView';
import FractalView from './components/FractalView/FractalView';

const VIEWS = {
  FRACTAL: 'fractal', 
  TODAY: 'today',
  CIRCULAR: 'circular',
  SPIRAL: 'spiral',
  TIMELINE: 'timeline',
  MATRIX: 'matrix',
};

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.FRACTAL);
  const [currentDay, setCurrentDay] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [today, setToday] = useState(null);

  const matrix = generateTzolkinMatrix();
  const sequence = generateTzolkinSequence();

  useEffect(() => {
    const todayData = getCurrentTzolkinDate();
    setToday(todayData);
    const todayInSequence = sequence.find(day => 
      day.number === todayData.number && day.name === todayData.name
    );
    setCurrentDay(todayInSequence);
  }, []);

  const handleDaySelect = (day) => {
    setCurrentDay(day);
    setIsAnimating(false);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setCurrentDay(null);
    setIsAnimating(false);
  };

  return (
    <div className="app">
      <Navbar onViewChange={handleViewChange} currentView={currentView} views={VIEWS} />
      
      <div className="main-content-wrapper">
        <div className="main-content">
          <div className="visualization-container">
            {currentView === VIEWS.FRACTAL && (
              <FractalView
                sequence={sequence}
              />
            )}
            {currentView === VIEWS.TODAY && today && (
              <TodayView 
                today={today}
                matrix={matrix}
                sequence={sequence}
                onDaySelect={handleDaySelect}
              />
            )}
            {currentView === VIEWS.CIRCULAR && (
              <CircularView 
                sequence={sequence}
                onDaySelect={handleDaySelect}
                currentDay={currentDay}
                isAnimating={isAnimating}
                animationSpeed={animationSpeed}
              />
            )}
            {currentView === VIEWS.SPIRAL && (
              <SpiralView 
                sequence={sequence}
                onDaySelect={handleDaySelect}
                currentDay={currentDay}
                isAnimating={isAnimating}
                animationSpeed={animationSpeed}
              />
            )}
            {currentView === VIEWS.TIMELINE && (
              <TimelineView 
                sequence={sequence}
                onDaySelect={handleDaySelect}
                currentDay={currentDay}
                isAnimating={isAnimating}
                animationSpeed={animationSpeed}
              />
            )}
            {currentView === VIEWS.MATRIX && (
              <MatrixView 
                matrix={matrix}
                sequence={sequence}
                onDaySelect={handleDaySelect}
                currentDay={currentDay}
                isAnimating={isAnimating}
                animationSpeed={animationSpeed}
              />
            )}
          </div>
          
          <div className="right-column">
            <InfoPanel day={currentDay} daySigns={daySigns} />
            <Controls 
              onStartAnimation={() => setIsAnimating(true)}
              onStopAnimation={() => setIsAnimating(false)}
              onSpeedChange={setAnimationSpeed}
              animationSpeed={animationSpeed}
              isAnimating={isAnimating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;