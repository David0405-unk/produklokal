import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import FormProduk from '../components/FormProduk';

function TambahProduk() {
  const navigate = useNavigate();

  const simpan = async (isi) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('produk_kerajinan')
      .insert({ ...isi, id_pengrajin: user.id, status_publikasi: 'Menunggu' });
    if (!error) navigate('/produk-saya');
    return error;
  };

  return (
    <>
      <h1>Tambah Produk</h1>
      <p className="muted">Produk akan tampil di publik setelah disetujui admin.</p>
      <FormProduk submitLabel="Kirim untuk Verifikasi" onSubmit={simpan} />
    </>
  );
}

export default TambahProduk;
