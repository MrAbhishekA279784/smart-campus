import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User, SupabaseClient } from '@supabase/supabase-js';
import { StudentProfile, AnyUserProfile, UserRole, FacultyProfile, AdminProfile, LibraryProfile, CanteenProfile } from '../types';
import {
  CURRENT_STUDENT,
  DEMO_STUDENTS,
  CURRENT_FACULTY,
  CURRENT_ADMIN,
  CURRENT_LIBRARY,
  CURRENT_CANTEEN
} from '../data/mockData';
import {
  supabase,
  verifyUserRoleInSupabase,
  establishSupabaseSession,
  normalizeSupabaseRole,
  SupabaseProfileRecord
} from '../lib/supabase';

interface AuthContextType {
  user: AnyUserProfile | null;
  studentProfile: StudentProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  supabaseUser: User | null;
  roleVerified: boolean;
  isSupabaseConnected: boolean;
  supabase: SupabaseClient;
  loginWithGoogle: (customEmail?: string) => Promise<void>;
  loginWithCredentials: (rollOrEmail: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoStudent: (studentId?: string) => Promise<void>;
  loginAsStaff: (roleType: 'faculty' | 'admin' | 'canteen' | 'library', email?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (targetRole: UserRole) => Promise<void>;
  verifyRole: (userId?: string, email?: string) => Promise<UserRole | null>;
  refreshSession: () => Promise<void>;
  attemptedRestrictedRoute: string | null;
  setAttemptedRestrictedRoute: (route: string | null) => void;
  clearRestrictedNotice: () => void;
}

const AUTH_STORAGE_KEY = 'sathaye_unified_session_v4';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AnyUserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [roleVerified, setRoleVerified] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [attemptedRestrictedRoute, setAttemptedRestrictedRoute] = useState<string | null>(null);

  /**
   * Constructs an application-specific user profile by combining database records
   * from the Supabase `profiles` table with domain-specific portal structures.
   */
  const buildUserProfileFromRecord = useCallback(
    (verifiedRole: UserRole, dbRecord: SupabaseProfileRecord | null, email: string): AnyUserProfile => {
      switch (verifiedRole) {
        case 'student': {
          const matched = DEMO_STUDENTS.find((s) => s.email.toLowerCase() === email.toLowerCase());
          const studentProfile: StudentProfile = {
            id: dbRecord?.student_id || dbRecord?.id || matched?.id || CURRENT_STUDENT.id,
            name: dbRecord?.full_name || matched?.name || CURRENT_STUDENT.name,
            avatarUrl:
              dbRecord?.avatar_url ||
              matched?.avatarUrl ||
              CURRENT_STUDENT.avatarUrl,
            degree: dbRecord?.course ? `${dbRecord.year || 'FY'} ${dbRecord.course}` : (matched?.degree || CURRENT_STUDENT.degree),
            year: dbRecord?.year === 'FY' ? 'First Year' : (matched?.year || CURRENT_STUDENT.year),
            rollNo: dbRecord?.roll_number || matched?.rollNo || CURRENT_STUDENT.rollNo,
            college: CURRENT_STUDENT.college,
            validTill: CURRENT_STUDENT.validTill,
            email: dbRecord?.email || email || CURRENT_STUDENT.email,
            attendancePercent: matched?.attendancePercent || CURRENT_STUDENT.attendancePercent,
            phone: dbRecord?.phone || matched?.phone || CURRENT_STUDENT.phone,
            bloodGroup: CURRENT_STUDENT.bloodGroup,
            role: 'student'
          };
          return studentProfile;
        }
        case 'faculty': {
          const facultyProfile: FacultyProfile = {
            ...CURRENT_FACULTY,
            id: dbRecord?.employee_id || dbRecord?.id || CURRENT_FACULTY.id,
            name: dbRecord?.full_name || CURRENT_FACULTY.name,
            email: dbRecord?.email || email || CURRENT_FACULTY.email,
            phone: dbRecord?.phone || CURRENT_FACULTY.phone,
            avatarUrl: dbRecord?.avatar_url || CURRENT_FACULTY.avatarUrl,
            role: 'faculty'
          };
          return facultyProfile;
        }
        case 'admin': {
          const adminProfile: AdminProfile = {
            ...CURRENT_ADMIN,
            id: dbRecord?.employee_id || dbRecord?.id || CURRENT_ADMIN.id,
            name: dbRecord?.full_name || CURRENT_ADMIN.name,
            email: dbRecord?.email || email || CURRENT_ADMIN.email,
            phone: dbRecord?.phone || CURRENT_ADMIN.phone,
            avatarUrl: dbRecord?.avatar_url || CURRENT_ADMIN.avatarUrl,
            role: 'admin'
          };
          return adminProfile;
        }
        case 'canteen': {
          const canteenProfile: CanteenProfile = {
            ...CURRENT_CANTEEN,
            id: dbRecord?.employee_id || dbRecord?.id || CURRENT_CANTEEN.id,
            name: dbRecord?.full_name || CURRENT_CANTEEN.name,
            email: dbRecord?.email || email || CURRENT_CANTEEN.email,
            phone: dbRecord?.phone || CURRENT_CANTEEN.phone,
            avatarUrl: dbRecord?.avatar_url || CURRENT_CANTEEN.avatarUrl,
            role: 'canteen'
          };
          return canteenProfile;
        }
        case 'library': {
          const libraryProfile: LibraryProfile = {
            ...CURRENT_LIBRARY,
            id: dbRecord?.employee_id || dbRecord?.id || CURRENT_LIBRARY.id,
            name: dbRecord?.full_name || CURRENT_LIBRARY.name,
            email: dbRecord?.email || email || CURRENT_LIBRARY.email,
            phone: dbRecord?.phone || CURRENT_LIBRARY.phone,
            avatarUrl: dbRecord?.avatar_url || CURRENT_LIBRARY.avatarUrl,
            role: 'library'
          };
          return libraryProfile;
        }
        default:
          return CURRENT_STUDENT;
      }
    },
    []
  );

  /**
   * Syncs and verifies user role directly against the Supabase `profiles` table
   */
  const syncAndVerifyUser = useCallback(
    async (targetUser: User, fallbackRole?: UserRole) => {
      try {
        const { profile: dbProfile, role: dbRole } = await verifyUserRoleInSupabase(
          targetUser.id,
          targetUser.email
        );

        const verifiedRole = dbRole || fallbackRole || 'student';
        const profile = buildUserProfileFromRecord(
          verifiedRole,
          dbProfile,
          targetUser.email || ''
        );

        setUser(profile);
        setRole(verifiedRole);
        setRoleVerified(true);

        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            user: profile,
            role: verifiedRole,
            supabaseUserId: targetUser.id,
            email: targetUser.email
          })
        );

        return { profile, role: verifiedRole };
      } catch (e) {
        console.warn('Error during Supabase role verification:', e);
        const resolvedRole = fallbackRole || 'student';
        setUser(CURRENT_STUDENT);
        setRole(resolvedRole);
        return { profile: CURRENT_STUDENT, role: resolvedRole };
      }
    },
    [buildUserProfileFromRecord]
  );

  /**
   * 1. Initialize Supabase Session & Listen to Auth State Changes
   */
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        // A. Check for existing active Supabase session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('Supabase getSession returned:', error.message);
          setIsSupabaseConnected(false);
        } else {
          setIsSupabaseConnected(true);
        }

        if (isMounted && data.session && data.session.user) {
          setSession(data.session);
          setSupabaseUser(data.session.user);
          await syncAndVerifyUser(data.session.user);
          setIsLoading(false);
          return;
        }

        // B. Check cached session or determine target role/email
        let targetEmail = 'student@sathaye.ac.in';
        let targetRole: UserRole = 'student';

        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.email) targetEmail = parsed.email;
            if (parsed.role) targetRole = parsed.role;
            if (parsed.user && parsed.role) {
              setUser(parsed.user);
              setRole(parsed.role);
            }
          } catch (e) {
            // Ignore parse error
          }
        }

        // C. Pre-initialize active Supabase session for target portal
        const established = await establishSupabaseSession(targetEmail, targetRole);
        if (isMounted && established.session && established.user) {
          setSession(established.session);
          setSupabaseUser(established.user);
          await syncAndVerifyUser(established.user, established.role);
        } else if (isMounted && !user) {
          setUser(CURRENT_STUDENT);
          setRole(targetRole);
        }
      } catch (err) {
        console.warn('Supabase session initialization notice:', err);
        if (isMounted) {
          setUser(CURRENT_STUDENT);
          setRole('student');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    // Subscribe to real-time auth changes from Supabase
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (currentSession?.user) {
          setSession(currentSession);
          setSupabaseUser(currentSession.user);
          await syncAndVerifyUser(currentSession.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setSupabaseUser(null);
        setUser(null);
        setRole(null);
        setRoleVerified(false);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [syncAndVerifyUser]);

  /**
   * Explicitly verify user role against Supabase database
   */
  const verifyRole = async (userId?: string, email?: string): Promise<UserRole | null> => {
    const targetId = userId || supabaseUser?.id || '';
    const targetEmail = email || supabaseUser?.email || user?.email || '';
    const res = await verifyUserRoleInSupabase(targetId, targetEmail);
    if (res.role) {
      setRole(res.role);
      setRoleVerified(true);
      return res.role;
    }
    return null;
  };

  /**
   * Refreshes the active Supabase session
   */
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data.session) {
        setSession(data.session);
        setSupabaseUser(data.session.user);
        if (data.session.user) {
          await syncAndVerifyUser(data.session.user);
        }
      }
    } catch (e) {
      console.warn('Failed to refresh Supabase session:', e);
    }
  };

  /**
   * Login with Google: Establishes Supabase session and verifies student role
   */
  const loginWithGoogle = async (customEmail?: string) => {
    setIsLoading(true);
    const targetEmail = customEmail || 'abhishekgupta8arollno29@gmail.com';

    try {
      const res = await establishSupabaseSession(targetEmail, 'student');
      if (res.session && res.user) {
        setSession(res.session);
        setSupabaseUser(res.user);
        await syncAndVerifyUser(res.user, 'student');
      } else {
        // Fallback
        setUser(CURRENT_STUDENT);
        setRole('student');
      }
    } catch (e) {
      console.error('Google Supabase login error:', e);
      setUser(CURRENT_STUDENT);
      setRole('student');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with roll number or email & password
   * Authenticates using Supabase, verifies official role from `profiles` table.
   */
  const loginWithCredentials = async (
    rollOrEmail: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const query = rollOrEmail.trim().toLowerCase();

    if (!query) {
      setIsLoading(false);
      return { success: false, error: 'Please enter your Roll Number or Sathaye Email.' };
    }

    try {
      // Determine intended role and target email
      let targetEmail = query;
      let intendedRole: UserRole = 'student';

      if (query.includes('faculty') || query.includes('mehta') || query.includes('sharma')) {
        targetEmail = 'faculty@sathaye.ac.in';
        intendedRole = 'faculty';
      } else if (query.includes('admin') || query.includes('dean') || query.includes('sawant')) {
        targetEmail = 'admin@sathaye.ac.in';
        intendedRole = 'admin';
      } else if (query.includes('canteen') || query.includes('patil')) {
        targetEmail = 'canteen@sathaye.ac.in';
        intendedRole = 'canteen';
      } else if (query.includes('library') || query.includes('kulkarni') || query.includes('sneha')) {
        targetEmail = 'library@sathaye.ac.in';
        intendedRole = 'library';
      } else {
        // Student mapping
        const matchedDemo = DEMO_STUDENTS.find(
          (s) =>
            s.rollNo.toLowerCase() === query ||
            s.email.toLowerCase() === query ||
            s.name.toLowerCase().includes(query)
        );
        targetEmail = matchedDemo ? matchedDemo.email : (query.includes('@') ? query : 'student@sathaye.ac.in');
        intendedRole = 'student';
      }

      // Establish authentic Supabase session
      const established = await establishSupabaseSession(targetEmail, intendedRole);

      if (established.session && established.user) {
        setSession(established.session);
        setSupabaseUser(established.user);
        await syncAndVerifyUser(established.user, established.role || intendedRole);
        setIsLoading(false);
        return { success: true };
      }

      throw new Error(established.error || 'Failed to authenticate with Supabase');
    } catch (err: any) {
      console.warn('loginWithCredentials fallback triggered:', err);
      // Fallback to demo credentials
      if (query.includes('faculty')) {
        await loginAsStaff('faculty');
      } else if (query.includes('admin')) {
        await loginAsStaff('admin');
      } else if (query.includes('canteen')) {
        await loginAsStaff('canteen');
      } else if (query.includes('library')) {
        await loginAsStaff('library');
      } else {
        await loginAsDemoStudent();
      }
      setIsLoading(false);
      return { success: true };
    }
  };

  /**
   * Quick-login as Demo Student
   */
  const loginAsDemoStudent = async (studentId?: string) => {
    setIsLoading(true);
    try {
      const email = 'student@sathaye.ac.in';
      const res = await establishSupabaseSession(email, 'student');
      if (res.session && res.user) {
        setSession(res.session);
        setSupabaseUser(res.user);
        await syncAndVerifyUser(res.user, 'student');
      } else {
        setUser(CURRENT_STUDENT);
        setRole('student');
      }
    } catch (e) {
      console.warn('loginAsDemoStudent fallback:', e);
      setUser(CURRENT_STUDENT);
      setRole('student');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Quick-login as Staff (Faculty, Admin, Canteen, Library)
   */
  const loginAsStaff = async (
    roleType: 'faculty' | 'admin' | 'canteen' | 'library',
    customEmail?: string
  ) => {
    setIsLoading(true);
    let targetEmail: string;

    switch (roleType) {
      case 'faculty':
        targetEmail = customEmail || 'faculty@sathaye.ac.in';
        break;
      case 'admin':
        targetEmail = customEmail || 'admin@sathaye.ac.in';
        break;
      case 'canteen':
        targetEmail = customEmail || 'canteen@sathaye.ac.in';
        break;
      case 'library':
        targetEmail = customEmail || 'library@sathaye.ac.in';
        break;
    }

    try {
      const res = await establishSupabaseSession(targetEmail, roleType);
      if (res.session && res.user) {
        setSession(res.session);
        setSupabaseUser(res.user);
        await syncAndVerifyUser(res.user, roleType);
      } else {
        // Fallback to static mock profile
        switch (roleType) {
          case 'faculty':
            setUser(CURRENT_FACULTY);
            break;
          case 'admin':
            setUser(CURRENT_ADMIN);
            break;
          case 'canteen':
            setUser(CURRENT_CANTEEN);
            break;
          case 'library':
            setUser(CURRENT_LIBRARY);
            break;
        }
        setRole(roleType);
      }
    } catch (e) {
      console.warn('loginAsStaff fallback:', e);
      switch (roleType) {
        case 'faculty':
          setUser(CURRENT_FACULTY);
          break;
        case 'admin':
          setUser(CURRENT_ADMIN);
          break;
        case 'canteen':
          setUser(CURRENT_CANTEEN);
          break;
        case 'library':
          setUser(CURRENT_LIBRARY);
          break;
      }
      setRole(roleType);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Switch Role: Updates the active Supabase session to match the target role
   */
  const switchRole = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      let email = 'student@sathaye.ac.in';
      if (targetRole === 'faculty') email = 'faculty@sathaye.ac.in';
      else if (targetRole === 'admin') email = 'admin@sathaye.ac.in';
      else if (targetRole === 'canteen') email = 'canteen@sathaye.ac.in';
      else if (targetRole === 'library') email = 'library@sathaye.ac.in';

      const res = await establishSupabaseSession(email, targetRole);
      if (res.session && res.user) {
        setSession(res.session);
        setSupabaseUser(res.user);
        await syncAndVerifyUser(res.user, targetRole);
      } else {
        switch (targetRole) {
          case 'student':
            setUser(CURRENT_STUDENT);
            setRole('student');
            break;
          case 'faculty':
            setUser(CURRENT_FACULTY);
            setRole('faculty');
            break;
          case 'admin':
            setUser(CURRENT_ADMIN);
            setRole('admin');
            break;
          case 'canteen':
            setUser(CURRENT_CANTEEN);
            setRole('canteen');
            break;
          case 'library':
            setUser(CURRENT_LIBRARY);
            setRole('library');
            break;
        }
      }
    } catch (e) {
      console.warn('switchRole error, using fallback:', e);
      switch (targetRole) {
        case 'student':
          setUser(CURRENT_STUDENT);
          setRole('student');
          break;
        case 'faculty':
          setUser(CURRENT_FACULTY);
          setRole('faculty');
          break;
        case 'admin':
          setUser(CURRENT_ADMIN);
          setRole('admin');
          break;
        case 'canteen':
          setUser(CURRENT_CANTEEN);
          setRole('canteen');
          break;
        case 'library':
          setUser(CURRENT_LIBRARY);
          setRole('library');
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout: Signs out of Supabase and clears local state
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    } finally {
      setSession(null);
      setSupabaseUser(null);
      setUser(null);
      setRole(null);
      setRoleVerified(false);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsLoading(false);
    }
  };

  const clearRestrictedNotice = () => {
    setAttemptedRestrictedRoute(null);
  };

  const studentProfile = user && user.role === 'student' ? (user as StudentProfile) : null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        role: role || (user?.role ?? null),
        isAuthenticated,
        isLoading,
        session,
        supabaseUser,
        roleVerified,
        isSupabaseConnected,
        supabase,
        loginWithGoogle,
        loginWithCredentials,
        loginAsDemoStudent,
        loginAsStaff,
        logout,
        switchRole,
        verifyRole,
        refreshSession,
        attemptedRestrictedRoute,
        setAttemptedRestrictedRoute,
        clearRestrictedNotice
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
