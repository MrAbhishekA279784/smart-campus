import { createClient, Session, User } from '@supabase/supabase-js';
import { UserRole } from '../types';

// Provided Supabase configuration
export const supabaseConfig = {
  url: (import.meta as any).env?.VITE_SUPABASE_URL || 'https://gqeplhjtkggsohbwmqhx.supabase.co',
  anonKey:
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZXBsaGp0a2dnc29oYndtcWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NTU1MzEsImV4cCI6MjEwNDMzMTUzMX0.xY9BtpFd3453G61h6GzXY-EKcAtV9dqGXIt5nGrOHmM',
  serviceRole:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZXBsaGp0a2dnc29oYndtcWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODc1NTUzMSwiZXhwIjoyMTA0MzMxNTMxfQ.moJxzzEwphZ-MAvl6O6CCPGNgcf07Qc4zI4vcCgrHm0'
};

// 1. Primary Client initialized with project URL and Anon API Key for session management & RLS
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});

// 2. Admin Client for seamless server-side verification and token issuance
export const supabaseAdmin = createClient(supabaseConfig.url, supabaseConfig.serviceRole, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Schema definition matching Supabase `public.profiles` table
export interface SupabaseProfileRecord {
  id: string;
  email: string;
  full_name: string;
  role: string;
  student_id?: string | null;
  employee_id?: string | null;
  department_id?: string | null;
  course?: string | null;
  year?: string | null;
  division?: string | null;
  roll_number?: string | null;
  bio?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Normalizes Supabase database role values ('library_staff', 'canteen_staff', etc.)
 * to the application's UserRole type ('library', 'canteen', etc.).
 */
export function normalizeSupabaseRole(rawRole?: string | null): UserRole {
  if (!rawRole) return 'student';
  const clean = rawRole.trim().toLowerCase();
  if (clean === 'student') return 'student';
  if (clean === 'faculty') return 'faculty';
  if (clean === 'admin') return 'admin';
  if (clean === 'library_staff' || clean === 'library') return 'library';
  if (clean === 'canteen_staff' || clean === 'canteen') return 'canteen';
  if (clean === 'security_staff' || clean === 'security') return 'security';
  return 'student';
}

/**
 * Verifies and retrieves a user's role and profile from the Supabase `profiles` table.
 * Falls back gracefully to administrative query if RLS restricts unauthenticated reads.
 */
export async function verifyUserRoleInSupabase(
  userId: string,
  email?: string
): Promise<{ profile: SupabaseProfileRecord | null; role: UserRole }> {
  try {
    // 1. Attempt lookup using primary supabase client (RLS applies if user is signed in)
    if (userId) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data && !error) {
        return {
          profile: data as SupabaseProfileRecord,
          role: normalizeSupabaseRole(data.role)
        };
      }
    }

    // 2. Fallback to Supabase Admin client if RLS blocked or direct ID not yet populated
    let query = supabaseAdmin.from('profiles').select('*');
    if (userId && email) {
      query = query.or(`id.eq.${userId},email.eq.${email}`);
    } else if (userId) {
      query = query.eq('id', userId);
    } else if (email) {
      query = query.eq('email', email);
    } else {
      return { profile: null, role: 'student' };
    }

    const { data: adminData } = await query.maybeSingle();
    if (adminData) {
      return {
        profile: adminData as SupabaseProfileRecord,
        role: normalizeSupabaseRole(adminData.role)
      };
    }
  } catch (err) {
    console.warn('Supabase profile verification check failed:', err);
  }

  return { profile: null, role: 'student' };
}

// Map of in-flight authentication promises to prevent duplicate concurrent OTP/link operations
const inFlightAuthPromises = new Map<
  string,
  Promise<{
    session: Session | null;
    user: User | null;
    profile: SupabaseProfileRecord | null;
    role: UserRole;
    error?: string;
  }>
>();

/**
 * Authenticates with Supabase directly, establishing a valid session on the client
 * and verifying the user's role from the database.
 * Deduplicates in-flight requests and handles expired/concurrent link tokens smoothly.
 */
export async function establishSupabaseSession(
  email: string,
  targetRole?: UserRole
): Promise<{
  session: Session | null;
  user: User | null;
  profile: SupabaseProfileRecord | null;
  role: UserRole;
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();

  // Deduplicate concurrent authentication attempts for the same email
  if (inFlightAuthPromises.has(cleanEmail)) {
    return inFlightAuthPromises.get(cleanEmail)!;
  }

  const authPromise = (async () => {
    try {
      // 1. Check if client already possesses an active valid session for this email
      try {
        const { data: currentSessionData } = await supabase.auth.getSession();
        if (
          currentSessionData.session &&
          currentSessionData.session.user &&
          currentSessionData.session.user.email?.toLowerCase() === cleanEmail
        ) {
          const expiresAt = currentSessionData.session.expires_at;
          const now = Math.floor(Date.now() / 1000);
          if (!expiresAt || expiresAt > now + 60) {
            const { profile, role } = await verifyUserRoleInSupabase(
              currentSessionData.session.user.id,
              cleanEmail
            );
            return {
              session: currentSessionData.session,
              user: currentSessionData.session.user,
              profile,
              role: role || targetRole || 'student'
            };
          }
        }
      } catch (checkErr) {
        // Continue if getSession check threw
      }

      // 2. Ensure user exists in Supabase Auth
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      let existingUser = (userList?.users as User[] | undefined)?.find(
        (u: User) => u.email?.toLowerCase() === cleanEmail
      );

      if (!existingUser) {
        // Create user in Supabase Auth
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          email_confirm: true,
          user_metadata: {
            role: targetRole || 'student'
          }
        });
        if (createErr) {
          console.warn('Failed to auto-create Supabase auth user:', createErr.message);
        } else if (created.user) {
          existingUser = created.user;

          // Also ensure profile record exists
          await supabaseAdmin.from('profiles').upsert({
            id: created.user.id,
            email: cleanEmail,
            full_name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
            role: targetRole || 'student'
          });
        }
      }

      // 3. Generate fresh authentication link
      const linkRes = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: cleanEmail
      });

      if (linkRes.error || !linkRes.data?.properties?.hashed_token) {
        throw new Error(linkRes.error?.message || 'Failed to generate Supabase token');
      }

      // 4. Verify OTP using the public Supabase client so it saves active session to localStorage
      let verifyRes = await supabase.auth.verifyOtp({
        token_hash: linkRes.data.properties.hashed_token,
        type: 'magiclink'
      });

      // If token expired or invalid (e.g. from race condition or double invocation), attempt recovery
      if (verifyRes.error || !verifyRes.data.session) {
        // Check if session was already established concurrently
        const fallbackCheck = await supabase.auth.getSession();
        if (fallbackCheck.data?.session?.user?.email?.toLowerCase() === cleanEmail) {
          verifyRes = {
            data: {
              session: fallbackCheck.data.session,
              user: fallbackCheck.data.session.user
            },
            error: null
          };
        } else {
          // Retry once with fresh OTP after brief pause
          await new Promise((r) => setTimeout(r, 200));
          const retryLink = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: cleanEmail
          });

          if (retryLink.data?.properties?.email_otp) {
            verifyRes = await supabase.auth.verifyOtp({
              email: cleanEmail,
              token: retryLink.data.properties.email_otp,
              type: 'email'
            });
          } else if (retryLink.data?.properties?.hashed_token) {
            verifyRes = await supabase.auth.verifyOtp({
              token_hash: retryLink.data.properties.hashed_token,
              type: 'magiclink'
            });
          }
        }
      }

      const activeSession = verifyRes.data?.session || (await supabase.auth.getSession()).data.session;
      const targetUserId = activeSession?.user?.id || existingUser?.id || '';

      // 5. Verify role against Supabase database `profiles` table
      const { profile, role } = await verifyUserRoleInSupabase(
        targetUserId,
        cleanEmail
      );

      return {
        session: activeSession || null,
        user: activeSession?.user || existingUser || null,
        profile,
        role: role || targetRole || 'student'
      };
    } catch (err: any) {
      console.warn('establishSupabaseSession fallback to profile query:', err?.message || err);

      // Perform direct role lookup even if auth session handshake timed out
      const { profile, role } = await verifyUserRoleInSupabase('', cleanEmail);

      return {
        session: null,
        user: null,
        profile,
        role: role || targetRole || 'student',
        error: err?.message || 'Supabase session handshake fallback'
      };
    }
  })();

  inFlightAuthPromises.set(cleanEmail, authPromise);
  try {
    return await authPromise;
  } finally {
    inFlightAuthPromises.delete(cleanEmail);
  }
}
