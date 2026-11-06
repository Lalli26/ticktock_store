import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSessionUser } from '../../hooks/useSessionUser';

/** UI guard only. Real protection is RLS (public.is_admin()). */
export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useSessionUser();
  if (loading) return <main className="tt-wrap"><p className="tt-muted">Checking access…</p></main>;
  if (!user) return <main className="tt-wrap tt-empty"><h2>Please log in</h2><Link to="/login">Go to login</Link></main>;
  if (!isAdmin) return <main className="tt-wrap tt-empty"><h2>Admins only</h2><p>You don’t have permission to manage products.</p></main>;
  return <>{children}</>;
}
