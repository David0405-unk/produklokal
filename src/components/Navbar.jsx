import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function Navbar({ role }) {
  const [nama, setNama] = useState('');
  const [roleAktif, setRoleAktif] = useState(role || null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setNama(session.user.user_metadata?.nama || session.user.email);
        if (!role) setRoleAktif(session.user.user_metadata?.role || null);
      }
    };
    getUser();
  }, [role]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRoleAktif(null);
    navigate('/login');
  };

  const menuPublik = [
    { to: '/', label: 'Beranda' },
    { to: '/jelajah', label: 'Jelajah' },
    { to: '/rekomendasi', label: 'Rekomendasi' },
  ];
  const menuPengrajin = [
    { to: '/', label: 'Beranda' },
    { to: '/jelajah', label: 'Jelajah' },
    { to: '/produk-saya', label: 'Produk Saya' },
    { to: '/tambah-produk', label: 'Tambah Produk' },
    { to: '/profil', label: 'Profil' },
  ];
  const menuAdmin = [
    { to: '/admin', label: 'Verifikasi' },
    { to: '/admin/kategori', label: 'Kategori' },
  ];

  const menu = roleAktif === 'admin' ? menuAdmin : roleAktif === 'pengrajin' ? menuPengrajin : menuPublik;

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="brand-logo">MC</div>
        <div>
          <div className="brand-name">MinahasaCraft</div>
          <div className="brand-sub">Sulawesi Utara</div>
        </div>
      </div>

      <nav className="topbar-menu">
        {menu.map((item) => (
          <NavLink key={item.to} to={item.to} end className={({ isActive }) => 'menu-item' + (isActive ? ' active' : '')}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="topbar-user">
        {roleAktif ? (
          <>
            <div className="user-avatar">{nama?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div className="user-name">{nama}</div>
              <div className="user-role">{roleAktif === 'admin' ? 'Admin' : 'Pengrajin'}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Keluar</button>
          </>
        ) : (
          <NavLink to="/login" className="menu-item">Masuk / Daftar</NavLink>
        )}
      </div>
    </header>
  );
}

export default Navbar;