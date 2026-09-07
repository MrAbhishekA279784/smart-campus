/**
 * Centralized Typed API Client for Smart Sathaye Campus
 * Direct communication with Express backend /api/* routes backed by Supabase
 */

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.error || errJson.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    getProfile: (email?: string, userId?: string) => {
      const params = new URLSearchParams();
      if (email) params.set('email', email);
      if (userId) params.set('userId', userId);
      return request<{ profile: any }>(`/api/auth/profile?${params.toString()}`);
    },
    switchRole: (userId: string, role: string) =>
      request<{ profile: any }>('/api/auth/role', {
        method: 'POST',
        body: JSON.stringify({ userId, role })
      }),
    uploadPhoto: (data: { userId?: string; email?: string; photoUrl: string }) =>
      request<{ profile: any; photoUrl: string; message: string }>('/api/auth/photo', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // Digital ID & Verification
  digitalId: {
    getUser: (userId: string, role?: string) => {
      const params = new URLSearchParams();
      params.set('userId', userId);
      if (role) params.set('role', role);
      return request<{
        profile: any;
        verificationToken: string;
        verificationUrl: string;
        issuedBy: string;
        validUntil: string;
      }>(`/api/digital-id/user?${params.toString()}`);
    },
    regenerate: (userId: string) =>
      request<{
        message: string;
        verificationToken: string;
        verificationUrl: string;
      }>('/api/digital-id/regenerate', {
        method: 'POST',
        body: JSON.stringify({ userId })
      }),
    verify: (token: string) =>
      request<{
        status: string;
        verified: boolean;
        college?: string;
        collegeAddress?: string;
        identity?: any;
        message?: string;
      }>(`/api/digital-id/verify/${encodeURIComponent(token)}`)
  },

  // Students
  students: {
    getStats: (studentId: string) =>
      request<{
        classesToday: number;
        attendancePercent: number;
        pendingAssignments: number;
        upcomingEvents: number;
        activeCanteenOrders: number;
        activeBorrowedBooks: number;
      }>(`/api/students/stats?studentId=${encodeURIComponent(studentId)}`),

    getDigitalId: (studentId: string) =>
      request<{
        student: any;
        qrPayload: string;
        validUntil: string;
        bloodGroup: string;
        emergencyContact: string;
      }>(`/api/students/digital-id?studentId=${encodeURIComponent(studentId)}`)
  },

  // Academics
  academics: {
    getTimetable: (day?: string, course?: string) => {
      const params = new URLSearchParams();
      if (day) params.set('day', day);
      if (course) params.set('course', course);
      return request<{ timetable: any[] }>(`/api/academics/timetable?${params.toString()}`);
    },
    getAttendance: (studentId: string) =>
      request<{
        summary: { totalClasses: number; presentCount: number; absentCount: number; percentage: number };
        subjectBreakdown: Record<string, { present: number; total: number }>;
        recentRecords: any[];
      }>(`/api/academics/attendance?studentId=${encodeURIComponent(studentId)}`),
    getMaterials: (subject?: string) => {
      const url = subject ? `/api/academics/materials?subject=${encodeURIComponent(subject)}` : '/api/academics/materials';
      return request<{ materials: any[] }>(url);
    },
    uploadMaterial: (data: any) =>
      request<{ material: any; message: string }>('/api/academics/materials', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getSyllabus: (course?: string) => {
      const url = course ? `/api/academics/syllabus?course=${encodeURIComponent(course)}` : '/api/academics/syllabus';
      return request<{ course: string; units: any[]; lastUpdated?: string }>(url);
    },
    updateSyllabus: (data: { course?: string; unitId: string; topicId: string; completed: boolean; facultyName?: string }) =>
      request<{ message: string; units: any[] }>('/api/academics/syllabus/update', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getExams: () =>
      request<{ exams: any[] }>('/api/academics/exams'),
    getResults: (studentId?: string) => {
      const url = studentId ? `/api/academics/results?studentId=${encodeURIComponent(studentId)}` : '/api/academics/results';
      return request<{ studentId: string; sgpa: number; cgpa: number; status: string; subjectResults: any[] }>(url);
    }
  },

  // Faculty
  faculty: {
    getStats: (facultyId?: string) => {
      const url = facultyId ? `/api/faculty/stats?facultyId=${encodeURIComponent(facultyId)}` : '/api/faculty/stats';
      return request<{
        classesToday: number;
        totalStudents: number;
        avgAttendance: number;
        pendingEvaluations: number;
      }>(url);
    },
    getSchedule: (facultyId?: string) => {
      const url = facultyId ? `/api/faculty/schedule?facultyId=${encodeURIComponent(facultyId)}` : '/api/faculty/schedule';
      return request<{ schedule: any[] }>(url);
    },
    getRoster: (subject: string) =>
      request<{ roster: any[] }>(`/api/faculty/roster/${encodeURIComponent(subject)}`),
    markAttendance: (data: { subject: string; date?: string; records: { studentId: string; status: 'present' | 'absent' }[]; facultyId?: string }) =>
      request<{ success: boolean; message: string; date: string; markedCount: number }>('/api/faculty/attendance', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    recordAttendance: (data: any) =>
      api.faculty.markAttendance({
        subject: data.courseId || data.subject || 'Data Structures',
        date: data.date,
        records: (data.records || []).map((r: any) => ({
          studentId: r.studentId,
          status: (r.status || 'present').toLowerCase() as any
        }))
      }),
    getSubmissions: (assignmentId: string) =>
      api.assignments.getSubmissions(assignmentId),
    createAssignment: (data: any) =>
      api.assignments.create(data),
    gradeSubmission: (submissionId: string, data: { marks: number; feedback?: string; gradedBy?: string }) =>
      api.assignments.grade(submissionId, data),
    uploadMaterial: (data: any) =>
      api.academics.uploadMaterial(data)
  },

  // Assignments
  assignments: {
    list: (studentId?: string) => {
      const url = studentId ? `/api/assignments?studentId=${encodeURIComponent(studentId)}` : '/api/assignments';
      return request<{ assignments: any[] }>(url);
    },
    create: (data: any) =>
      request<{ assignment: any; message: string }>('/api/assignments', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    submit: (id: string, data: { studentId: string; fileUrl?: string; notes?: string; studentName?: string }) =>
      request<{ submission: any; message: string }>(`/api/assignments/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getSubmissions: (id: string) =>
      request<{ submissions: any[] }>(`/api/assignments/${id}/submissions`),
    grade: (submissionId: string, data: { marks: number; feedback?: string; facultyName?: string }) =>
      request<{ submission: any; message: string }>(`/api/assignments/submissions/${submissionId}/grade`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // Issues & Complaints (Student -> Backend -> Admin Connection)
  issues: {
    list: (params?: { studentId?: string; status?: string; category?: string }) => {
      const q = new URLSearchParams();
      if (params?.studentId) q.set('studentId', params.studentId);
      if (params?.status) q.set('status', params.status);
      if (params?.category) q.set('category', params.category);
      return request<{ issues: any[] }>(`/api/issues?${q.toString()}`);
    },
    create: (data: {
      studentId?: string;
      studentName?: string;
      title: string;
      description?: string;
      category: string;
      location: string;
      priority?: string;
    }) =>
      request<{ issue: any; message: string }>('/api/issues', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    updateStatus: (
      id: string,
      data: { status: string; assignedTo?: string; resolutionNote?: string; updatedBy?: string }
    ) =>
      request<{ issue: any; message: string }>(`/api/issues/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
    getUpdates: (id: string) =>
      request<{ updates: any[] }>(`/api/issues/${id}/updates`)
  },

  // Lost & Found
  lostFound: {
    list: (type?: string) => {
      const url = type ? `/api/lost-found?type=${encodeURIComponent(type)}` : '/api/lost-found';
      return request<{ items: any[] }>(url);
    },
    report: (data: any) =>
      request<{ item: any; matchesFound: number; matches: any[]; message: string }>('/api/lost-found', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    claim: (id: string, data: { claimantId?: string; claimantName?: string; proofDetails?: string }) =>
      request<{ item: any; message: string }>(`/api/lost-found/${id}/claim`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // Events
  events: {
    list: (studentId?: string) => {
      const url = studentId ? `/api/events?studentId=${encodeURIComponent(studentId)}` : '/api/events';
      return request<{ events: any[] }>(url);
    },
    register: (eventId: string, data: { studentId: string; studentName?: string; studentRoll?: string }) =>
      request<{ registration: any; message: string; newCount: number }>(`/api/events/${eventId}/register`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    cancel: (eventId: string, studentId: string) =>
      request<{ message: string }>(`/api/events/${eventId}/register?studentId=${encodeURIComponent(studentId)}`, {
        method: 'DELETE'
      }),
    create: (data: any) =>
      request<{ event: any; message: string }>('/api/events', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // Smart Canteen
  canteen: {
    getMenu: (category?: string) => {
      const url = category ? `/api/canteen/menu?category=${encodeURIComponent(category)}` : '/api/canteen/menu';
      return request<{ menu: any[] }>(url);
    },
    placeOrder: (data: {
      studentId: string;
      studentName?: string;
      items: { itemId: string; quantity: number }[];
      paymentMethod?: string;
    }) =>
      request<{ order: any; tokenNumber: string; items: any[]; totalAmount: number; message: string }>(
        '/api/canteen/orders',
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      ),
    getStudentOrders: (studentId: string) =>
      request<{ orders: any[] }>(`/api/canteen/orders/student?studentId=${encodeURIComponent(studentId)}`),
    getActiveOrders: () =>
      request<{ orders: any[] }>('/api/canteen/orders/active'),
    getQueue: () =>
      request<{ orders: any[] }>('/api/canteen/orders/active'),
    updateOrderStatus: (id: string, status: string) =>
      request<{ order: any; message: string }>(`/api/canteen/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    updateStatus: (id: string, status: string) =>
      request<{ order: any; message: string }>(`/api/canteen/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    updateItem: (id: string, data: any) =>
      request<{ item: any; message: string }>(`/api/canteen/items/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
    updateMenuItem: (id: string, data: any) =>
      request<{ item: any; message: string }>(`/api/canteen/items/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
    addMenuItem: (data: any) =>
      request<{ item: any; message: string }>('/api/canteen/items', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getStats: () =>
      request<{
        totalOrders: number;
        activeQueue: number;
        preparingCount: number;
        readyCount: number;
        completedCount: number;
        totalRevenue: number;
      }>('/api/canteen/stats')
  },

  // Library
  library: {
    getBooks: (q?: string, category?: string) => {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (category) params.set('category', category);
      return request<{ books: any[] }>(`/api/library/books?${params.toString()}`);
    },
    addBook: (data: any) =>
      request<{ book: any; message: string }>('/api/library/books', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    issueBook: (data: { bookId: string; studentId: string; studentName?: string; studentRoll?: string; days?: number }) =>
      request<{ loan: any; message: string; availableCopies: number }>('/api/library/loans/issue', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    returnBook: (loanId: string) =>
      request<{ loan: any; message: string }>('/api/library/loans/return', {
        method: 'POST',
        body: JSON.stringify({ loanId })
      }),
    getStudentLoans: (studentId: string) =>
      request<{ loans: any[] }>(`/api/library/loans/student?studentId=${encodeURIComponent(studentId)}`),
    getActiveLoans: () =>
      request<{ loans: any[] }>('/api/library/loans/active'),
    submitRequest: (data: { studentId?: string; studentName?: string; title: string; author?: string; type?: string; notes?: string }) =>
      request<{ request: any; message: string }>('/api/library/requests', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getRequests: () =>
      request<{ requests: any[] }>('/api/library/requests'),
    updateRequestStatus: (id: string, status: string) =>
      request<{ request: any; message: string }>(`/api/library/requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    getSummary: () =>
      request<{
        totalTitles: number;
        totalCopies: number;
        availableCopies: number;
        activeLoansCount: number;
        overdueCount: number;
      }>('/api/library/summary')
  },

  // Notifications
  notifications: {
    list: (userId: string) =>
      request<{ notifications: any[]; unreadCount: number }>(`/api/notifications?userId=${encodeURIComponent(userId)}`),
    markRead: (id: string) =>
      request<{ notification: any }>(`/api/notifications/${id}/read`, {
        method: 'PATCH'
      }),
    markAllRead: (userId: string) =>
      request<{ message: string }>('/api/notifications/read-all', {
        method: 'POST',
        body: JSON.stringify({ userId })
      }),
    broadcast: (data: { title: string; message: string; targetRole?: string }) =>
      request<{ message: string }>('/api/notifications/broadcast', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // Admin
  admin: {
    getDashboard: () =>
      request<{
        metrics: {
          totalStudents: number;
          totalFaculty: number;
          attendancePercent: number;
          pendingApprovals: number;
          openComplaints: number;
          upcomingEvents: number;
          totalCanteenSales: number;
          totalLibraryBooks: number;
        };
      }>('/api/admin/dashboard'),
    getUsers: (role?: string) => {
      const url = role && role !== 'all' ? `/api/admin/users?role=${encodeURIComponent(role)}` : '/api/admin/users';
      return request<{ users: any[] }>(url);
    },
    createUser: (data: any) =>
      request<{ user: any; message: string }>('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getAnnouncements: () =>
      request<{ announcements: any[] }>('/api/admin/announcements'),
    getOccupancy: (floor: string, date?: string, time?: string) => {
      const params = new URLSearchParams();
      params.set('floor', floor);
      if (date) params.set('date', date);
      if (time) params.set('time', time);
      return request<{
        floor: string;
        date: string;
        time: string;
        totalRooms: number;
        availableCount: number;
        occupiedCount: number;
        maintenanceCount: number;
        rooms: any[];
      }>(`/api/admin/rooms/occupancy?${params.toString()}`);
    },
    bookRoom: (data: any) =>
      request<{ booking: any; message: string }>('/api/admin/rooms/book', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    toggleMaintenance: (data: { roomNumber: string; isMaintenance: boolean; reason?: string }) =>
      request<{ message: string; roomNumber: string; isMaintenance: boolean }>('/api/admin/rooms/maintenance', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    generateTimetable: (data: any) =>
      request<{ draft: any; message: string }>('/api/admin/timetable/generate', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    publishTimetable: (data: { draftId?: string; slots?: any[] }) =>
      request<{ message: string; publishedSlotsCount: number }>('/api/admin/timetable/publish', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getAuditLogs: () =>
      request<{ auditLogs: any[] }>('/api/admin/audit-logs')
  },

  // Map
  map: {
    getBuildings: () =>
      request<{ buildings: any[] }>('/api/map/buildings'),
    getRooms: (buildingId?: string, type?: string) => {
      const params = new URLSearchParams();
      if (buildingId) params.set('buildingId', buildingId);
      if (type) params.set('type', type);
      return request<{ rooms: any[] }>(`/api/map/rooms?${params.toString()}`);
    },
    getRoute: (from: string, to: string, wheelchair: boolean = false) =>
      request<{
        from: string;
        to: string;
        wheelchairAccessible: boolean;
        estimatedMinutes: number;
        totalDistance: string;
        steps: { step: number; instruction: string; distance: string; icon: string }[];
      }>(`/api/map/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&wheelchair=${wheelchair}`)
  },

  // AI Copilot
  ai: {
    chat: (message: string, studentId?: string, studentName?: string) =>
      request<{ reply: string; sources?: string[] }>('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, studentId, studentName })
      })
  }
};
