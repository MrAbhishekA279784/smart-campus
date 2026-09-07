import React from 'react';
import { Floor } from '../../data/campusMapData';
import { RoutePath } from '../../lib/pathfinding';

interface CampusMapRouteOverlayProps {
  route: RoutePath | null;
  activeFloor: Floor;
}

export const CampusMapRouteOverlay: React.FC<CampusMapRouteOverlayProps> = ({ route, activeFloor }) => {
  if (!route) return null;

  // Group consecutive nodes on the same floor into separate SVG polylines
  const polylines: string[] = [];
  let currentPoints: string[] = [];

  route.nodes.forEach((node) => {
    if (node.floor === activeFloor) {
      // SVG viewBox is set to 0 0 100 100, so percentages map directly to standard coordinates
      currentPoints.push(`${node.x},${node.y}`);
    } else {
      if (currentPoints.length > 1) {
        polylines.push(currentPoints.join(' '));
      }
      currentPoints = [];
    }
  });
  
  if (currentPoints.length > 1) {
    polylines.push(currentPoints.join(' '));
  }

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-10" 
      style={{ overflow: 'visible', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }} 
      preserveAspectRatio="none" 
      viewBox="0 0 100 100"
    >
      {polylines.map((points, idx) => (
        <polyline
          key={`poly-${idx}`}
          points={points}
          fill="none"
          stroke="#2563eb"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1.5, 1"
          className="animate-pulse"
        />
      ))}
      
      {/* Node Markers */}
      {route.nodes.map((node, i) => {
        if (node.floor === activeFloor) {
          const isStart = i === 0;
          const isEnd = i === route.nodes.length - 1;
          return (
            <circle
              key={`node-${i}`}
              cx={`${node.x}`}
              cy={`${node.y}`}
              r={isStart || isEnd ? "1.5" : "0.6"}
              fill={isStart ? "#10b981" : isEnd ? "#ef4444" : "#ffffff"}
              stroke={isStart || isEnd ? "#ffffff" : "#2563eb"}
              strokeWidth="0.2"
            />
          );
        }
        return null;
      })}
    </svg>
  );
};
