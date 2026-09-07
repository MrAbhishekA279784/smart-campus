import fs from 'fs';

let content = fs.readFileSync('src/components/mobile/MobileMap.tsx', 'utf8');

if (!content.includes('onError={() => setImgError(true)}')) {
    content = content.replace(
        /<img\n\s*src=\{mapImage\}\n\s*alt="Sathaye College 2D Floor Plan"\n\s*className="w-full h-full object-fill opacity-90"\n\s*\/>/m,
        `<img
              src={mapImage}
              alt="Sathaye College 2D Floor Plan"
              className="w-full h-full object-fill opacity-90"
              onError={() => setImgError(true)}
            />`
    );
    fs.writeFileSync('src/components/mobile/MobileMap.tsx', content);
}
