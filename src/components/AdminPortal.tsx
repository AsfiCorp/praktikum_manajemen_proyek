import React, { useState } from 'react';
import { 
  BarChart3, 
  Layers, 
  Users, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  ArrowLeft, 
  Upload, 
  Boxes, 
  ShieldAlert, 
  Search, 
  Bell, 
  Settings, 
  QrCode, 
  TrendingUp, 
  AlertTriangle,
  LogOut,
  Heart,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { InventoryItem, Beneficiary, SyncItem } from '../types';

interface AdminPortalProps {
  onBackToPublic: () => void;
  inventoryItems: InventoryItem[];
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  beneficiaries: Beneficiary[];
  setBeneficiaries: React.Dispatch<React.SetStateAction<Beneficiary[]>>;
  duplicateCount: number;
  setDuplicateCount: React.Dispatch<React.SetStateAction<number>>;
  onAutoGenerateItem?: (item: InventoryItem) => void;
}

export default function AdminPortal({
  onBackToPublic,
  inventoryItems,
  setInventoryItems,
  beneficiaries,
  setBeneficiaries,
  duplicateCount,
  setDuplicateCount
}: AdminPortalProps) {
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'beneficiaries' | 'reports'>('inventory');
  
  // States for filters
  const [selectedWarehouse, setSelectedWarehouse] = useState('Semua Gudang');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  
  // Modal states
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [isDisposalModalOpen, setIsDisposalModalOpen] = useState(false);
  const [disposalTargetItem, setDisposalTargetItem] = useState<InventoryItem | null>(null);

  // New triage item form states
  const [triageStep, setTriageStep] = useState(1);
  const [scannedCode, setScannedCode] = useState('');
  const [triageCondition, setTriageCondition] = useState<'Sangat Baik' | 'Layak' | 'Rusak'>('Sangat Baik');
  const [repackCategory, setRepackCategory] = useState('Family Kit');
  const [triageItemName, setTriageItemName] = useState('Paket Sembako Darurat B');
  const [triageWarehouse, setTriageWarehouse] = useState('Gudang Jakarta');

  // Disposal form state
  const [disposalReason, setDisposalReason] = useState('');
  const [uploadedPDF, setUploadedPDF] = useState<File | null>(null);

  // Handle addition of inventory via Triage Modal
  const handleTriageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedCode) {
      alert('Silakan scan / masukkan kode barang terlebih dahulu.');
      return;
    }

    const newItem: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      qrCode: scannedCode,
      name: `${repackCategory} - ${triageCondition} (${scannedCode})`,
      category: repackCategory.includes('Family') || repackCategory.includes('Makanan') ? 'Logistik' : 'Hunian',
      stock: 100, // standard starting batch stock
      unit: repackCategory.includes('Kit') ? 'Kit' : 'Koli',
      location: triageWarehouse,
      status: triageCondition === 'Sangat Baik' ? 'Kondisi Baik' : 'Layak Pakai',
      statusCode: 'good'
    };

    setInventoryItems([newItem, ...inventoryItems]);
    setIsTriageModalOpen(false);
    // Reset form
    setTriageStep(1);
    setScannedCode('');
    setTriageCondition('Sangat Baik');
    setRepackCategory('Family Kit');
  };

  // Handle disposal action click
  const openDisposal = (item: InventoryItem) => {
    setDisposalTargetItem(item);
    setDisposalReason('');
    setUploadedPDF(null);
    setIsDisposalModalOpen(true);
  };

  const handleDisposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disposalReason) {
      alert('Silakan masukkan alasan pemusnahan secara akuntabel.');
      return;
    }
    if (disposalTargetItem) {
      // Set the stock of disposed item to 0 or remove/update its status to "Dimusnahkan"
      setInventoryItems(prev => 
        prev.map(item => 
          item.id === disposalTargetItem.id 
            ? { ...item, stock: 0, status: 'Sudah Dimusnahkan', statusCode: 'low' as const } 
            : item
        )
      );
      setIsDisposalModalOpen(false);
      setDisposalTargetItem(null);
    }
  };

  // Verification center logic
  const handleVerifyBeneficiary = (id: string) => {
    setBeneficiaries(prev => 
      prev.map(b => b.id === id ? { ...b, status: 'Verified' as const } : b)
    );
  };

  const handleDuplicateBeneficiary = (id: string) => {
    setBeneficiaries(prev => 
      prev.map(b => b.id === id ? { ...b, status: 'Duplicate' as const } : b)
    );
    // Increment duplicated prevention counter
    setDuplicateCount(prev => prev + 1);
  };

  // Filter items logic
  const filteredItems = inventoryItems.filter(item => {
    const matchWarehouse = selectedWarehouse === 'Semua Gudang' || item.location === selectedWarehouse;
    const matchCategory = selectedCategory === 'Semua Kategori' || item.category === selectedCategory;
    return matchWarehouse && matchCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans" id="admin-portal">
      
      {/* SideNavBar Panel */}
      <nav className="w-72 bg-slate-950 text-white flex flex-col h-screen fixed top-0 left-0 border-r border-slate-900 z-20 shadow-2xl">
        <div className="p-6 border-b border-slate-900 flex flex-col items-center gap-2 select-none">
          {/* Circular logo mark */}
          <div className="w-14 h-14 bg-red-50 hover:bg-red-100 rounded-2xl flex items-center justify-center border-2 border-red-200/50 cursor-pointer shadow-lg shadow-red-500/10 transition-all duration-200 hover:scale-105 active:scale-95" onClick={onBackToPublic}>
            <Heart className="w-8 h-8 text-red-600 fill-current animate-pulse" />
          </div>
          <h1 className="font-extrabold text-xl text-white tracking-tight uppercase mt-2.5">LHAMS <span className="text-red-500">Central</span></h1>
          <p className="text-xs text-slate-400 font-semibold font-sans uppercase tracking-wider">PMI Distribution Hub</p>
        </div>

        {/* Action Menu */}
        <div className="px-4.5 py-6 flex-grow flex flex-col gap-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/20' : 'text-slate-300 hover:bg-slate-900 hover:text-white'}`}
          >
            <BarChart3 className="w-4 h-4" />
            Dasbor Utama
          </button>

          <button 
            onClick={() => {
              setActiveTab('inventory');
              setSelectedWarehouse('Semua Gudang');
              setSelectedCategory('Semua Kategori');
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'inventory' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/20' : 'text-slate-300 hover:bg-slate-900 hover:text-white'}`}
          >
            <Layers className="w-4 h-4" />
            Manajemen Inventaris
          </button>

          <button 
            onClick={() => setActiveTab('beneficiaries')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'beneficiaries' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/20' : 'text-slate-300 hover:bg-slate-900 hover:text-white'}`}
          >
            <Users className="w-4 h-4" />
            Pusat Verifikasi
          </button>

          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'reports' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/20' : 'text-slate-300 hover:bg-slate-900 hover:text-white'}`}
          >
            <Boxes className="w-4 h-4" />
            Kinerja &amp; Laporan
          </button>
        </div>

        {/* Top Fixed switch triggers */}
        <div className="p-4 border-t border-slate-900 flex flex-col gap-2">
          <button 
            onClick={onBackToPublic}
            className="w-full bg-slate-905 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-slate-800 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
            Kunjungi Portal Publik
          </button>
          <button 
            onClick={onBackToPublic}
            className="w-full text-slate-400 hover:text-white text-xs font-semibold py-1.5 px-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Workspace Frame */}
      <section className="flex-grow pl-72 min-h-screen flex flex-col pb-12">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white w-full border-b border-slate-100 px-8 flex justify-between items-center sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-slate-400 text-xs font-bold tracking-wider font-sans uppercase">Lingkungan Kerja:</span>
            <span className="font-extrabold text-xs text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100/50 font-sans shadow-xs">Kantor Pusat Regional</span>
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <button className="hover:text-red-650 transition-all cursor-pointer"><Search className="w-4 h-4" /></button>
            <button className="hover:text-red-650 transition-all relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 bg-red-600 rounded-full" />
            </button>
            <button className="hover:text-red-650 transition-all cursor-pointer"><Settings className="w-4 h-4" /></button>
            
            <div className="h-6 w-px bg-slate-200/60" />

            <div className="flex items-center gap-2.5">
              <img 
                alt="Asep Somantri" 
                className="w-8.5 h-8.5 rounded-full border border-slate-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN4f024yYXY0SJrymaU3cwbNIhze7nyseXSwnDVtZMZsIVgewr1VPooaxqZ7U5aC78KLwTl2qXQY5ukB346q7HC0HFoHgf9BT50JLX-TmCOpBhrOapDr21RMxdndz0GWpVcIzJREcgvHvI79wiO6uwd4RSa9hMpFQV4xBy2AxFyv-I9vlsav4D554Xu5s-H7WJma65iqWWyR5W7ogcOtziHjfPQzcoXdIA2jcOoK69YZbqookNvP5TQZFlzSmfTa3QJQPLAXa-SfDh"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 font-sans leading-none">Asep Somantri, ST.MT</span>
                <span className="text-[10px] text-slate-400 font-semibold font-sans tracking-wide mt-1 leading-none">Project Sponsor</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="px-8 py-8 w-full max-w-7xl mx-auto flex flex-col gap-7">

          {/* ============ TAB 1: DASBOR UTAMA ============ */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">Statistik &amp; Pemantauan Kemanusiaan</h2>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Ikhtisar real-time rantai pasok dan identitas kependudukan darurat.</p>
                </div>
              </div>

              {/* Bento Stats Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xl shadow-slate-100/70 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-200">
                  <div className="flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Total Bantuan Tersalur</span>
                    <span className="font-extrabold text-3xl text-slate-900 tracking-tight mt-1.5">14,250 <span className="text-xs font-semibold text-slate-400">Kit</span></span>
                  </div>
                  <div className="p-3 bg-red-50 rounded-xl text-red-650 ring-1 ring-red-100"><TrendingUp className="w-6 h-6" /></div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xl shadow-slate-100/70 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-200">
                  <div className="flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Duplikasi Dicegah</span>
                    <span className="font-bold text-3xl text-red-650 mt-1.5">{duplicateCount} <span className="text-xs font-semibold text-slate-400">Jiwa</span></span>
                  </div>
                  <div className="p-3 bg-red-50 text-red-650 rounded-xl ring-1 ring-red-100"><ShieldAlert className="w-6 h-6" /></div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xl shadow-slate-100/70 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-200">
                  <div className="flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Gudang Regional</span>
                    <span className="font-extrabold text-3xl text-slate-900 mt-1.5">34 <span className="text-xs font-semibold text-slate-400">Hubs</span></span>
                  </div>
                  <div className="p-3 bg-red-50 text-red-650 rounded-xl ring-1 ring-red-100"><Boxes className="w-6 h-6" /></div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xl shadow-slate-100/70 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-200">
                  <div className="flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Kerapatan Stok</span>
                    <span className="font-extrabold text-3xl text-emerald-700 mt-1.5">100% <span className="text-xs font-semibold text-emerald-400">Baik</span></span>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl ring-1 ring-emerald-100"><CheckCircle className="w-6 h-6" /></div>
                </div>
              </div>

              {/* Central Graph simulation mapping */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <div className="bg-white border border-slate-100 p-6 rounded-3xl flex flex-col gap-4 shadow-xl shadow-slate-100/80">
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Perbandingan Stok Gudang Regional</h3>
                  <div className="h-56 flex items-end justify-between pt-4 border-b border-slate-100 relative">
                    <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-[10px] text-slate-400 font-extrabold">
                      <span>15k</span><span>10k</span><span>5k</span><span>0</span>
                    </div>
                    {/* Simulated vertical chart bars */}
                    <div className="w-[12%] flex flex-col items-center gap-1.5 ml-8 h-full justify-end">
                      <div className="bg-gradient-to-t from-red-650 to-red-500 rounded-t-lg w-full h-[85%] shadow-md shadow-red-500/10" />
                      <span className="text-[10px] font-bold text-slate-400">Jakarta</span>
                    </div>
                    <div className="w-[12%] flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="bg-gradient-to-t from-red-650 to-red-500 rounded-t-lg w-full h-[60%] shadow-md shadow-red-500/10" />
                      <span className="text-[10px] font-bold text-slate-400">Bandung</span>
                    </div>
                    <div className="w-[12%] flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="bg-gradient-to-t from-red-650 to-red-500 rounded-t-lg w-full h-[45%] shadow-md shadow-red-500/10" />
                      <span className="text-[10px] font-bold text-slate-400">Surabaya</span>
                    </div>
                    <div className="w-[12%] flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg w-full h-[70%] shadow-sm" />
                      <span className="text-[10px] font-bold text-slate-400">Medan</span>
                    </div>
                    <div className="w-[12%] flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg w-full h-[30%] shadow-sm" />
                      <span className="text-[10px] font-bold text-slate-400">Makassar</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-3xl flex flex-col gap-4 shadow-xl shadow-slate-100/80">
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Antrean Verifikasi Kependudukan Darurat</h3>
                  <div className="flex-grow flex flex-col gap-3 justify-center">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-700">Menunggu Verifikasi</span>
                      </div>
                      <span className="font-extrabold text-sm text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">{beneficiaries.filter(b => b.status === "Pending").length} Skenario</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-700">Sudah Tervalidasi</span>
                      </div>
                      <span className="font-extrabold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">{beneficiaries.filter(b => b.status === "Verified").length} KTP/KK</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-600" />
                        <span className="text-xs font-bold text-slate-700">Pemberangusan Duplikasi NIK</span>
                      </div>
                      <span className="font-extrabold text-sm text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">{beneficiaries.filter(b => b.status === "Duplicate").length} Kasus</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ TAB 2: MANAJEMEN INVENTARIS ============ */}
          {activeTab === 'inventory' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              {/* Toolbar Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-pmi-silver/80">
                <button 
                  onClick={() => setIsTriageModalOpen(true)}
                  className="bg-pmi-red hover:bg-pmi-red-light text-white font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <QrCode className="w-4 h-4" />
                  Tambah Barang + Scan Barcode
                </button>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  {/* Select filters */}
                  <div className="relative">
                    <select 
                      value={selectedWarehouse}
                      onChange={e => setSelectedWarehouse(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2.5 text-xs font-semibold border border-pmi-silver rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pmi-red focus:border-pmi-red appearance-none cursor-pointer"
                    >
                      <option>Semua Gudang</option>
                      <option>Gudang Jakarta</option>
                      <option>Gudang Bandung</option>
                      <option>Gudang Surabaya</option>
                    </select>
                  </div>

                  <div className="relative">
                    <select 
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2.5 text-xs font-semibold border border-pmi-silver rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pmi-red focus:border-pmi-red appearance-none cursor-pointer"
                    >
                      <option>Semua Kategori</option>
                      <option>Logistik</option>
                      <option>Medis</option>
                      <option>Hunian</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-xl border border-pmi-silver/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-pmi-gray-light border-b border-pmi-silver text-gray-500 text-xs tracking-wider uppercase">
                        <th className="py-3.5 px-6 font-bold w-20">Kode QR</th>
                        <th className="py-3.5 px-6 font-bold">Nama Barang</th>
                        <th className="py-3.5 px-6 font-bold">Kategori</th>
                        <th className="py-3.5 px-6 font-bold">Stok</th>
                        <th className="py-3.5 px-6 font-bold">Lokasi</th>
                        <th className="py-3.5 px-6 font-bold text-center">Status</th>
                        <th className="py-3.5 px-6 font-bold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 font-sans">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center border border-pmi-silver">
                              <QrCode className="w-5 h-5 text-gray-500" />
                            </div>
                          </td>
                          <td className="py-4 px-6 text-pmi-slate font-bold">{item.name}</td>
                          <td className="py-4 px-6 text-gray-500">{item.category}</td>
                          <td className="py-4 px-6 font-bold text-pmi-slate">
                            {item.stock > 0 ? `${item.stock.toLocaleString()} ${item.unit}` : 'Habis / Dimusnahkan'}
                          </td>
                          <td className="py-4 px-6 text-gray-500">{item.location}</td>
                          <td className="py-4 px-6 text-center">
                            {item.stock === 0 ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-[10px] bg-gray-100 text-gray-600">
                                Dimusnahkan
                              </span>
                            ) : item.statusCode === 'good' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-[10px] bg-green-50 text-green-700">
                                Kondisi Baik
                              </span>
                            ) : item.statusCode === 'expiring' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-[10px] bg-yellow-50 text-yellow-700 border border-yellow-100">
                                Kedaluwarsa &lt; 30 Hari
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-[10px] bg-red-50 text-pmi-red border border-red-100">
                                Stok Menipis
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            {item.statusCode === 'expiring' && item.stock > 0 && (
                              <button 
                                onClick={() => openDisposal(item)}
                                className="bg-pmi-red/10 text-pmi-red-dark hover:bg-pmi-red hover:text-white px-2.5 py-1 rounded-md text-xs font-bold transition-all border border-pmi-red/20 active:scale-95 cursor-pointer"
                              >
                                Pemusnahan Digital
                              </button>
                            )}
                            {item.stock > 0 && item.statusCode !== 'expiring' && (
                              <span className="text-xs text-gray-400">Verifikasi OK</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============ TAB 3: PUSAT VERIFIKASI ============ */}
          {activeTab === 'beneficiaries' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-pmi-silver pb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-pmi-slate font-sans">Sistem Verifikasi Pencegahan Anti-Duplikasi KTP</h2>
                  <p className="text-xs text-gray-400 mt-1">Guna memelihara integritas logistik, sistem menyaring pendaftaran berulang berdasarkan NIK kependudukan.</p>
                </div>
                
                <div className="bg-white px-4 py-2 rounded-lg border border-pmi-silver flex items-center gap-2">
                  <ShieldAlert className="text-pmi-red w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold text-pmi-slate font-sans">Total Duplikasi Dicegah: <span className="font-bold text-pmi-red-dark">{duplicateCount} Kasus</span></span>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {beneficiaries.map((b) => (
                  <div key={b.id} className="bg-white border border-pmi-silver rounded-xl p-4 flex flex-col gap-4 shadow-xs">
                    <div className="flex justify-between items-start">
                      {b.status === 'Pending' ? (
                        <span className="bg-yellow-50 text-yellow-800 font-bold text-[10px] px-2.5 py-1 rounded-full border border-yellow-200">
                          Menunggu Verifikasi
                        </span>
                      ) : b.status === 'Verified' ? (
                        <span className="bg-green-50 text-green-800 font-bold text-[10px] px-2.5 py-1 rounded-full border border-green-200">
                          Sudah Terdaftar
                        </span>
                      ) : (
                        <span className="bg-red-50 text-pmi-red-dark font-bold text-[10px] px-2.5 py-1 rounded-full border border-pmi-red-dim">
                          Duplikat Dicegah
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-gray-400 font-bold">{b.queueNo}</span>
                    </div>

                    <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden border border-pmi-silver flex items-center justify-center relative">
                      {b.photoUrl ? (
                        <img alt={b.name} className="w-full h-full object-cover" src={b.photoUrl} />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Trash2 className="w-10 h-10" />
                          <span className="text-xs">Foto Tidak Terlampir</span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-white/95 px-2 py-0.5 rounded font-bold text-pmi-slate border border-pmi-silver text-[9px]">
                        {b.identityType}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold text-sm text-pmi-slate truncate">{b.name}</h4>
                      <p className="text-xs text-gray-500 font-mono">ID / NIK: {b.identityNumber}</p>
                      <p className="text-[11px] text-gray-400 mt-1">Diajukan: {b.submissionTime}</p>
                    </div>

                    {b.status === 'Pending' && (
                      <div className="flex gap-2 mt-auto pt-3 border-t border-pmi-gray-light">
                        <button 
                          onClick={() => handleVerifyBeneficiary(b.id)}
                          className="flex-1 bg-white hover:bg-green-50 text-green-700 border border-green-300 font-bold py-1.5 rounded-lg text-xs transition-colors flex justify-center items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          Verify
                        </button>
                        <button 
                          onClick={() => handleDuplicateBeneficiary(b.id)}
                          className="flex-grow bg-white hover:bg-red-50 text-pmi-red-dark border border-pmi-red font-bold py-1.5 rounded-lg text-xs transition-all flex justify-center items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          Duplicate
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ TAB 4: KINERJA & LAPORAN ============ */}
          {activeTab === 'reports' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-pmi-silver pb-3">
                <h2 className="text-2xl font-bold tracking-tight text-pmi-slate font-sans">Kinerja Proyek Terintegrasi (Earned Value System)</h2>
                <p className="text-xs text-gray-400 mt-1">Logistik dan Kemanusiaan PMI dianalisis berdasarkan baseline triple-constraint internasional.</p>
              </div>

              {/* EVA Matrix Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
                <div className="bg-white border border-pmi-silver/80 rounded-xl p-5 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PV (Planned Value)</span>
                  <span className="font-bold text-xl text-pmi-slate tracking-tight mt-1.5 font-mono">Rp 9,000,000,000</span>
                  <span className="text-[10px] text-gray-400 mt-1">Baseline Anggaran</span>
                </div>

                <div className="bg-white border border-pmi-silver/80 rounded-xl p-5 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">EV (Earned Value)</span>
                  <span className="font-bold text-xl text-pmi-slate tracking-tight mt-1.5 font-mono">Rp 9,000,000,000</span>
                  <span className="text-[10px] text-green-700 font-bold mt-1">Kemajuan Fisik 100%</span>
                </div>

                <div className="bg-white border border-pmi-silver/80 rounded-xl p-5 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AC (Actual Cost)</span>
                  <span className="font-bold text-xl text-pmi-slate tracking-tight mt-1.5 font-mono">Rp 9,000,000,000</span>
                  <span className="text-[10px] text-gray-400 mt-1">Realisasi Pengeluaran</span>
                </div>

                <div className="bg-white border border-pmi-silver/80 rounded-xl p-5 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">Varian Jadwal / Biaya</span>
                  <span className="font-bold text-xl text-pmi-red-dark tracking-tight mt-1.5">Rp 0 (Sempurna)</span>
                  <span className="text-[10px] text-gray-400 mt-1">SV: Rp 0 | CV: Rp 0</span>
                </div>

                <div className="bg-white border border-pmi-silver/80 rounded-xl p-5 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SPI / CPI Index</span>
                  <span className="font-bold text-xl text-green-700 tracking-tight mt-1.5">1.0 / 1.0 (On Track)</span>
                  <span className="text-[10px] text-green-700 mt-1">Tepat Waktu &amp; Anggaran</span>
                </div>
              </div>

              {/* IFRC Exporter generator */}
              <div className="bg-white border border-pmi-silver/80 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 mt-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <h3 className="font-bold text-lg text-pmi-slate">Generator Pelaporan Otomatis Berstandar IFRC</h3>
                  <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
                    Setiap data masuk, triase, repacking, dan logistik disatukan dalam template baku International Federation of Red Cross and Red Crescent Societies (IFRC) yang siap diunggah atau diserahkan secara akuntabel.
                  </p>
                </div>
                <button 
                  onClick={() => alert('IFRC Report Excel/PDF Berhasil Dikompilasi & Diunduh!')}
                  className="bg-pmi-slate hover:bg-pmi-gray-dark text-white font-bold font-sans text-xs py-3 px-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 active:scale-95"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-500" />
                  Ekspor Dokumen Baku IFRC
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ============ MODAL 1: TRIAGE / TAMBAH BARANG ============ */}
      {isTriageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-fade-in border border-pmi-red-dim">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-pmi-silver">
              <h2 className="text-lg font-bold text-pmi-slate font-sans flex items-center gap-1.5">
                <Boxes className="w-5 h-5 text-pmi-red" />
                Penerimaan &amp; Triase Barang Baru
              </h2>
              <button 
                onClick={() => setIsTriageModalOpen(false)}
                className="text-gray-400 hover:text-pmi-slate transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTriageSubmit}>
              <div className="p-6 space-y-5">
                
                {/* Steps markers representation */}
                <div className="flex items-center justify-between border border-pmi-silver rounded-lg p-2.5 bg-pmi-gray-light">
                  <button 
                    type="button" 
                    onClick={() => setTriageStep(1)}
                    className={`flex-1 text-center font-bold text-xs py-1 rounded ${triageStep === 1 ? 'bg-pmi-red text-white' : 'text-gray-500'}`}
                  >
                    1. Scan Barcode
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setTriageStep(2)}
                    className={`flex-1 text-center font-bold text-xs py-1 rounded ${triageStep === 2 ? 'bg-pmi-red text-white' : 'text-gray-500'}`}
                  >
                    2. Status Kelayakan
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setTriageStep(3)}
                    className={`flex-1 text-center font-bold text-xs py-1 rounded ${triageStep === 3 ? 'bg-pmi-red text-white' : 'text-gray-500'}`}
                  >
                    3. Kategori Repacking
                  </button>
                </div>

                {/* Step 1 element */}
                {triageStep === 1 && (
                  <div className="space-y-3 animate-fade-in">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Langkah 1: Input Code / Scan Barcode</label>
                    <div 
                      onClick={() => {
                        const randomCode = `QR-PMI-${Math.floor(Math.random()*9000 + 1000)}`;
                        setScannedCode(randomCode);
                        setTriageStep(2); // Auto proceed
                      }}
                      className="border-2 border-dashed border-pmi-red-dim hover:border-pmi-red rounded-xl bg-pmi-gray-light/60 p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-pmi-red-dim/20 transition-all group"
                    >
                      <QrCode className="w-12 h-12 text-pmi-red group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-sm text-pmi-slate">Lakukan Klik Di Sini untuk Pemindaian (Simulasi)</span>
                      <p className="text-xs text-gray-400">Atau akan tergenerasi otomatis penomoran QR acak.</p>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-xs font-semibold text-pmi-slate">Kode Scanned Saat Ini:</span>
                      <input 
                        type="text" 
                        value={scannedCode} 
                        onChange={e => setScannedCode(e.target.value)}
                        placeholder="Misal: QR-PMI-8809"
                        className="w-full bg-white border border-pmi-silver rounded-lg p-2.5 text-sm font-semibold tracking-wide"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2 element */}
                {triageStep === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Langkah 2: Status Kelayakan Triase</label>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <label 
                        onClick={() => { setTriageCondition('Sangat Baik'); setTriageStep(3); }}
                        className={`flex-1 border-2 p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all hover:bg-gray-100/50 ${triageCondition === 'Sangat Baik' ? 'bg-green-50 border-green-500' : 'bg-white border-pmi-silver'}`}
                      >
                        <CheckCircle className="w-6 h-6 text-green-700" />
                        <span className="font-bold text-xs text-green-800">Sangat Baik</span>
                        <span className="text-[10px] text-gray-400 text-center">Layak distribusi logistik utama.</span>
                      </label>

                      <label 
                        onClick={() => { setTriageCondition('Layak'); setTriageStep(3); }}
                        className={`flex-1 border-2 p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all hover:bg-gray-100/50 ${triageCondition === 'Layak' ? 'bg-yellow-50 border-yellow-500' : 'bg-white border-pmi-silver'}`}
                      >
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        <span className="font-bold text-xs text-yellow-700">Layak Pakai</span>
                        <span className="text-[10px] text-gray-400 text-center">Digolongkan untuk cadangan krisis.</span>
                      </label>

                      <label 
                        onClick={() => { setTriageCondition('Rusak'); setTriageStep(3); }}
                        className={`flex-1 border-2 p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all hover:bg-gray-100/50 ${triageCondition === 'Rusak' ? 'bg-red-50 border-pmi-red' : 'bg-white border-pmi-silver'}`}
                      >
                        <X className="w-6 h-6 text-pmi-red" />
                        <span className="font-bold text-xs text-pmi-red-dark">Rusak / Tolak</span>
                        <span className="text-[10px] text-gray-400 text-center">Dikategorikan untuk disposisi.</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 3 element */}
                {triageStep === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">Langkah 3: Penggolongan Repacking Bantuan</label>
                    <div>
                      <span className="block text-xs text-gray-400 mb-1.5 font-bold">Standardisasi Kategori Kit</span>
                      <select 
                        value={repackCategory}
                        onChange={e => setRepackCategory(e.target.value)}
                        className="w-full bg-white border border-pmi-silver rounded-lg p-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-pmi-red"
                      >
                        <option>Family Kit</option>
                        <option>Hygiene Kit</option>
                        <option>Logistik Makanan</option>
                        <option>Hunian Darurat / Tenda</option>
                      </select>
                    </div>

                    <div>
                      <span className="block text-xs text-gray-400 mb-1.5 font-bold">Gudang Penyimpanan Tujuan</span>
                      <select 
                        value={triageWarehouse}
                        onChange={e => setTriageWarehouse(e.target.value)}
                        className="w-full bg-white border border-pmi-silver rounded-lg p-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-pmi-red"
                      >
                        <option>Gudang Jakarta</option>
                        <option>Gudang Bandung</option>
                        <option>Gudang Surabaya</option>
                      </select>
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-pmi-gray-light border-t border-pmi-silver">
                <button 
                  type="button" 
                  onClick={() => setIsTriageModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold border border-pmi-silver rounded-lg hover:bg-white text-pmi-slate transition-colors cursor-pointer"
                >
                  Batal
                </button>
                {triageStep < 3 ? (
                  <button 
                    type="button" 
                    onClick={() => setTriageStep(prev => prev + 1)}
                    className="px-4 py-2 text-xs font-bold bg-pmi-slate hover:bg-pmi-gray-dark text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="px-4 py-2 text-xs font-bold bg-pmi-red hover:bg-pmi-red-light text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Terbitkan Barcode &amp; Simpan
                  </button>
                )}
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ============ MODAL 2: PROSEDUR PEMUSNAHAN BARANG ============ */}
      {isDisposalModalOpen && disposalTargetItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-fade-in border border-pmi-red">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-pmi-silver bg-red-50">
              <h2 className="text-lg font-bold text-pmi-red-dark flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-pmi-red animate-pulse" />
                Prosedur Pemusnahan Barang (EWS H-30)
              </h2>
              <button 
                onClick={() => setIsDisposalModalOpen(false)}
                className="text-gray-400 hover:text-pmi-slate transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDisposalSubmit}>
              <div className="p-6 space-y-5">
                
                {/* Target item detail banner */}
                <div className="bg-pmi-gray-light p-4 rounded-lg flex flex-col gap-2 border border-pmi-silver/60">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Nama Barang:</span>
                    <span className="text-xs font-bold text-pmi-slate">{disposalTargetItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 font-sans">Jumlah Tersedia:</span>
                    <span className="text-xs font-bold text-pmi-red-dark">{disposalTargetItem.stock} {disposalTargetItem.unit}</span>
                  </div>
                  {disposalTargetItem.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Tanggal Kedaluwarsa:</span>
                      <span className="text-xs font-bold text-pmi-red-dark font-mono bg-red-100 px-2 py-0.5 rounded-md">{disposalTargetItem.expiryDate}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">Alasan Pemusnahan (Akuntabilitas)</label>
                  <textarea 
                    required
                    value={disposalReason}
                    onChange={e => setDisposalReason(e.target.value)}
                    placeholder="Semisal: Barang darurat medis telah lewat kedaluwarsa H-30 dan tidak dapat disirkulasikan rujukan kesehatan..."
                    className="w-full h-24 p-3 border border-pmi-silver rounded-lg text-sm bg-white focus:ring-1 focus:ring-pmi-red outline-none shadow-xs font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Unggah Dokumen Otorisasi (PDF)</label>
                  <div className="border-2 border-dashed border-pmi-silver hover:border-pmi-red rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-pmi-red-dim/10 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-xs font-semibold text-pmi-slate">Klik untuk Unggah Otorisasi Pimpinan</span>
                    <p className="text-[10px] text-gray-400 text-center font-sans">Mendukung format dokumen laporan resmi PDF maksimal 2MB.</p>
                  </div>
                </div>

              </div>

              {/* Action Buttons footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-pmi-gray-light border-t border-pmi-silver">
                <button 
                  type="button" 
                  onClick={() => setIsDisposalModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold border border-pmi-silver rounded-lg hover:bg-white text-pmi-slate transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-bold bg-pmi-red hover:bg-pmi-red-light text-white rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95"
                >
                  Sahkan Pemusnahan Digital
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
