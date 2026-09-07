import fs from 'fs';

// 1. DesktopLogin
let desktopLogin = fs.readFileSync('src/components/desktop/DesktopLogin.tsx', 'utf8');
desktopLogin = desktopLogin.replace(/3D interactive campus navigation/, 'interactive 2D campus navigation');
fs.writeFileSync('src/components/desktop/DesktopLogin.tsx', desktopLogin);

// 2. MobileMap
let mobileMap = fs.readFileSync('src/components/mobile/MobileMap.tsx', 'utf8');

mobileMap = mobileMap.replace(/\{\/\* 3\. Interactive 3D Map Area \*\/\}/, '{/* 3. Interactive 2D Map Area */}');
mobileMap = mobileMap.replace(/\{\/\* Campus 3D Bird's Eye Aerial \/ Isometric Grounds \*\/\}/, '{/* 2D Campus Floor Plan */}');
mobileMap = mobileMap.replace(/alt="3D Campus Aerial"/, 'alt="2D Campus Floor Plan"');
mobileMap = mobileMap.replace(/src="https:\/\/images\.unsplash\.com.*?\"/, 'src="/image.png"');

fs.writeFileSync('src/components/mobile/MobileMap.tsx', mobileMap);
