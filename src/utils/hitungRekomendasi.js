export const DAFTAR_TUJUAN = ['Souvenir', 'Hadiah', 'Dekorasi', 'Koleksi', 'Busana & aksesori'];

export function hitungSkorRekomendasi(produk, preferensi) {
  let skor = 0;

  if (preferensi.bahan && (produk.bahan || '').toLowerCase() === preferensi.bahan.toLowerCase()) {
    skor += 1;
  }

  if (
    preferensi.anggaranMin != null &&
    preferensi.anggaranMax != null &&
    produk.harga >= preferensi.anggaranMin &&
    produk.harga <= preferensi.anggaranMax
  ) {
    skor += 1;
  }

  if (preferensi.kategori && produk.id_kategori === preferensi.kategori) {
    skor += 1;
  }

  if (preferensi.tujuan && produk.tujuan === preferensi.tujuan) {
    skor += 1;
  }

  return skor;
}

export function urutkanRekomendasi(daftarProduk, preferensi) {
  return daftarProduk
    .map((p) => ({ ...p, skor_kecocokan: hitungSkorRekomendasi(p, preferensi) }))
    .filter((p) => p.skor_kecocokan > 0)
    .sort((a, b) => b.skor_kecocokan - a.skor_kecocokan);
}