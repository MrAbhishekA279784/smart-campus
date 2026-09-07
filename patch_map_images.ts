import fs from 'fs';

// 1. CampusMapCard.tsx
let cardContent = fs.readFileSync('src/components/desktop/CampusMapCard.tsx', 'utf8');
cardContent = cardContent.replace(/import mapImage from '\.\.\/\.\.\/assets\/sathaye_floorplan\.png';\n/, '');
cardContent = cardContent.replace(/src=\{mapImage\}/g, 'src="/sathaye_floorplan.png"');
cardContent = cardContent.replace(/public\/image\.png/g, 'public/sathaye_floorplan.png');
fs.writeFileSync('src/components/desktop/CampusMapCard.tsx', cardContent);

// 2. DesktopFullMapModal.tsx
let desktopContent = fs.readFileSync('src/components/desktop/DesktopFullMapModal.tsx', 'utf8');
desktopContent = desktopContent.replace(/import mapImage from '\.\.\/\.\.\/assets\/sathaye_floorplan\.png';\n/, '');
desktopContent = desktopContent.replace(/src=\{mapImage\}/g, 'src="/sathaye_floorplan.png"');
desktopContent = desktopContent.replace(/src\/assets/g, 'public');
fs.writeFileSync('src/components/desktop/DesktopFullMapModal.tsx', desktopContent);

// 3. MobileMap.tsx
let mobileContent = fs.readFileSync('src/components/mobile/MobileMap.tsx', 'utf8');
mobileContent = mobileContent.replace(/import mapImage from '\.\.\/\.\.\/assets\/sathaye_floorplan\.png';\n/, '');
mobileContent = mobileContent.replace(/src=\{mapImage\}/g, 'src="/sathaye_floorplan.png"');
mobileContent = mobileContent.replace(/src\/assets/g, 'public');
fs.writeFileSync('src/components/mobile/MobileMap.tsx', mobileContent);
