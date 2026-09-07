import { db } from './server/db';

async function testCnt() {
  const { data, error } = await db.from('canteen_orders').select('*').neq('status', 'completed');
  if (error) {
    console.log("canteen_orders status error:", error.message);
  } else {
    console.log("canteen_orders status SUCCESS! Count:", data?.length);
  }
}

testCnt();
