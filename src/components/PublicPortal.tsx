import React, { useState } from 'react';
import { Search, MapPin, Warehouse, Inbox, Truck, ShieldCheck, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Shipment, TimelineEvent } from '../types';

interface PublicPortalProps {
  onLoginClick: () => void;
  shipments: Shipment[];
}

export default function PublicPortal({ onLoginClick, shipments }: PublicPortalProps) {
  const [searchQuery, setSearchQuery] = useState('PMI-2024-X8J9');
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(
    shipments.find(s => s.id === 'PMI-2024-X8J9') || shipments[0] || null
  );
  const [sortByNewest, setSortByNewest] = useState(false);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    const found = shipments.find(s => s.id === query || s.id.includes(query));
    if (found) {
      setActiveShipment(found);
    } else {
      // Create a simulated dynamic shipment if not found, to keep it interactive
      const simulated: Shipment = {
        id: query || 'PMI-SIMULATED-XYZ',
        status: 'Dalam Perjalanan',
        origin: 'Gudang Pusat PMI, JKT',
        destination: 'Posko Wilayah Bantuan, Jakarta',
        timeline: [
          {
            title: 'Dikemas Ulang',
            location: 'Gudang Pusat PMI, JKT',
            time: '15 Juni 2026, 08:00 WIB',
            description: 'Penyusunan barang dan standardisasi kemasan selesai.',
            completed: true,
            active: true,
            icon: 'inventory_2'
          },
          {
            title: 'Diterima di Gudang Transit',
            location: 'Gudang Hub Utama, Bekasi',
            time: '15 Juni 2026, 12:30 WIB',
            description: 'Barang diturunkan untuk penyortiran antar wilayah pasokan.',
            completed: true,
            active: true,
            icon: 'warehouse'
          },
          {
            title: 'Menuju Gudang Regional',
            location: 'Gudang Distribusi Regional',
            description: 'Sedang dalam pengapalan melalui truk logistik ber-GPS.',
            completed: false,
            active: false,
            icon: 'local_shipping'
          },
          {
            title: 'Diterima Penerima Manfaat',
            location: 'Penerima Manfaat Akhir',
            description: 'Menunggu konfirmasi serah terima digital kupon bantuan.',
            completed: false,
            active: false,
            icon: 'verified_user'
          }
        ]
      };
      setActiveShipment(simulated);
    }
  };

  const getSortedTimeline = (timeline: TimelineEvent[]) => {
    if (sortByNewest) {
      // Logic for reverse chronology (latest completed first, followed by pending)
      const completed = timeline.filter(t => t.completed).slice().reverse();
      const pending = timeline.filter(t => !t.completed);
      return [...completed, ...pending];
    }
    // Normal chronological progress order (earliest completed first, followed by pending)
    return timeline;
  };

  const getIcon = (type: string, active: boolean) => {
    const color = active ? 'text-pmi-red' : 'text-gray-400';
    switch (type) {
      case 'warehouse':
        return <Warehouse className={`w-5 h-5 ${color}`} />;
      case 'inventory_2':
        return <Inbox className={`w-5 h-5 ${color}`} />;
      case 'local_shipping':
        return <Truck className={`w-5 h-5 ${color}`} />;
      case 'verified_user':
        return <ShieldCheck className={`w-5 h-5 ${color}`} />;
      default:
        return <Warehouse className={`w-5 h-5 ${color}`} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans" id="beranda">
      {/* TopNavBar Component */}
      <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-200">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4.5">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-red-500/30">P</span>
            <div className="font-extrabold text-2xl text-slate-900 tracking-tight flex items-center">
              LHAM<span className="text-red-600">S</span>
            </div>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-slate-600 hover:text-red-600 focus:text-red-600 transition-colors text-sm font-semibold focus:border-b-2 focus:border-red-600 focus:pb-1.5" href="#beranda">Beranda</a>
            <a className="text-slate-600 hover:text-red-600 focus:text-red-600 transition-colors text-sm font-semibold focus:border-b-2 focus:border-red-600 focus:pb-1.5" href="#lacak-donasi">Lacak Donasi</a>
            <a className="text-slate-600 hover:text-red-600 focus:text-red-600 transition-colors text-sm font-semibold focus:border-b-2 focus:border-red-600 focus:pb-1.5" href="#pembaruan">Pembaruan</a>
          </nav>
          <button 
            onClick={onLoginClick}
            className="inline-flex items-center justify-center px-4.5 py-2.5 border border-red-500 hover:border-red-600 text-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:text-white transition-all rounded-xl text-xs font-bold cursor-pointer active:scale-95 shadow-md shadow-red-100/50"
            id="login-btn"
          >
            Login Central / Admin
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-14">
        
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center text-center max-w-3xl mx-auto gap-5 scroll-mt-32" id="lacak-donasi">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50 rounded-full border border-red-100 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-extrabold text-red-700 tracking-wide uppercase">Palang Merah Indonesia Logistik</span>
          </div>
          <h1 className="font-black text-4xl sm:text-5xl text-slate-900 tracking-tight leading-tight mt-1">
            Lacak Dampak <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-500">Kemanusiaan</span> Anda
          </h1>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-normal max-w-2xl">
            Sistem Manajemen Bantuan Kemanusiaan Palang Merah Indonesia memastikan setiap bantuan dan donasi Anda sampai tepat sasaran, transparan, dan akuntabel hingga ke tangan penerima manfaat.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="w-full mt-6 bg-white p-3 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/70 flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-grow flex items-center w-full px-4">
              <Search className="text-slate-400 mr-3.5 w-5 h-5 shrink-0" />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-slate-900 text-sm font-medium placeholder:text-slate-400 py-2.5 outline-none focus:outline-none focus:ring-0" 
                placeholder="Masukkan Nomor Resi (Contoh: PMI-2024-X8J9)" 
                type="text"
                id="search-resi-input"
              />
            </div>
            <button 
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl shadow-red-500/20 hover:shadow-red-500/35 shrink-0 cursor-pointer active:scale-95"
            >
              Lacak Resi
            </button>
          </form>
        </section>

        {/* Tracking Result Area */}
        {activeShipment ? (
          <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in scroll-mt-32" id="pembaruan">
            
            {/* Left Column: Shipment Details Card */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-7 shadow-xl shadow-slate-100/80 flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detail Kiriman</h3>
                <div className="flex justify-between items-center mt-2.5">
                  <span className="font-mono text-2xl font-black tracking-tight text-slate-900">{activeShipment.id}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="inline-flex items-center px-3 py-1 rounded bg-red-50 text-red-700 font-bold text-xs ring-1 ring-red-100">
                    <Truck className="w-3.5 h-3.5 mr-1" />
                    {activeShipment.status}
                  </span>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-slate-400">Hub Pengirim (Asal)</span>
                  <span className="block text-sm font-bold text-slate-800 mt-1.5">{activeShipment.origin}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 font-sans">Tujuan Akhir (Posko)</span>
                  <span className="block text-sm font-bold text-slate-800 mt-1.5">{activeShipment.destination}</span>
                </div>
              </div>

              {/* Map Simulator */}
              <div className="h-44 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/60 flex flex-col items-center justify-center overflow-hidden relative" id="tracking-map">
                {/* Simulated dots */}
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-40"></div>
                
                {/* Simulated path line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path d="M 40,110 Q 150,40 280,70" fill="transparent" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="4 4" className="animate-pulse" />
                </svg>

                {/* Simulated Icons */}
                <div className="absolute left-[30px] bottom-[35px] z-10 flex flex-col items-center">
                  <div className="w-5.5 h-5.5 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-100 mt-1.5">JKT</span>
                </div>

                <div className="absolute right-[60px] top-[40px] z-10 flex flex-col items-center">
                  <div className="w-5.5 h-5.5 rounded-full bg-slate-400 flex items-center justify-center shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-100 mt-1.5">Cianjur</span>
                </div>

                {/* Animated truck symbol online representation */}
                <div className="absolute left-[130px] top-[55px] z-20 flex bg-white p-1 rounded-full shadow-lg border border-red-100 animate-bounce">
                  <Truck className="w-4 h-4 text-red-600" />
                </div>

                <div className="absolute bottom-2 right-2 bg-white/95 px-2 py-0.5 rounded border border-slate-200/40 text-[10px] font-mono text-slate-400 z-10">
                  Transmisi GPS Aktif
                </div>
              </div>

              {/* Logical Flow Fix Notice */}
              <div className="bg-red-50/55 border border-red-100/75 p-5 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-red-850">Alur Logika Dibetulkan</span>
                  <span className="text-[11px] text-slate-600 leading-relaxed">
                    Sistem mendeteksi timeline berdasarkan urutan kejadian yang benar secara kronologis (Dikemas Ulang pukul 09:15 mendahului Transit Hub pukul 14:30).
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Tracking History Timeline */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-7 shadow-xl shadow-slate-100/80 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Riwayat Perjalanan</h3>
                  <p className="text-sm text-slate-500 mt-1">Rincian perjalanan paket logistik bantuan kemanusiaan.</p>
                </div>
                
                 {/* Logic demonstration: Ascending vs Descending Toggle */}
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 pl-1.5">Tampilan:</span>
                  <button 
                    onClick={() => setSortByNewest(false)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${!sortByNewest ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Kronologis
                  </button>
                  <button 
                    onClick={() => setSortByNewest(true)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${sortByNewest ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Paling Baru
                  </button>
                </div>
              </div>

              {/* Beautiful Timeline component */}
              <div className="relative pl-7 flex-grow flex flex-col gap-7" id="tracking-timeline">
                {/* Central connecting line */}
                <div className="absolute top-2 bottom-6 left-[19px] w-[2px] bg-slate-100" />
                
                {/* Completed journey line indicator */}
                <div 
                  className="absolute top-2 left-[19px] w-[2px] bg-red-600 transition-all duration-300 shadow-sm shadow-red-500"
                  style={{
                    height: sortByNewest 
                      ? '35%' // Depends on reverse order layout representation
                      : '35%' 
                  }}
                />

                {/* Steps mapping */}
                {getSortedTimeline(activeShipment.timeline).map((step, idx) => (
                  <div key={idx} className={`relative flex gap-5 transition-all duration-300 ${step.completed ? 'opacity-100' : 'opacity-40'}`}>
                    
                    {/* Circle marker for status */}
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shrink-0 border-2 transition-all duration-200 ${
                        step.completed 
                          ? 'bg-red-55 border-red-600 text-red-600 shadow-md shadow-red-500/10' 
                          : 'bg-white border-slate-200 text-slate-300'
                      }`}
                    >
                      {getIcon(step.icon, step.completed)}
                    </div>

                    <div className="pt-1 flex flex-col">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`font-bold text-sm ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </span>
                        {step.completed && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Selesai
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 mt-1 font-semibold">
                        {step.location}
                      </span>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
                        {step.description}
                      </p>
                      {step.time && (
                        <span className="font-mono text-[10.5px] text-red-700 font-extrabold mt-2.5 bg-red-50 px-2.5 py-1 rounded-lg w-fit border border-red-100/60 shadow-xs">
                          {step.time}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </section>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center gap-3 shadow-xl shadow-slate-100/50">
            <AlertCircle className="w-12 h-12 text-slate-333" />
            <span className="font-bold text-lg text-slate-900">Resi Tidak Ditemukan</span>
            <p className="text-sm text-slate-400">Pastikan Anda memasukkan nomor resi PMI yang valid untuk melakukan pelacakan.</p>
          </div>
        )}
      </main>

      {/* Footer component */}
      <footer className="w-full bg-slate-950 py-10 border-t border-slate-900 text-white mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6 gap-6">
          <div className="flex items-center gap-2">
            <span className="w-6.5 h-6.5 rounded-lg bg-gradient-to-br from-red-500 to-red-650 flex items-center justify-center text-white font-extrabold text-sm">P</span>
            <div className="font-extrabold text-lg text-white">
              LHAM<span className="text-red-500">S</span> <span className="text-xs font-mono text-slate-500 pl-1">v1.3</span>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <a className="text-slate-400 hover:text-white transition-colors text-xs font-semibold" href="#kebijakan">Kebijakan Privasi</a>
            <a className="text-slate-400 hover:text-white transition-colors text-xs font-semibold" href="#syarat">Syarat &amp; Ketentuan</a>
            <a className="text-slate-400 hover:text-white transition-colors text-xs font-semibold" href="#kontak">Kontak Kami</a>
          </nav>
          <div className="text-xs text-slate-500 font-semibold">
            © 2026 LHAMS PMI. Semua hak dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
