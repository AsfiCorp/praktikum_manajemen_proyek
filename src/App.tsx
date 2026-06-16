import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Globe, 
  Layers, 
  Smartphone, 
  AlertCircle, 
  Activity, 
  Info, 
  Check, 
  Settings,
  Heart,
  ChevronRight,
  Database
} from 'lucide-react';
import PublicPortal from './components/PublicPortal';
import AdminPortal from './components/AdminPortal';
import MobileDispatch from './components/MobileDispatch';
import { Shipment, InventoryItem, Beneficiary, SyncItem } from './types';

export default function App() {
  
  // High-level playground navigation: 'portal' | 'admin' | 'mobile_split'
  const [currentView, setCurrentView] = useState<'portal' | 'admin' | 'mobile_split'>('portal');

  // Mobile connectivity simulation state (shared globally so you can trigger offline/online sync testing)
  const [isOnline, setIsOnline] = useState(false);

  // Core Dynamic Datastores representing the LHAMS cluster
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: 'PMI-2024-X8J9',
      status: 'Dalam Perjalanan',
      origin: 'Gudang Pusat PMI, JKT',
      destination: 'Posko Darurat, Cianjur',
      timeline: [
        {
          title: 'Dikemas Ulang',
          location: 'Gudang Pusat PMI, JKT',
          time: '12 Okt 2024, 09:15 WIB',
          description: 'Penyusunan barang bantuan dan repacking ke dalam kemasan standar Family Kit selesai dilakukan.',
          completed: true,
          active: true,
          icon: 'inventory_2'
        },
        {
          title: 'Diterima di Gudang Transit',
          location: 'Gudang Regional Jabar, Bandung',
          time: '12 Okt 2024, 14:30 WIB',
          description: 'Logistik tiba di transit hub utama Jawa Barat untuk disortir menyusul pembagian rute regional.',
          completed: true,
          active: true,
          icon: 'warehouse'
        },
        {
          title: 'Menuju Gudang Regional',
          location: 'Gudang Distribusi Regional',
          description: 'Menunggu pembaruan jadwal armada logistik menuju Posko Darurat Cianjur.',
          completed: false,
          active: false,
          icon: 'local_shipping'
        },
        {
          title: 'Diterima Penerima Manfaat',
          location: 'Penerima Manfaat Akhir',
          description: 'Menunggu laporan hasil verifikasi luring oleh petugas lapangan di posko akhir.',
          completed: false,
          active: false,
          icon: 'verified_user'
        }
      ]
    }
  ]);

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: 'ITEM-001',
      qrCode: 'QR-PMI-819',
      name: 'Beras Premium Bulog 5kg',
      category: 'Logistik',
      stock: 15400,
      unit: 'Karung',
      location: 'Gudang Jakarta',
      status: 'Kondisi Baik',
      statusCode: 'good'
    },
    {
      id: 'ITEM-002',
      qrCode: 'QR-PMI-512',
      name: 'Masker Medis N95',
      category: 'Medis',
      stock: 500,
      unit: 'Box',
      location: 'Gudang Bandung',
      status: 'Kedaluwarsa < 30 Hari',
      statusCode: 'expiring',
      expiryDate: '12 Okt 2024'
    },
    {
      id: 'ITEM-003',
      qrCode: 'QR-PMI-320',
      name: 'Tenda Darurat Serbaguna Peleton',
      category: 'Hunian',
      stock: 120,
      unit: 'Unit',
      location: 'Gudang Jakarta',
      status: 'Kondisi Baik',
      statusCode: 'good'
    },
    {
      id: 'ITEM-004',
      qrCode: 'QR-PMI-044',
      name: 'Obat P3K Standar Medis',
      category: 'Medis',
      stock: 15,
      unit: 'Karton',
      location: 'Gudang Surabaya',
      status: 'Stok Menipis',
      statusCode: 'low'
    },
    {
      id: 'ITEM-005',
      qrCode: 'QR-PMI-670',
      name: 'Selimut Poliester Hangat',
      category: 'Hunian',
      stock: 3200,
      unit: 'Lembar',
      location: 'Gudang Bandung',
      status: 'Kondisi Baik',
      statusCode: 'good'
    }
  ]);

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: 'BEN-001',
      queueNo: '#Q-402',
      name: 'Budi Santoso',
      identityType: 'Surat RT',
      identityNumber: '3271012345091876',
      submissionTime: '15 Okt 2024, 08:30 WIB',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      status: 'Pending'
    },
    {
      id: 'BEN-002',
      queueNo: '#Q-311',
      name: 'Siti Aminah',
      identityType: 'Kartu Keluarga',
      identityNumber: '3271088764500921',
      submissionTime: '14 Okt 2024, 11:20 WIB',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      status: 'Verified'
    },
    {
      id: 'BEN-003',
      queueNo: '#Q-182',
      name: 'Ahmad Faisal',
      identityType: 'KTP',
      identityNumber: '3271044321008745',
      submissionTime: '14 Okt 2024, 15:45 WIB',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      status: 'Pending'
    }
  ]);

  // Sycn queue state for the dispatch simulator (offline holding queue)
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([
    {
      id: 'DO-9920',
      name: 'Distribusi Lapangan - Posko B',
      size: '1.1 MB',
      status: 'Menunggu Sinyal',
      type: 'delivery',
      icon: 'person'
    }
  ]);

  const [duplicateCount, setDuplicateCount] = useState(2); // Initial baseline cases prevented

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col font-sans" id="lhams-app">
      
      {/* Dynamic Interaction Control Center */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 z-50 shadow-xl select-none">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white border border-red-400 shadow-lg shadow-red-600/35 animate-pulse">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-wide flex items-center gap-1.5 font-mono">
              <span className="text-red-500 font-extrabold mr-1">●</span>
              <span>LOGIXA: LHAMS SYSTEM INTERACTIVE SANDBOX</span>
            </div>
            <p className="text-[10.5px] text-slate-400 mt-1 uppercase font-semibold font-sans tracking-tight">PMI Humanitarian Logistics &amp; Airway Triage Management</p>
          </div>
        </div>

        {/* View Changer buttons (Main Control Toggles) */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <button 
            onClick={() => setCurrentView('portal')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer ${currentView === 'portal' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-xl shadow-red-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
          >
            <Globe className="w-3.5 h-3.5 text-current" />
            1. Portal Publik (Lacak Bantuan)
          </button>
          
          <button 
            onClick={() => setCurrentView('admin')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer ${currentView === 'admin' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-xl shadow-red-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
          >
            <Database className="w-3.5 h-3.5 text-current" />
            2. Admin Portal (Pusat Logistik)
          </button>

          <button 
            onClick={() => setCurrentView('mobile_split')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer ${currentView === 'mobile_split' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-xl shadow-red-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
          >
            <Smartphone className="w-3.5 h-3.5 text-current" />
            3. Field Dispatch Luring (Mobile Frame)
          </button>
        </div>

        {/* Network Toggle representing LTE/Satellite Connection on emergency field */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wide">Simulasi Koneksi Lapangan:</span>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all active:scale-95 ${isOnline ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'}`}
            >
              {isOnline ? 'BERJEJARING (Online)' : 'LURING (Offline)'}
            </button>
          </div>
        </div>

      </div>

      {/* Guide Banner */}
      <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-3.5 text-xs text-red-100 flex items-center gap-3 leading-relaxed font-sans shadow-md">
        <div className="p-1 px-1.5 bg-red-600/20 rounded-md border border-red-500/40 shrink-0">
          <Info className="w-4 h-4 text-red-400" />
        </div>
        <span>
          <strong>Uji Alur Sinkronisasi:</strong> Masuk ke <strong>Field Dispatch Luring</strong>, klik <i>Mulai Serah Terima</i>, isi data dan tanda tangan, lalu klik simpan. Setelah antrean masuk, ubah koneksi lapangan di kanan atas menjadi <strong>Online</strong>, klik <i>Aktivasi Sinkronisasi</i> di handphone, lalu buka <strong>Admin Portal &gt; Pusat Verifikasi</strong> untuk melihat data terkirim!
        </span>
      </div>

      {/* Primary Simulator Panel Viewport */}
      <div className="flex-grow flex flex-col relative bg-pmi-gray-light">
        
        {currentView === 'portal' && (
          <div className="animate-fade-in">
            <PublicPortal 
              onLoginClick={() => setCurrentView('admin')} 
              shipments={shipments} 
            />
          </div>
        )}

        {currentView === 'admin' && (
          <div className="animate-fade-in text-pmi-slate">
            <AdminPortal 
              onBackToPublic={() => setCurrentView('portal')}
              inventoryItems={inventoryItems}
              setInventoryItems={setInventoryItems}
              beneficiaries={beneficiaries}
              setBeneficiaries={setBeneficiaries}
              duplicateCount={duplicateCount}
              setDuplicateCount={setDuplicateCount}
            />
          </div>
        )}

        {currentView === 'mobile_split' && (
          <div className="flex-grow w-full py-12 px-6 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] select-none">
            
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center justify-center">
              
              {/* Left Column: Device descriptor and scenarios */}
              <div className="lg:col-span-5 flex flex-col gap-5 text-pmi-slate pr-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pmi-red-dim text-pmi-red-dark text-xs font-bold rounded-md w-fit">
                  <Smartphone className="w-3.5 h-3.5" /> Simulation Sandbox
                </div>
                
                <h2 className="text-2xl font-bold tracking-tight text-pmi-slate">Aplikasi Lapangan Luring (Offline-First Mobile Framework)</h2>
                <p className="text-xs text-gray-500 leading-relaxed font-sans font-medium">
                  Seringkali lapangan bencana memiliki keterbatasan koneksi satelit/seluler. LHAMS mengompresi data identitas wajah dan goresan koordinat vektor tanda tangan penerima bantuan ke dalam cache SQLite luring berukuran <strong className="text-pmi-red">&lt; 500 KB</strong>.
                </p>

                <div className="space-y-3 bg-white p-4 rounded-xl border border-pmi-silver/80">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Langkah Uji Coba Luring</span>
                  
                  <div className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-pmi-red text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-sans">1</div>
                    <p className="text-xs text-gray-600 leading-normal font-sans">
                      Isi form distribusinya dan lakukan capture simulated photo serta coretan tanda tangan di frame handphone kanan.
                    </p>
                  </div>

                  <div className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-pmi-red text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-sans">2</div>
                    <p className="text-xs text-gray-600 leading-normal font-sans">
                      Klik simpan lokal. Hubungkan koneksi lewat switch <strong>Online</strong> di kanan atas, lalu eksekusi sinkronisasi antrean.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Physical Phone simulation device */}
              <div className="lg:col-span-7 flex justify-center">
                <MobileDispatch 
                  isOnline={isOnline}
                  setIsOnline={setIsOnline}
                  beneficiaries={beneficiaries}
                  setBeneficiaries={setBeneficiaries}
                  syncQueue={syncQueue}
                  setSyncQueue={setSyncQueue}
                />
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
