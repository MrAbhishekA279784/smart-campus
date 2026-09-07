import fs from 'fs';

let content = fs.readFileSync('src/components/desktop/DesktopFullMapModal.tsx', 'utf8');

content = content.replace(
  /const handleNavigate = \(\) => \{/,
  `const handleNavigate = async () => {`
);

content = content.replace(
  /const calculatedRoute = findRoute\(/,
  `const calculatedRoute = await findRoute(`
);

fs.writeFileSync('src/components/desktop/DesktopFullMapModal.tsx', content);
