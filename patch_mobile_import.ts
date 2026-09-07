import fs from 'fs';

let content = fs.readFileSync('src/components/mobile/MobileMap.tsx', 'utf8');

if (!content.includes("mapImage from")) {
  content = content.replace(
    /import \{ MapLocation \} from '\.\.\/\.\.\/types';/,
    `import { MapLocation } from '../../types';\nimport mapImage from '../../assets/sathaye_floorplan.png';`
  );
  
  content = content.replace(
    /src="\/image\.png"/,
    `src={mapImage}`
  );
  
  fs.writeFileSync('src/components/mobile/MobileMap.tsx', content);
}
