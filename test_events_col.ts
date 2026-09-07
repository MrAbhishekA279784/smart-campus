import { db } from './server/db';

async function testEv() {
  const { data, error } = await db.from('events').select('*').order('start_at', { ascending: true });
  if (error) {
    console.log("Events start_at query error:", error.message);
  } else {
    console.log("Events start_at query SUCCESS! Count:", data?.length);
  }
}

testEv();
