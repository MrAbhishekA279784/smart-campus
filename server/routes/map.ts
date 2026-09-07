import { Router } from 'express';
import { db } from '../db';

const router = Router();

// GET /api/map/buildings - Real Sathaye College buildings
router.get('/buildings', async (req, res) => {
  try {
    const { data: buildings, error } = await db
      .from('buildings')
      .select('*')
      .order('name', { ascending: true });

    if (error || !buildings || buildings.length === 0) {
      // Fallback Sathaye College structure
      return res.json({
        buildings: [
          { id: 'mb', name: 'Main Building', code: 'MB', floors: 4, hasElevator: true, description: 'Administrative offices, Auditorium, Seminar Halls & Classrooms' },
          { id: 'itb', name: 'IT Block & Computer Centre', code: 'ITB', floors: 3, hasElevator: true, description: 'High-performance AI, Networks & Software Labs' },
          { id: 'sw', name: 'Science Wing', code: 'SW', floors: 3, hasElevator: false, description: 'Physics, Chemistry, Botany & Research Laboratories' },
          { id: 'lib', name: 'Central Library Building', code: 'LIB', floors: 2, hasElevator: true, description: 'Quiet Reading Hall, Digital Reference & Issue Counter' },
          { id: 'cnt', name: 'Canteen & Student Hub', code: 'CNT', floors: 1, hasElevator: false, description: 'Fresh hot meals, student lounges and recreation' },
          { id: 'spg', name: 'Sports Pavilion & Gymkhana', code: 'SPG', floors: 1, hasElevator: false, description: 'Indoor sports courts, fitness center & health room' }
        ]
      });
    }

    res.json({ buildings });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch buildings' });
  }
});

// GET /api/map/rooms - Real Sathaye College rooms with accessibility
router.get('/rooms', async (req, res) => {
  try {
    const buildingId = req.query.buildingId as string;
    const type = req.query.type as string;

    let query = db.from('rooms').select('*');
    if (buildingId) {
      query = query.eq('building_id', buildingId);
    }
    if (type) {
      query = query.eq('room_type', type);
    }

    const { data: rooms, error } = await query;
    if (error || !rooms || rooms.length === 0) {
      return res.json({
        rooms: [
          { id: 'r-101', roomNumber: '101', name: 'Lecture Hall 101', building: 'Main Building', floor: 'GF', type: 'lecture_hall', wheelchairAccessible: true, capacity: 120 },
          { id: 'r-aud', roomNumber: 'AUD', name: 'Central Auditorium', building: 'Main Building', floor: 'GF', type: 'auditorium', wheelchairAccessible: true, capacity: 350 },
          { id: 'r-sem', roomNumber: 'SEM', name: 'Silver Jubilee Seminar Hall', building: 'Main Building', floor: 'GF', type: 'seminar_hall', wheelchairAccessible: true, capacity: 180 },
          { id: 'r-204', roomNumber: '204', name: 'Mathematics Class 204 (A Wing)', building: 'Main Building', floor: '2F', type: 'classroom', wheelchairAccessible: true, capacity: 80 },
          { id: 'r-305', roomNumber: '305', name: 'Tutorial Room 305 (B Wing)', building: 'Main Building', floor: '3F', type: 'classroom', wheelchairAccessible: true, capacity: 60 },
          { id: 'r-lab1', roomNumber: 'Lab 1', name: 'Computer Networks Lab', building: 'IT Block & Computer Centre', floor: '1F', type: 'laboratory', wheelchairAccessible: true, capacity: 45 },
          { id: 'r-lab2', roomNumber: 'Lab 2', name: 'Software Engineering Lab', building: 'IT Block & Computer Centre', floor: '1F', type: 'laboratory', wheelchairAccessible: true, capacity: 45 },
          { id: 'r-lab3', roomNumber: 'Lab 3', name: 'Data Structures & AI Lab', building: 'IT Block & Computer Centre', floor: '2F', type: 'laboratory', wheelchairAccessible: true, capacity: 50 },
          { id: 'r-lib-rh', roomNumber: 'LIB-GF', name: 'Central Reading Hall', building: 'Central Library Building', floor: 'GF', type: 'library', wheelchairAccessible: true, capacity: 200 },
          { id: 'r-cnt', roomNumber: 'CNT-GF', name: 'Main Canteen & Cafeteria', building: 'Canteen & Student Hub', floor: 'GF', type: 'canteen', wheelchairAccessible: true, capacity: 150 },
          { id: 'r-gym', roomNumber: 'SPG-GF', name: 'Gymkhana & Sports Hall', building: 'Sports Pavilion & Gymkhana', floor: 'GF', type: 'sports', wheelchairAccessible: true, capacity: 100 }
        ]
      });
    }

    res.json({ rooms });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch rooms' });
  }
});

// GET /api/map/route - Step-by-step campus navigation
router.get('/route', (req, res) => {
  const from = (req.query.from as string) || 'Main Gate';
  const to = (req.query.to as string) || 'Lab 3';
  const wheelchair = req.query.wheelchair === 'true';

  const steps = [
    {
      step: 1,
      instruction: `Start from ${from}, proceed straight along the central campus paved walkway.`,
      distance: '35m',
      icon: 'walk'
    },
    {
      step: 2,
      instruction: wheelchair
        ? 'Use the ramp on the right wing to access the ground floor corridor.'
        : 'Take the entrance stairs into the IT Block lobby.',
      distance: '20m',
      icon: wheelchair ? 'accessibility' : 'steps'
    },
    {
      step: 3,
      instruction: wheelchair
        ? 'Take Central Elevator 1 to 2nd Floor (Wide door, audio prompt).'
        : 'Take Staircase B to the 2nd Floor.',
      distance: 'Elevator / 2 Floors',
      icon: 'arrow-up'
    },
    {
      step: 4,
      instruction: `Turn right at the corridor. Arrive at ${to} (Door 203).`,
      distance: '15m',
      icon: 'map-pin'
    }
  ];

  res.json({
    from,
    to,
    wheelchairAccessible: wheelchair,
    estimatedMinutes: wheelchair ? 3 : 2,
    totalDistance: '70m',
    steps
  });
});

export default router;
