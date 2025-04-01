import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SpiralView = ({ sequence, onDaySelect, currentDay, isAnimating, animationSpeed }) => {
  const svgRef = useRef();
  const animationRef = useRef();
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const center = { x: width/2, y: height/2 };
    const maxRadius = Math.min(width, height) * 0.45;
    
    svg.selectAll('*').remove();
    
    // Create spiral layout
    const spiral = d3.lineRadial()
      .angle(d => (d.dayOfCycle * 2 * Math.PI / 20) - Math.PI/2)
      .radius(d => (d.dayOfCycle / 260) * maxRadius)
      .curve(d3.curveCardinal);
    
    // Draw spiral path
    svg.append('path')
      .datum(sequence)
      .attr('d', spiral)
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1)
      .attr('transform', `translate(${center.x}, ${center.y})`);
    
    // Draw days along the spiral
    sequence.forEach(day => {
      const angle = (day.dayOfCycle * 2 * Math.PI / 20) - Math.PI/2;
      const radius = (day.dayOfCycle / 260) * maxRadius;
      
      const dayGroup = svg.append('g')
        .attr('transform', `translate(${center.x + radius * Math.cos(angle)}, ${center.y + radius * Math.sin(angle)})`)
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
        const angle = (currentDay.dayOfCycle * 2 * Math.PI / 20) - Math.PI/2;
        const radius = (currentDay.dayOfCycle / 260) * maxRadius;
        
        svg.append('circle')
          .attr('cx', center.x + radius * Math.cos(angle))
          .attr('cy', center.y + radius * Math.sin(angle))
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
    <div className="spiral-view-container">
      <svg ref={svgRef} width="800" height="800" viewBox="0 0 800 800"></svg>
    </div>
  );
};

export default SpiralView;