import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function ProdukSaya() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const muat = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const [a, b] = await Promise.all([
      supabase.from('produk_kerajinan').select('*').eq('id_pengrajin', user.id).order('created_at', { ascending: false }),
      supabase.from('kategori').select('id_kategori, nama_kategori'),
    ]);
    if (a.error) setError(a.error.message);
    const namaK = Object.fromEntries((b.data || []).map((k) => [k.id_kategori, k.nama_kategori]));
    setList((a.data || []).map((p) => ({ ...p, nama_kategori: namaK[p.id_kategori] })));
    setLoading(false);
  }, []);

  useEffect(() => { muat(); }, [muat]);

  const hapus = async (p) => {
    if (!window.confirm(`Hapus "${p.nama_produk}"?`)) return;
    await supabase.from('produk_kerajinan').delete().eq('id_produk', p.id_produk);
    muat();
  };

  return (
    <>
      <div className="page-bar">
        <h1>Produk Saya</h1>
        <Link to="/tambah-produk" className="btn btn-small">Tambah Produk</Link>
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? <p>Memuat...</p> : list.length === 0 ? (
        <p className="muted">Belum ada produk. Tambahkan karya pertamamu.</p>
      ) : list.map((p) => (
        <div className="list-item" key={p.id_produk}>
          <div>
            <strong>{p.nama_produk}</strong>
            <p className="muted">{p.nama_kategori || 'Tanpa kategori'} · Rp{Number(p.harga).toLocaleString('id-ID')}</p>
            <span className={`badge badge-${p.status_publikasi.toLowerCase()}`}>
              {p.status_publikasi === 'Menunggu' ? 'Menunggu verifikasi' : p.status_publikasi}
            </span>
            {p.status_publikasi === 'Ditolak' && (
              <p className="reject-note">
                <strong>Alasan penolakan:</strong> {p.alasan_penolakan || 'Admin tidak mencantumkan alasan.'}
                <br />Perbaiki lewat tombol Ubah, lalu produk akan diverifikasi ulang.
              </p>
            )}
          </div>
          <div className="list-actions">
            <Link to={`/edit-produk/${p.id_produk}`} className="btn btn-small btn-outline">Ubah</Link>
            <button className="btn btn-small btn-danger" onClick={() => hapus(p)}>Hapus</button>
          </div>
        </div>
      ))}
    </>
  );
}

export default ProdukSaya;