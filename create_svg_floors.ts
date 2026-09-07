import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'public', 'floors');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Common SVG template generator
function generateFloorSVG(options: {
  floorTitle: string;
  topRotatedLeft: { text: string; bg: string };
  topRotatedRight: { text: string; bg: string };
  leftWingRooms: { text: string; bg: string }[];
  leftBottomRoom?: { text: string; bg: string };
  leftExtraBox?: { text: string; bg: string };
  rightWingRooms: { text: string; bg: string }[];
  rightBottomRoom1?: { text: string; bg: string };
  rightBottomRoom2?: { text: string; bg: string };
  rightExtraBox?: { text: string; bg: string };
  bottomNoteText?: string;
}) {
  const {
    floorTitle,
    topRotatedLeft,
    topRotatedRight,
    leftWingRooms,
    leftBottomRoom,
    leftExtraBox,
    rightWingRooms,
    rightBottomRoom1,
    rightBottomRoom2,
    rightExtraBox,
    bottomNoteText
  } = options;

  // ViewBox: 0 0 1000 420
  // Corridor Y: 150, Height: 55
  // Foyer: x=410..580, y=95..250

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 420" width="100%" height="100%">
  <defs>
    <style>
      .bg { fill: #071527; }
      .foyer { fill: #2b82ea; stroke: #1e62c1; stroke-width: 2; }
      .foyer-text { fill: #ffffff; font-family: system-ui, -apple-system, sans-serif; font-weight: 800; font-size: 20px; text-anchor: middle; dom-dominant-baseline: middle; }
      .title-text { fill: #ffffff; font-family: system-ui, -apple-system, sans-serif; font-weight: 800; font-size: 28px; text-anchor: middle; }
      .note-text { fill: #ffffff; font-family: system-ui, -apple-system, sans-serif; font-weight: 700; font-size: 13px; text-anchor: end; }
      .room-text { fill: #ffffff; font-family: system-ui, -apple-system, sans-serif; font-weight: 800; font-size: 13px; text-anchor: middle; dominant-baseline: central; }
      .room-text-sm { fill: #ffffff; font-family: system-ui, -apple-system, sans-serif; font-weight: 800; font-size: 11px; text-anchor: middle; dominant-baseline: central; }
      .stairs { fill: none; stroke: #60a5fa; stroke-width: 1.5; stroke-dasharray: 2,2; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1000" height="420" class="bg" />

  <!-- Stairs/Lines around Foyer -->
  <line x1="395" y1="150" x2="395" y2="210" class="stairs" />
  <line x1="400" y1="150" x2="400" y2="210" class="stairs" />
  <line x1="405" y1="150" x2="405" y2="210" class="stairs" />
  
  <line x1="585" y1="150" x2="585" y2="210" class="stairs" />
  <line x1="590" y1="150" x2="590" y2="210" class="stairs" />
  <line x1="595" y1="150" x2="595" y2="210" class="stairs" />

  <!-- Central Foyer Polygon -->
  <path d="M 420 120 L 480 80 L 520 80 L 570 120 L 570 245 L 420 245 Z" class="foyer" />
  <text x="495" y="175" class="foyer-text">Foyer</text>

  <!-- Top Rotated Left Room -->
  <g transform="translate(390, 80) rotate(-15)">
    <rect width="70" height="50" rx="3" fill="${topRotatedLeft.bg}" stroke="#ffffff" stroke-width="1.5"/>
    <text x="35" y="25" class="room-text">${topRotatedLeft.text}</text>
  </g>

  <!-- Top Rotated Right Room -->
  <g transform="translate(465, 55) rotate(15)">
    <rect width="70" height="50" rx="3" fill="${topRotatedRight.bg}" stroke="#ffffff" stroke-width="1.5"/>
    <text x="35" y="25" class="room-text">${topRotatedRight.text}</text>
  </g>
`;

  // Render Left Extra Box (e.g. Elevator or Washroom on far left corridor end)
  let startXLeft = 410;
  if (leftExtraBox) {
    startXLeft = 360;
  }

  // Left Wing Rooms (rendered right to left from Foyer)
  const roomW = 60;
  const roomH = 50;
  const corridorY = 150;

  leftWingRooms.forEach((r, idx) => {
    const rx = startXLeft - (idx + 1) * (roomW + 4);
    svg += `
  <rect x="${rx}" y="${corridorY}" width="${roomW}" height="${roomH}" rx="2" fill="${r.bg}" stroke="#ffffff" stroke-width="1.5" />
  <text x="${rx + roomW / 2}" y="${corridorY + roomH / 2}" class="${r.text.length > 5 ? 'room-text-sm' : 'room-text'}">${r.text}</text>`;
  });

  if (leftExtraBox) {
    const exX = startXLeft - leftWingRooms.length * (roomW + 4) - 45;
    svg += `
  <rect x="${exX}" y="${corridorY}" width="40" height="${roomH}" rx="2" fill="${leftExtraBox.bg}" stroke="#ffffff" stroke-width="1.5" />
  <text x="${exX + 20}" y="${corridorY + roomH / 2}" class="room-text-sm">${leftExtraBox.text}</text>`;
  }

  // Far Left Bottom Room
  if (leftBottomRoom) {
    const lbX = 50;
    const lbY = 210;
    const lbW = 110;
    const lbH = 100;
    svg += `
  <rect x="${lbX}" y="${lbY}" width="${lbW}" height="${lbH}" rx="3" fill="${leftBottomRoom.bg}" stroke="#ffffff" stroke-width="1.5" />
  <text x="${lbX + lbW / 2}" y="${lbY + lbH / 2 - 8}" class="room-text">${leftBottomRoom.text.split(' ')[0]}</text>
  <text x="${lbX + lbW / 2}" y="${lbY + lbH / 2 + 10}" class="room-text">${leftBottomRoom.text.split(' ').slice(1).join(' ')}</text>`;
  }

  // Right Wing Rooms (rendered left to right from Foyer)
  const startXRight = 580;
  rightWingRooms.forEach((r, idx) => {
    const rx = startXRight + idx * (roomW + 4) + 15;
    svg += `
  <rect x="${rx}" y="${corridorY}" width="${roomW}" height="${roomH}" rx="2" fill="${r.bg}" stroke="#ffffff" stroke-width="1.5" />
  <text x="${rx + roomW / 2}" y="${corridorY + roomH / 2}" class="${r.text.length > 5 ? 'room-text-sm' : 'room-text'}">${r.text}</text>`;
  });

  if (rightExtraBox) {
    const exX = startXRight + rightWingRooms.length * (roomW + 4) + 20;
    svg += `
  <rect x="${exX}" y="${corridorY}" width="45" height="${roomH}" rx="2" fill="${rightExtraBox.bg}" stroke="#ffffff" stroke-width="1.5" />
  <text x="${exX + 22}" y="${corridorY + roomH / 2}" class="room-text-sm">${rightExtraBox.text}</text>`;
  }

  // Right Bottom Rooms
  if (rightBottomRoom1) {
    const rbX = 750;
    const rbY = 210;
    const rbW = 100;
    const rbH = 85;
    svg += `
  <rect x="${rbX}" y="${rbY}" width="${rbW}" height="${rbH}" rx="3" fill="${rightBottomRoom1.bg}" stroke="#ffffff" stroke-width="1.5" />
  <text x="${rbX + rbW / 2}" y="${rbY + rbH / 2 - 6}" class="room-text-sm">${rightBottomRoom1.text.split(' ')[0]}</text>
  <text x="${rbX + rbW / 2}" y="${rbY + rbH / 2 + 8}" class="room-text-sm">${rightBottomRoom1.text.split(' ').slice(1).join(' ')}</text>`;
  }

  if (rightBottomRoom2) {
    const rbX = 860;
    const rbY = 210;
    const rbW = 110;
    const rbH = 110;
    svg += `
  <rect x="${rbX}" y="${rbY}" width="${rbW}" height="${rbH}" rx="3" fill="${rightBottomRoom2.bg}" stroke="#ffffff" stroke-width="1.5" />
  <text x="${rbX + rbW / 2}" y="${rbY + rbH / 2 - 8}" class="room-text">${rightBottomRoom2.text.split(' ')[0]}</text>
  <text x="${rbX + rbW / 2}" y="${rbY + rbH / 2 + 10}" class="room-text">${rightBottomRoom2.text.split(' ').slice(1).join(' ')}</text>`;
  }

  // Footer Note Text
  if (bottomNoteText) {
    svg += `<text x="960" y="380" class="note-text">${bottomNoteText}</text>`;
  }

  // Large Floor Title at Bottom Center
  svg += `<text x="500" y="375" class="title-text">${floorTitle}</text>`;

  svg += `\n</svg>`;
  return svg;
}

// 1. Ground Floor
const groundSVG = generateFloorSVG({
  floorTitle: 'Ground Floor',
  topRotatedLeft: { text: 'G10', bg: '#ef4444' },
  topRotatedRight: { text: 'G10', bg: '#ef4444' },
  leftWingRooms: [
    { text: 'G5', bg: '#10b981' },
    { text: 'G3', bg: '#ef4444' },
    { text: 'G2', bg: '#10b981' },
    { text: 'G1', bg: '#10b981' }
  ],
  leftBottomRoom: { text: 'Admin Office', bg: '#ef4444' },
  rightWingRooms: [
    { text: 'G4', bg: '#10b981' },
    { text: 'G7', bg: '#ef4444' },
    { text: 'G8', bg: '#10b981' },
    { text: 'G9', bg: '#10b981' },
    { text: 'Library', bg: '#10b981' }
  ],
  rightBottomRoom2: { text: 'Auditorium', bg: '#ef4444' },
  bottomNoteText: 'Main Entrance →'
});

// 2. First Floor
const firstSVG = generateFloorSVG({
  floorTitle: 'First Floor',
  topRotatedLeft: { text: '101', bg: '#10b981' },
  topRotatedRight: { text: '102', bg: '#ef4444' },
  leftWingRooms: [
    { text: '105', bg: '#10b981' },
    { text: '104', bg: '#10b981' },
    { text: '103', bg: '#10b981' }
  ],
  leftExtraBox: { text: 'Elev', bg: '#ef4444' },
  leftBottomRoom: { text: 'Staff Room', bg: '#10b981' },
  rightWingRooms: [
    { text: '106', bg: '#10b981' },
    { text: '107', bg: '#ef4444' },
    { text: '108', bg: '#10b981' },
    { text: '109', bg: '#ef4444' }
  ],
  rightBottomRoom2: { text: 'Exam Cell', bg: '#ef4444' },
  bottomNoteText: 'IGNOU Study Centre →'
});

// 3. Second Floor
const secondSVG = generateFloorSVG({
  floorTitle: 'Second Floor',
  topRotatedLeft: { text: '202', bg: '#10b981' },
  topRotatedRight: { text: '203', bg: '#ef4444' },
  leftWingRooms: [
    { text: '208', bg: '#ef4444' },
    { text: '207', bg: '#10b981' },
    { text: '206', bg: '#ef4444' },
    { text: '205', bg: '#ef4444' },
    { text: '204', bg: '#10b981' }
  ],
  leftBottomRoom: { text: 'Computer Lab', bg: '#10b981' },
  rightWingRooms: [
    { text: '209', bg: '#10b981' },
    { text: '210', bg: '#10b981' },
    { text: '211', bg: '#10b981' },
    { text: '212', bg: '#ef4444' },
    { text: '213', bg: '#10b981' }
  ],
  rightExtraBox: { text: 'WC', bg: '#0284c7' },
  rightBottomRoom1: { text: 'Physics Lab', bg: '#10b981' },
  rightBottomRoom2: { text: 'Chemistry Lab', bg: '#f59e0b' },
  bottomNoteText: 'Arts & Humanities Hindi Floor ↑'
});

// 4. Third Floor
const thirdSVG = generateFloorSVG({
  floorTitle: 'Third Floor',
  topRotatedLeft: { text: '302', bg: '#10b981' },
  topRotatedRight: { text: '303', bg: '#ef4444' },
  leftWingRooms: [
    { text: '308', bg: '#10b981' },
    { text: '307', bg: '#10b981' },
    { text: '306', bg: '#10b981' },
    { text: '305', bg: '#10b981' },
    { text: '304', bg: '#10b981' }
  ],
  leftExtraBox: { text: 'WC', bg: '#0284c7' },
  leftBottomRoom: { text: 'Common Room', bg: '#10b981' },
  rightWingRooms: [
    { text: '309', bg: '#ef4444' },
    { text: '310', bg: '#ef4444' },
    { text: '311', bg: '#10b981' },
    { text: '312', bg: '#ef4444' }
  ],
  rightBottomRoom1: { text: 'Makers Lab', bg: '#10b981' },
  rightBottomRoom2: { text: 'Mass Media', bg: '#10b981' },
  bottomNoteText: 'Stairs to 301-314 →'
});

fs.writeFileSync(path.join(dir, 'ground.svg'), groundSVG);
fs.writeFileSync(path.join(dir, 'first.svg'), firstSVG);
fs.writeFileSync(path.join(dir, 'second.svg'), secondSVG);
fs.writeFileSync(path.join(dir, 'third.svg'), thirdSVG);

console.log('Successfully created all 4 floor SVG map files!');
