import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabaseClient';
import { linkWhatsApp } from '../utils/kontak';

function DetailProduk() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [kategori, setKategori] = useState(null);
  const [pengrajin, setPengrajin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error: err } = await supabase.from('produk_kerajinan').select('*').eq('id_produk', id).maybeSingle();
      if (err) setError(err.message);
      setP(data);
      if (data) {
        // Diambil terpisah supaya tidak bergantung pada relasi foreign key
        const [k, u] = await Promise.all([
          data.id_kategori ? supabase.from('kategori').select('nama_kategori').eq('id_kategori', data.id_kategori).maybeSingle() : { data: null },
          data.id_pengrajin ? supabase.from('users').select('id, nama, wilayah, biodata, kontak_wa').eq('id', data.id_pengrajin).maybeSingle() : { data: null },
        ]);
        setKategori(k.data);
        setPengrajin(u.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        {loading ? <p>Memuat...</p> : !p ? (
          <>
            <p>Produk tidak ditemukan.</p>
            {error && <p className="error">{error}</p>}
          </>
        ) : (
          <div className="detail-grid">
            <div className="detail-foto">
              {p.foto_url ? <img src={p.foto_url} alt={p.nama_produk} /> : <span>Belum ada foto</span>}
            </div>
            <div>
              {kategori?.nama_kategori && <span className="chip">{kategori.nama_kategori}</span>}
              <h1>{p.nama_produk}</h1>
              <p className="product-price big">Rp{Number(p.harga).toLocaleString('id-ID')}</p>
              <dl className="spec">
                <dt>Bahan</dt><dd>{p.bahan}</dd>
                <dt>Teknik</dt><dd>{p.teknik_pembuatan || '-'}</dd>
                <dt>Wilayah</dt><dd>{p.wilayah_asal || '-'}</dd>
              </dl>
              {p.deskripsi && <><h3>Deskripsi</h3><p>{p.deskripsi}</p></>}
              {p.makna_motif && <><h3>Makna dan Cerita Motif</h3><p>{p.makna_motif}</p></>}
              {pengrajin && (
                <Link to={`/pengrajin/${pengrajin.id}`} className="info-box">
                  <strong>{pengrajin.nama}</strong>
                  <span>{pengrajin.wilayah}</span>
                  <span>{pengrajin.biodata?.slice(0, 120)}</span>
                </Link>
              )}
              {pengrajin && (
                <div className="contact-box">
                  <h3>Cara memesan</h3>
                  {linkWhatsApp(pengrajin.kontak_wa, '') ? (
                    <>
                      <p>Hubungi pengrajin langsung untuk menanyakan ketersediaan, ongkos kirim, dan pembayaran.</p>
                      <a
                        className="btn btn-wa"
                        href={linkWhatsApp(
                          pengrajin.kontak_wa,
                          `Halo ${pengrajin.nama}, saya tertarik dengan produk "${p.nama_produk}" yang saya lihat di Pengrajin Lokal. Apakah masih tersedia?`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Pesan via WhatsApp
                      </a>
                    </>
                  ) : (
                    <p className="muted">Pengrajin ini belum mencantumkan kontak pemesanan.</p>
                  )}
               </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DetailProduk;