import React, { useState, useRef, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Battery, 
  Clock, 
  UserCheck, 
  QrCode, 
  FileText, 
  Signature, 
  Save, 
  Info, 
  ChevronRight, 
  MapPin, 
  Camera, 
  History, 
  Home, 
  RefreshCw, 
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Beneficiary, SyncItem, DeliveryTask } from '../types';

interface MobileDispatchProps {
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  beneficiaries: Beneficiary[];
  setBeneficiaries: React.Dispatch<React.SetStateAction<Beneficiary[]>>;
  syncQueue: SyncItem[];
  setSyncQueue: React.Dispatch<React.SetStateAction<SyncItem[]>>;
}

export default function MobileDispatch({
  isOnline,
  setIsOnline,
  beneficiaries,
  setBeneficiaries,
  syncQueue,
  setSyncQueue
}: MobileDispatchProps) {

  const [currentScreen, setCurrentScreen] = useState<'login' | 'home' | 'distribution' | 'queue'>('login');
  
  // Login fields
  const [volunteerID, setVolunteerID] = useState('LOGIXA-RELAWAN-04');
  const [password, setPassword] = useState('••••••••');
  
  // Delivery tasks list
  const [tasks, setTasks] = useState<DeliveryTask[]>([
    { id: 'DO-9921', destination: 'Posko Desa A', status: 'Prioritas' },
    { id: 'DO-9922', destination: 'Puskesmas B', status: 'Pending' },
    { id: 'DO-9923', destination: 'Balai Warga C', status: 'Pending' }
  ]);
  const [activeTaskID, setActiveTaskID] = useState<string | null>(null);

  // Form Fields
  const [idType, setIdType] = useState<'KTP' | 'Kartu Keluarga' | 'Surat RT'>('KTP');
  const [idNumber, setIdNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  // Canvas ref for signature pad
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Storage metric
  const [storageUsed, setStorageUsed] = useState(45); // MB

  // Syncing simulation animation states
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize and clear signature pad
  useEffect(() => {
    if (currentScreen === 'distribution' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#bb0013';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setSignatureUrl(null);
    }
  }, [currentScreen]);

  // Drawing event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignatureUrl(canvasRef.current.toDataURL());
    }
  };

  // Click handler to simulate photo capturing
  const triggerCamera = () => {
    // Generate a random name to make inputting easier
    const names = ['Andi Saputra', 'Diana Lestari', 'Joko Susilo', 'Ririn Aprilia', 'Bambang Prasetyo'];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    
    setRecipientName(selectedName);
    setIdNumber(`32710${Math.floor(Math.random() * 9000000 + 100000)}`);
    setPhotoCaptured(true);
  };

  // Submit local delivery entry
  const handleLocalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !idNumber) {
      alert('Silakan lengkapi data penerima dan nomor identitas.');
      return;
    }
    
    // Create local queue item
    const newQueueItem: SyncItem = {
      id: activeTaskID || 'DO-TEMP',
      name: `${recipientName} - Foto & TTD`,
      size: '1.2 MB',
      status: 'Menunggu Sinyal',
      type: 'delivery',
      icon: 'person'
    };

    setSyncQueue([...syncQueue, newQueueItem]);
    setStorageUsed(prev => prev + 1.2);

    // Remove task from DO list or mark completed
    if (activeTaskID) {
      setTasks(prev => prev.filter(t => t.id !== activeTaskID));
    }

    // Prepare draft beneficiary internally to be published upon sync
    const draftBeneficiary: Beneficiary = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      queueNo: `#Q-${Math.floor(Math.random() * 800 + 100)}`,
      name: recipientName,
      identityType: idType,
      identityNumber: idNumber,
      submissionTime: 'Baru Saja (Mobile Sync)',
      // Random face photo URL for demonstration
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAuh8tDhGZaUCrZFO6YR3jlkQQXyUH_YjFEb59lI2Y1MI6oMpXjHDCEhYOEuHbgR2UU_AnE-dawBAzAQPOK9TjnfUn7PZLftczcLg7JrL3vh7jDE_otPfoj0fzzE7IeovxN9eVPyj_nuS7EFuWYqVmsQrrx7m7AIEMft6Iipfg_3W0bhtNVIBGWHxDNOsR_Qj3qqTKFaHhWUeNMmXfgRsZm2KL_PZwShY7JG04ZTafJpfQnFXtpz_GXKo6n0sdp82Vnmr1pWxXmPTC',
      status: 'Pending'
    };

    // Store the temporary draft in state to merge when verified/synchronizing
    _localDrafts.current.push(draftBeneficiary);

    // Redirect to Queue screen
    setCurrentScreen('queue');

    // Reset Form
    setIdNumber('');
    setRecipientName('');
    setPhotoCaptured(false);
    setSignatureUrl(null);
  };

  // Persistent reference for local drafts waiting for online sync
  const _localDrafts = useRef<Beneficiary[]>([]);

  // Force synchronous push
  const handleForceSync = () => {
    if (!isOnline) {
      alert('Maaf, Sinkronisasi membutuhkan koneksi internet aktif. Aktifkan jaringan wifi di atas!');
      return;
    }

    setIsSyncing(true);
    setSyncQueue(prev => prev.map(item => ({ ...item, status: 'Mensinkronisasi' })));

    setTimeout(() => {
      // Complete syncing. Push all local drafts to central beneficiaries list
      setBeneficiaries(prev => [..._localDrafts.current, ...prev]);
      _localDrafts.current = [];
      setSyncQueue([]);
      setIsSyncing(false);
      setStorageUsed(45); // Reset back to baseline MB
      alert('Pencatatan Berhasil Disinkronisasikan ke Pusat (Pusat Verifikasi)!');
      setCurrentScreen('home');
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 bg-slate-50" id="phone-container">
      
      {/* Smartphone Outer bezel design skeleton */}
      <div className="w-80 h-[688px] bg-slate-950 rounded-[44px] shadow-2xl shadow-slate-900/30 p-3 border-[6px] border-slate-900 relative flex flex-col overflow-hidden">
        
        {/* Smartphone Camera Notch */}
        <div className="absolute top-4.5 left-1/2 -translate-x-1/2 w-32 h-5.5 bg-slate-950 rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2 border border-slate-800 shadow-inner" /> {/* lens */}
          <div className="w-12 h-1 bg-slate-800 rounded-full" /> {/* speaker grill */}
        </div>

        {/* Status Bar */}
        <header className="h-6 bg-slate-950 text-white text-[10px] flex justify-between items-center px-6 pt-1 z-40 select-none">
          <div className="font-extrabold flex items-center gap-1 font-mono">
            <Clock className="w-2.5 h-2.5 text-red-500" />
            17:32
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Battery Indicator */}
            <span className="font-mono font-bold scale-95 text-slate-400">91%</span>
            <Battery className="w-4 h-4 text-emerald-400 rotate-90" />
            
            {/* Online/Offline Status directly reflected on top bar icons */}
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            )}
          </div>
        </header>

        {/* SIMULATOR SCREEN CONTAINER */}
        <div className="flex-grow bg-slate-100 rounded-[32px] overflow-hidden flex flex-col relative">

          {/* ============ MOBILE SCREEN: LOGIN ============ */}
          {currentScreen === 'login' && (
            <div className="flex-grow flex flex-col justify-center px-5 py-8 animate-fade-in relative z-10 bg-white">
              <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 mb-3.5 shadow-sm shadow-red-500/10">
                  <UserCheck className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-black text-center text-lg text-slate-900 font-sans uppercase tracking-tight">Field Dispatch</h3>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Aplikasi Relawan Lapangan</span>
              </div>

              <form onSubmit={e => { e.preventDefault(); setCurrentScreen('home'); }} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">ID Relawan</label>
                  <input 
                    type="text" 
                    value={volunteerID} 
                    onChange={e => setVolunteerID(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-red-500 transition-all focus:bg-white"
                    placeholder="Masukkan ID Anda" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Kata Sandi</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs text-slate-800 outline-none focus:border-red-500 transition-all focus:bg-white"
                    placeholder="Sandi" 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-550/15 transition-all text-center"
                >
                  Masuk Mode Lapangan
                </button>
              </form>

              <div className="mt-5 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-[9.5px] text-slate-500 leading-normal font-semibold">
                  Penyimpanan lokal diaktifkan. Anda dapat bekerja 100% luring tanpa sinyal di wilayah darurat bencana.
                </span>
              </div>
            </div>
          )}

          {/* ============ MOBILE SCREEN: HOME ============ */}
          {currentScreen === 'home' && (
            <div className="flex-grow flex flex-col justify-start pb-16 animate-fade-in text-slate-850">
              
              {/* Header profile info */}
              <div className="bg-white px-4 py-3 border-b border-slate-100 flex justify-between items-center select-none pt-4 sticky top-0 z-20 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-red-500/20">V</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-none text-slate-900">Halo, Relawan</span>
                    <span className="text-[9px] text-slate-450 mt-1 leading-none font-bold">{volunteerID}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {isOnline ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase bg-emerald-55 text-emerald-700 select-none">
                      Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase bg-red-50 text-red-600 select-none">
                      Luring
                    </span>
                  )}
                </div>
              </div>

              {/* Offline mode notification banner */}
              {!isOnline && (
                <div className="bg-red-600 text-white py-1 px-4 text-center text-[10px] font-bold select-none flex items-center justify-center gap-1.5 shadow-sm">
                  <WifiOff className="w-3 h-3" />
                  Mode Luring Aktif: Data Disimpan Lokal
                </div>
              )}

              {/* Bento indicators */}
              <div className="p-4 grid grid-cols-2 gap-3 pb-2">
                <div className="bg-white border border-slate-105 rounded-2xl p-3.5 flex flex-col justify-between h-20 shadow-xs relative">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">DO Aktif</span>
                  <div className="flex items-end justify-between">
                    <span className="font-extrabold text-2xl text-slate-900">{tasks.length}</span>
                    <UserCheck className="w-4 h-4 text-red-500" />
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentScreen('queue')}
                  className="bg-white hover:bg-slate-50 border border-slate-105 rounded-2xl p-3.5 flex flex-col justify-between h-20 shadow-xs relative text-left cursor-pointer transition-all active:scale-95"
                >
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Antrean Luring</span>
                  <div className="flex items-end justify-between w-full">
                    <span className={`font-extrabold text-2xl ${syncQueue.length > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                      {syncQueue.length}
                    </span>
                    <RefreshCw className={`w-4 h-4 text-slate-400 ${syncQueue.length > 0 ? 'animate-spin text-red-500' : ''}`} />
                  </div>
                </button>
              </div>

              {/* Task list section */}
              <div className="px-4 flex-grow overflow-y-auto">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 font-sans">Daftar Tugas Kelola</h4>
                
                <div className="space-y-3">
                  {tasks.length > 0 ? (
                    tasks.map(task => (
                      <div key={task.id} className="bg-white border border-slate-100 rounded-2xl p-3.5 relative overflow-hidden group shadow-xs">
                        {/* Red visual left rail line indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-500" />
                        
                        <div className="flex justify-between items-start mb-2.5 pl-1.5">
                          <div className="flex flex-col">
                            <span className="font-bold text-xs font-mono text-slate-800">{task.id}</span>
                            <span className="text-[10px] font-bold text-slate-500 mt-0.5">{task.destination}</span>
                          </div>
                          
                          {task.status === 'Prioritas' && (
                            <span className="bg-red-50 text-red-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-red-100">Prioritas</span>
                          )}
                        </div>

                        <button 
                          onClick={() => {
                            setActiveTaskID(task.id);
                            setCurrentScreen('distribution');
                          }}
                          className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-[10px] font-extrabold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors active:scale-95 duration-100 shadow-sm"
                        >
                          Mulai Serah Terima
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl flex flex-col items-center gap-2 shadow-xs">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-805">Tugas Selesai</span>
                      <p className="text-[9.5px] text-slate-400 font-semibold">Semua paket distribusi luring telah didata.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ============ MOBILE SCREEN: DISTRIBUTION FORM ============ */}
          {currentScreen === 'distribution' && (
            <div className="flex-grow flex flex-col justify-start pb-16 animate-fade-in text-slate-850 overflow-y-auto">
              
              {/* Back navigation header */}
              <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3 select-none pt-4 sticky top-0 z-20 shadow-xs">
                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="p-1 hover:bg-slate-50 rounded-full text-red-600 active:scale-95 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none text-slate-900">Distribusi Bantuan</span>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 leading-none">{activeTaskID}</span>
                </div>
              </div>

              {/* Alert banner fallback */}
              {!isOnline && (
                <div className="bg-red-600 text-white py-1 px-4 text-center text-[10px] font-bold select-none flex items-center justify-center gap-1.5">
                  <WifiOff className="w-3 h-3 animate-pulse" />
                  Pipa Luring Aktif: Penyimpanan Terisolasi
                </div>
              )}

              <form onSubmit={handleLocalSave} className="p-4 space-y-4">
                
                {/* QR barcode mock-up scan area */}
                <button 
                  type="button"
                  onClick={() => alert(`QR Paket ${activeTaskID} Terpindai!`)}
                  className="w-full bg-white border-2 border-red-500 border-dashed rounded-2xl py-4 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-red-50/40 transition-colors shadow-sm"
                >
                  <QrCode className="w-8 h-8 text-red-600 animate-pulse" />
                  <span className="font-bold text-xs text-red-700">Pindai QR Paket Bantuan</span>
                  <span className="text-[9px] text-slate-500 font-medium">Kamera aktif otomatis memvalidasi barcode</span>
                </button>

                {/* Receiver ID selection block input representation */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pilih Identitas</label>
                  <select 
                    value={idType} 
                    onChange={e => setIdType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 outline-none rounded-xl p-2.5 text-xs font-bold text-slate-805"
                  >
                    <option value="KTP">KTP (Kartu Tanda Penduduk)</option>
                    <option value="Kartu Keluarga">KK (Kartu Keluarga)</option>
                    <option value="Surat RT">Surat RT/RW (Darurat)</option>
                  </select>
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Nomor Identitas</label>
                  <input 
                    type="text" 
                    required
                    value={idNumber} 
                    onChange={e => setIdNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-red-500 text-slate-900 font-semibold"
                    placeholder="Contoh ID: 3271012356..." 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none font-sans">Nama Penerima</label>
                  <input 
                    type="text" 
                    required
                    value={recipientName} 
                    onChange={e => setRecipientName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-red-500 text-slate-900 font-semibold"
                    placeholder="Sesuai kartu kependudukan" 
                  />
                </div>

                {/* Camera mock up */}
                <div className="space-y-1.5">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none font-sans">Bukti Capture Penerimaan</span>
                  <button 
                    type="button"
                    onClick={triggerCamera}
                    className={`w-full py-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${photoCaptured ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                  >
                    <Camera className={`w-8 h-8 ${photoCaptured ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className={`font-bold text-xs ${photoCaptured ? 'text-emerald-800' : 'text-slate-800'}`}>
                      {photoCaptured ? 'Kamera: Wajah + Identitas Ter-Capture' : 'Ambil Foto Wajah / Bukti'}
                    </span>
                    <p className="text-[9px] text-slate-500 font-medium font-mono">Maksimal resolusi otomatis kompresi &lt; 500 KB</p>
                  </button>
                </div>

                {/* Digital Signature canvas pad */}
                <div className="space-y-1.5">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none font-sans">Tanda Tangan Digital Penerima</span>
                  <div className="border border-slate-200 rounded-2xl bg-white relative h-28 overflow-hidden shadow-xs">
                    <canvas 
                      ref={canvasRef}
                      width={280}
                      height={110}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"
                    />
                    {!signatureUrl && (
                      <span className="text-[10px] text-slate-450 font-semibold absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        Gambar tanda tangan di coretan ini
                      </span>
                    )}
                  </div>
                </div>

                {/* Save button */}
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-650 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-500/15 active:scale-95 transition-all mt-1"
                >
                  <Save className="w-4 h-4 text-white" />
                  Simpan Data Distribusi Lokal
                </button>

              </form>
            </div>
          )}

          {/* ============ MOBILE SCREEN: SYNC QUEUE ============ */}
          {currentScreen === 'queue' && (
            <div className="flex-grow flex flex-col justify-start pb-16 animate-fade-in text-slate-850 overflow-y-auto">
              
              {/* Back header */}
              <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3 select-none pt-4 sticky top-0 z-20 shadow-xs">
                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="p-1 hover:bg-slate-50 rounded-full text-red-600 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="text-xs font-bold text-slate-900">Kapasitas Antrean</h3>
              </div>

              {/* Connectivity status alert block */}
              <div className={`py-3 px-4 border-b flex items-start gap-2.5 border-slate-100 ${isOnline ? 'bg-emerald-50/70' : 'bg-amber-50/70'}`}>
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <WifiOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none text-slate-900">
                    {isOnline ? 'Sinyal Tersambung WiFi' : 'Koneksi Terputus'}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-1 leading-normal font-semibold">
                    {isOnline ? 'Siap melakukan sinkronisasi data luring ke Pusat Verifikasi.' : 'Luring diaktifkan. Data aman tidak akan hilang karena caching lokal SQLite.'}
                  </span>
                </div>
              </div>

              {/* Waiting lists queue mapping */}
              <section className="p-4 flex-grow">
                <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block mb-2 font-sans">Menunggu Sinkronisasi ({syncQueue.length})</span>
                
                <div className="space-y-2.5">
                  {syncQueue.length > 0 ? (
                    syncQueue.map((item, idx) => (
                      <div key={item.id} className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-slate-500 font-bold" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-800 truncate max-w-[124px]">{item.name}</span>
                            <span className="text-[9px] text-slate-450 font-semibold font-mono mt-0.5">{item.size} • {isOnline ? 'Siap kirim' : 'Antre Sinyal'}</span>
                          </div>
                        </div>

                        <span className={`text-[8px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full select-none ${
                          isSyncing 
                            ? 'bg-amber-100 text-amber-800 animate-pulse' 
                            : isOnline 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isSyncing ? 'Mengirim' : isOnline ? 'Ready' : 'Luring'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl flex flex-col items-center gap-2 shadow-xs">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">Antrean Bersih</span>
                      <p className="text-[9px] text-slate-450 font-semibold">Semua cache data luring telah terunggah sempurna.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Bottom storage metric progress bar inside phone screen */}
              <div className="p-4 bg-white border-t border-slate-100 sticky bottom-0 z-30 shadow-md">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-slate-400 font-bold font-sans uppercase tracking-wider">Kapasitas Terpakai Luring</span>
                    <span className="font-mono text-slate-900 font-bold">{storageUsed.toFixed(1)}MB / 500MB</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div className="h-full bg-gradient-to-r from-red-650 to-red-500 rounded-full" style={{ width: `${(storageUsed/500)*100}%` }} />
                  </div>

                  <button 
                    onClick={handleForceSync}
                    disabled={syncQueue.length === 0}
                    className="w-full h-10 mt-1 bg-gradient-to-r from-red-650 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-extrabold transition-all active:scale-95 disabled:active:scale-100 disabled:pointer-events-none cursor-pointer shadow-md"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    Aktivasi Sinkronisasi
                  </button>
                  <p className="text-center text-[8px] text-slate-400 font-semibold mt-1 pb-1">Sinkronisasi membutuhkan status jaringan WiFi Online</p>
                </div>
              </div>

            </div>
          )}

          {/* SIMULATED BOTTOM HARDWARE BUTTON FOR PHONE FRAME */}
          <nav className="absolute bottom-0 w-full h-[64px] bg-white border-t border-slate-100 flex justify-around items-center px-4 pb-safe z-40 select-none shadow-md">
            
            {/* Tab 1: Home */}
            <button 
              onClick={() => {
                if (currentScreen !== 'login') {
                  setCurrentScreen('home');
                }
              }}
              className={`flex flex-col items-center justify-center w-12 h-12 transition-all active:scale-95 cursor-pointer ${currentScreen === 'home' ? 'text-red-600' : 'text-slate-400'}`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[9px] font-bold font-sans mt-0.5 leading-none">Beranda</span>
            </button>

            {/* Tab 2: Queue */}
            <button 
              onClick={() => {
                if (currentScreen !== 'login') {
                  setCurrentScreen('queue');
                }
              }}
              className={`flex flex-col items-center justify-center w-12 h-12 transition-all active:scale-95 cursor-pointer relative ${currentScreen === 'queue' ? 'text-red-600' : 'text-slate-400'}`}
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-[9px] font-bold font-sans mt-0.5 leading-none animate-pulse">Antrean</span>
              {syncQueue.length > 0 && (
                <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-600 rounded-full shadow-md shadow-red-500/50" />
              )}
            </button>
          </nav>

        </div>
      </div>

    </div>
  );
}
