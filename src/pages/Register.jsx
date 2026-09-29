import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import PasswordInput from '../components/PasswordInput';

function Register() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== konfirmasi) {
      setError('Password dan konfirmasi tidak cocok.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nama, role: 'pengrajin' } }
    });
    setLoading(false);

    if (error) setError(error.message);
    else navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-logo">PL</div>
          <div className="auth-brand">Pengrajin Lokal</div>
          <h1 className="auth-welcome">Bergabung Bersama Kami</h1>
          <p className="auth-tagline">Daftarkan diri sebagai pengrajin dan perkenalkan karya Anda ke lebih banyak orang.</p>
          <Link to="/login" className="btn-outline-white">Masuk</Link>
        </div>

        <div className="auth-right">
          <h1>Daftar Pengrajin</h1>
          <p className="auth-subtitle">Lengkapi data untuk membuat akun</p>
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Nama Lengkap" value={nama} onChange={(e) => setNama(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} required />
            <PasswordInput placeholder="Konfirmasi Kata Sandi" value={konfirmasi} onChange={(e) => setKonfirmasi(e.target.value)} required />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Daftar'}</button>
          </form>
          <p className="switch-auth">Sudah punya akun? <Link to="/login">Masuk</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;