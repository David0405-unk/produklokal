import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import PasswordInput from '../components/PasswordInput';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const { data: akun } = await supabase.from('users').select('aktif').eq('id', data.user.id).maybeSingle();
    if (!akun || akun.aktif === false) {
      await supabase.auth.signOut();
      setError('Akun tidak aktif atau sudah dihapus oleh admin.');
      return;
    }

    const role = data.user.user_metadata?.role;
    navigate(role === 'admin' ? '/admin' : '/produk-saya');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-logo">MC</div>
          <div className="auth-brand">MinahasaCraft</div>
          <h1 className="auth-welcome">Selamat Datang Kembali!</h1>
          <p className="auth-tagline">Masuk untuk mengelola produk kerajinan dan profil Anda.</p>
          <Link to="/register" className="btn-outline-white">Daftar</Link>
        </div>

        <div className="auth-right">
          <h1>Masuk</h1>
          <p className="auth-subtitle">Masuk sebagai pengrajin atau admin</p>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
             <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} required />
             <p className="auth-link-line"><Link to="/lupa-password">Lupa kata sandi?</Link></p>
             {location.state?.pesan && <p className="success">{location.state.pesan}</p>}
             {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Masuk'}</button>
          </form>
          <p className="switch-auth">Belum punya akun? <Link to="/register">Daftar sebagai pengrajin</Link></p>
          <p className="switch-auth"><Link to="/">Lanjut sebagai pengunjung</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;