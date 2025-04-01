import { FaPlay, FaPause, FaFastForward, FaFastBackward } from 'react-icons/fa';
import '../../styles/Controls.css';

const Controls = ({ 
  onStartAnimation, 
  onStopAnimation, 
  onSpeedChange, 
  animationSpeed, 
  isAnimating 
}) => {
  return (
    <div className="controls">
      <div className="control-buttons">
        <button 
          onClick={isAnimating ? onStopAnimation : onStartAnimation}
          className={isAnimating ? 'active' : ''}
        >
          {isAnimating ? <FaPause /> : <FaPlay />}
          {isAnimating ? ' Pause' : ' Play'}
        </button>
        
        <div className="speed-control">
          <label>Speed:</label>
          <input 
            type="range" 
            min="0.5" 
            max="5" 
            step="0.5" 
            value={animationSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          />
          <span>{animationSpeed}x</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;