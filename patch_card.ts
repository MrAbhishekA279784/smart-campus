import fs from 'fs';

let content = fs.readFileSync('src/components/desktop/CampusMapCard.tsx', 'utf8');

// Add the import
if (!content.includes('sathaye_floorplan.png')) {
  content = content.replace(
    /import \{ ROOMS, Room \} from '\.\.\/\.\.\/data\/campusMapData';/,
    `import { ROOMS, Room } from '../../data/campusMapData';\nimport mapImage from '../../assets/sathaye_floorplan.png';`
  );
  
  // Update the src
  content = content.replace(
    /src="\/image\.png"/,
    `src={mapImage}`
  );
  
  fs.writeFileSync('src/components/desktop/CampusMapCard.tsx', content);
}
