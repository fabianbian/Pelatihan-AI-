// Menangani validasi formulir BL-03 serta penyusunan template pesan dan tautan WhatsApp sesuai PRD.

import {
  ESTIMATE_DISCLAIMER,
  STORE_INFO,
  WEIGHT_RULES,
  WHATSAPP_DEFAULTS,
} from '../config';
import type { OrderEstimate } from './calculator';
import { formatRupiah, formatWeight, parseWeightInput } from './format';

export type OrderErrorField = 'weight' | 'customerName' | 'pickupAddress';

export interface OrderFormValues {
  weightInput: string;
  customerName: string;
  pickupAddress: string;
  notes: string;
  useDelivery: boolean;
  useFragrance: boolean;
}

export interface OrderValidationResult {
  isValid: boolean;
  errors: Partial<Record<OrderErrorField, string>>;
  firstErrorField: OrderErrorField | null;
  parsedWeightKg: number | null;
}

/**
 * Memvalidasi seluruh isian pesanan sesuai BL-03 dan menentukan kolom error pertama.
 */
export function validateOrderForm(values: OrderFormValues): OrderValidationResult {
  const errors: Partial<Record<OrderErrorField, string>> = {};

  const parsedWeight = parseWeightInput(
    values.weightInput,
    WEIGHT_RULES.minKg,
    WEIGHT_RULES.maxKg,
  );

  if (parsedWeight.reason === 'empty' || parsedWeight.reason === 'too_small') {
    errors.weight = 'Masukkan berat cucian minimal 0,1 kg, contoh: 2,5';
  } else if (parsedWeight.reason === 'invalid_number') {
    errors.weight = 'Gunakan angka untuk berat cucian, contoh: 3,5';
  } else if (parsedWeight.reason === 'too_large') {
    errors.weight = `Masukkan berat maksimal ${WEIGHT_RULES.maxKg} kg, contoh: 12`;
  }

  if (values.customerName.trim() === '') {
    errors.customerName = 'Isi nama kamu dulu, contoh: Budi Santoso';
  }

  if (values.useDelivery && values.pickupAddress.trim() === '') {
    errors.pickupAddress =
      'Isi alamat penjemputan lengkap, contoh: Jl. Melati No. 12, Kost Putri';
  }

  const orderedFields: OrderErrorField[] = ['weight', 'customerName', 'pickupAddress'];
  const firstErrorField = orderedFields.find((field) => Boolean(errors[field])) ?? null;

  return {
    isValid: firstErrorField === null,
    errors,
    firstErrorField,
    parsedWeightKg: parsedWeight.value,
  };
}

export interface WhatsAppMessagePayload {
  customerName: string;
  pickupAddress: string;
  notes: string;
  useDelivery: boolean;
  useFragrance: boolean;
  estimate: OrderEstimate;
}

/**
 * Menyusun pesan WhatsApp mengikuti template wajib PRD Bagian 7 secara utuh.
 */
export function buildWhatsAppMessage(payload: WhatsAppMessagePayload): string {
  const { estimate, useDelivery, useFragrance } = payload;
  const cleanName = payload.customerName.trim();
  const cleanAddress = useDelivery
    ? payload.pickupAddress.trim()
    : WHATSAPP_DEFAULTS.selfDropOffText;
  const cleanNotes = payload.notes.trim() || WHATSAPP_DEFAULTS.emptyNotesText;

  const actualWeightText = formatWeight(estimate.actualWeightKg ?? 0);
  const billedWeightText = formatWeight(estimate.billedWeightKg ?? 0);

  const deliveryLine = useDelivery
    ? `Ya (+${formatRupiah(estimate.deliveryCost)})`
    : 'Tidak';

  const fragranceLine = useFragrance
    ? `Ya (+${formatRupiah(estimate.fragranceCost)})`
    : 'Tidak';

  const totalText = formatRupiah(estimate.totalCost);

  return [
    'Halo Admin Laundry, saya ingin memesan layanan laundry dengan rincian berikut:',
    '',
    `*Nama:* ${cleanName}`,
    `*Layanan Utama:* ${estimate.service.name}`,
    `*Estimasi Berat:* ${actualWeightText} kg (Berat Ditagih: ${billedWeightText} kg)`,
    '*Layanan Tambahan:*',
    `- Antar-Jemput: ${deliveryLine}`,
    `- Pewangi Premium: ${fragranceLine}`,
    '',
    `*Alamat Penjemputan:* ${cleanAddress}`,
    `*Catatan Khusus:* ${cleanNotes}`,
    '',
    `*Estimasi Total Biaya:* *${totalText}*`,
    '',
    `_(Catatan: ${ESTIMATE_DISCLAIMER})_`,
    '',
    'Mohon konfirmasi pesanan dan ketersediaan jadwalnya. Terima kasih!',
  ].join('\n');
}

/**
 * Menghasilkan tautan deep-link resmi WhatsApp dengan encodeURIComponent yang aman.
 */
export function buildWhatsAppUrl(
  message: string,
  whatsappNumber: string = STORE_INFO.whatsappNumber,
): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
