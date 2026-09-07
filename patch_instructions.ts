import fs from 'fs';

// DesktopFullMapModal.tsx
let desktopContent = fs.readFileSync('src/components/desktop/DesktopFullMapModal.tsx', 'utf8');
desktopContent = desktopContent.replace(
  /const \[instructions, setInstructions\] = useState<\{instruction: string, node: string\}\[\]>\(\[\]\);/,
  `const [instructions, setInstructions] = useState<any[]>([]);`
);
fs.writeFileSync('src/components/desktop/DesktopFullMapModal.tsx', desktopContent);

// MobileMap.tsx
let mobileContent = fs.readFileSync('src/components/mobile/MobileMap.tsx', 'utf8');
mobileContent = mobileContent.replace(
  /const \[instructions, setInstructions\] = useState<\{instruction: string, node: string\}\[\]>\(\[\]\);/,
  `const [instructions, setInstructions] = useState<any[]>([]);`
);
fs.writeFileSync('src/components/mobile/MobileMap.tsx', mobileContent);
