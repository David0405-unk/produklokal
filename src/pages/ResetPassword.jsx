import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import PasswordInput from '../components/PasswordInput';

function ResetPassword() {
  const [siap, setSiap] = useState(false);
  const [cek, setCek] = useState(true);
  const [password, setPassword] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) setSiap(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setSiap(true); });
    // Beri waktu singkat bagi Supabase untuk membaca tautan sebelum dianggap tidak valid
    const t = setTimeout(() => setCek(false), 1500);
    return () => { sub.subscription.unsubscribe(); clearTimeout(t); };
  }, []);

  const handleSimpan = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (password !== konfirmasi) {
      setError('Kata sandi dan konfirmasi tidak cocok.');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }
    await supabase.auth.signOut();
    navigate('/login', { state: { pesan: 'Kata sandi berhasil diubah. Silakan masuk dengan kata sandi baru.' } });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-logo">PL</div>
          <div className="auth-brand">Pengrajin Lokal</div>
          <h1 className="auth-welcome">Buat Kata Sandi Baru</h1>
          <p className="auth-tagline">Gunakan kata sandi yang mudah kamu ingat tapi sulit ditebak orang lain.</p>
        </div>

        <div className="auth-right">
          <h1>Kata Sandi Baru</h1>
          {siap ? (
            <form onSubmit={handleSimpan}>
              <PasswordInput placeholder="Kata Sandi Baru" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <PasswordInput placeholder="Konfirmasi Kata Sandi Baru" value={konfirmasi} onChange={(e) => setKonfirmasi(e.target.value)} required />
              {error && <p className="error">{error}</p>}
              <button type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Kata Sandi'}</button>
            </form>
          ) : cek ? (
            <p className="auth-subtitle">Memverifikasi tautan...</p>
          ) : (
            <>
              <p className="error">Tautan tidak valid atau sudah kedaluwarsa.</p>
              <p className="switch-auth"><Link to="/lupa-password">Minta tautan baru</Link></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;