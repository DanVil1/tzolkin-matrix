import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TimelineView = ({ sequence, onDaySelect, currentDay, isAnimating, animationSpeed }) => {
  const svgRef = useRef();
  const animationRef = useRef();
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    svg.selectAll('*').remove();
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Create scales
    const x = d3.scaleLinear()
      .domain([1, 260])
      .range([0, innerWidth]);
    
    const y = d3.scaleBand()
      .domain(d3.range(1, 14))
      .range([0, innerHeight])
      .padding(0.1);
    
    // Add axes
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x).ticks(13).tickFormat(d => `Day ${d}`));
    
    g.append('g')
      .call(d3.axisLeft(y).tickFormat(d => d));
    
    // Draw days
    sequence.forEach(day => {
      const dayGroup = g.append('g')
        .attr('transform', `translate(${x(day.dayOfCycle)}, ${y(day.number)})`)
        .on('click', () => onDaySelect(day));
      
      dayGroup.append('rect')
        .attr('width', 10)
        .attr('height', y.bandwidth())
        .attr('fill', day.color)
        .attr('stroke', currentDay?.dayOfCycle === day.dayOfCycle ? '#000' : 'none')
        .attr('stroke-width', 2);
      
      if (day.dayOfCycle % 20 === 1 || day.dayOfCycle === 260) {
        dayGroup.append('text')
          .attr('x', 15)
          .attr('y', y.bandwidth()/2)
          .attr('dominant-baseline', 'middle')
          .text(day.name)
          .attr('font-size', '10px')
          .attr('fill', '#333');
      }
    });
    
    // Highlight current day
    if (currentDay) {
      g.append('rect')
        .attr('x', x(currentDay.dayOfCycle) - 5)
        .attr('y', y(currentDay.number) - 5)
        .attr('width', 20)
        .attr('height', y.bandwidth() + 10)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,3');
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
    <div className="timeline-view-container">
      <svg ref={svgRef} width="1000" height="400" viewBox="0 0 1000 400"></svg>
    </div>
  );
};

export default TimelineView;