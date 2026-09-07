export type Floor = 'GF' | '1F' | '2F' | '3F';

export interface Room {
  id: string;
  name: string;
  floor: Floor;
  x: number; // 0-100% relative to floor plan image width
  y: number; // 0-100% relative to floor plan image height
  type: 'classroom' | 'laboratory' | 'office' | 'facility' | 'stairs' | 'elevator' | 'washroom' | 'library' | 'canteen' | 'sports';
  description?: string;
  nodeId: string; // The navigation graph node this room connects to
}

export interface MapNode {
  id: string;
  floor: Floor;
  x: number;
  y: number;
  type: 'corridor' | 'stairs' | 'elevator' | 'room_entry';
}

export interface MapEdge {
  from: string;
  to: string;
  distance: number;
  isAccessible: boolean;
  type: 'walk' | 'stairs' | 'elevator';
}

export const FLOOR_LABELS: Record<Floor, string> = {
  GF: 'Ground Floor',
  '1F': 'First Floor',
  '2F': 'Second Floor',
  '3F': 'Third Floor'
};

export const ROOMS: Room[] = [
  // --- GROUND FLOOR ---
  { id: 'foyer-gf', name: 'Main Foyer', floor: 'GF', x: 49.5, y: 41.5, type: 'facility', description: 'Central hub and main building entrance', nodeId: 'n-gf-foyer' },
  { id: 'g1', name: 'Room G1', floor: 'GF', x: 18.6, y: 41.5, type: 'classroom', description: 'Ground Floor Classroom G1', nodeId: 'n-gf-g1' },
  { id: 'g2', name: 'Room G2', floor: 'GF', x: 25.0, y: 41.5, type: 'classroom', description: 'Ground Floor Classroom G2', nodeId: 'n-gf-g2' },
  { id: 'g3', name: 'Room G3', floor: 'GF', x: 31.4, y: 41.5, type: 'classroom', description: 'Ground Floor Classroom G3', nodeId: 'n-gf-g3' },
  { id: 'g5', name: 'Room G5', floor: 'GF', x: 37.8, y: 41.5, type: 'classroom', description: 'Ground Floor Classroom G5', nodeId: 'n-gf-g5' },
  { id: 'g10', name: 'Room G10', floor: 'GF', x: 42.5, y: 25.0, type: 'classroom', description: 'Ground Floor Classroom G10', nodeId: 'n-gf-g10' },
  { id: 'admin-office', name: 'Admin Office', floor: 'GF', x: 10.5, y: 62.0, type: 'office', description: 'College Administrative & Admissions Office', nodeId: 'n-gf-admin' },
  { id: 'g4', name: 'Room G4', floor: 'GF', x: 62.5, y: 41.5, type: 'classroom', description: 'Ground Floor Classroom G4', nodeId: 'n-gf-g4' },
  { id: 'g7', name: 'Room G7', floor: 'GF', x: 69.0, y: 41.5, type: 'classroom', description: 'Ground Floor Classroom G7', nodeId: 'n-gf-g7' },
  { id: 'g8', name: 'Room G8', floor: 'GF', x: 75.5, y: 41.5, type: 'classroom', description: 'Ground Floor Classroom G8', nodeId: 'n-gf-g8' },
  { id: 'g9', name: 'Room G9', floor: 'GF', x: 82.0, y: 41.5, type: 'classroom', description: 'Ground Floor Classroom G9', nodeId: 'n-gf-g9' },
  { id: 'library', name: 'Central Library', floor: 'GF', x: 88.5, y: 41.5, type: 'library', description: 'Central Library & Reading Hall', nodeId: 'n-gf-library' },
  { id: 'auditorium', name: 'Auditorium', floor: 'GF', x: 91.5, y: 62.0, type: 'facility', description: 'Main College Auditorium & Event Center', nodeId: 'n-gf-auditorium' },

  // --- FIRST FLOOR ---
  { id: 'foyer-1f', name: 'First Floor Foyer', floor: '1F', x: 49.5, y: 41.5, type: 'facility', description: 'Central lobby on the First Floor', nodeId: 'n-1f-foyer' },
  { id: '101', name: 'Room 101', floor: '1F', x: 42.5, y: 25.0, type: 'classroom', description: 'Lecture Hall 101', nodeId: 'n-1f-101' },
  { id: '102', name: 'Room 102', floor: '1F', x: 50.0, y: 19.0, type: 'classroom', description: 'Lecture Hall 102', nodeId: 'n-1f-102' },
  { id: '103', name: 'Room 103', floor: '1F', x: 25.0, y: 41.5, type: 'classroom', description: 'Lecture Hall 103', nodeId: 'n-1f-103' },
  { id: '104', name: 'Room 104', floor: '1F', x: 31.4, y: 41.5, type: 'classroom', description: 'Lecture Hall 104', nodeId: 'n-1f-104' },
  { id: '105', name: 'Room 105', floor: '1F', x: 37.8, y: 41.5, type: 'classroom', description: 'Lecture Hall 105', nodeId: 'n-1f-105' },
  { id: 'staff-room', name: 'Staff Room', floor: '1F', x: 10.5, y: 62.0, type: 'office', description: 'Faculty & Senior Staff Room', nodeId: 'n-1f-staff' },
  { id: '106', name: 'Room 106', floor: '1F', x: 62.5, y: 41.5, type: 'classroom', description: 'Lecture Hall 106', nodeId: 'n-1f-106' },
  { id: '107', name: 'Room 107', floor: '1F', x: 69.0, y: 41.5, type: 'classroom', description: 'Lecture Hall 107', nodeId: 'n-1f-107' },
  { id: '108', name: 'Room 108', floor: '1F', x: 75.5, y: 41.5, type: 'classroom', description: 'Lecture Hall 108', nodeId: 'n-1f-108' },
  { id: '109', name: 'Room 109', floor: '1F', x: 82.0, y: 41.5, type: 'classroom', description: 'Lecture Hall 109', nodeId: 'n-1f-109' },
  { id: 'exam-cell', name: 'Exam Cell', floor: '1F', x: 91.5, y: 62.0, type: 'office', description: 'College Examination Department & Records', nodeId: 'n-1f-exam' },
  { id: 'iqac', name: 'IQAC Cell', floor: '1F', x: 91.5, y: 80.0, type: 'office', description: 'Internal Quality Assurance Cell', nodeId: 'n-1f-iqac' },

  // --- SECOND FLOOR ---
  { id: 'foyer-2f', name: 'Second Floor Foyer', floor: '2F', x: 49.5, y: 41.5, type: 'facility', description: 'Central lobby on the Second Floor', nodeId: 'n-2f-foyer' },
  { id: '202', name: 'Room 202', floor: '2F', x: 42.5, y: 25.0, type: 'classroom', description: 'Classroom 202', nodeId: 'n-2f-202' },
  { id: '203', name: 'Room 203', floor: '2F', x: 50.0, y: 19.0, type: 'classroom', description: 'Classroom 203', nodeId: 'n-2f-203' },
  { id: '204', name: 'Room 204', floor: '2F', x: 12.2, y: 41.5, type: 'classroom', description: 'Classroom 204', nodeId: 'n-2f-204' },
  { id: '205', name: 'Room 205', floor: '2F', x: 18.6, y: 41.5, type: 'classroom', description: 'Classroom 205', nodeId: 'n-2f-205' },
  { id: '206', name: 'Room 206', floor: '2F', x: 25.0, y: 41.5, type: 'classroom', description: 'Classroom 206', nodeId: 'n-2f-206' },
  { id: '207', name: 'Room 207', floor: '2F', x: 31.4, y: 41.5, type: 'classroom', description: 'Classroom 207', nodeId: 'n-2f-207' },
  { id: '208', name: 'Room 208', floor: '2F', x: 37.8, y: 41.5, type: 'classroom', description: 'Classroom 208', nodeId: 'n-2f-208' },
  { id: 'computer-lab', name: 'Computer Lab', floor: '2F', x: 10.5, y: 62.0, type: 'laboratory', description: 'Department of Computer Science & IT Lab', nodeId: 'n-2f-comp' },
  { id: '209', name: 'Room 209', floor: '2F', x: 62.5, y: 41.5, type: 'classroom', description: 'Classroom 209', nodeId: 'n-2f-209' },
  { id: '210', name: 'Room 210', floor: '2F', x: 69.0, y: 41.5, type: 'classroom', description: 'Classroom 210', nodeId: 'n-2f-210' },
  { id: '211', name: 'Room 211', floor: '2F', x: 75.5, y: 41.5, type: 'classroom', description: 'Classroom 211', nodeId: 'n-2f-211' },
  { id: '212', name: 'Room 212', floor: '2F', x: 82.0, y: 41.5, type: 'classroom', description: 'Classroom 212', nodeId: 'n-2f-212' },
  { id: '213', name: 'Room 213', floor: '2F', x: 88.5, y: 41.5, type: 'classroom', description: 'Classroom 213', nodeId: 'n-2f-213' },
  { id: 'physics-lab', name: 'Physics Lab', floor: '2F', x: 80.0, y: 60.0, type: 'laboratory', description: 'Department of Physics Laboratory', nodeId: 'n-2f-physics' },
  { id: 'chemistry-lab', name: 'Chemistry Lab', floor: '2F', x: 91.5, y: 62.0, type: 'laboratory', description: 'Department of Chemistry Laboratory', nodeId: 'n-2f-chemistry' },

  // --- THIRD FLOOR ---
  { id: 'foyer-3f', name: 'Third Floor Foyer', floor: '3F', x: 49.5, y: 41.5, type: 'facility', description: 'Central lobby on the Third Floor', nodeId: 'n-3f-foyer' },
  { id: '302', name: 'Room 302', floor: '3F', x: 42.5, y: 25.0, type: 'classroom', description: 'Classroom 302', nodeId: 'n-3f-302' },
  { id: '303', name: 'Room 303', floor: '3F', x: 50.0, y: 19.0, type: 'classroom', description: 'Classroom 303', nodeId: 'n-3f-303' },
  { id: '304', name: 'Room 304', floor: '3F', x: 12.2, y: 41.5, type: 'classroom', description: 'Classroom 304', nodeId: 'n-3f-304' },
  { id: '305', name: 'Room 305', floor: '3F', x: 18.6, y: 41.5, type: 'classroom', description: 'Classroom 305', nodeId: 'n-3f-305' },
  { id: '306', name: 'Room 306', floor: '3F', x: 25.0, y: 41.5, type: 'classroom', description: 'Classroom 306', nodeId: 'n-3f-306' },
  { id: '307', name: 'Room 307', floor: '3F', x: 31.4, y: 41.5, type: 'classroom', description: 'Classroom 307', nodeId: 'n-3f-307' },
  { id: '308', name: 'Room 308', floor: '3F', x: 37.8, y: 41.5, type: 'classroom', description: 'Classroom 308', nodeId: 'n-3f-308' },
  { id: 'common-room', name: 'Common Room', floor: '3F', x: 10.5, y: 62.0, type: 'facility', description: 'Student Common Room & Lounge', nodeId: 'n-3f-common' },
  { id: '309', name: 'Room 309', floor: '3F', x: 62.5, y: 41.5, type: 'classroom', description: 'Classroom 309', nodeId: 'n-3f-309' },
  { id: '310', name: 'Room 310', floor: '3F', x: 69.0, y: 41.5, type: 'classroom', description: 'Classroom 310', nodeId: 'n-3f-310' },
  { id: '311', name: 'Room 311', floor: '3F', x: 75.5, y: 41.5, type: 'classroom', description: 'Classroom 311', nodeId: 'n-3f-311' },
  { id: '312', name: 'Room 312', floor: '3F', x: 82.0, y: 41.5, type: 'classroom', description: 'Classroom 312', nodeId: 'n-3f-312' },
  { id: 'makers-lab', name: 'Makers Lab', floor: '3F', x: 80.0, y: 60.0, type: 'laboratory', description: 'Innovation & Robotics Makers Lab', nodeId: 'n-3f-makers' },
  { id: 'mass-media', name: 'Mass Media Dept.', floor: '3F', x: 91.5, y: 62.0, type: 'office', description: 'Department of Mass Media & Communication', nodeId: 'n-3f-media' }
];

export const NODES: MapNode[] = [
  // --- GF NODES ---
  { id: 'n-gf-foyer', floor: 'GF', x: 49.5, y: 41.5, type: 'corridor' },
  { id: 'n-gf-stairs', floor: 'GF', x: 40.0, y: 41.5, type: 'stairs' },
  { id: 'n-gf-g1', floor: 'GF', x: 18.6, y: 41.5, type: 'room_entry' },
  { id: 'n-gf-g2', floor: 'GF', x: 25.0, y: 41.5, type: 'room_entry' },
  { id: 'n-gf-g3', floor: 'GF', x: 31.4, y: 41.5, type: 'room_entry' },
  { id: 'n-gf-g5', floor: 'GF', x: 37.8, y: 41.5, type: 'room_entry' },
  { id: 'n-gf-g10', floor: 'GF', x: 42.5, y: 25.0, type: 'room_entry' },
  { id: 'n-gf-admin', floor: 'GF', x: 10.5, y: 62.0, type: 'room_entry' },
  { id: 'n-gf-g4', floor: 'GF', x: 62.5, y: 41.5, type: 'room_entry' },
  { id: 'n-gf-g7', floor: 'GF', x: 69.0, y: 41.5, type: 'room_entry' },
  { id: 'n-gf-g8', floor: 'GF', x: 75.5, y: 41.5, type: 'room_entry' },
  { id: 'n-gf-g9', floor: 'GF', x: 82.0, y: 41.5, type: 'room_entry' },
  { id: 'n-gf-library', floor: 'GF', x: 88.5, y: 41.5, type: 'room_entry' },
  { id: 'n-gf-auditorium', floor: 'GF', x: 91.5, y: 62.0, type: 'room_entry' },

  // --- 1F NODES ---
  { id: 'n-1f-foyer', floor: '1F', x: 49.5, y: 41.5, type: 'corridor' },
  { id: 'n-1f-stairs', floor: '1F', x: 40.0, y: 41.5, type: 'stairs' },
  { id: 'n-1f-101', floor: '1F', x: 42.5, y: 25.0, type: 'room_entry' },
  { id: 'n-1f-102', floor: '1F', x: 50.0, y: 19.0, type: 'room_entry' },
  { id: 'n-1f-103', floor: '1F', x: 25.0, y: 41.5, type: 'room_entry' },
  { id: 'n-1f-104', floor: '1F', x: 31.4, y: 41.5, type: 'room_entry' },
  { id: 'n-1f-105', floor: '1F', x: 37.8, y: 41.5, type: 'room_entry' },
  { id: 'n-1f-staff', floor: '1F', x: 10.5, y: 62.0, type: 'room_entry' },
  { id: 'n-1f-106', floor: '1F', x: 62.5, y: 41.5, type: 'room_entry' },
  { id: 'n-1f-107', floor: '1F', x: 69.0, y: 41.5, type: 'room_entry' },
  { id: 'n-1f-108', floor: '1F', x: 75.5, y: 41.5, type: 'room_entry' },
  { id: 'n-1f-109', floor: '1F', x: 82.0, y: 41.5, type: 'room_entry' },
  { id: 'n-1f-exam', floor: '1F', x: 91.5, y: 62.0, type: 'room_entry' },
  { id: 'n-1f-iqac', floor: '1F', x: 91.5, y: 80.0, type: 'room_entry' },

  // --- 2F NODES ---
  { id: 'n-2f-foyer', floor: '2F', x: 49.5, y: 41.5, type: 'corridor' },
  { id: 'n-2f-stairs', floor: '2F', x: 40.0, y: 41.5, type: 'stairs' },
  { id: 'n-2f-202', floor: '2F', x: 42.5, y: 25.0, type: 'room_entry' },
  { id: 'n-2f-203', floor: '2F', x: 50.0, y: 19.0, type: 'room_entry' },
  { id: 'n-2f-204', floor: '2F', x: 12.2, y: 41.5, type: 'room_entry' },
  { id: 'n-2f-205', floor: '2F', x: 18.6, y: 41.5, type: 'room_entry' },
  { id: 'n-2f-206', floor: '2F', x: 25.0, y: 41.5, type: 'room_entry' },
  { id: 'n-2f-207', floor: '2F', x: 31.4, y: 41.5, type: 'room_entry' },
  { id: 'n-2f-208', floor: '2F', x: 37.8, y: 41.5, type: 'room_entry' },
  { id: 'n-2f-comp', floor: '2F', x: 10.5, y: 62.0, type: 'room_entry' },
  { id: 'n-2f-209', floor: '2F', x: 62.5, y: 41.5, type: 'room_entry' },
  { id: 'n-2f-210', floor: '2F', x: 69.0, y: 41.5, type: 'room_entry' },
  { id: 'n-2f-211', floor: '2F', x: 75.5, y: 41.5, type: 'room_entry' },
  { id: 'n-2f-212', floor: '2F', x: 82.0, y: 41.5, type: 'room_entry' },
  { id: 'n-2f-213', floor: '2F', x: 88.5, y: 41.5, type: 'room_entry' },
  { id: 'n-2f-physics', floor: '2F', x: 80.0, y: 60.0, type: 'room_entry' },
  { id: 'n-2f-chemistry', floor: '2F', x: 91.5, y: 62.0, type: 'room_entry' },

  // --- 3F NODES ---
  { id: 'n-3f-foyer', floor: '3F', x: 49.5, y: 41.5, type: 'corridor' },
  { id: 'n-3f-stairs', floor: '3F', x: 40.0, y: 41.5, type: 'stairs' },
  { id: 'n-3f-302', floor: '3F', x: 42.5, y: 25.0, type: 'room_entry' },
  { id: 'n-3f-303', floor: '3F', x: 50.0, y: 19.0, type: 'room_entry' },
  { id: 'n-3f-304', floor: '3F', x: 12.2, y: 41.5, type: 'room_entry' },
  { id: 'n-3f-305', floor: '3F', x: 18.6, y: 41.5, type: 'room_entry' },
  { id: 'n-3f-306', floor: '3F', x: 25.0, y: 41.5, type: 'room_entry' },
  { id: 'n-3f-307', floor: '3F', x: 31.4, y: 41.5, type: 'room_entry' },
  { id: 'n-3f-308', floor: '3F', x: 37.8, y: 41.5, type: 'room_entry' },
  { id: 'n-3f-common', floor: '3F', x: 10.5, y: 62.0, type: 'room_entry' },
  { id: 'n-3f-309', floor: '3F', x: 62.5, y: 41.5, type: 'room_entry' },
  { id: 'n-3f-310', floor: '3F', x: 69.0, y: 41.5, type: 'room_entry' },
  { id: 'n-3f-311', floor: '3F', x: 75.5, y: 41.5, type: 'room_entry' },
  { id: 'n-3f-312', floor: '3F', x: 82.0, y: 41.5, type: 'room_entry' },
  { id: 'n-3f-makers', floor: '3F', x: 80.0, y: 60.0, type: 'room_entry' },
  { id: 'n-3f-media', floor: '3F', x: 91.5, y: 62.0, type: 'room_entry' }
];

export const EDGES: MapEdge[] = [
  // --- GF Edges ---
  { from: 'n-gf-admin', to: 'n-gf-g1', distance: 10, isAccessible: true, type: 'walk' },
  { from: 'n-gf-g1', to: 'n-gf-g2', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-gf-g2', to: 'n-gf-g3', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-gf-g3', to: 'n-gf-g5', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-gf-g5', to: 'n-gf-stairs', distance: 5, isAccessible: true, type: 'walk' },
  { from: 'n-gf-stairs', to: 'n-gf-foyer', distance: 5, isAccessible: true, type: 'walk' },
  { from: 'n-gf-foyer', to: 'n-gf-g10', distance: 10, isAccessible: true, type: 'walk' },
  { from: 'n-gf-foyer', to: 'n-gf-g4', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-gf-g4', to: 'n-gf-g7', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-gf-g7', to: 'n-gf-g8', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-gf-g8', to: 'n-gf-g9', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-gf-g9', to: 'n-gf-library', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-gf-library', to: 'n-gf-auditorium', distance: 10, isAccessible: true, type: 'walk' },

  // --- 1F Edges ---
  { from: 'n-1f-staff', to: 'n-1f-103', distance: 10, isAccessible: true, type: 'walk' },
  { from: 'n-1f-103', to: 'n-1f-104', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-1f-104', to: 'n-1f-105', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-1f-105', to: 'n-1f-stairs', distance: 5, isAccessible: true, type: 'walk' },
  { from: 'n-1f-stairs', to: 'n-1f-foyer', distance: 5, isAccessible: true, type: 'walk' },
  { from: 'n-1f-foyer', to: 'n-1f-101', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-1f-foyer', to: 'n-1f-102', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-1f-foyer', to: 'n-1f-106', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-1f-106', to: 'n-1f-107', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-1f-107', to: 'n-1f-108', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-1f-108', to: 'n-1f-109', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-1f-109', to: 'n-1f-exam', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-1f-exam', to: 'n-1f-iqac', distance: 6, isAccessible: true, type: 'walk' },

  // --- 2F Edges ---
  { from: 'n-2f-comp', to: 'n-2f-204', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-204', to: 'n-2f-205', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-205', to: 'n-2f-206', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-206', to: 'n-2f-207', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-207', to: 'n-2f-208', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-208', to: 'n-2f-stairs', distance: 5, isAccessible: true, type: 'walk' },
  { from: 'n-2f-stairs', to: 'n-2f-foyer', distance: 5, isAccessible: true, type: 'walk' },
  { from: 'n-2f-foyer', to: 'n-2f-202', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-foyer', to: 'n-2f-203', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-foyer', to: 'n-2f-209', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-209', to: 'n-2f-210', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-210', to: 'n-2f-211', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-211', to: 'n-2f-212', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-212', to: 'n-2f-213', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-211', to: 'n-2f-physics', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-2f-213', to: 'n-2f-chemistry', distance: 8, isAccessible: true, type: 'walk' },

  // --- 3F Edges ---
  { from: 'n-3f-common', to: 'n-3f-304', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-304', to: 'n-3f-305', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-305', to: 'n-3f-306', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-306', to: 'n-3f-307', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-307', to: 'n-3f-308', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-308', to: 'n-3f-stairs', distance: 5, isAccessible: true, type: 'walk' },
  { from: 'n-3f-stairs', to: 'n-3f-foyer', distance: 5, isAccessible: true, type: 'walk' },
  { from: 'n-3f-foyer', to: 'n-3f-302', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-foyer', to: 'n-3f-303', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-foyer', to: 'n-3f-309', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-309', to: 'n-3f-310', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-310', to: 'n-3f-311', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-311', to: 'n-3f-312', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-311', to: 'n-3f-makers', distance: 8, isAccessible: true, type: 'walk' },
  { from: 'n-3f-312', to: 'n-3f-media', distance: 8, isAccessible: true, type: 'walk' },

  // --- CROSS FLOOR CONNECTIONS (Stairs & Elevator) ---
  { from: 'n-gf-stairs', to: 'n-1f-stairs', distance: 15, isAccessible: false, type: 'stairs' },
  { from: 'n-1f-stairs', to: 'n-2f-stairs', distance: 15, isAccessible: false, type: 'stairs' },
  { from: 'n-2f-stairs', to: 'n-3f-stairs', distance: 15, isAccessible: false, type: 'stairs' },

  { from: 'n-gf-foyer', to: 'n-1f-foyer', distance: 12, isAccessible: true, type: 'elevator' },
  { from: 'n-1f-foyer', to: 'n-2f-foyer', distance: 12, isAccessible: true, type: 'elevator' },
  { from: 'n-2f-foyer', to: 'n-3f-foyer', distance: 12, isAccessible: true, type: 'elevator' }
];
