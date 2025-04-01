import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CircularView = ({ sequence, onDaySelect, currentDay, isAnimating, animationSpeed }) => {
  const svgRef = useRef();
  const animationRef = useRef();
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const radius = Math.min(width, height) / 2 - 40;
    
    svg.selectAll('*').remove();
    
    const g = svg.append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`);
    
    // Draw day signs in outer circle
    const daySignAngle = (2 * Math.PI) / 20;
    sequence.slice(0, 20).forEach((day, i) => {
      const angle = i * daySignAngle - Math.PI/2;
      g.append('text')
        .attr('x', (radius + 30) * Math.cos(angle))
        .attr('y', (radius + 30) * Math.sin(angle))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(day.name)
        .attr('fill', day.color)
        .attr('font-size', '12px');
      
      g.append('line')
        .attr('x1', radius * Math.cos(angle))
        .attr('y1', radius * Math.sin(angle))
        .attr('x2', (radius + 20) * Math.cos(angle))
        .attr('y2', (radius + 20) * Math.sin(angle))
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);
    });
    
    // Draw numbers in spiral pattern
    const spiralRadiusStep = radius / 260;
    sequence.forEach((day, i) => {
      const angle = (i * daySignAngle) - Math.PI/2;
      const spiralRadius = i * spiralRadiusStep;
      
      const dayGroup = g.append('g')
        .attr('transform', `translate(${spiralRadius * Math.cos(angle)}, ${spiralRadius * Math.sin(angle)})`)
        .on('click', () => onDaySelect(day));
      
      dayGroup.append('circle')
        .attr('r', 10)
        .attr('fill', day.color)
        .attr('stroke', currentDay?.dayOfCycle === day.dayOfCycle ? '#000' : 'none')
        .attr('stroke-width', 2);
      
      dayGroup.append('text')
        .attr('y', 4)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(day.number)
        .attr('font-size', '10px')
        .attr('fill', d3.color(day.color).l < 0.6 ? '#fff' : '#000');
    });
    
    // Highlight current day
    if (currentDay) {
      const dayIndex = sequence.findIndex(d => d.dayOfCycle === currentDay.dayOfCycle);
      if (dayIndex !== -1) {
        const angle = (dayIndex * daySignAngle) - Math.PI/2;
        const spiralRadius = dayIndex * spiralRadiusStep;
        
        g.append('circle')
          .attr('cx', spiralRadius * Math.cos(angle))
          .attr('cy', spiralRadius * Math.sin(angle))
          .attr('r', 15)
          .attr('fill', 'none')
          .attr('stroke', '#000')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,3');
      }
    }
  }, [sequence, currentDay]);
  
  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        const day = sequence[currentIndexRef.current % 260];
        onDaySelect(day);
        currentIndexRef.current++;
        animationRef.current = setTimeout(animate, 1000 / animationSpeed);
      };
      animate();
    } else {
      clearTimeout(animationRef.current);
    }
    
    return () => clearTimeout(animationRef.current);
  }, [isAnimating, animationSpeed]);
  
  return (
    <div className="circular-view-container">
      <svg ref={svgRef} width="800" height="800" viewBox="0 0 800 800"></svg>
    </div>
  );
};

export default CircularView;