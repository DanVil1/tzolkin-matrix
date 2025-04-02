// src/components/FractalView/FractalView.jsx
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './FractalView.css';

const HyperTorus = ({ sequence }) => {
  const groupRef = useRef();
  const lineRef = useRef();

  // Generate 3D positions for each day in the sequence
  const generateDayPositions = (days) => {
    return days.map((_, index) => {
      // Use index to calculate positions (since we don't need day properties here)
      const u = (index / 13) * Math.PI * 2;  // 13-day cycle
      const v = (index / 20) * Math.PI * 2;  // 20-day cycle
      const R = 2;  // Major radius
      const r = 0.5; // Minor radius
      
      return new THREE.Vector3(
        (R + r * Math.cos(u)) * Math.cos(v),
        (R + r * Math.cos(u)) * Math.sin(v),
        r * Math.sin(u)
      );
    });
  };

  // Animation loop
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  // Create the torus and path
  useEffect(() => {
    const points = generateDayPositions(sequence);
    
    // Create the torus knot path
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xFFD966 });
    lineRef.current = new THREE.Line(geometry, material);
    groupRef.current.add(lineRef.current);

    // Create the wireframe torus
    const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x6FA8DC, 
      wireframe: true 
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    groupRef.current.add(torus);

    return () => {
      // Cleanup
      groupRef.current.remove(lineRef.current);
      groupRef.current.remove(torus);
      geometry.dispose();
      material.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
    };
  }, [sequence]);

  return <group ref={groupRef} />;
};

const FractalView = ({ sequence }) => {
  return (
    <div className="fractal-view">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <HyperTorus sequence={sequence} />
      </Canvas>
      <div className="fractal-legend">
        <div><span style={{ background: '#6FA8DC' }}></span> 13-day cycle</div>
        <div><span style={{ background: '#FFD966' }}></span> 20-day cycle</div>
      </div>
    </div>
  );
};

export default FractalView;