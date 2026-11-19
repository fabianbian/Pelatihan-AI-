// Menyediakan fungsi tunggal untuk memformat Rupiah, angka desimal tanpa pembulatan, dan mengurai input desimal.

/**
 * Memformat bilangan bulat menjadi format Rupiah Indonesia sesuai PRD (contoh: Rp 18.000).
 */
export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : '';
  const digits = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}Rp ${digits}`;
}

/**
 * Memformat angka desimal Indonesia memakai koma tanpa membulatkan angka bermakna (contoh: 2,35 atau 3).
 */
export function formatDecimal(value: number): string {
  const clean = Number(value.toPrecision(12));
  if (Number.isInteger(clean)) {
    return String(clean);
  }
  return String(clean).replace('.', ',');
}

/**
 * Memformat berat kilogram memakai aturan desimal tanpa pembulatan.
 */
export function formatWeight(kg: number): string {
  return formatDecimal(kg);
}

/**
 * Memformat jarak pengiriman kilometer memakai aturan desimal tanpa pembulatan.
 */
export function formatDistance(km: number): string {
  return formatDecimal(km);
}

export interface ParsedDecimalResult {
  value: number | null;
  reason: 'empty' | 'invalid_number' | 'too_small' | 'too_large' | null;
}

/**
 * Mengurai teks input desimal yang boleh memakai koma atau titik tanpa membulatkan nilainya.
 */
export function parseDecimalInput(
  rawInput: string,
  minValue: number,
  maxValue: number,
): ParsedDecimalResult {
  const trimmed = rawInput.trim();
  if (trimmed === '') {
    return { value: null, reason: 'empty' };
  }

  const normalized = trimmed.replace(',', '.');
  if (!/^-?\d*(\.\d+)?$/.test(normalized) || normalized === '.' || normalized === '-.') {
    return { value: null, reason: 'invalid_number' };
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return { value: null, reason: 'invalid_number' };
  }

  if (parsed < minValue) {
    return { value: null, reason: 'too_small' };
  }

  if (parsed > maxValue) {
    return { value: null, reason: 'too_large' };
  }

  return { value: parsed, reason: null };
}

/**
 * Alias pengurai khusus input berat cucian.
 */
export function parseWeightInput(
  rawInput: string,
  minKg: number,
  maxKg: number,
): ParsedDecimalResult {
  return parseDecimalInput(rawInput, minKg, maxKg);
}
