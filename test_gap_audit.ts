import { db } from './server/db';

async function runGapAudit() {
  console.log("=== STARTING COMPREHENSIVE GAP AUDIT ===");
  const BASE_URL = 'http://localhost:3000/api';

  // 1. SYLLABUS & MATERIALS
  console.log("\n1. Testing Syllabus & Materials Endpoints...");
  try {
    const matRes = await fetch(`${BASE_URL}/academics/materials`);
    const matData = await matRes.json();
    console.log("   GET /academics/materials:", matData.materials ? `OK (${matData.materials.length} items)` : 'FAIL');
  } catch (e: any) {
    console.log("   Syllabus/Materials Error:", e.message);
  }

  // 2. AI CAMPUS COPILOT
  console.log("\n2. Testing AI Copilot Queries...");
  const aiQueries = [
    "What classes do I have today?",
    "What is my attendance?",
    "Where is Room 204?",
    "Is Atomic Habits available in the library?",
    "What is today's canteen menu?"
  ];
  for (const q of aiQueries) {
    try {
      const aiRes = await fetch(`${BASE_URL}/ai/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc' })
      });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        console.log(`   Q: "${q}" -> A:`, (aiData.reply || aiData.text || JSON.stringify(aiData)).slice(0, 80));
      } else {
        console.log(`   Q: "${q}" -> Status:`, aiRes.status);
      }
    } catch (e: any) {
      console.log(`   AI Query Error ("${q}"):`, e.message);
    }
  }

  // 3. CANTEEN MENU TOGGLE & SALES ANALYTICS
  console.log("\n3. Testing Canteen Management & Analytics...");
  try {
    const statsRes = await fetch(`${BASE_URL}/canteen/stats`);
    const statsData = await statsRes.json();
    console.log("   Canteen Stats:", statsData);
  } catch (e: any) {
    console.log("   Canteen Stats Error:", e.message);
  }

  // 4. DUPLICATE EVENT REGISTRATION PREVENTION
  console.log("\n4. Testing Duplicate Event Registration...");
  try {
    const evRes = await fetch(`${BASE_URL}/events`);
    const evData = await evRes.json();
    const firstEv = evData.events?.[0];
    if (firstEv) {
      // First reg
      const reg1 = await fetch(`${BASE_URL}/events/${firstEv.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc' })
      });
      console.log("   Reg 1 Status:", reg1.status, await reg1.text());

      // Second reg (duplicate test)
      const reg2 = await fetch(`${BASE_URL}/events/${firstEv.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc' })
      });
      console.log("   Reg 2 (Duplicate) Status:", reg2.status, await reg2.text());
    }
  } catch (e: any) {
    console.log("   Event Reg Error:", e.message);
  }

  // 5. LOST & FOUND CLAIM WORKFLOW
  console.log("\n5. Testing Lost & Found Claim...");
  try {
    const lostRes = await fetch(`${BASE_URL}/lost-found`);
    const lostData = await lostRes.json();
    console.log("   Lost & Found Count:", lostData.items?.length);
  } catch (e: any) {
    console.log("   Lost & Found Error:", e.message);
  }

  console.log("\n=== GAP AUDIT COMPLETED ===");
}

runGapAudit();
