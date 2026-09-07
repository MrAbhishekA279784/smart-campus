import fs from 'fs';

let content = fs.readFileSync('src/components/desktop/DesktopSectionViews.tsx', 'utf8');

content = content.replace(
  /Object\.entries\(canteenCart\)\.reduce\(\(sum: number, \[itemId, qty\]\)/g,
  'Object.entries(canteenCart).reduce((sum: number, [itemId, qty]: [string, any])'
);

content = content.replace(
  /Object\.entries\(breakdown\)\.map\(\(\[subject, stats\]\) => \{/g,
  'Object.entries(breakdown).map(([subject, stats]: [string, any]) => {'
);

fs.writeFileSync('src/components/desktop/DesktopSectionViews.tsx', content);
