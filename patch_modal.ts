import fs from 'fs';

let content = fs.readFileSync('src/components/desktop/DesktopFullMapModal.tsx', 'utf8');

if (!content.includes('sathaye_floorplan.png')) {
  content = content.replace(
    /import \{ CampusMapRouteOverlay \} from '\.\/CampusMapRouteOverlay';/,
    `import { CampusMapRouteOverlay } from './CampusMapRouteOverlay';\nimport mapImage from '../../assets/sathaye_floorplan.png';`
  );
  
  // Replace the image src and the missing file message text
  content = content.replace(
    /src="\/image\.png"/,
    `src={mapImage}`
  );
  
  content = content.replace(
    /because <strong>image\.png<\/strong> is missing from the public folder\./,
    `because <strong>sathaye_floorplan.png</strong> is missing or not a valid image.`
  );
  
  content = content.replace(
    /Upload it into the <strong>public<\/strong> folder\./,
    `Upload it into the <strong>src/assets</strong> folder.`
  );
  
  content = content.replace(
    /named exactly <strong>image\.png<\/strong>\./,
    `named exactly <strong>sathaye_floorplan.png</strong>.`
  );
  
  fs.writeFileSync('src/components/desktop/DesktopFullMapModal.tsx', content);
}
