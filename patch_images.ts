import fs from 'fs';

let cardContent = fs.readFileSync('src/components/desktop/CampusMapCard.tsx', 'utf8');
cardContent = cardContent.replace(
  /onError=\{\(e\) => \{\n\s*\(e\.target as HTMLImageElement\)\.src = 'https:\/\/images\.unsplash\.com.*?';\n\s*\}\}/,
  ''
);
fs.writeFileSync('src/components/desktop/CampusMapCard.tsx', cardContent);

let modalContent = fs.readFileSync('src/components/desktop/DesktopFullMapModal.tsx', 'utf8');
modalContent = modalContent.replace(
  /onError=\{\(e\) => \{\n\s*\/\/ Fallback visually if image\.png is not loaded\n\s*\(e\.target as HTMLImageElement\)\.src = 'https:\/\/images\.unsplash\.com.*?';\n\s*\}\}/,
  ''
);
fs.writeFileSync('src/components/desktop/DesktopFullMapModal.tsx', modalContent);

