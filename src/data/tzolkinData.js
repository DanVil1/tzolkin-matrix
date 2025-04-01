export const daySigns = [
  { name: 'Imix', meaning: 'Crocodile', direction: 'East', color: '#f44336' },
  { name: 'Ik', meaning: 'Wind', direction: 'North', color: '#9e9e9e' },
  { name: 'Akbal', meaning: 'Night', direction: 'West', color: '#2196f3' },
  { name: 'Kan', meaning: 'Lizard', direction: 'South', color: '#437a38' },
  { name: 'Chicchan', meaning: 'Serpent', direction: 'East', color: '#f44336' },
  { name: 'Cimi', meaning: 'Death', direction: 'North', color: '#9e9e9e' },
  { name: 'Manik', meaning: 'Deer', direction: 'West', color: '#2196f3' },
  { name: 'Lamat', meaning: 'Rabbit', direction: 'South', color: '#437a38' },
  { name: 'Muluc', meaning: 'Water', direction: 'East', color: '#f44336' },
  { name: 'Oc', meaning: 'Dog', direction: 'North', color: '#9e9e9e' },
  { name: 'Chuen', meaning: 'Monkey', direction: 'West', color: '#2196f3' },
  { name: 'Eb', meaning: 'Grass', direction: 'South', color: '#437a38' },
  { name: 'Ben', meaning: 'Reed', direction: 'East', color: '#f44336' },
  { name: 'Ix', meaning: 'Jaguar', direction: 'North', color: '#9e9e9e' },
  { name: 'Men', meaning: 'Eagle', direction: 'West', color: '#2196f3' },
  { name: 'Cib', meaning: 'Owl', direction: 'South', color: '#437a38' },
  { name: 'Caban', meaning: 'Earth', direction: 'East', color: '#f44336' },
  { name: 'Etznab', meaning: 'Flint', direction: 'North', color: '#9e9e9e' },
  { name: 'Cauac', meaning: 'Storm', direction: 'West', color: '#2196f3' },
  { name: 'Ahau', meaning: 'Sun', direction: 'South', color: '#437a38' }
];

const TZOLKIN_EPOCH = new Date(Date.UTC(2025, 2, 31));

export const generateTzolkinMatrix = () => {
  const matrix = [];
  for (let i = 0; i < 13; i++) {
    matrix[i] = [];
    for (let j = 0; j < 20; j++) {
      const number = (i + j * 13) % 13 + 1;
      const daySign = daySigns[(i + j * 13) % 20];
      matrix[i][j] = { number, ...daySign };
    }
  }
  return matrix;
};

export const generateTzolkinSequence = () => {
  const sequence = [];
  for (let i = 0; i < 260; i++) {
    const number = i % 13 + 1;
    const daySign = daySigns[i % 20];
    sequence.push({ number, ...daySign, dayOfCycle: i + 1 });
  }
  return sequence;
};

export const getCurrentTzolkinDate = () => {
  const today = new Date();
  const utcToday = new Date(Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ));
  

  const diffDays = Math.floor((utcToday - TZOLKIN_EPOCH) / (1000 * 60 * 60 * 24));
  const dayNumber = ((diffDays % 13) + 12) % 13 + 1;
  const daySignIndex = (diffDays + 19) % 20;
  const daySign = daySigns[daySignIndex];
  const dayOfCycle = (diffDays % 260 + 260) % 260 + 1;

  return {
    number: dayNumber,
    name: daySign.name,
    meaning: daySign.meaning,
    direction: daySign.direction,
    color: daySign.color,
    dayOfCycle
  };
};