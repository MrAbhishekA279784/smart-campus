import fs from 'fs';

let content = fs.readFileSync('src/components/mobile/MobileMap.tsx', 'utf8');

content = content.replace(
    /const \[searchQuery, setSearchQuery\] = useState\(''\);/,
    `const [searchQuery, setSearchQuery] = useState('');\n  const [imgError, setImgError] = useState(false);`
);
fs.writeFileSync('src/components/mobile/MobileMap.tsx', content);
