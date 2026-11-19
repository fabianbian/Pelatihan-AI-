// Berisi rumus murni BL-01 (berat ditagih minimum charge) dan BL-02 (perhitungan tarif utama & add-on).

import {
  getAddOnByCode,
  getServiceByCode,
  STORE_INFO,
  WEIGHT_RULES,
  type MainService,
  type ServiceCode,
} from '../config';

export interface CalculationInput {
  serviceCode: ServiceCode;
  actualWeightKg: number | null;
  useDelivery: boolean;
  useFragrance: boolean;
}

export interface OrderEstimate {
  isValidWeight: boolean;
  service: MainService;
  actualWeightKg: number | null;
  billedWeightKg: number | null;
  isMinimumChargeApplied: boolean;
  mainCost: number;
  deliveryCost: number;
  fragranceCost: number;
  addOnsCost: number;
  totalCost: number;
}

/**
 * BL-01: Menghitung berat ditagih dengan ketentuan minimum charge 3 kg.
 */
export function calculateBilledWeight(actualWeightKg: number): number {
  return Math.max(STORE_INFO.minimumChargeKg, actualWeightKg);
}

/**
 * BL-02: Menghitung biaya layanan utama, biaya tambahan, dan total estimasi pesanan.
 */
export function calculateOrderEstimate(input: CalculationInput): OrderEstimate {
  const service = getServiceByCode(input.serviceCode);
  const deliveryAddOn = getAddOnByCode('T01');
  const fragranceAddOn = getAddOnByCode('T02');

  if (input.actualWeightKg === null || input.actualWeightKg < WEIGHT_RULES.minKg) {
    const deliveryCost = input.useDelivery ? deliveryAddOn.price : 0;
    return {
      isValidWeight: false,
      service,
      actualWeightKg: null,
      billedWeightKg: null,
      isMinimumChargeApplied: false,
      mainCost: 0,
      deliveryCost,
      fragranceCost: 0,
      addOnsCost: deliveryCost,
      totalCost: 0,
    };
  }

  const billedWeightKg = calculateBilledWeight(input.actualWeightKg);
  const isMinimumChargeApplied = input.actualWeightKg < STORE_INFO.minimumChargeKg;

  const mainCost = Math.round(billedWeightKg * service.pricePerKg);
  const deliveryCost = input.useDelivery ? deliveryAddOn.price : 0;
  const fragranceCost = input.useFragrance
    ? Math.round(billedWeightKg * fragranceAddOn.price)
    : 0;
  const addOnsCost = deliveryCost + fragranceCost;
  const totalCost = mainCost + addOnsCost;

  return {
    isValidWeight: true,
    service,
    actualWeightKg: input.actualWeightKg,
    billedWeightKg,
    isMinimumChargeApplied,
    mainCost,
    deliveryCost,
    fragranceCost,
    addOnsCost,
    totalCost,
  };
}

/**
 * Menyesuaikan berat cucian dengan langkah tombol cepat sambil menjaga rentang min-maks.
 */
export function adjustWeight(currentWeightKg: number | null, deltaKg: number): number {
  const base = currentWeightKg ?? 0;
  const next = Math.round((base + deltaKg) * 10) / 10;
  if (next < WEIGHT_RULES.minKg) {
    return WEIGHT_RULES.minKg;
  }
  if (next > WEIGHT_RULES.maxKg) {
    return WEIGHT_RULES.maxKg;
  }
  return next;
}
