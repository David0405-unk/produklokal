import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabaseClient';

function JelajahKerajinan() {
  const [produk, setProduk] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [filterKategori, setFilterKategori] = useState('');
  const [filterBahan, setFilterBahan] = useState('');
  const [cariKata, setCariKata] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKategori = async () => {
      const { data } = await supabase.from('kategori').select('*');
      if (data) setKategoriList(data);
    };
    fetchKategori();
  }, []);

  useEffect(() => {
    const fetchProduk = async () => {
      setLoading(true);
      let query = supabase.from('produk_kerajinan').select('*').eq('status_publikasi', 'Disetujui');
      if (filterKategori) query = query.eq('id_kategori', filterKategori);
      if (filterBahan) query = query.ilike('bahan', `%${filterBahan}%`);
      if (cariKata) query = query.ilike('nama_produk', `%${cariKata}%`);
      const { data, error } = await query;
      if (!error) setProduk(data);
      setLoading(false);
    };
    fetchProduk();
  }, [filterKategori, filterBahan, cariKata]);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <h1>Jelajah Kerajinan</h1>

        <div className="filter">
          <input type="text" placeholder="Cari nama produk..." value={cariKata} onChange={(e) => setCariKata(e.target.value)} />
          <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}>
            <option value="">Semua Kategori</option>
            {kategoriList.map((k) => (
              <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>
            ))}
          </select>
          <input type="text" placeholder="Filter bahan (mis: rotan)" value={filterBahan} onChange={(e) => setFilterBahan(e.target.value)} />
        </div>

        {loading ? (
          <p>Memuat...</p>
        ) : produk.length === 0 ? (
          <p>Tidak ada produk yang cocok.</p>
        ) : (
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
      </main>
    </div>
  );
}

export default JelajahKerajinan;