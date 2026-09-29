import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function KelolaKategori() {
  const [list, setList] = useState([]);
  const [nama, setNama] = useState('');
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState('');

  const muat = useCallback(async () => {
    const { data } = await supabase.from('kategori').select('*').order('nama_kategori');
    setList(data || []);
  }, []);

  useEffect(() => { muat(); }, [muat]);

  const tambah = async (e) => {
    e.preventDefault();
    setError('');
    if (!nama.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }
    const { error: err } = await supabase.from('kategori').insert({ nama_kategori: nama.trim() });
    if (err) {
      setError(err.message.includes('duplicate') ? 'Kategori sudah ada.' : err.message);
      return;
    }
    setNama('');
    muat();
  };

  const simpan = async () => {
    if (!edit.nama_kategori.trim()) return;
    await supabase.from('kategori').update({ nama_kategori: edit.nama_kategori.trim() }).eq('id_kategori', edit.id_kategori);
    setEdit(null);
    muat();
  };

  const hapus = async (k) => {
    if (!window.confirm(`Hapus kategori "${k.nama_kategori}"? Produk di kategori ini akan menjadi tanpa kategori.`)) return;
    await supabase.from('kategori').delete().eq('id_kategori', k.id_kategori);
    muat();
  };

  return (
    <>
      <h1>Kelola Kategori</h1>
      <form className="inline-form" onSubmit={tambah}>
        <input placeholder="Nama kategori baru" value={nama} onChange={(e) => setNama(e.target.value)} />
        <button type="submit" className="btn btn-small">Tambah</button>
      </form>
      {error && <p className="error">{error}</p>}
      {list.map((k) => (
        <div className="list-item" key={k.id_kategori}>
          {edit?.id_kategori === k.id_kategori
            ? <input value={edit.nama_kategori} onChange={(e) => setEdit({ ...edit, nama_kategori: e.target.value })} />
            : <strong>{k.nama_kategori}</strong>}
          <div className="list-actions">
            {edit?.id_kategori === k.id_kategori ? (
              <>
                <button className="btn btn-small" onClick={simpan}>Simpan</button>
                <button className="btn btn-small btn-outline" onClick={() => setEdit(null)}>Batal</button>
              </>
            ) : (
              <>
                <button className="btn btn-small btn-outline" onClick={() => setEdit(k)}>Ubah</button>
                <button className="btn btn-small btn-danger" onClick={() => hapus(k)}>Hapus</button>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export default KelolaKategori;
