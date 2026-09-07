import fs from 'fs';

let content = fs.readFileSync('src/components/desktop/DesktopFullMapModal.tsx', 'utf8');

if (!content.includes('react-zoom-pan-pinch')) {
  // Add imports
  content = content.replace(
    /import \{ X, Search, MapPin, Compass, Navigation, PersonStanding, Layers \} from 'lucide-react';/,
    `import { X, Search, MapPin, Compass, Navigation, PersonStanding, Layers } from 'lucide-react';\nimport { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";`
  );

  // Replace map container
  const oldContainer = `<div className="relative flex-1 bg-[#e6e2db] overflow-hidden select-none">`;
  const newContainer = `<div className="relative flex-1 bg-[#e6e2db] overflow-hidden select-none cursor-grab active:cursor-grabbing">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
            limitToBounds={false}
          >
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
              <div className="relative w-[1200px] h-[1200px] sm:w-[1600px] sm:h-[1600px]">`;
              
  content = content.replace(oldContainer, newContainer);
  
  // Close the wrapper
  const oldClose = `{/* Floating Floor Selector */}`;
  const newClose = `</div>\n            </TransformComponent>\n          </TransformWrapper>\n\n          {/* Floating Floor Selector */}`;
  
  content = content.replace(oldClose, newClose);

  fs.writeFileSync('src/components/desktop/DesktopFullMapModal.tsx', content);
}
