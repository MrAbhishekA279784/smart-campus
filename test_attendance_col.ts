import { db } from './server/db';

async function testAtt() {
  const { data, error } = await db.from('attendance').select('*').order('attendance_date', { ascending: false });
  if (error) {
    console.log("attendance attendance_date error:", error.message);
  } else {
    console.log("attendance attendance_date SUCCESS! Count:", data?.length);
  }
}

testAtt();
