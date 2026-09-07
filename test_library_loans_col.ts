import { db } from './server/db';

async function testLib() {
  const { data, error } = await db.from('library_loans').select('*').order('due_at', { ascending: true });
  if (error) {
    console.log("library_loans due_at error:", error.message);
  } else {
    console.log("library_loans due_at SUCCESS! Count:", data?.length);
  }
}

testLib();
