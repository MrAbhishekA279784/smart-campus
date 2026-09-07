import fs from 'fs';

let content = fs.readFileSync('src/lib/pathfinding.ts', 'utf8');

content = content.replace(
  /export function findRoute\(/,
  `import { supabase } from './supabase';\n\nexport async function findRoute(`
);

// We need to inject the fetch logic right after the function declaration.
content = content.replace(
  /export async function findRoute\(startNodeId: string, endNodeId: string, requireAccessible: boolean = false\): RoutePath \| null \{/,
  `export async function findRoute(startNodeId: string, endNodeId: string, requireAccessible: boolean = false): Promise<RoutePath | null> {
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
  }`
);

// Replace all subsequent uses of NODES and EDGES inside the function with `nodes` and `edges`
content = content.replace(/const nodesMap = new Map<string, MapNode>\(NODES/g, 'const nodesMap = new Map<string, MapNode>(nodes');
content = content.replace(/NODES\.forEach/g, 'nodes.forEach');
content = content.replace(/EDGES\.forEach/g, 'edges.forEach');

fs.writeFileSync('src/lib/pathfinding.ts', content);
