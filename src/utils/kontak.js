export function linkWhatsApp(nomor, pesan) {
  let n = String(nomor || '').replace(/\D/g, '');
  if (!n) return null;
  if (n.startsWith('0')) n = '62' + n.slice(1);
  else if (n.startsWith('8')) n = '62' + n;
  return `https://wa.me/${n}?text=${encodeURIComponent(pesan)}`;
}