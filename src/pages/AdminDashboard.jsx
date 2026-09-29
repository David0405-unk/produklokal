import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const rp = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');

function AdminDashboard() {
  const [tab, setTab] = useState('verifikasi');
  const [users, setUsers] = useState([]);
  const [produk, setProduk] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [buka, setBuka] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const muat = useCallback(async () => {
    const [u, p, k] = await Promise.all([
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('produk_kerajinan').select('*').order('created_at'),
      supabase.from('kategori').select('id_kategori, nama_kategori'),
    ]);
    const err = [u, p, k].find((r) => r.error);
    setError(err ? 'Gagal memuat data: ' + err.error.message : '');
    setUsers(u.data || []);
    setProduk(p.data || []);
    setKategori(k.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { muat(); }, [muat]);

  const namaU = Object.fromEntries(users.map((x) => [x.id, x.nama]));
  const namaK = Object.fromEntries(kategori.map((x) => [x.id_kategori, x.nama_kategori]));
  const pengrajin = users.filter((x) => x.role === 'pengrajin');
  const antrian = produk.filter((x) => x.status_publikasi === 'Menunggu');
  const tayang = produk.filter((x) => x.status_publikasi === 'Disetujui');
  const jumlahProduk = (id) => produk.filter((x) => x.id_pengrajin === id).length;

  const putuskan = async (id, status) => {
    const { error: er } = await supabase.from('produk_kerajinan').update({ status_publikasi: status }).eq('id_produk', id);
    if (er) setError('Gagal menyimpan: ' + er.message);
    setBuka(null);
    muat();
  };

  const toggleAktif = async (u) => {
    const { error: er } = await supabase.from('users').update({ aktif: !u.aktif }).eq('id', u.id);
    if (er) setError('Gagal mengubah status: ' + er.message);
    muat();
  };

  const hapusAkun = async (u) => {
    if (!window.confirm(`Hapus pengrajin ${u.nama} beserta semua produknya? Tindakan ini tidak bisa dibatalkan.`)) return;
    await supabase.from('produk_kerajinan').delete().eq('id_pengrajin', u.id);
    const { error: er } = await supabase.from('users').delete().eq('id', u.id);
    if (er) setError('Gagal menghapus: ' + er.message);
    muat();
  };

  return (
    <>
      <div className="page-bar">
        <h1>Dashboard Admin</h1>
        <Link to="/admin/kategori" className="btn btn-small btn-outline">Kelola Kategori</Link>
      </div>

      <div className="stats">
        <div><strong>{pengrajin.length}</strong><span>Pengrajin</span></div>
        <div><strong>{produk.length}</strong><span>Total produk</span></div>
        <div><strong>{tayang.length}</strong><span>Produk tayang</span></div>
        <div><strong>{antrian.length}</strong><span>Menunggu verifikasi</span></div>
      </div>

      <div className="tabs">
        <button className={tab === 'verifikasi' ? 'on' : ''} onClick={() => setTab('verifikasi')}>Verifikasi Konten ({antrian.length})</button>
        <button className={tab === 'akun' ? 'on' : ''} onClick={() => setTab('akun')}>Akun Pengrajin ({pengrajin.length})</button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Memuat...</p>}

      {!loading && tab === 'verifikasi' && (antrian.length === 0 ? (
        <p className="muted">Tidak ada produk yang menunggu verifikasi.</p>
      ) : antrian.map((p) => (
        <div className="list-item" key={p.id_produk}>
          <div>
            <strong>{p.nama_produk}</strong>
            <p className="muted">{namaU[p.id_pengrajin] || 'Pengrajin'} · {namaK[p.id_kategori] || 'Tanpa kategori'} · {rp(p.harga)}</p>
          </div>
          <div className="list-actions">
            <button className="btn btn-small btn-outline" onClick={() => setBuka(buka === p.id_produk ? null : p.id_produk)}>
              {buka === p.id_produk ? 'Tutup' : 'Lihat detail'}
            </button>
          </div>

          {buka === p.id_produk && (
            <div className="review">
              {p.foto_url ? <img src={p.foto_url} alt={p.nama_produk} /> : <div className="detail-foto"><span>Tanpa foto</span></div>}
              <div>
                <dl className="spec">
                  <dt>Pengrajin</dt><dd>{namaU[p.id_pengrajin] || '-'}</dd>
                  <dt>Kategori</dt><dd>{namaK[p.id_kategori] || '-'}</dd>
                  <dt>Harga</dt><dd>{rp(p.harga)}</dd>
                  <dt>Bahan</dt><dd>{p.bahan}</dd>
                  <dt>Teknik</dt><dd>{p.teknik_pembuatan || '-'}</dd>
                  <dt>Wilayah</dt><dd>{p.wilayah_asal || '-'}</dd>
                  <dt>Cocok untuk</dt><dd>{p.tujuan || '-'}</dd>
                </dl>
                <h3>Deskripsi</h3>
                <p>{p.deskripsi || '-'}</p>
                <h3>Makna dan cerita motif</h3>
                <p>{p.makna_motif || '-'}</p>
                <div className="list-actions">
                  <button className="btn btn-small" onClick={() => putuskan(p.id_produk, 'Disetujui')}>Setujui</button>
                  <button className="btn btn-small btn-danger" onClick={() => putuskan(p.id_produk, 'Ditolak')}>Tolak</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )))}

      {!loading && tab === 'akun' && (pengrajin.length === 0 ? (
        <p className="muted">Belum ada pengrajin terdaftar.</p>
      ) : pengrajin.map((u) => (
        <div className="list-item" key={u.id}>
          <div>
            <strong>{u.nama}</strong>
            <p className="muted">{u.wilayah || 'Lokasi belum diisi'} · {jumlahProduk(u.id)} produk</p>
            <span className={`badge ${u.aktif ? 'badge-disetujui' : 'badge-ditolak'}`}>{u.aktif ? 'Aktif' : 'Nonaktif'}</span>
          </div>
          <div className="list-actions">
            <Link to={`/pengrajin/${u.id}`} className="btn btn-small btn-outline">Lihat profil</Link>
            <button className="btn btn-small btn-outline" onClick={() => toggleAktif(u)}>{u.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button>
            <button className="btn btn-small btn-danger" onClick={() => hapusAkun(u)}>Hapus</button>
          </div>
        </div>
      )))}
    </>
  );
}

export default AdminDashboard;