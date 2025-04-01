import '../../styles/InfoPanel.css';

const InfoPanel = ({ day, daySigns }) => {
  if (!day) {
    return (
      <div className="info-panel">
        <h3>Welcome to Tzolk'in Explorer</h3>
        <p>Click on any day to see details about it</p>
        <div className="day-signs-grid">
          {daySigns.map(sign => (
            <div key={sign.name} className="day-sign-card" style={{ backgroundColor: sign.color }}>
              <h4>{sign.name}</h4>
              <p>{sign.meaning}</p>
              <small>Direction: {sign.direction}</small>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="info-panel">
      <h3>Day {day.dayOfCycle} of 260</h3>
      <div className="day-details" style={{ backgroundColor: day.color }}>
        <h2>{day.number} {day.name}</h2>
        <p><strong>Meaning:</strong> {day.meaning}</p>
        <p><strong>Direction:</strong> {day.direction}</p>
        <p><strong>Color:</strong> {getColorName(day.color)}</p>
      </div>
      <div className="day-significance">
        <h4>Significance</h4>
        <p>{getDaySignificance(day)}</p>
      </div>
    </div>
  );
};

const getColorName = (hex) => {
  const colors = {
    '#f44336': 'Red',
    '#9e9e9e': 'White',
    '#2196f3': 'Blue',
    '#437a38': 'Green'
  };
  return colors[hex] || hex;
};

const getDaySignificance = (day) => {
  // Simplified interpretations - in reality Mayan day signs had complex meanings
  const meanings = {
    'Imix': 'Represents primordial energy and new beginnings.',
    'Ik': 'Associated with wind, breath, and spirit.',
    'Akbal': 'Symbolizes darkness, the underworld, and potential.',
    'Kan': 'Represents fertility, abundance, and growth.',
    'Chicchan': 'Connected to celestial serpents and life force.',
    'Cimi': 'Signifies transformation and the cycle of life and death.',
    'Manik': 'Associated with the deer and the hunt.',
    'Lamat': 'Represents Venus, the morning star, and artistic energy.',
    'Muluc': 'Connected to water and emotional purification.',
    'Oc': 'Symbolizes loyalty, the dog, and community.',
    'Chuen': 'Represents creativity, the monkey, and playfulness.',
    'Eb': 'Associated with the path, road, and human destiny.',
    'Ben': 'Symbolizes the reed, authority, and leadership.',
    'Ix': 'Connected to the jaguar, magic, and the earth.',
    'Men': 'Represents the eagle, vision, and higher perspective.',
    'Cib': 'Associated with wisdom, the owl, and ancient knowledge.',
    'Caban': 'Symbolizes the earth, movement, and earthquakes.',
    'Etznab': 'Represents flint, truth, and clarity.',
    'Cauac': 'Connected to the storm, chaos, and transformation.',
    'Ahau': 'Represents the sun, enlightenment, and mastery.'
  };
  
  return meanings[day.name] || 'This day sign carries special significance in Mayan cosmology.';
};

export default InfoPanel;