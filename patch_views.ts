import fs from 'fs';

let content = fs.readFileSync('src/components/desktop/DesktopSectionViews.tsx', 'utf8');

content = content.replace(
  /const cartTotal = Object\.entries\(canteenCart\)\.reduce\(\(sum, \[itemId, qty\]\) => \{/g,
  'const cartTotal = Object.entries(canteenCart).reduce((sum: number, [itemId, qty]) => {'
);

content = content.replace(
  /const items = Object\.entries\(canteenCart\)\.map\(\(\[itemId, quantity\]\) => \(\{ itemId, quantity \}\)\);/g,
  'const items = Object.entries(canteenCart).map(([itemId, quantity]) => ({ itemId, quantity: quantity as number }));'
);

content = content.replace(
  /Object\.values\(attendance\)\.reduce\(\(acc: any, curr: any\) => acc \+ curr\.total, 0\)/g,
  'Object.values(attendance).reduce((acc: number, curr: any) => acc + curr.total, 0)'
);

content = content.replace(
  /Object\.values\(attendance\)\.reduce\(\(acc: any, curr: any\) => acc \+ curr\.present, 0\)/g,
  'Object.values(attendance).reduce((acc: number, curr: any) => acc + curr.present, 0)'
);

content = content.replace(
  /Object\.values\(canteenCart\)\.reduce\(\(a, b\) => a \+ b, 0\)/g,
  'Object.values(canteenCart).reduce((a: number, b: number) => a + b, 0)'
);

content = content.replace(
  /Object\.values\(attendance\)\.reduce\(\(acc, curr: any\) => acc \+ curr\.total, 0\)/g,
  'Object.values(attendance).reduce((acc: number, curr: any) => acc + curr.total, 0)'
);

content = content.replace(
  /Object\.values\(attendance\)\.reduce\(\(acc, curr: any\) => acc \+ curr\.present, 0\)/g,
  'Object.values(attendance).reduce((acc: number, curr: any) => acc + curr.present, 0)'
);

fs.writeFileSync('src/components/desktop/DesktopSectionViews.tsx', content);
