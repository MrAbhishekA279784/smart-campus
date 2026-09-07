import { supabase } from './src/lib/supabase';

async function testEndpoints() {
  console.log("=== TESTING ALL SERVER ENDPOINTS ===");
  const baseUrl = "http://localhost:3000";

  const endpoints = [
    { name: "Health", url: "/api/health", method: "GET" },
    { name: "Auth Profile", url: "/api/auth/profile?email=abhishek.gupta@sathaye.edu.in", method: "GET" },
    { name: "Student Stats", url: "/api/students/stats?studentId=st-101", method: "GET" },
    { name: "Digital ID", url: "/api/students/digital-id?studentId=st-101", method: "GET" },
    { name: "Timetable", url: "/api/academics/timetable", method: "GET" },
    { name: "Attendance", url: "/api/academics/attendance?studentId=st-101", method: "GET" },
    { name: "Study Materials", url: "/api/academics/materials", method: "GET" },
    { name: "Faculty Stats", url: "/api/faculty/stats", method: "GET" },
    { name: "Faculty Schedule", url: "/api/faculty/schedule", method: "GET" },
    { name: "Faculty Roster", url: "/api/faculty/roster/Data%20Structures", method: "GET" },
    { name: "Assignments List", url: "/api/assignments", method: "GET" },
    { name: "Issues List", url: "/api/issues", method: "GET" },
    { name: "Lost & Found List", url: "/api/lost-found", method: "GET" },
    { name: "Events List", url: "/api/events", method: "GET" },
    { name: "Canteen Menu", url: "/api/canteen/menu", method: "GET" },
    { name: "Canteen Active Orders", url: "/api/canteen/orders/active", method: "GET" },
    { name: "Canteen Stats", url: "/api/canteen/stats", method: "GET" },
    { name: "Library Books", url: "/api/library/books", method: "GET" },
    { name: "Library Loans Active", url: "/api/library/loans/active", method: "GET" },
    { name: "Library Requests", url: "/api/library/requests", method: "GET" },
    { name: "Library Summary", url: "/api/library/summary", method: "GET" },
    { name: "Notifications", url: "/api/notifications?userId=st-101", method: "GET" },
    { name: "Admin Dashboard", url: "/api/admin/dashboard", method: "GET" },
    { name: "Admin Users", url: "/api/admin/users", method: "GET" },
    { name: "Admin Announcements", url: "/api/admin/announcements", method: "GET" },
    { name: "Map Buildings", url: "/api/map/buildings", method: "GET" },
    { name: "Map Rooms", url: "/api/map/rooms", method: "GET" },
    { name: "Map Route", url: "/api/map/route?from=Main%20Gate&to=Room%20204", method: "GET" }
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(baseUrl + ep.url, { method: ep.method });
      const status = res.status;
      if (res.ok) {
        const json = await res.json();
        console.log(`✅ [${status}] ${ep.name} (${ep.url}):`, JSON.stringify(json).slice(0, 80) + "...");
      } else {
        const text = await res.text();
        console.log(`❌ [${status}] ${ep.name} (${ep.url}): ${text.slice(0, 100)}`);
      }
    } catch (e: any) {
      console.log(`💥 [ERROR] ${ep.name} (${ep.url}): ${e.message}`);
    }
  }
}

testEndpoints();
