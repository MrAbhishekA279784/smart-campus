import {
  StudentProfile,
  ScheduleItem,
  MapLocation,
  EventItem,
  CanteenItem,
  BookItem,
  AnnouncementItem,
  QuickActionItem
} from '../types';

export const CURRENT_STUDENT: StudentProfile = {
  id: 'std-241023',
  name: 'Abhishek Gupta',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  degree: 'FY B.Sc. IT',
  year: 'First Year',
  rollNo: '241023',
  college: 'Sathaye College, Mumbai',
  validTill: '2029',
  email: 'abhishek.gupta@sathaye.ac.in',
  attendancePercent: 87,
  phone: '+91 98201 44521',
  bloodGroup: 'B+',
  emergencyContact: '+91 98201 11200',
  role: 'student'
};

export const DEMO_STUDENTS: StudentProfile[] = [
  CURRENT_STUDENT,
  {
    id: 'std-232014',
    name: 'Priya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    degree: 'SY B.Com',
    year: 'Second Year',
    rollNo: '232014',
    college: 'Sathaye College, Mumbai',
    validTill: '2028',
    email: 'priya.sharma@sathaye.ac.in',
    attendancePercent: 92,
    phone: '+91 98334 55120',
    bloodGroup: 'O+',
    emergencyContact: '+91 98334 11099',
    role: 'student'
  },
  {
    id: 'std-223055',
    name: 'Rohan Patil',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    degree: 'TY B.Sc. Computer Science',
    year: 'Third Year',
    rollNo: '223055',
    college: 'Sathaye College, Mumbai',
    validTill: '2027',
    email: 'rohan.patil@sathaye.ac.in',
    attendancePercent: 84,
    phone: '+91 98199 87654',
    bloodGroup: 'A+',
    emergencyContact: '+91 98199 22345',
    role: 'student'
  }
];

export const CURRENT_FACULTY = {
  id: 'fac-1023',
  name: 'Dr. R. Mehta',
  role: 'faculty' as const,
  designation: 'Assistant Professor',
  department: 'Department of Computer Science',
  college: 'Sathaye College, Mumbai',
  employeeId: 'SCF1023',
  email: 'faculty@sathaye.edu',
  phone: '+91 98765 43210',
  joiningDate: '12 July 2023',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  subjects: ['Data Structures', 'DBMS', 'Computer Networks', 'OOPs']
};

export const CURRENT_ADMIN = {
  id: 'adm-001',
  name: 'Admin',
  role: 'admin' as const,
  designation: 'Dean & Principal',
  office: 'Dean Office',
  college: 'Sathaye College, Mumbai',
  email: 'dean.office@sathaye.ac.in',
  phone: '+91 98200 12345',
  accessLevel: 'SuperAdmin' as const,
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
};

export const CURRENT_LIBRARY = {
  id: 'lib-409',
  name: 'Sneha Lokhande',
  role: 'library' as const,
  staffId: 'LIB-409',
  designation: 'Library Staff',
  shift: '8:00 AM - 8:00 PM',
  college: 'Sathaye College, Mumbai',
  email: 'library@sathaye.edu',
  phone: '+91 98202 33445',
  avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80'
};

export const CURRENT_CANTEEN = {
  id: 'cant-101',
  name: 'Canteen Staff',
  role: 'canteen' as const,
  canteenRole: 'Canteen Head & Staff',
  stallName: 'Main Canteen',
  college: 'Sathaye College, Mumbai',
  email: 'canteen@123',
  phone: '+91 98920 54321',
  avatarUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&auto=format&fit=crop&q=80'
};


export const STATS_METRICS = [
  {
    id: 'classes',
    label: 'Classes Today',
    value: 4,
    color: 'blue' as const,
    actionText: '',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    value: '87%',
    color: 'green' as const,
    actionText: 'View →',
  },
  {
    id: 'assignments',
    label: 'Pending Assignments',
    value: 2,
    color: 'red' as const,
    actionText: 'View →',
  },
  {
    id: 'events',
    label: 'Upcoming Events',
    value: 3,
    color: 'purple' as const,
    actionText: 'View →',
  },
];

export const DESKTOP_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-1',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    subject: 'Mathematics',
    room: 'Room 204',
    building: 'A Wing',
    faculty: 'Dr. S. Kulkarni',
    status: 'ongoing',
  },
  {
    id: 'sch-2',
    startTime: '10:15 AM',
    endTime: '11:15 AM',
    subject: 'Data Structures',
    room: 'Lab 3',
    building: 'IT Block',
    faculty: 'Prof. R. Mehta',
    status: 'upcoming',
    countdown: 'Upcoming (25 min)',
  },
  {
    id: 'sch-3',
    startTime: '11:30 AM',
    endTime: '12:30 PM',
    subject: 'Environmental Science',
    room: 'Room 101',
    building: 'Main Building',
    faculty: 'Dr. P. Sharma',
    status: 'upcoming',
  },
  {
    id: 'sch-4',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    subject: 'Communication Skills',
    room: 'Room 305',
    building: 'B Wing',
    faculty: 'Prof. A. Desai',
    status: 'upcoming',
  }
];

export const MOBILE_SCHEDULE: ScheduleItem[] = [
  {
    id: 'm-sch-1',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Mathematics',
    room: 'Room 101',
    building: 'A Wing',
    faculty: 'Dr. S. Kulkarni',
    status: 'upcoming',
  },
  {
    id: 'm-sch-2',
    startTime: '10:15',
    endTime: '11:15',
    subject: 'Data Structures',
    room: 'Room 204',
    building: 'IT Block',
    faculty: 'Prof. R. Mehta',
    status: 'ongoing',
    isNow: true,
  },
  {
    id: 'm-sch-3',
    startTime: '11:30',
    endTime: '12:30',
    subject: 'Environmental Science',
    room: 'Room 301',
    building: 'Main Building',
    faculty: 'Dr. P. Sharma',
    status: 'upcoming',
  },
  {
    id: 'm-sch-4',
    startTime: '02:00',
    endTime: '03:00',
    subject: 'Communication Skills',
    room: 'Room 405',
    building: 'B Wing',
    faculty: 'Prof. A. Desai',
    status: 'upcoming',
  }
];

export const CAMPUS_LOCATIONS: MapLocation[] = [
  {
    id: 'loc-main',
    name: 'Main Building',
    category: 'Academic',
    buildingType: 'Academic Block',
    details: '4 Floors • 48 Classrooms',
    floorsCount: 4,
    classroomsCount: 48,
    topPercent: 44,
    leftPercent: 63,
    color: 'red',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80',
    description: 'Central administrative and academic wing housing arts and science departments.'
  },
  {
    id: 'loc-library',
    name: 'Library',
    category: 'Library',
    buildingType: 'Central Learning Resource',
    details: '3 Floors • 50,000+ Books',
    floorsCount: 3,
    classroomsCount: 6,
    topPercent: 19,
    leftPercent: 60,
    color: 'blue',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80',
    description: 'Multi-level campus library with digital reading zones and study carrels.'
  },
  {
    id: 'loc-canteen',
    name: 'Canteen',
    category: 'Canteen',
    buildingType: 'Campus Dining & Café',
    details: 'Ground Floor • Seating for 250',
    floorsCount: 1,
    topPercent: 44,
    leftPercent: 32,
    color: 'orange',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    description: 'Serving hot breakfast, lunch, fresh juice, and South Indian delicacies.'
  },
  {
    id: 'loc-it',
    name: 'IT Block',
    category: 'Academic',
    buildingType: 'Technology Wing',
    details: '3 Floors • 12 High-Tech Labs',
    floorsCount: 3,
    classroomsCount: 18,
    topPercent: 54,
    leftPercent: 55,
    color: 'purple',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
    description: 'Specialized computer science and IT laboratories with fiber gigabit internet.'
  },
  {
    id: 'loc-science',
    name: 'Science Block',
    category: 'Academic',
    buildingType: 'Laboratories Wing',
    details: '3 Floors • Chemistry & Physics',
    floorsCount: 3,
    topPercent: 57,
    leftPercent: 24,
    color: 'purple',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
    description: 'Equipped science research wings, botanical lab, and seminar auditoriums.'
  },
  {
    id: 'loc-sports',
    name: 'Sports Ground',
    category: 'Sports',
    buildingType: 'Athletics & Pavilion',
    details: 'Outdoor Arena • Cricket & Football',
    topPercent: 68,
    leftPercent: 64,
    color: 'green',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    description: 'Full-sized college sports field hosting annual tournaments and NCC drills.'
  }
];

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'evt-1',
    title: 'TechVerse 2026',
    subtitle: 'Annual Tech Fest',
    category: 'Workshops',
    date: '28 Aug 2026 | Auditorium',
    location: 'Auditorium',
    organizedBy: 'Department of Information Technology',
    isFeatured: true,
    tag: 'Featured',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
    actionText: 'Register',
    actionVariant: 'primary'
  },
  {
    id: 'evt-2',
    title: 'Monsoon Photography Contest',
    subtitle: 'By Photography Club',
    category: 'Cultural',
    date: '30 Aug 2026 | Online',
    location: 'Online',
    organizedBy: 'Photography Club',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    actionText: 'Register',
    actionVariant: 'primary',
    isBookmarked: false
  },
  {
    id: 'evt-3',
    title: 'Career Guidance Session',
    subtitle: 'By Placement Cell',
    category: 'Workshops',
    date: '2 Sep 2026 | Seminar Hall',
    location: 'Seminar Hall',
    organizedBy: 'Placement Cell',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    actionText: 'Interested',
    actionVariant: 'outline',
    isBookmarked: false
  },
  {
    id: 'evt-4',
    title: 'Street Play – Social Awareness',
    subtitle: 'By NSS Unit',
    category: 'Clubs',
    date: '5 Sep 2026 | Main Quadrangle',
    location: 'Main Quadrangle',
    organizedBy: 'NSS Unit',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    actionText: 'Register',
    actionVariant: 'primary',
    isBookmarked: true
  }
];

export const CANTEEN_MENU: CanteenItem[] = [
  {
    id: 'cnt-1',
    name: 'Masala Dosa',
    category: 'Breakfast',
    price: 60,
    rating: 4.5,
    ratingCount: 120,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80',
    isAvailable: true
  },
  {
    id: 'cnt-2',
    name: 'Veg Thali',
    category: 'Lunch',
    price: 80,
    rating: 4.3,
    ratingCount: 98,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&auto=format&fit=crop&q=80',
    isAvailable: true
  },
  {
    id: 'cnt-3',
    name: 'Chicken Biryani',
    category: 'Lunch',
    price: 120,
    rating: 4.6,
    ratingCount: 156,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80',
    isAvailable: true
  },
  {
    id: 'cnt-4',
    name: 'Paneer Wrap',
    category: 'Snacks',
    price: 90,
    rating: 4.4,
    ratingCount: 72,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80',
    isAvailable: true
  },
  {
    id: 'cnt-5',
    name: 'Cold Coffee',
    category: 'Beverages',
    price: 50,
    rating: 4.5,
    ratingCount: 210,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&auto=format&fit=crop&q=80',
    isAvailable: true
  }
];

export const LIBRARY_BOOKS: BookItem[] = [
  {
    id: 'bk-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Books',
    copiesAvailable: 3,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    isBookmarked: true
  },
  {
    id: 'bk-2',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Books',
    copiesAvailable: 2,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&auto=format&fit=crop&q=80',
    isBookmarked: false
  },
  {
    id: 'bk-3',
    title: 'Introduction to Psychology',
    author: 'Daniel Schacter',
    category: 'Books',
    copiesAvailable: 5,
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=300&auto=format&fit=crop&q=80',
    isBookmarked: false
  },
  {
    id: 'bk-4',
    title: 'Data Science Essentials',
    author: 'Joel Grus',
    category: 'Books',
    copiesAvailable: 4,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80',
    isBookmarked: true
  },
  {
    id: 'bk-5',
    title: 'Engineering Mathematics',
    author: 'B.S. Grewal',
    category: 'Books',
    copiesAvailable: 3,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&auto=format&fit=crop&q=80',
    isBookmarked: false
  }
];

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'anc-1',
    title: 'College will remain closed on 29th Aug due to Ganesh Chaturthi.',
    authorDepartment: 'Admin',
    timestamp: '2 hours ago',
    badgeType: 'admin'
  },
  {
    id: 'anc-2',
    title: 'TY Exam Form Submission Deadline: 5th Sept 2026.',
    authorDepartment: 'Examination Cell',
    timestamp: '1 day ago',
    badgeType: 'exam'
  },
  {
    id: 'anc-3',
    title: 'NSS Volunteers Needed for Clean Campus Drive.',
    authorDepartment: 'NSS Unit',
    timestamp: '1 day ago',
    badgeType: 'nss'
  }
];

export const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'act-location',
    label: 'Find Location',
    icon: 'Navigation',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    path: 'map'
  },
  {
    id: 'act-canteen',
    label: 'Canteen',
    icon: 'Utensils',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    path: 'canteen'
  },
  {
    id: 'act-library',
    label: 'Library',
    icon: 'BookOpen',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    path: 'library'
  },
  {
    id: 'act-events',
    label: 'Events',
    icon: 'Calendar',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    path: 'events'
  },
  {
    id: 'act-report',
    label: 'Report Issue',
    icon: 'AlertTriangle',
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    path: 'report-issue'
  },
  {
    id: 'act-lost-found',
    label: 'Lost & Found',
    icon: 'Search',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    path: 'lost-found'
  },
  {
    id: 'act-id',
    label: 'My ID',
    icon: 'CreditCard',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    path: 'digital-id'
  },
  {
    id: 'act-copilot',
    label: 'AI Copilot',
    icon: 'Sparkles',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    path: 'copilot'
  }
];
