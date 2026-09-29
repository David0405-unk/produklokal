import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Beranda from './pages/Beranda';
import JelajahKerajinan from './pages/JelajahKerajinan';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

import DetailProduk from './pages/DetailProduk';
import DetailProfilPengrajin from './pages/DetailProfilPengrajin';
import FormRekomendasi from './pages/FormRekomendasi';
import ProdukSaya from './pages/ProdukSaya';
import TambahProduk from './pages/TambahProduk';
import EditProduk from './pages/EditProduk';
import KelolaProfil from './pages/KelolaProfil';
import AdminDashboard from './pages/AdminDashboard';
import KelolaKategori from './pages/KelolaKategori';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publik */}
        <Route path="/" element={<Beranda />} />
        <Route path="/jelajah" element={<JelajahKerajinan />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/produk/:id" element={<DetailProduk />} />
        <Route path="/pengrajin/:id" element={<DetailProfilPengrajin />} />
        <Route path="/rekomendasi" element={<FormRekomendasi />} />

        {/* Pengrajin */}
        <Route 
          path="/produk-saya" 
          element={<ProtectedRoute requiredRole="pengrajin"><ProdukSaya /></ProtectedRoute>} 
        />
        <Route 
          path="/tambah-produk" 
          element={<ProtectedRoute requiredRole="pengrajin"><TambahProduk /></ProtectedRoute>} 
        />
        <Route 
          path="/edit-produk/:id" 
          element={<ProtectedRoute requiredRole="pengrajin"><EditProduk /></ProtectedRoute>} 
        />
        <Route 
          path="/profil" 
          element={<ProtectedRoute requiredRole="pengrajin"><KelolaProfil /></ProtectedRoute>} 
        />

        {/* Admin */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/kategori" 
          element={<ProtectedRoute requiredRole="admin"><KelolaKategori /></ProtectedRoute>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;