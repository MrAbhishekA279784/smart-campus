export type UserRole = 'student' | 'faculty' | 'admin' | 'canteen' | 'library' | 'security';

export interface BaseUserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  department?: string;
  designation?: string;
  college?: string;
  phone?: string;
}

export interface StudentProfile extends BaseUserProfile {
  degree: string;
  year: string;
  rollNo: string;
  college: string;
  validTill: string;
  attendancePercent: number;
  bloodGroup?: string;
  emergencyContact?: string;
  course?: string;
  prn?: string;
  collegeName?: string;
  role: 'student';
}

export interface FacultyProfile extends BaseUserProfile {
  role: 'faculty';
  employeeId: string;
  designation: string; // e.g. "Assistant Professor"
  department: string; // e.g. "Department of Computer Science"
  joiningDate: string; // e.g. "12 July 2023"
  subjects: string[];
}

export interface AdminProfile extends BaseUserProfile {
  role: 'admin';
  office: string; // e.g. "Dean Office"
  accessLevel: 'SuperAdmin' | 'Dean' | 'AcademicHead';
}

export interface LibraryProfile extends BaseUserProfile {
  role: 'library';
  staffId: string;
  shift: string; // e.g. "8:00 AM - 8:00 PM"
}

export interface CanteenProfile extends BaseUserProfile {
  role: 'canteen';
  stallName: string; // e.g. "Main Canteen"
}

export type AnyUserProfile = StudentProfile | FacultyProfile | AdminProfile | LibraryProfile | CanteenProfile;


export interface StatMetric {
  id: string;
  label: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'red' | 'purple';
  actionText?: string;
  actionHref?: string;
}

export interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  building: string;
  faculty: string;
  status: 'ongoing' | 'upcoming';
  countdown?: string;
  isNow?: boolean;
}

export interface MapLocation {
  id: string;
  name: string;
  category: 'Academic' | 'Canteen' | 'Library' | 'Sports' | 'Admin';
  buildingType: string;
  details: string;
  floorsCount?: number;
  classroomsCount?: number;
  topPercent: number; // For map positioning
  leftPercent: number;
  color: 'blue' | 'orange' | 'red' | 'purple' | 'green';
  image: string;
  description?: string;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Workshops' | 'Cultural' | 'Sports' | 'Clubs' | 'All';
  date: string;
  location: string;
  organizedBy?: string;
  isFeatured?: boolean;
  image: string;
  tag?: string;
  actionText: string;
  actionVariant: 'primary' | 'outline';
  isBookmarked?: boolean;
}

export interface CanteenItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Snacks' | 'Beverages';
  price: number;
  rating: number;
  ratingCount: number;
  image: string;
  isAvailable: boolean;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: 'Books' | 'Study Rooms' | 'Digital';
  copiesAvailable: number;
  image: string;
  isBookmarked?: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  authorDepartment: string;
  timestamp: string;
  badgeType: 'admin' | 'exam' | 'nss';
  details?: string;
}

export interface QuickActionItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  path?: string;
}

export type DesktopNavSection =
  | 'dashboard'
  | 'profile'
  | 'academics'
  | 'timetable'
  | 'attendance'
  | 'assignments'
  | 'exams'
  | 'events'
  | 'map'
  | 'canteen'
  | 'library'
  | 'report-issue'
  | 'lost-found'
  | 'community'
  | 'safety'
  | 'digital-id'
  | 'notifications';

export type MobileTab = 'home' | 'academics' | 'map' | 'events' | 'canteen' | 'community' | 'profile';
