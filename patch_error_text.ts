import fs from 'fs';

// Replace error text again to make it clear for public/
let desktopContent = fs.readFileSync('src/components/desktop/DesktopFullMapModal.tsx', 'utf8');
desktopContent = desktopContent.replace(/Upload it into the <strong>src\/assets<\/strong> folder\./g, 'Upload it into the <strong>public</strong> folder.');
fs.writeFileSync('src/components/desktop/DesktopFullMapModal.tsx', desktopContent);

let mobileContent = fs.readFileSync('src/components/mobile/MobileMap.tsx', 'utf8');
mobileContent = mobileContent.replace(/Upload to src\/assets\/sathaye_floorplan\.png/g, 'Upload to public/sathaye_floorplan.png');
fs.writeFileSync('src/components/mobile/MobileMap.tsx', mobileContent);
