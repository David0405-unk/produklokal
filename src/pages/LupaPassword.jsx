import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function LupaPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [terkirim, setTerkirim] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleKirim = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setTerkirim(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-logo">MC</div>
          <div className="auth-brand">MinahasaCraft</div>
          <h1 className="auth-welcome">Lupa Kata Sandi?</h1>
          <p className="auth-tagline">Tenang, kami kirim tautan ke email untuk membuat kata sandi baru.</p>
          <Link to="/login" className="btn-outline-white">Kembali Masuk</Link>
        </div>

        <div className="auth-right">
          <h1>Atur Ulang Kata Sandi</h1>
          {terkirim ? (
            <>
              <p className="success">
                Jika email terdaftar, tautan pengaturan ulang sudah dikirim. Cek kotak masuk dan folder spam.
              </p>
              <p className="switch-auth"><Link to="/login">Kembali ke halaman masuk</Link></p>
            </>
          ) : (
            <>
              <p className="auth-subtitle">Masukkan email akun pengrajin atau admin</p>
              <form onSubmit={handleKirim}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Tautan'}</button>
              </form>
              <p className="switch-auth"><Link to="/login">Kembali ke halaman masuk</Link></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LupaPassword;