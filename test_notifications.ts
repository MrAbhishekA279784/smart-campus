import { db } from './server/db';

async function testNotif() {
  const { data, error } = await db.from('notifications').select('*').limit(5);
  if (error) {
    console.log("notifications error:", error.message);
  } else {
    console.log("notifications SUCCESS! Count:", data?.length);
  }
}

testNotif();
