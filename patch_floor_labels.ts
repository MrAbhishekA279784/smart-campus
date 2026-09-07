import fs from 'fs';

let content = fs.readFileSync('src/data/campusMapData.ts', 'utf8');

if (!content.includes('FLOOR_LABELS')) {
  content += `\n\nexport const FLOOR_LABELS: Record<Floor, string> = {
  GF: 'Ground Floor',
  '1F': 'First Floor',
  '2F': 'Second Floor',
  '3F': 'Third Floor'
};\n`;
  fs.writeFileSync('src/data/campusMapData.ts', content);
}
