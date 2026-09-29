import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabaseClient';

function Beranda() {
  const [produkUnggulan, setProdukUnggulan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('produk_kerajinan')
        .select('*')
        .eq('status_publikasi', 'Disetujui')
        .order('created_at', { ascending: false })
        .limit(6);
      if (!error) setProdukUnggulan(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <div className="hero-card">
          <h2>Kerajinan Lokal Sulawesi Utara</h2>
          <p>Temukan produk kerajinan asli dari para pengrajin lokal, lengkap dengan cerita dan makna di baliknya.</p>
          <Link to="/jelajah" className="btn-hero">Jelajahi Produk</Link>
        </div>

        <h1>Produk Unggulan</h1>
        {loading ? (
          <p>Memuat...</p>
        ) : produkUnggulan.length === 0 ? (
          <p>Belum ada produk yang dipublikasikan.</p>
        ) : (
          <div className="product-grid">
            {produkUnggulan.map((p) => (
              <Link to={`/produk/${p.id_produk}`} key={p.id_produk} className="product-card">
                {p.foto_url && <img src={p.foto_url} alt={p.nama_produk} />}
                <div className="product-card-body">
                  <h3>{p.nama_produk}</h3>
                  <p>{p.bahan}</p>
                  <p className="product-price">Rp{Number(p.harga).toLocaleString('id-ID')}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Beranda;