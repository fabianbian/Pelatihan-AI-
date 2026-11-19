// Menyediakan fungsi tunggal untuk memformat Rupiah, angka desimal berat, dan mengurai input berat.

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
 * Memformat berat kilogram memakai koma tanpa nol di belakang (contoh: 4,5 atau 3).
 */
export function formatWeight(kg: number): string {
  const normalized = Math.round(kg * 10) / 10;
  if (Number.isInteger(normalized)) {
    return String(normalized);
  }
  return normalized.toFixed(1).replace(/\.0$/, '').replace('.', ',');
}

export interface ParsedWeightResult {
  value: number | null;
  reason: 'empty' | 'invalid_number' | 'too_small' | 'too_large' | null;
}

/**
 * Mengurai teks input berat yang boleh memakai koma atau titik serta memeriksa rentang valid.
 */
export function parseWeightInput(
  rawInput: string,
  minKg: number,
  maxKg: number,
): ParsedWeightResult {
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

  if (parsed < minKg) {
    return { value: null, reason: 'too_small' };
  }

  if (parsed > maxKg) {
    return { value: null, reason: 'too_large' };
  }

  return { value: parsed, reason: null };
}
