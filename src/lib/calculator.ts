// Berisi rumus murni BL-01 (berat ditagih), BL-02 (tarif utama, ongkir per km, pewangi), dan kelayakan Bayar Nanti member.

import {
  DISTANCE_RULES,
  getAddOnByCode,
  getServiceByCode,
  MEMBER_CREDIT_RULES,
  WEIGHT_RULES,
  type MainService,
  type ServiceCode,
} from '../config';

export interface CalculationInput {
  serviceCode: ServiceCode;
  actualWeightKg: number | null;
  useDelivery: boolean;
  distanceKm: number | null;
  useFragrance: boolean;
}

export interface OrderEstimate {
  isValidWeight: boolean;
  isValidDistance: boolean;
  isComplete: boolean;
  service: MainService;
  actualWeightKg: number | null;
  billedWeightKg: number | null;
  distanceKm: number | null;
  isMinimumChargeApplied: boolean;
  mainCost: number;
  deliveryRatePerKm: number;
  deliveryCost: number;
  fragranceCost: number;
  addOnsCost: number;
  totalCost: number;
}

/**
 * Menghitung berat ditagih persis sesuai berat aktual tanpa menaikkan ke minimum 3 kg dan tanpa pembulatan.
 */
export function calculateBilledWeight(actualWeightKg: number): number {
  return actualWeightKg;
}

/**
 * FT-08: Memeriksa apakah pengguna memenuhi syarat pengajuan Bayar Nanti (member di atas 1 tahun).
 */
export function isEligibleForMemberCredit(
  isMember: boolean,
  memberYears: number | null,
): boolean {
  return (
    isMember &&
    memberYears !== null &&
    memberYears > MEMBER_CREDIT_RULES.minTenureYearsExclusive
  );
}

/**
 * Menghitung biaya layanan utama, ongkir per km desimal, pewangi, dan total estimasi sesuai berat aktual.
 */
export function calculateOrderEstimate(input: CalculationInput): OrderEstimate {
  const service = getServiceByCode(input.serviceCode);
  const deliveryAddOn = getAddOnByCode('T01');
  const fragranceAddOn = getAddOnByCode('T02');

  const isValidWeight =
    input.actualWeightKg !== null &&
    input.actualWeightKg >= WEIGHT_RULES.minKg &&
    input.actualWeightKg <= WEIGHT_RULES.maxKg;

  const hasValidDistanceValue =
    input.distanceKm !== null &&
    input.distanceKm >= DISTANCE_RULES.minKm &&
    input.distanceKm <= DISTANCE_RULES.maxKm;

  const isValidDistance = !input.useDelivery || hasValidDistanceValue;
  const isComplete = isValidWeight && isValidDistance;

  const deliveryCost =
    input.useDelivery && hasValidDistanceValue && input.distanceKm !== null
      ? Math.round(input.distanceKm * deliveryAddOn.price)
      : 0;

  if (!isValidWeight || input.actualWeightKg === null) {
    return {
      isValidWeight: false,
      isValidDistance,
      isComplete: false,
      service,
      actualWeightKg: null,
      billedWeightKg: null,
      distanceKm: input.useDelivery && hasValidDistanceValue ? input.distanceKm : null,
      isMinimumChargeApplied: false,
      mainCost: 0,
      deliveryRatePerKm: deliveryAddOn.price,
      deliveryCost,
      fragranceCost: 0,
      addOnsCost: deliveryCost,
      totalCost: 0,
    };
  }

  const billedWeightKg = calculateBilledWeight(input.actualWeightKg);
  const isMinimumChargeApplied = false;

  const mainCost = Math.round(billedWeightKg * service.pricePerKg);
  const fragranceCost = input.useFragrance
    ? Math.round(billedWeightKg * fragranceAddOn.price)
    : 0;
  const addOnsCost = deliveryCost + fragranceCost;
  const totalCost = isComplete ? mainCost + addOnsCost : 0;

  return {
    isValidWeight: true,
    isValidDistance,
    isComplete,
    service,
    actualWeightKg: input.actualWeightKg,
    billedWeightKg,
    distanceKm: input.useDelivery && hasValidDistanceValue ? input.distanceKm : null,
    isMinimumChargeApplied,
    mainCost,
    deliveryRatePerKm: deliveryAddOn.price,
    deliveryCost,
    fragranceCost,
    addOnsCost,
    totalCost,
  };
}

/**
 * Menyesuaikan nilai desimal dengan tombol cepat tanpa membulatkan digit desimal yang sudah ada.
 */
export function adjustDecimalValue(
  currentValue: number | null,
  delta: number,
  minValue: number,
  maxValue: number,
): number {
  const base = currentValue ?? 0;
  const next = Number((base + delta).toPrecision(12));
  if (next < minValue) {
    return minValue;
  }
  if (next > maxValue) {
    return maxValue;
  }
  return next;
}

/**
 * Menyesuaikan berat cucian dengan tombol cepat dalam rentang aturan berat.
 */
export function adjustWeight(currentWeightKg: number | null, deltaKg: number): number {
  return adjustDecimalValue(
    currentWeightKg,
    deltaKg,
    WEIGHT_RULES.minKg,
    WEIGHT_RULES.maxKg,
  );
}
