import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MatrixView = ({ 
  matrix, 
  sequence,
  onDaySelect, 
  currentDay, 
  isAnimating,
  animationSpeed
}) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const animationRef = useRef();
  const currentIndexRef = useRef(0);
  const highlightRef = useRef(null);

  useEffect(() => {
    const drawMatrix = () => {
      if (!containerRef.current) return;

      const cellSize = 80; // Fixed cell size
      const matrixWidth = matrix[0].length * cellSize + cellSize * 2;
      const matrixHeight = matrix.length * cellSize + cellSize * 2;
      
      const svg = d3.select(svgRef.current)
        .attr('width', matrixWidth)
        .attr('height', matrixHeight)
        .style('min-width', `${matrixWidth}px`)
        .style('min-height', `${matrixHeight}px`);

      svg.selectAll('*').remove();
      
      const grid = svg.append('g')
        .attr('transform', `translate(${cellSize}, ${cellSize * 1.5})`);

      // Store cell references for animation
      const cells = {};
      
      // Draw matrix
      matrix.forEach((row, i) => {
        row.forEach((day, j) => {
          cells[day.dayOfCycle] = { i, j, cellSize };
          
          const cell = grid.append('g')
            .attr('transform', `translate(${j * cellSize}, ${i * cellSize})`)
            .on('click', () => onDaySelect(day));
          
          cell.append('rect')
            .attr('width', cellSize - 4)
            .attr('height', cellSize - 4)
            .attr('rx', 4)
            .attr('fill', day.color)
            .attr('stroke', currentDay?.dayOfCycle === day.dayOfCycle ? '#fff' : 'none')
            .attr('stroke-width', 2);
          
          cell.append('text')
            .attr('x', cellSize/2)
            .attr('y', cellSize/2 + 5)
            .attr('text-anchor', 'middle')
            .text(day.number)
            .attr('font-size', '14px')
            .attr('fill', d3.color(day.color).l < 0.6 ? '#fff' : '#000');
        });
      });

      // Draw highlight for current day
      const updateHighlight = (day) => {
        if (highlightRef.current) highlightRef.current.remove();
        
        if (day && cells[day.dayOfCycle]) {
          const { i, j, cellSize } = cells[day.dayOfCycle];
          highlightRef.current = grid.append('rect')
            .attr('x', j * cellSize - cellSize * 0.15)
            .attr('y', i * cellSize - cellSize * 0.15)
            .attr('width', cellSize * 1.2)
            .attr('height', cellSize * 1.2)
            .attr('rx', cellSize * 0.3)
            .attr('fill', 'none')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,3')
            .node();
        }
      };

      updateHighlight(currentDay);
    };

    drawMatrix();
    window.addEventListener('resize', drawMatrix);
    return () => window.removeEventListener('resize', drawMatrix);
  }, [matrix, currentDay]);

  // Animation effect - FIXED VERSION
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        const day = sequence[currentIndexRef.current % 260];
        onDaySelect(day); // This updates currentDay which triggers the highlight
        
        // Force immediate visual update
        const svg = d3.select(svgRef.current);
        if (highlightRef.current) highlightRef.current.remove();
        
        const cellSize = 80;
        const i = day.number - 1;
        const j = (day.dayOfCycle - 1) % 20;
        
        highlightRef.current = svg.select('g')
          .append('rect')
            .attr('x', j * cellSize - cellSize * 0.15 + cellSize)
            .attr('y', i * cellSize - cellSize * 0.15 + cellSize * 1.5)
            .attr('width', cellSize * 1.2)
            .attr('height', cellSize * 1.2)
            .attr('rx', cellSize * 0.3)
            .attr('fill', 'none')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,3')
            .node();

        currentIndexRef.current = (currentIndexRef.current + 1) % 260;
        animationRef.current = setTimeout(animate, 1000 / animationSpeed);
      };
      animate();
    } else {
      clearTimeout(animationRef.current);
    }

    return () => {
      clearTimeout(animationRef.current);
    };
  }, [isAnimating, animationSpeed, sequence, onDaySelect]);

  return (
    <div className="matrix-container" ref={containerRef}>
      <svg ref={svgRef} className="matrix-svg"></svg>
    </div>
  );
};


export default MatrixView;