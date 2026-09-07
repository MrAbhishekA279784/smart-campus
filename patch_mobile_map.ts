import fs from 'fs';
let content = fs.readFileSync('src/components/mobile/MobileMap.tsx', 'utf8');

content = content.replace(
  /<img\n\s*src="\/image\.png"\n\s*alt="2D Campus Floor Plan"\n\s*className="w-full h-full object-cover opacity-85"\n\s*\/>/m,
  `<div 
          className="absolute w-[200%] h-[200%] transition-transform duration-700 ease-out origin-top-left"
          style={{ 
            transform: activeFloor === 'GF' ? 'translate(0%, 0%)' :
                       activeFloor === '1F' ? 'translate(0%, -50%)' :
                       activeFloor === '2F' ? 'translate(-50%, 0%)' :
                       'translate(-50%, -50%)' // 3F
          }}
        >
          <img
            src="/image.png"
            alt="Sathaye College 2D Floor Plan"
            className="w-full h-full object-fill opacity-90"
          />
        </div>`
);

fs.writeFileSync('src/components/mobile/MobileMap.tsx', content);
