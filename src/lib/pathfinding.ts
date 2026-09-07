import { NODES, EDGES, MapNode, MapEdge } from '../data/campusMapData';

export interface RoutePath {
  nodes: MapNode[];
  edges: MapEdge[];
  totalDistance: number;
}

import { supabase } from './supabase';

export async function findRoute(startNodeId: string, endNodeId: string, requireAccessible: boolean = false): Promise<RoutePath | null> {
  let nodes: MapNode[] = [];
  let edges: MapEdge[] = [];
  try {
    const { data: nodesData, error: nodesError } = await supabase.from('campus_nodes').select('*');
    const { data: edgesData, error: edgesError } = await supabase.from('campus_edges').select('*');
    if (!nodesError && !edgesError && nodesData && edgesData && nodesData.length > 0) {
      // Map columns from db if necessary, assuming exact match for now
      nodes = nodesData as MapNode[];
      edges = edgesData as MapEdge[];
    } else {
      nodes = NODES;
      edges = EDGES;
    }
  } catch (err) {
    nodes = NODES;
    edges = EDGES;
  }
  const nodesMap = new Map<string, MapNode>(nodes.map(n => [n.id, n]));
  const adjacencyList = new Map<string, { to: string; edge: MapEdge }[]>();

  // Build Adjacency List
  nodes.forEach(n => adjacencyList.set(n.id, []));
  edges.forEach(edge => {
    if (requireAccessible && !edge.isAccessible) return; // Skip inaccessible edges if required
    
    // Graph is undirected for walking/stairs/elevators
    adjacencyList.get(edge.from)?.push({ to: edge.to, edge });
    adjacencyList.get(edge.to)?.push({ to: edge.from, edge: { ...edge, from: edge.to, to: edge.from } });
  });

  const startNode = nodesMap.get(startNodeId);
  const endNode = nodesMap.get(endNodeId);
  if (!startNode || !endNode) return null;

  // A* structures
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, { node: string; edge: MapEdge }>();
  
  nodes.forEach(n => {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  });
  
  gScore.set(startNodeId, 0);
  fScore.set(startNodeId, heuristic(startNode, endNode));

  const openSet = [startNodeId];

  while (openSet.length > 0) {
    // Find node with lowest fScore
    openSet.sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity));
    const current = openSet.shift()!;

    if (current === endNodeId) {
      return reconstructPath(cameFrom, current, nodesMap);
    }

    const neighbors = adjacencyList.get(current) || [];
    for (const { to, edge } of neighbors) {
      const tentativeG = (gScore.get(current) || Infinity) + edge.distance;
      if (tentativeG < (gScore.get(to) || Infinity)) {
        cameFrom.set(to, { node: current, edge });
        gScore.set(to, tentativeG);
        fScore.set(to, tentativeG + heuristic(nodesMap.get(to)!, endNode));
        if (!openSet.includes(to)) {
          openSet.push(to);
        }
      }
    }
  }

  return null; // No path found
}

function heuristic(a: MapNode, b: MapNode): number {
  // Simple heuristic: Manhattan distance on the same floor, plus heavy penalty for floor change
  const floorPenalty = a.floor !== b.floor ? 50 : 0;
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + floorPenalty;
}

function reconstructPath(cameFrom: Map<string, { node: string; edge: MapEdge }>, current: string, nodesMap: Map<string, MapNode>): RoutePath {
  const nodes: MapNode[] = [nodesMap.get(current)!];
  const edges: MapEdge[] = [];
  let totalDistance = 0;

  let curr = current;
  while (cameFrom.has(curr)) {
    const { node, edge } = cameFrom.get(curr)!;
    nodes.unshift(nodesMap.get(node)!);
    edges.unshift(edge);
    totalDistance += edge.distance;
    curr = node;
  }

  return { nodes, edges, totalDistance };
}

export function generateInstructions(path: RoutePath): { step: number; instruction: string; icon: string }[] {
  if (path.nodes.length <= 1) return [{ step: 1, instruction: 'You are already at the destination.', icon: 'map-pin' }];
  
  const steps: { step: number; instruction: string; icon: string }[] = [];
  let currentFloor = path.nodes[0].floor;
  
  for (let i = 0; i < path.edges.length; i++) {
    const edge = path.edges[i];
    const nextNode = path.nodes[i + 1];
    
    if (edge.type === 'walk') {
      steps.push({
        step: steps.length + 1,
        instruction: `Walk towards ${nextNode.type === 'corridor' ? 'the corridor' : 'the next room'}.`,
        icon: 'walk'
      });
    } else if (edge.type === 'stairs') {
      steps.push({
        step: steps.length + 1,
        instruction: `Take the stairs from ${currentFloor} to ${nextNode.floor}.`,
        icon: 'stairs'
      });
      currentFloor = nextNode.floor;
    } else if (edge.type === 'elevator') {
      steps.push({
        step: steps.length + 1,
        instruction: `Take the elevator from ${currentFloor} to ${nextNode.floor}.`,
        icon: 'accessibility'
      });
      currentFloor = nextNode.floor;
    }
  }
  
  steps.push({
    step: steps.length + 1,
    instruction: `Arrive at destination on ${currentFloor}.`,
    icon: 'map-pin'
  });
  
  return steps;
}
