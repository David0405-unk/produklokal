import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import FormProduk from '../components/FormProduk';

function EditProduk() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('produk_kerajinan').select('*')
        .eq('id_produk', id).eq('id_pengrajin', user.id).maybeSingle();
      setP(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const simpan = async (isi) => {
    // Setelah diubah, produk diverifikasi ulang oleh admin
    const { error } = await supabase.from('produk_kerajinan')
      .update({ ...isi, status_publikasi: 'Menunggu', alasan_penolakan: null }).eq('id_produk', id);
    if (!error) navigate('/produk-saya');
    return error;
  };

  if (loading) return <p>Memuat...</p>;
  if (!p) return <p>Produk tidak ditemukan.</p>;

  return (
    <>
      <h1>Ubah Produk</h1>
      <p className="muted">Perubahan akan diverifikasi ulang oleh admin.</p>
      <FormProduk initial={p} submitLabel="Simpan Perubahan" onSubmit={simpan} />
    </>
  );
}

export default EditProduk;
