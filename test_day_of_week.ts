import { db } from './server/db';

async function testTT() {
  const { data, error } = await db.from('timetable').select('*').eq('day_of_week', 1);
  if (error) {
    console.log("Integer day error:", error.message);
  } else {
    console.log("Integer day SUCCESS! count:", data?.length);
  }

  const { data: strData, error: strErr } = await db.from('timetable').select('*').eq('day_of_week', 'Monday');
  if (strErr) {
    console.log("String day error:", strErr.message);
  } else {
    console.log("String day SUCCESS! count:", strData?.length);
  }
}

testTT();
