import fs from 'fs';

let cardContent = fs.readFileSync('src/components/desktop/CampusMapCard.tsx', 'utf8');

// Replace the img tag with one that handles error state
cardContent = cardContent.replace(
  /<img\n\s*src="\/image\.png"\n\s*alt="Sathaye College Ground Floor"\n\s*className="w-full h-full object-fill opacity-90"\n\s*\/>/m,
  `{!imgError ? (
            <img
              src="/image.png"
              alt="Sathaye College Ground Floor"
              className="w-full h-full object-fill opacity-90"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-center p-4">
              <p className="text-xs font-bold text-slate-500">Image not found</p>
              <p className="text-[10px] text-slate-400 mt-1">Please upload the floor-plan to public/image.png</p>
            </div>
          )}`
);

// Add imgError state to CampusMapCard
cardContent = cardContent.replace(
  /const \[selectedLoc, setSelectedLoc\] = useState<Room \| null>\(floorRooms\[0\]\);/,
  `const [selectedLoc, setSelectedLoc] = useState<Room | null>(floorRooms[0]);\n  const [imgError, setImgError] = useState(false);`
);

fs.writeFileSync('src/components/desktop/CampusMapCard.tsx', cardContent);

let modalContent = fs.readFileSync('src/components/desktop/DesktopFullMapModal.tsx', 'utf8');

modalContent = modalContent.replace(
  /<img\n\s*src="\/image\.png"\n\s*alt="Sathaye College Floor Plan"\n\s*className="w-full h-full object-fill opacity-90"\n\s*\/>/m,
  `{!imgError ? (
                <img
                  src="/image.png"
                  alt="Sathaye College Floor Plan"
                  className="w-full h-full object-fill opacity-90"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-center p-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-sm">
                    <h3 className="font-bold text-slate-800 mb-2">Missing Floor-Plan Image</h3>
                    <p className="text-sm text-slate-600 mb-4">The map cannot render because <strong>image.png</strong> is missing from the public folder.</p>
                    <ol className="text-xs text-slate-500 text-left list-decimal pl-4 space-y-2">
                      <li>Download the floor-plan you attached in the chat.</li>
                      <li>Open the Code Editor file explorer on the left.</li>
                      <li>Upload it into the <strong>public</strong> folder.</li>
                      <li>Make sure it is named exactly <strong>image.png</strong>.</li>
                    </ol>
                  </div>
                </div>
              )}`
);

modalContent = modalContent.replace(
  /const \[isNavigating, setIsNavigating\] = useState\(false\);/,
  `const [isNavigating, setIsNavigating] = useState(false);\n  const [imgError, setImgError] = useState(false);`
);

fs.writeFileSync('src/components/desktop/DesktopFullMapModal.tsx', modalContent);

let mobileContent = fs.readFileSync('src/components/mobile/MobileMap.tsx', 'utf8');

mobileContent = mobileContent.replace(
  /<img\n\s*src="\/image\.png"\n\s*alt="Sathaye College 2D Floor Plan"\n\s*className="w-full h-full object-fill opacity-90"\n\s*\/>/m,
  `{!imgError ? (
            <img
              src="/image.png"
              alt="Sathaye College 2D Floor Plan"
              className="w-full h-full object-fill opacity-90"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-center p-4">
              <p className="text-xs font-bold text-slate-300">Image missing</p>
              <p className="text-[10px] text-slate-400 mt-1">Upload public/image.png</p>
            </div>
          )}`
);

mobileContent = mobileContent.replace(
  /const \[activeFloor, setActiveFloor\] = useState<Floor>\('GF'\);/,
  `const [activeFloor, setActiveFloor] = useState<Floor>('GF');\n  const [imgError, setImgError] = useState(false);`
);

fs.writeFileSync('src/components/mobile/MobileMap.tsx', mobileContent);
