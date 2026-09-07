import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';

// Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyAh9gUxSUlZSRZrrFZLTYX59hyruXIG4kA",
  authDomain: "smart-sathaye.firebaseapp.com",
  projectId: "smart-sathaye",
  storageBucket: "smart-sathaye.firebasestorage.app",
  messagingSenderId: "213587581314",
  appId: "1:213587581314:web:9ef1cb9b57984197ab179b",
  measurementId: "G-LHHV7B7RJM"
};

// Re-export Supabase client and helpers from dedicated supabase module
export {
  supabase,
  supabaseAdmin,
  supabaseConfig,
  normalizeSupabaseRole,
  verifyUserRoleInSupabase,
  establishSupabaseSession
} from './supabase';
export type { SupabaseProfileRecord } from './supabase';
