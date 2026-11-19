// Menangani validasi formulir lengkap serta penyusunan template pesan dan tautan WhatsApp sesuai PRD dan iterasi.

import {
  DISTANCE_RULES,
  ESTIMATE_DISCLAIMER,
  MEMBER_CREDIT_RULES,
  STORE_INFO,
  WEIGHT_RULES,
  WHATSAPP_DEFAULTS,
} from '../config';
import { isEligibleForMemberCredit, type OrderEstimate } from './calculator';
import {
  formatDecimal,
  formatDistance,
  formatRupiah,
  formatWeight,
  parseDecimalInput,
} from './format';

export type OrderErrorField =
  | 'weight'
  | 'distance'
  | 'customerName'
  | 'pickupAddress'
  | 'memberYears';

export interface OrderFormValues {
  weightInput: string;
  distanceInput: string;
  customerName: string;
  pickupAddress: string;
  notes: string;
  useDelivery: boolean;
  useFragrance: boolean;
  isMember: boolean;
  memberYearsInput: string;
  requestPayLater: boolean;
}

export interface OrderValidationResult {
  isValid: boolean;
  errors: Partial<Record<OrderErrorField, string>>;
  firstErrorField: OrderErrorField | null;
  parsedWeightKg: number | null;
  parsedDistanceKm: number | null;
  parsedMemberYears: number | null;
}

/**
 * Memvalidasi seluruh isian pesanan sesuai BL-03, jarak per km, dan lama keanggotaan member.
 */
export function validateOrderForm(values: OrderFormValues): OrderValidationResult {
  const errors: Partial<Record<OrderErrorField, string>> = {};

  const parsedWeight = parseDecimalInput(
    values.weightInput,
    WEIGHT_RULES.minKg,
    WEIGHT_RULES.maxKg,
  );

  if (parsedWeight.reason === 'empty' || parsedWeight.reason === 'too_small') {
    errors.weight = 'Masukkan berat cucian minimal 0,1 kg, contoh: 2,43';
  } else if (parsedWeight.reason === 'invalid_number') {
    errors.weight = 'Gunakan angka untuk berat cucian, contoh: 2,43';
  } else if (parsedWeight.reason === 'too_large') {
    errors.weight = `Masukkan berat maksimal ${WEIGHT_RULES.maxKg} kg, contoh: 12,5`;
  }

  let parsedDistanceValue: number | null = null;
  if (values.useDelivery) {
    const parsedDistance = parseDecimalInput(
      values.distanceInput,
      DISTANCE_RULES.minKm,
      DISTANCE_RULES.maxKm,
    );
    parsedDistanceValue = parsedDistance.value;

    if (parsedDistance.reason === 'empty' || parsedDistance.reason === 'too_small') {
      errors.distance = 'Masukkan jarak minimal 0,1 km, contoh: 2,35';
    } else if (parsedDistance.reason === 'invalid_number') {
      errors.distance = 'Gunakan angka untuk jarak pengiriman, contoh: 1,75';
    } else if (parsedDistance.reason === 'too_large') {
      errors.distance = `Jarak penjemputan maksimal ${DISTANCE_RULES.maxKm} km, contoh: 4,5`;
    }
  }

  if (values.customerName.trim() === '') {
    errors.customerName = 'Isi nama kamu dulu, contoh: Budi Santoso';
  }

  if (values.useDelivery && values.pickupAddress.trim() === '') {
    errors.pickupAddress =
      'Isi alamat penjemputan lengkap, contoh: Jl. Melati No. 12, Kost Putri';
  }

  let parsedMemberYearsValue: number | null = null;
  if (values.isMember) {
    const parsedYears = parseDecimalInput(
      values.memberYearsInput,
      MEMBER_CREDIT_RULES.minInputYears,
      MEMBER_CREDIT_RULES.maxInputYears,
    );
    parsedMemberYearsValue = parsedYears.value;

    if (parsedYears.reason === 'empty' || parsedYears.reason === 'too_small') {
      errors.memberYears = 'Masukkan lama menjadi member minimal 0,1 tahun, contoh: 1,5';
    } else if (parsedYears.reason === 'invalid_number') {
      errors.memberYears = 'Gunakan angka untuk lama keanggotaan, contoh: 2';
    } else if (parsedYears.reason === 'too_large') {
      errors.memberYears = `Masukkan lama keanggotaan maksimal ${MEMBER_CREDIT_RULES.maxInputYears} tahun, contoh: 3`;
    }
  }

  const orderedFields: OrderErrorField[] = [
    'weight',
    'distance',
    'customerName',
    'pickupAddress',
    'memberYears',
  ];
  const firstErrorField = orderedFields.find((field) => Boolean(errors[field])) ?? null;

  return {
    isValid: firstErrorField === null,
    errors,
    firstErrorField,
    parsedWeightKg: parsedWeight.value,
    parsedDistanceKm: parsedDistanceValue,
    parsedMemberYears: parsedMemberYearsValue,
  };
}

export interface WhatsAppMessagePayload {
  customerName: string;
  pickupAddress: string;
  notes: string;
  useDelivery: boolean;
  useFragrance: boolean;
  isMember: boolean;
  memberYears: number | null;
  requestPayLater: boolean;
  estimate: OrderEstimate;
}

/**
 * Menyusun pesan WhatsApp mengikuti template wajib PRD Bagian 7 dengan jarak desimal dan status member/Bayar Nanti.
 */
export function buildWhatsAppMessage(payload: WhatsAppMessagePayload): string {
  const { estimate, useDelivery, useFragrance, isMember, memberYears, requestPayLater } =
    payload;
  const cleanName = payload.customerName.trim();
  const cleanAddress = useDelivery
    ? payload.pickupAddress.trim()
    : WHATSAPP_DEFAULTS.selfDropOffText;
  const cleanNotes = payload.notes.trim() || WHATSAPP_DEFAULTS.emptyNotesText;

  const actualWeightText = formatWeight(estimate.actualWeightKg ?? 0);

  const deliveryLine =
    useDelivery && estimate.distanceKm !== null
      ? `Ya (${formatDistance(estimate.distanceKm)} km, +${formatRupiah(estimate.deliveryCost)})`
      : 'Tidak';

  const fragranceLine = useFragrance
    ? `Ya (+${formatRupiah(estimate.fragranceCost)})`
    : 'Tidak';

  const totalText = formatRupiah(estimate.totalCost);
  const canPayLater = isEligibleForMemberCredit(isMember, memberYears) && requestPayLater;

  const lines = [
    'Halo Admin Laundry, saya ingin memesan layanan laundry dengan rincian berikut:',
    '',
    `*Nama:* ${cleanName}`,
    `*Layanan Utama:* ${estimate.service.name}`,
    `*Estimasi Berat:* ${actualWeightText} kg`,
    '*Layanan Tambahan:*',
    `- Antar-Jemput: ${deliveryLine}`,
    `- Pewangi Premium: ${fragranceLine}`,
    '',
    `*Alamat Penjemputan:* ${cleanAddress}`,
    `*Catatan Khusus:* ${cleanNotes}`,
  ];

  if (isMember && memberYears !== null) {
    lines.push(
      '',
      `*Status Member:* Member (${formatDecimal(memberYears)} tahun)`,
      `*Metode Pembayaran:* ${
        canPayLater
          ? 'Pengajuan Bayar Nanti / Hutang (Menunggu verifikasi admin)'
          : 'Bayar Biasa'
      }`,
    );
  }

  lines.push(
    '',
    `*Estimasi Total Biaya:* *${totalText}*`,
    '',
    `_(Catatan: ${ESTIMATE_DISCLAIMER})_`,
    '',
    'Mohon konfirmasi pesanan dan ketersediaan jadwalnya. Terima kasih!',
  );

  return lines.join('\n');
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
