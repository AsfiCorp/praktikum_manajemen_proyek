export interface TimelineEvent {
  title: string;
  location: string;
  time?: string;
  description: string;
  completed: boolean;
  active: boolean;
  icon: 'warehouse' | 'inventory_2' | 'local_shipping' | 'verified_user';
}

export interface Shipment {
  id: string;
  status: 'Diproses' | 'Dalam Perjalanan' | 'Tiba di Transit' | 'Selesai';
  origin: string;
  destination: string;
  timeline: TimelineEvent[];
}

export interface InventoryItem {
  id: string;
  qrCode: string;
  name: string;
  category: 'Logistik' | 'Medis' | 'Hunian';
  stock: number;
  unit: string;
  location: string;
  status: string;
  statusCode: 'good' | 'expiring' | 'low';
  expiryDate?: string;
}

export interface Beneficiary {
  id: string;
  queueNo: string;
  name: string;
  identityType: 'KTP' | 'Kartu Keluarga' | 'Surat RT';
  identityNumber: string;
  submissionTime: string;
  photoUrl: string;
  status: 'Pending' | 'Verified' | 'Duplicate';
}

export interface SyncItem {
  id: string;
  name: string;
  size: string;
  status: 'Menunggu Sinyal' | 'Mensinkronisasi' | 'Selesai';
  type: 'delivery' | 'location' | 'report';
  icon: 'person' | 'location_on' | 'description';
}

export interface DeliveryTask {
  id: string;
  destination: string;
  status: 'Pending' | 'Prioritas' | 'Selesai';
}
