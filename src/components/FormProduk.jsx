import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { DAFTAR_TUJUAN } from '../utils/hitungRekomendasi';

const KOSONG = {
  nama_produk: '', id_kategori: '', bahan: '', teknik_pembuatan: '',
  harga: '', wilayah_asal: '', tujuan: '', deskripsi: '', makna_motif: '', foto_url: '',
};

// Dipakai bersama oleh TambahProduk dan EditProduk
function FormProduk({ initial, submitLabel, onSubmit }) {
  const [v, setV] = useState({ ...KOSONG, ...initial });
  const [kategoriList, setKategoriList] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('kategori').select('*').order('nama_kategori').then(({ data }) => setKategoriList(data || []));
  }, []);

  const ubah = (e) => setV({ ...v, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!v.nama_produk.trim() || !v.bahan.trim() || !v.id_kategori) {
      setError('Nama produk, kategori, dan bahan wajib diisi.');
      return;
    }
    if (v.harga === '' || Number(v.harga) < 0) {
      setError('Harga harus berupa angka 0 atau lebih.');
      return;
    }
    setLoading(true);
    let foto_url = v.foto_url;
    if (file) {
      const { data: { user } } = await supabase.auth.getUser();
      const path = `${user.id}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const { error: upErr } = await supabase.storage.from('produk').upload(path, file);
      if (upErr) {
        setLoading(false);
        setError('Foto gagal diunggah: ' + upErr.message);
        return;
      }
      foto_url = supabase.storage.from('produk').getPublicUrl(path).data.publicUrl;
    }
    const isi = {};
    Object.keys(KOSONG).forEach((k) => { isi[k] = v[k] === '' ? null : v[k]; });
    const err = await onSubmit({ ...isi, foto_url, harga: Number(v.harga) });
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <label>Nama Produk<input name="nama_produk" value={v.nama_produk} onChange={ubah} /></label>
      <label>Kategori
        <select name="id_kategori" value={v.id_kategori || ''} onChange={ubah}>
          <option value="">Pilih kategori</option>
          {kategoriList.map((k) => <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>)}
        </select>
      </label>
      <label>Bahan<input name="bahan" value={v.bahan} onChange={ubah} placeholder="Contoh: rotan" /></label>
      <label>Teknik Pembuatan<input name="teknik_pembuatan" value={v.teknik_pembuatan || ''} onChange={ubah} /></label>
      <div className="form-row">
        <label>Harga (Rp)<input name="harga" type="number" min="0" value={v.harga} onChange={ubah} /></label>
        <label>Wilayah Asal<input name="wilayah_asal" value={v.wilayah_asal || ''} onChange={ubah} placeholder="Contoh: Minahasa" /></label>
      </div>
      <label>Cocok untuk (tujuan pembelian)
        <select name="tujuan" value={v.tujuan || ''} onChange={ubah}>
          <option value="">Pilih tujuan</option>
          {DAFTAR_TUJUAN.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <label>Deskripsi<textarea name="deskripsi" rows="3" value={v.deskripsi || ''} onChange={ubah} /></label>
      <label>Cerita / Makna Motif<textarea name="makna_motif" rows="3" value={v.makna_motif || ''} onChange={ubah} /></label>
      <label>Foto Produk<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} /></label>
      {v.foto_url && !file && <img className="preview" src={v.foto_url} alt="Foto saat ini" />}
      <button type="submit" className="btn" disabled={loading}>{loading ? 'Menyimpan...' : submitLabel}</button>
    </form>
  );
}

export default FormProduk;
