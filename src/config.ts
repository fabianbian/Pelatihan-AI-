// Menyimpan seluruh data bisnis resmi dari PRD dan aturan konfigurasi aplikasi LaundryCalc.

export type ServiceCode = 'L01' | 'L02' | 'L03';
export type AddOnCode = 'T01' | 'T02';
export type AddOnCalculationType = 'flat' | 'per_billed_kg';

export interface MainService {
  code: ServiceCode;
  name: string;
  pricePerKg: number;
  durationDays: number;
  description: string;
}

export interface AddOnService {
  code: AddOnCode;
  name: string;
  price: number;
  calculationType: AddOnCalculationType;
  notes: string;
}

export const APP_INFO = {
  name: 'LaundryCalc',
  subtitle: 'Hitung estimasi biaya cucian dan pesan lewat WhatsApp.',
} as const;

export const STORE_INFO = {
  name: 'Laundry UMKM',
  whatsappNumber: '6281234567890',
  openingHours: '08.00–20.00 WIB',
  pickupHours: '09.00–17.00 WIB',
  pickupRadiusMaxKm: 5,
  minimumChargeKg: 3.0,
} as const;

export const WEIGHT_RULES = {
  defaultKg: 3,
  minKg: 0.1,
  maxKg: 100,
  stepKg: 0.1,
  quickStepKg: 0.5,
} as const;

export const DEFAULT_SERVICE_CODE: ServiceCode = 'L01';

export const MAIN_SERVICES: readonly MainService[] = [
  {
    code: 'L01',
    name: 'Cuci Lipat',
    pricePerKg: 6000,
    durationDays: 3,
    description: 'Dicuci, dikeringkan, dilipat tanpa setrika (Min. charge 3 kg)',
  },
  {
    code: 'L02',
    name: 'Cuci Setrika',
    pricePerKg: 8000,
    durationDays: 3,
    description: 'Dicuci, disetrika, dilipat rapi (Min. charge 3 kg)',
  },
  {
    code: 'L03',
    name: 'Cuci Setrika Ekspres',
    pricePerKg: 15000,
    durationDays: 1,
    description: 'Sama dengan Cuci Setrika, selesai besok (Min. charge 3 kg)',
  },
] as const;

export const ADD_ONS: readonly AddOnService[] = [
  {
    code: 'T01',
    name: 'Antar-Jemput',
    price: 10000,
    calculationType: 'flat',
    notes: 'Area penjemputan radius max 5 km',
  },
  {
    code: 'T02',
    name: 'Pewangi Premium',
    price: 2000,
    calculationType: 'per_billed_kg',
    notes: 'Aroma mewah pilihan tahan lama (Downy Passion / Mystique)',
  },
] as const;

export const ESTIMATE_DISCLAIMER =
  'Total di atas adalah estimasi awal. Berat pasti akan ditimbang kembali saat pakaian diterima oleh kasir/kurir laundry.';

export const WHATSAPP_DEFAULTS = {
  selfDropOffText: 'Antar Sendiri ke Toko',
  emptyNotesText: '-',
} as const;

export function getServiceByCode(code: ServiceCode): MainService {
  const found = MAIN_SERVICES.find((service) => service.code === code);
  return found ?? MAIN_SERVICES[0];
}

export function getAddOnByCode(code: AddOnCode): AddOnService {
  const found = ADD_ONS.find((addOn) => addOn.code === code);
  return found ?? ADD_ONS[0];
}
