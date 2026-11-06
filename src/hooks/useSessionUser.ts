import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Reads Member 2's existing Supabase session only. No second auth system.
export function useSessionUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  const isAdmin = user?.app_metadata?.role === 'admin'; // must match public.is_admin()
  return { user, loading, isAdmin };
}
