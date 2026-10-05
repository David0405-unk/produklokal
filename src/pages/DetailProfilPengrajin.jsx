import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { linkWhatsApp } from '../utils/kontak';
import { supabase } from '../lib/supabaseClient';

function DetailProfilPengrajin() {
  const { id } = useParams();
  const [g, setG] = useState(null);
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [a, b] = await Promise.all([
        supabase.from('users').select('*').eq('id', id).maybeSingle(),
        supabase.from('produk_kerajinan').select('*').eq('id_pengrajin', id)
          .eq('status_publikasi', 'Disetujui').order('created_at', { ascending: false }),
      ]);
      setG(a.data);
      setProduk(b.data || []);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        {loading ? <p>Memuat...</p> : !g ? <p>Pengrajin tidak ditemukan.</p> : (
          <>
            <div className="profile-head">
              <div className="avatar-big">{g.foto_url ? <img src={g.foto_url} alt={g.nama} /> : g.nama[0]}</div>
              <div>
                <h1>{g.nama}</h1>
                <p className="muted">{g.wilayah || 'Sulawesi Utara'}</p>
                <p>{g.biodata || 'Pengrajin ini belum menulis biodata.'}</p>
              </div>
              {linkWhatsApp(g.kontak_wa, '') && (
                <a
                  className="btn btn-wa btn-small"
                  href={linkWhatsApp(g.kontak_wa, `Halo ${g.nama}, saya melihat profil Anda di Pengrajin Lokal dan ingin bertanya soal produk.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hubungi via WhatsApp
                </a>
              )}
            </div>
            <h2>Karya {g.nama}</h2>
            {produk.length === 0 ? <p>Belum ada produk yang dipublikasikan.</p> : (
              <div className="product-grid">
                {produk.map((p) => (
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
          </>
        )}
      </main>
    </div>
  );
}

export default DetailProfilPengrajin;
