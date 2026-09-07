import fs from 'fs';

let content = fs.readFileSync('src/components/mobile/MobileMap.tsx', 'utf8');

if (!content.includes('sathaye_floorplan.png')) {
  content = content.replace(
    /import \{ ROOMS, Floor \} from '\.\.\/\.\.\/data\/campusMapData';/,
    `import { ROOMS, Floor } from '../../data/campusMapData';\nimport mapImage from '../../assets/sathaye_floorplan.png';`
  );
  
  content = content.replace(
    /src="\/image\.png"/,
    `src={mapImage}`
  );
  
  content = content.replace(
    /Upload public\/image\.png/,
    `Upload src/assets/sathaye_floorplan.png`
  );
  
  fs.writeFileSync('src/components/mobile/MobileMap.tsx', content);
}
