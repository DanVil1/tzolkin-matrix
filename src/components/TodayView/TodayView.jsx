import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../../styles/TodayView.css';
import { daySigns } from '../../data/tzolkinData';

const TodayView = ({ today, matrix, sequence, onDaySelect }) => {

  console.log(today)

  const matrixRef = useRef();
  const circularRef = useRef();
  const spiralRef = useRef();
  const timelineRef = useRef();

  // ===== [FIX #1] SAFE MATRIX POSITION FINDER =====
  const findDayInMatrix = (matrix, day) => {
    if (!matrix || !day) return [-1, -1]; // Early return if invalid input
    
    for (let i = 0; i < matrix.length; i++) {
      if (!matrix[i]) continue;
      
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]?.dayOfCycle === day?.dayOfCycle) {
          return [i, j];
        }
      }
    }
    return [-1, -1];
  };

  // ===== [FIX #2] SAFE MATRIX RENDER =====
  useEffect(() => {
    if (!matrixRef.current || !today || !matrix) return;

    const cellSize = 30;
    const width = 20 * cellSize + cellSize * 2;
    const height = 13 * cellSize + cellSize * 2;

    const svg = d3.select(matrixRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#0e1619');

    svg.selectAll('*').remove();

    const grid = svg.append('g')
      .attr('transform', `translate(${cellSize}, ${cellSize * 1.5})`);

    // [FIX #3] SAFE TODAY POSITION FINDING
    const todayInMatrix = matrix.flat().find(d => d?.dayOfCycle === today?.dayOfCycle) || {};
    const [todayRow, todayCol] = findDayInMatrix(matrix, todayInMatrix);

    // Draw all cells
    matrix.forEach((row, i) => {
      row.forEach((day, j) => {
        if (!day) return; // Skip invalid days
        
        const isToday = i === todayRow && j === todayCol;
        
        grid.append('rect')
          .attr('x', j * cellSize)
          .attr('y', i * cellSize)
          .attr('width', cellSize - 2)
          .attr('height', cellSize - 2)
          .attr('rx', 4)
          .attr('fill', day.color || '#000000')
          .attr('stroke', isToday ? '#ff0' : 'none')
          .attr('stroke-width', isToday ? 3 : 0);

        // [FIX #4] ONLY ADD TEXT IF DAY IS VALID
        if (day.number && day.name) {
          grid.append('text')
            .attr('x', j * cellSize + cellSize/2)
            .attr('y', i * cellSize + cellSize/2 + 5)
            .attr('text-anchor', 'middle')
            .text(day.number)
            .attr('font-size', '14px')
            .attr('fill', d3.color(day.color)?.l < 0.6 ? '#fff' : '#000');
        }

        // Today's highlight
        if (isToday) {
          grid.append('rect')
            .attr('x', j * cellSize - 5)
            .attr('y', i * cellSize - 5)
            .attr('width', cellSize + 10)
            .attr('height', cellSize + 10)
            .attr('rx', 8)
            .attr('fill', 'none')
            .attr('stroke', '#ff0')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,3');
        }
      });
    });
  }, [today, matrix]);

  // ===== [FIX #5] SAFE CIRCULAR VIEW =====
  useEffect(() => {
    if (!circularRef.current || !today || !daySigns) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 30;

    const svg = d3.select(circularRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#0e1619');

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`);

    // Draw day signs
    daySigns.forEach((sign, i) => {
      const angle = (i * 2 * Math.PI / 20) - Math.PI/2;
      g.append('text')
        .attr('x', (radius + 20) * Math.cos(angle))
        .attr('y', (radius + 20) * Math.sin(angle))
        .attr('text-anchor', 'middle')
        .text(sign.name.substring(0, 3))
        .attr('fill', '#e0e0e0')
        .attr('font-size', '10px');
    });

    // Highlight today
    const todayAngle = ((today.dayOfCycle - 1) % 20) * 2 * Math.PI / 20 - Math.PI/2;
    g.append('circle')
      .attr('cx', radius * Math.cos(todayAngle))
      .attr('cy', radius * Math.sin(todayAngle))
      .attr('r', 15)
      .attr('fill', today.color || '#000')
      .attr('stroke', '#ff0')
      .attr('stroke-width', 2);
  }, [today]);

  // ===== [FIX #6] SAFE SPIRAL VIEW =====
  useEffect(() => {
    if (!spiralRef.current || !today || !sequence) return;

    const width = 300;
    const height = 300;
    const center = { x: width/2, y: height/2 };
    const maxRadius = Math.min(width, height) * 0.4;

    const svg = d3.select(spiralRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#0e1619');

    svg.selectAll('*').remove();

    // Draw spiral path
    const spiral = d3.lineRadial()
      .angle(d => (d.dayOfCycle * 2 * Math.PI / 20) - Math.PI/2)
      .radius(d => (d.dayOfCycle / 260) * maxRadius)
      .curve(d3.curveCardinal);

    svg.append('path')
      .datum(sequence)
      .attr('d', spiral)
      .attr('transform', `translate(${center.x}, ${center.y})`)
      .attr('fill', 'none')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1);

    // Highlight today
    const todayInSeq = sequence.find(d => d.dayOfCycle === today.dayOfCycle);
    if (todayInSeq) {
      const angle = (todayInSeq.dayOfCycle * 2 * Math.PI / 20) - Math.PI/2;
      const radius = (todayInSeq.dayOfCycle / 260) * maxRadius;
      
      svg.append('circle')
        .attr('cx', center.x + radius * Math.cos(angle))
        .attr('cy', center.y + radius * Math.sin(angle))
        .attr('r', 10)
        .attr('fill', todayInSeq.color || '#000')
        .attr('stroke', '#ff0')
        .attr('stroke-width', 2);
    }
  }, [today, sequence]);

  // ===== [FIX #7] SAFE TIMELINE VIEW =====
  useEffect(() => {
    if (!timelineRef.current || !today || !sequence) return;

    const width = 600;
    const height = 150;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = d3.select(timelineRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#0e1619');

    svg.selectAll('*').remove();

    const x = d3.scaleLinear()
      .domain([1, 260])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(d3.range(1, 14))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    // Draw days
    sequence.forEach(day => {
      if (!day) return;
      
      const isToday = day.dayOfCycle === today.dayOfCycle;
      svg.append('rect')
        .attr('x', x(day.dayOfCycle))
        .attr('y', y(day.number))
        .attr('width', 8)
        .attr('height', y.bandwidth())
        .attr('fill', day.color || '#000')
        .attr('stroke', isToday ? '#ff0' : 'none')
        .attr('stroke-width', isToday ? 2 : 0);
    });

    // Highlight today
    svg.append('rect')
      .attr('x', x(today.dayOfCycle) - 6)
      .attr('y', y(today.number) - 6)
      .attr('width', 20)
      .attr('height', y.bandwidth() + 12)
      .attr('fill', 'none')
      .attr('stroke', '#ff0')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,3');
  }, [today, sequence]);

  // ===== [FIX #8] LOADING STATE =====
  if (!today) {
    return (
      <div className="today-container">
        <div className="today-header">
          <h2>Loading today's date...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="today-container">
      <div className="today-header">
        <h2>Today is {today.number} {today.name}</h2>
        <p>Day {today.dayOfCycle} of 260</p>
      </div>
      

      
      <div className="today-description">
        <h3>Significance</h3>
        <p>{today.meaning || 'No interpretation available'}</p>
        <p><strong>Direction:</strong> {today.direction || 'Unknown'}</p>
        <p><strong>Color Meaning:</strong> {getColorMeaning(today.color)}</p>
      </div>
    </div>
  );
};

// ===== [FIX #9] SAFE COLOR INTERPRETATION =====
const getColorMeaning = (color) => {
  const colors = {
    '#f44336': 'Red - Represents energy and action',
    '#9e9e9e': 'White - Represents spirit and clarity',
    '#2196f3': 'Blue - Represents wisdom and intuition',
    '#437a38': 'Green - Represents intelligence and creativity'
  };
  return colors[color] || 'Unknown color meaning';
};


export default TodayView;