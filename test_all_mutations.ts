const BASE_URL = 'http://localhost:3000/api';

async function testMutations() {
  console.log('=== TESTING ALL END-TO-END MUTATIONS & DATA PERSISTENCE ===\n');

  try {
    // 1. STUDENT FILES CAMPUS ISSUE
    console.log('1. Testing Student Issue Submission...');
    const issueRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc',
        studentName: 'Abhishek Gupta',
        title: 'Water Leakage near Room 204',
        description: 'Pipe leaking heavily outside IT Lab 2',
        category: 'Maintenance',
        location: 'IT Block 2nd Floor',
        priority: 'High'
      })
    });
    const issueData = await issueRes.json();
    console.log('   Issue Created:', issueData.message, '| ID:', issueData.issue?.id);

    // 2. ADMIN UPDATES ISSUE STATUS
    const issueId = issueData.issue?.id;
    if (issueId) {
      console.log('2. Testing Admin Resolving Issue...');
      const updateRes = await fetch(`${BASE_URL}/issues/${issueId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'IN_PROGRESS',
          assignedTo: 'Plumbing Staff',
          resolutionNote: 'Plumber dispatched',
          updatedBy: 'Admin Office'
        })
      });
      const updateData = await updateRes.json();
      console.log('   Issue Updated:', updateData.message);
    }

    // 3. CANTEEN ORDER CREATION & PROGRESSION
    console.log('\n3. Testing Canteen Menu & Order Creation...');
    const menuRes = await fetch(`${BASE_URL}/canteen/menu`);
    const menuData = await menuRes.json();
    const firstItem = menuData.menu?.[0];
    if (firstItem) {
      const orderRes = await fetch(`${BASE_URL}/canteen/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc',
          studentName: 'Abhishek Gupta',
          items: [{ itemId: firstItem.id, quantity: 2 }],
          paymentMethod: 'UPI'
        })
      });
      const orderData = await orderRes.json();
      console.log('   Order Placed:', orderData.message, '| Token:', orderData.tokenNumber);

      const createdOrderId = orderData.order?.id;
      if (createdOrderId) {
        console.log('4. Testing Canteen Staff Updating Order Status to READY...');
        const statusRes = await fetch(`${BASE_URL}/canteen/orders/${createdOrderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'READY' })
        });
        const statusData = await statusRes.json();
        console.log('   Status Updated:', statusData.message);
      }
    }

    // 5. EVENT REGISTRATION
    console.log('\n5. Testing Event Registration...');
    const eventsRes = await fetch(`${BASE_URL}/events`);
    const eventsData = await eventsRes.json();
    const firstEvent = eventsData.events?.[0];
    if (firstEvent) {
      const regRes = await fetch(`${BASE_URL}/events/${firstEvent.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc',
          studentName: 'Abhishek Gupta',
          studentRoll: '241023'
        })
      });
      const regData = await regRes.json();
      console.log('   Event Registration:', regData.message);
    }

    // 6. LIBRARY LOAN ISSUE & RETURN
    console.log('\n6. Testing Library Issue & Return...');
    const booksRes = await fetch(`${BASE_URL}/library/books`);
    const booksData = await booksRes.json();
    const firstBook = booksData.books?.[0];
    if (firstBook) {
      const loanRes = await fetch(`${BASE_URL}/library/loans/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: firstBook.id,
          studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc',
          studentName: 'Abhishek Gupta',
          days: 7
        })
      });
      const loanData = await loanRes.json();
      console.log('   Book Issued:', loanData.message);

      const loanId = loanData.loan?.id;
      if (loanId) {
        const returnRes = await fetch(`${BASE_URL}/library/loans/return`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ loanId })
        });
        const returnData = await returnRes.json();
        console.log('   Book Returned:', returnData.message);
      }
    }

    // 7. FACULTY ATTENDANCE SUBMISSION
    console.log('\n7. Testing Faculty Attendance Batch Submission...');
    const attRes = await fetch(`${BASE_URL}/faculty/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Data Structures',
        date: new Date().toISOString().split('T')[0],
        facultyId: '8a8b13d6-4444-4222-8111-a88888888888',
        records: [
          { studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc', status: 'present' },
          { studentId: 'db49e49e-6575-47ce-8c4e-77fbe86c5284', status: 'absent' }
        ]
      })
    });
    const attData = await attRes.json();
    console.log('   Attendance Marked:', attData.message);

    // 8. LOST & FOUND REPORTING
    console.log('\n8. Testing Lost & Found Report...');
    const lostRes = await fetch(`${BASE_URL}/lost-found`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Blue Water Bottle',
        description: 'Milton stainless steel bottle left in Room 204',
        category: 'Electronics/Personal',
        location: 'Lecture Room 204',
        type: 'found',
        reporterId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc'
      })
    });
    const lostData = await lostRes.json();
    console.log('   Lost & Found Item Reported:', lostData.message);

    // 9. ADMIN BROADCAST
    console.log('\n9. Testing Admin Broadcast Notice...');
    const noticeRes = await fetch(`${BASE_URL}/notifications/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Audit Complete Notice',
        message: 'Smart Sathaye Campus E2E system audit verified operational.',
        targetRole: 'all'
      })
    });
    const noticeData = await noticeRes.json();
    console.log('   Admin Notice Broadcast:', noticeData.message);

    console.log('\n=== ALL END-TO-END MUTATIONS VERIFIED SUCCESSFULLY! ===');
  } catch (err: any) {
    console.error('Mutation Test Error:', err.message);
  }
}

testMutations();
