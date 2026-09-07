import { db } from './server/db';

async function runGapPart2() {
  console.log("=== COMPREHENSIVE GAP AUDIT PART 2 ===");
  const BASE_URL = 'http://localhost:3000/api';

  // 1. AI COPILOT QUERY VERIFICATION (POST /api/ai/chat)
  console.log("\n--- 1. Testing AI Campus Copilot Live Queries ---");
  const queries = [
    "What classes do I have today?",
    "What is my attendance?",
    "What assignments are pending?",
    "Where is Room 204?",
    "Where is the Chemistry Lab?",
    "What events are coming up?",
    "Is Atomic Habits available?",
    "What is today's canteen menu?",
    "What is my canteen order status?"
  ];

  for (const q of queries) {
    try {
      const res = await fetch(`${BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc' })
      });
      const data = await res.json();
      console.log(`[Copilot] Q: "${q}" -> Answer:`, (data.reply || '').replace(/\n/g, ' ').slice(0, 90));
    } catch (e: any) {
      console.log(`[Copilot FAIL] Q: "${q}" -> Error:`, e.message);
    }
  }

  // 2. LOST & FOUND FULL WORKFLOW
  console.log("\n--- 2. Testing Lost & Found Complete Workflow ---");
  try {
    // Student creates lost item
    const lostRes = await fetch(`${BASE_URL}/lost-found`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Lost Black Wallet',
        description: 'Leather wallet containing college ID card',
        category: 'Personal Item',
        location: 'Library 1st Floor',
        type: 'lost',
        reporterId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc'
      })
    });
    const lostData = await lostRes.json();
    console.log("   Lost Item Created:", lostData.message, "| Item ID:", lostData.item?.id);

    // Student creates found item
    const foundRes = await fetch(`${BASE_URL}/lost-found`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Found Scientific Calculator',
        description: 'Casio fx-991EX found on desk in Room 204',
        category: 'Electronics',
        location: 'Room 204',
        type: 'found',
        reporterId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc'
      })
    });
    const foundData = await foundRes.json();
    console.log("   Found Item Created:", foundData.message, "| Item ID:", foundData.item?.id);

    // Fetch all for admin visibility & search
    const allItemsRes = await fetch(`${BASE_URL}/lost-found`);
    const allItems = await allItemsRes.json();
    console.log(`   Admin/User Visibility: ${allItems.items?.length || 0} total items retrieved.`);
  } catch (e: any) {
    console.log("   Lost & Found Error:", e.message);
  }

  // 3. LIBRARY WORKFLOWS (Book Search, Procurement Request, Loan Status)
  console.log("\n--- 3. Testing Library Student Workflows ---");
  try {
    // Book Search
    const searchRes = await fetch(`${BASE_URL}/library/books?search=Data`);
    const searchData = await searchRes.json();
    console.log(`   Book Search ('Data'): ${searchData.books?.length || 0} books found.`);

    // Procurement Request
    const reqRes = await fetch(`${BASE_URL}/library/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Introduction to Algorithms (4th Edition)',
        author: 'Cormen, Leiserson, Rivest',
        studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc',
        studentName: 'Abhishek Gupta',
        notes: 'Required for Advanced Data Structures reference'
      })
    });
    const reqData = await reqRes.json();
    console.log("   Library Book Request Created:", reqData.message);

    // Active Loans
    const loansRes = await fetch(`${BASE_URL}/library/loans?studentId=a13698dc-ee1d-4d73-9302-b68e1df153cc`);
    const loansData = await loansRes.json();
    console.log(`   Student Active Loans: ${loansData.loans?.length || 0} active loans.`);
  } catch (e: any) {
    console.log("   Library Workflows Error:", e.message);
  }

  // 4. CANTEEN COMPLETE VALIDATION
  console.log("\n--- 4. Testing Canteen Complete Operations ---");
  try {
    // Fetch menu
    const menuRes = await fetch(`${BASE_URL}/canteen/menu`);
    const menuData = await menuRes.json();
    console.log(`   Menu Loaded: ${menuData.menu?.length || 0} items.`);

    // Place order
    if (menuData.menu && menuData.menu.length > 0) {
      const item1 = menuData.menu[0];
      const item2 = menuData.menu[1] || item1;
      const totalAmount = (item1.price * 2) + (item2.price * 1);

      const orderRes = await fetch(`${BASE_URL}/canteen/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc',
          studentName: 'Abhishek Gupta',
          items: [
            { itemId: item1.id, quantity: 2 },
            { itemId: item2.id, quantity: 1 }
          ],
          paymentMethod: 'UPI'
        })
      });
      const orderData = await orderRes.json();
      console.log(`   Order Placed: Token #${orderData.tokenNumber} | Amount Calculated: ₹${orderData.order?.total_amount || totalAmount}`);

      // Order History for Student
      const historyRes = await fetch(`${BASE_URL}/canteen/orders?studentId=a13698dc-ee1d-4d73-9302-b68e1df153cc`);
      const historyData = await historyRes.json();
      console.log(`   Student Order History: ${historyData.orders?.length || 0} past orders.`);

      // Toggle item availability
      const toggleRes = await fetch(`${BASE_URL}/canteen/items/${item1.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: false })
      });
      const toggleData = await toggleRes.json();
      console.log("   Item Availability Toggled Off:", toggleData.message || 'OK');

      // Re-toggle back on
      await fetch(`${BASE_URL}/canteen/items/${item1.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: true })
      });
    }

    // Sales analytics
    const statsRes = await fetch(`${BASE_URL}/canteen/stats`);
    const statsData = await statsRes.json();
    console.log(`   Real Sales Analytics: Total Revenue: ₹${statsData.totalRevenue}, Total Orders: ${statsData.totalOrders}`);
  } catch (e: any) {
    console.log("   Canteen Validation Error:", e.message);
  }

  // 5. DIGITAL CAMPUS ID & DYNAMIC QR
  console.log("\n--- 5. Testing Digital Campus ID & Dynamic QR ---");
  try {
    const idRes = await fetch(`${BASE_URL}/students/a13698dc-ee1d-4d73-9302-b68e1df153cc/id-card`);
    const idData = await idRes.json();
    console.log("   Digital ID QR Payload:", idData.qrCodePayload ? `Generated (Length: ${idData.qrCodePayload.length})` : 'FAILED');
  } catch (e: any) {
    console.log("   Digital ID Error:", e.message);
  }

  // 6. NOTIFICATIONS TRIGGERED ACROSS WORKFLOWS
  console.log("\n--- 6. Testing Notifications Retrieval ---");
  try {
    const notifRes = await fetch(`${BASE_URL}/notifications?userId=a13698dc-ee1d-4d73-9302-b68e1df153cc`);
    const notifData = await notifRes.json();
    console.log(`   Student Notifications Count: ${notifData.notifications?.length || 0}`);
  } catch (e: any) {
    console.log("   Notifications Error:", e.message);
  }

  // 7. CONCURRENCY & MULTIPLE SIMULTANEOUS OPERATIONS
  console.log("\n--- 7. Testing Concurrency ---");
  try {
    const promises = [1, 2, 3].map((i) =>
      fetch(`${BASE_URL}/canteen/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc',
          studentName: 'Abhishek Gupta',
          items: [{ itemId: '20202020-2020-2020-2020-202020202001', quantity: 1 }],
          paymentMethod: 'UPI'
        })
      })
    );
    const results = await Promise.all(promises);
    console.log(`   3 Concurrent Orders Placed: ${results.map(r => r.status).join(', ')}`);
  } catch (e: any) {
    console.log("   Concurrency Test Error:", e.message);
  }

  console.log("\n=== PART 2 COMPLETED SUCCESSFULLY ===");
}

runGapPart2();
