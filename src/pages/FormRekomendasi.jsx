import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabaseClient';
import { urutkanRekomendasi, DAFTAR_TUJUAN } from '../utils/hitungRekomendasi';

function FormRekomendasi() {
  const [semua, setSemua] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [f, setF] = useState({ bahan: '', kategori: '', tujuan: '', min: '', max: '' });
  const [hasil, setHasil] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [a, b] = await Promise.all([
        supabase.from('produk_kerajinan').select('*').eq('status_publikasi', 'Disetujui'),
        supabase.from('kategori').select('*').order('nama_kategori'),
      ]);
      setSemua(a.data || []);
      setKategoriList(b.data || []);
    };
    fetchData();
  }, []);

  const bahanUnik = [...new Set(semua.map((p) => p.bahan).filter(Boolean))].sort();
  const ubah = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const handleCari = async (e) => {
    e.preventDefault();
    setError('');
    if (!f.bahan && !f.kategori && !f.tujuan && !f.max) {
      setError('Isi minimal satu preferensi.');
      return;
    }
    if (f.max && Number(f.min || 0) > Number(f.max)) {
      setError('Anggaran minimum tidak boleh lebih besar dari maksimum.');
      return;
    }
    const preferensi = {
      bahan: f.bahan,
      kategori: f.kategori,
      tujuan: f.tujuan,
      anggaranMin: f.max ? Number(f.min || 0) : null,
      anggaranMax: f.max ? Number(f.max) : null,
    };
    setHasil(urutkanRekomendasi(semua, preferensi));
    await supabase.from('preferensi_rekomendasi').insert({
      bahan: f.bahan || null,
      id_kategori: f.kategori || null,
      tujuan: f.tujuan || null,
      anggaran_min: preferensi.anggaranMin,
      anggaran_max: preferensi.anggaranMax,
    });
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <h1>Rekomendasi Produk</h1>
        <p className="muted">Isi preferensimu, sistem akan mengurutkan produk dari yang paling cocok.</p>

        <form className="form-card" onSubmit={handleCari}>
          {error && <p className="error">{error}</p>}
          <label>Jenis Bahan
            <select name="bahan" value={f.bahan} onChange={ubah}>
              <option value="">Bebas</option>
              {bahanUnik.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </label>
          <label>Kategori
            <select name="kategori" value={f.kategori} onChange={ubah}>
              <option value="">Bebas</option>
              {kategoriList.map((k) => <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>)}
            </select>
          </label>
          <label>Tujuan Pembelian
            <select name="tujuan" value={f.tujuan} onChange={ubah}>
              <option value="">Bebas</option>
              {DAFTAR_TUJUAN.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <div className="form-row">
            <label>Anggaran Min (Rp)<input type="number" min="0" name="min" value={f.min} onChange={ubah} /></label>
            <label>Anggaran Maks (Rp)<input type="number" min="0" name="max" value={f.max} onChange={ubah} /></label>
          </div>
          <button type="submit" className="btn">Tampilkan Rekomendasi</button>
        </form>

        {hasil && (hasil.length === 0 ? (
          <p>Belum ada produk yang cocok. Coba longgarkan preferensimu.</p>
        ) : (
          <>
            <h2>{hasil.length} produk cocok</h2>
            <div className="product-grid">
              {hasil.map((p) => (
                <Link to={`/produk/${p.id_produk}`} key={p.id_produk} className="product-card">
                  {p.foto_url && <img src={p.foto_url} alt={p.nama_produk} />}
                  <div className="product-card-body">
                    <h3>{p.nama_produk}</h3>
                    <p>{p.bahan}</p>
                    <p className="product-price">Rp{Number(p.harga).toLocaleString('id-ID')}</p>
                    <p className="match">Skor kecocokan: {p.skor_kecocokan}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ))}
      </main>
    </div>
  );
}

export default FormRekomendasi;