import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function KelolaProfil() {
  const [f, setF] = useState({ nama: '', wilayah: '', biodata: '', kontak_wa: '', foto_url: '' });
  const [file, setFile] = useState(null);
  const [pesan, setPesan] = useState({ teks: '', ok: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
      if (data) setF({ nama: data.nama || '', wilayah: data.wilayah || '', biodata: data.biodata || '', kontak_wa: data.kontak_wa || '', foto_url: data.foto_url || '' });
      setLoading(false);
    };
    fetchData();
  }, []);

  const ubah = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (!f.nama.trim()) {
      setPesan({ teks: 'Nama wajib diisi.', ok: false });
      return;
      
    }

  const digit = f.kontak_wa.replace(/\D/g, '');
    if (f.kontak_wa && (digit.length < 9 || digit.length > 15)) {
      setPesan({ teks: 'Nomor WhatsApp tidak valid. Contoh: 081234567890', ok: false });
      return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    let foto_url = f.foto_url;
    if (file) {
      const path = `${user.id}/profil-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const { error: upErr } = await supabase.storage.from('produk').upload(path, file);
      if (upErr) {
        setSaving(false);
        setPesan({ teks: 'Foto gagal diunggah: ' + upErr.message, ok: false });
        return;
      }
      foto_url = supabase.storage.from('produk').getPublicUrl(path).data.publicUrl;
    }
    const { error } = await supabase.from('users')
      .update({ nama: f.nama.trim(), wilayah: f.wilayah, biodata: f.biodata, kontak_wa: f.kontak_wa.trim(), foto_url })
      .eq('id', user.id);
    if (!error) await supabase.auth.updateUser({ data: { nama: f.nama.trim() } }); // agar nama di Navbar ikut berubah
    setSaving(false);
    setF({ ...f, foto_url });
    setPesan(error ? { teks: error.message, ok: false } : { teks: 'Profil tersimpan.', ok: true });
  };

  if (loading) return <p>Memuat...</p>;

  return (
    <>
      <h1>Profil Pengrajin</h1>
      <form className="form-card" onSubmit={handleSimpan}>
        {pesan.teks && <p className={pesan.ok ? 'success' : 'error'}>{pesan.teks}</p>}
        <label>Nama<input name="nama" value={f.nama} onChange={ubah} /></label>
        <label>Lokasi / Wilayah<input name="wilayah" value={f.wilayah} onChange={ubah} placeholder="Contoh: Tomohon" /></label>
        <label>Biodata<textarea name="biodata" rows="4" value={f.biodata} onChange={ubah} /></label>
        <label>Nomor WhatsApp untuk pemesanan<input name="kontak_wa" value={f.kontak_wa} onChange={ubah} placeholder="Contoh: 081234567890" inputMode="tel" /></label>
        <label>Foto Profil<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} /></label>
        {f.foto_url && !file && <img className="preview" src={f.foto_url} alt="Foto profil" />}
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Profil'}</button>
      </form>
    </>
  );
}

export default KelolaProfil;
