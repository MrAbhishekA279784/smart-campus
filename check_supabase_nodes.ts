import { supabase } from './src/lib/supabase';

async function test() {
  const { data: nodes, error: nErr } = await supabase.from('campus_nodes').select('*');
  const { data: edges, error: eErr } = await supabase.from('campus_edges').select('*');
  console.log('Nodes count:', nodes?.length, 'Error:', nErr);
  console.log('Edges count:', edges?.length, 'Error:', eErr);
  if (nodes && nodes.length > 0) {
    console.log('Sample node floors:', Array.from(new Set(nodes.map(n => n.floor))));
  }
}
test();
