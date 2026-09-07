import fs from 'fs';

let content = fs.readFileSync('src/components/desktop/DesktopFullMapModal.tsx', 'utf8');

if (!content.includes('onError={() => setImgError(true)}')) {
    content = content.replace(
        /src=\{mapImage\}\n\s*alt="Sathaye College Floor Plan"/,
        `src={mapImage}\n                  alt="Sathaye College Floor Plan"\n                  onError={() => setImgError(true)}`
    );
    fs.writeFileSync('src/components/desktop/DesktopFullMapModal.tsx', content);
}
