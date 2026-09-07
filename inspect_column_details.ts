import { db } from './server/db';

async function testCols() {
  console.log("=== CHECKING TABLE COLUMNS ===");

  // 1. Attendance
  const { data: attData, error: attErr } = await db.from('attendance').select('*').limit(1);
  console.log("attendance error/sample:", attErr?.message || (attData?.[0] ? Object.keys(attData[0]) : "empty"));

  // 2. Events
  const { data: evData, error: evErr } = await db.from('events').select('*').limit(1);
  console.log("events error/sample:", evErr?.message || (evData?.[0] ? Object.keys(evData[0]) : "empty"));

  // 3. Library loans
  const { data: libData, error: libErr } = await db.from('library_loans').select('*').limit(1);
  console.log("library_loans error/sample:", libErr?.message || (libData?.[0] ? Object.keys(libData[0]) : "empty"));

  // 4. Canteen orders
  const { data: cntData, error: cntErr } = await db.from('canteen_orders').select('*').limit(1);
  console.log("canteen_orders error/sample:", cntErr?.message || (cntData?.[0] ? Object.keys(cntData[0]) : "empty"));

  // 5. Timetable
  const { data: ttData, error: ttErr } = await db.from('timetable').select('*').limit(1);
  console.log("timetable error/sample:", ttErr?.message || (ttData?.[0] ? Object.keys(ttData[0]) : "empty"));
}

testCols();
