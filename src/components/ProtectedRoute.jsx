import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from './Navbar';

function ProtectedRoute({ children, requiredRole }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const role = session?.user?.user_metadata?.role;
      setAllowed(!!session && (!requiredRole || role === requiredRole));
      setLoading(false);
    };
    check();
  }, [requiredRole]);

  if (loading) return <p className="loading-text">Memuat...</p>;
  if (!allowed) return <Navigate to="/login" />;

  return (
    <div className="app-shell">
      <Navbar role={requiredRole} />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default ProtectedRoute;