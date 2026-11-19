// Komponen utama LaundryCalc yang menyatukan fitur FT-01 sampai FT-06 beserta state dan validasi pesanan.

import { useMemo, useRef, useState } from 'react';
import { AddOnSelector } from './components/AddOnSelector';
import { CustomerForm } from './components/CustomerForm';
import { PriceSummary } from './components/PriceSummary';
import { ServiceCatalog } from './components/ServiceCatalog';
import { WeightInput } from './components/WeightInput';
import {
  APP_INFO,
  DEFAULT_SERVICE_CODE,
  WEIGHT_RULES,
  type AddOnCode,
  type ServiceCode,
} from './config';
import { adjustWeight, calculateOrderEstimate } from './lib/calculator';
import { formatWeight, parseWeightInput } from './lib/format';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  validateOrderForm,
  type OrderErrorField,
} from './lib/whatsapp';

/**
 * Membuka tautan eksternal di tab baru melalui elemen anchor agar aman tanpa window.open.
 */
function openExternalLinkInNewTab(url: string) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function App() {
  const [selectedServiceCode, setSelectedServiceCode] =
    useState<ServiceCode>(DEFAULT_SERVICE_CODE);
  const [weightInput, setWeightInput] = useState<string>(
    formatWeight(WEIGHT_RULES.defaultKg),
  );
  const [useDelivery, setUseDelivery] = useState<boolean>(false);
  const [useFragrance, setUseFragrance] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<OrderErrorField, string>>>({});
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string | null>(null);

  const weightInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLTextAreaElement>(null);

  const parsedWeight = useMemo(
    () => parseWeightInput(weightInput, WEIGHT_RULES.minKg, WEIGHT_RULES.maxKg),
    [weightInput],
  );

  const estimate = useMemo(
    () =>
      calculateOrderEstimate({
        serviceCode: selectedServiceCode,
        actualWeightKg: parsedWeight.value,
        useDelivery,
        useFragrance,
      }),
    [selectedServiceCode, parsedWeight.value, useDelivery, useFragrance],
  );

  function clearFieldError(field: OrderErrorField) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleWeightInputChange(value: string) {
    setWeightInput(value);
    clearFieldError('weight');
    setLastWhatsAppUrl(null);
  }

  function handleAdjustWeight(deltaKg: number) {
    const nextKg = adjustWeight(parsedWeight.value, deltaKg);
    setWeightInput(formatWeight(nextKg));
    clearFieldError('weight');
    setLastWhatsAppUrl(null);
  }

  function handleToggleAddOn(code: AddOnCode) {
    if (code === 'T01') {
      setUseDelivery((prev) => {
        const next = !prev;
        if (!next) {
          clearFieldError('pickupAddress');
        }
        return next;
      });
    } else {
      setUseFragrance((prev) => !prev);
    }
    setLastWhatsAppUrl(null);
  }

  function handleSelectService(code: ServiceCode) {
    setSelectedServiceCode(code);
    setLastWhatsAppUrl(null);
  }

  function handleCustomerNameChange(value: string) {
    setCustomerName(value);
    clearFieldError('customerName');
    setLastWhatsAppUrl(null);
  }

  function handlePickupAddressChange(value: string) {
    setPickupAddress(value);
    clearFieldError('pickupAddress');
    setLastWhatsAppUrl(null);
  }

  function handleNotesChange(value: string) {
    setNotes(value);
    setLastWhatsAppUrl(null);
  }

  function focusErrorField(field: OrderErrorField) {
    const target =
      field === 'weight'
        ? weightInputRef.current
        : field === 'customerName'
          ? nameInputRef.current
          : addressInputRef.current;

    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function handleSubmitOrder() {
    const validation = validateOrderForm({
      weightInput,
      customerName,
      pickupAddress,
      notes,
      useDelivery,
      useFragrance,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      if (validation.firstErrorField) {
        focusErrorField(validation.firstErrorField);
      }
      return;
    }

    setErrors({});

    const confirmedEstimate = calculateOrderEstimate({
      serviceCode: selectedServiceCode,
      actualWeightKg: validation.parsedWeightKg,
      useDelivery,
      useFragrance,
    });

    const message = buildWhatsAppMessage({
      customerName,
      pickupAddress,
      notes,
      useDelivery,
      useFragrance,
      estimate: confirmedEstimate,
    });

    const url = buildWhatsAppUrl(message);
    setLastWhatsAppUrl(url);
    openExternalLinkInNewTab(url);
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {APP_INFO.name}
          </h1>
          <p className="text-base text-neutral-600">{APP_INFO.subtitle}</p>
        </header>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmitOrder();
          }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start"
        >
          <main className="space-y-8 lg:col-span-7">
            <ServiceCatalog
              selectedServiceCode={selectedServiceCode}
              onSelectService={handleSelectService}
            />

            <WeightInput
              weightInput={weightInput}
              onWeightInputChange={handleWeightInputChange}
              onAdjustWeight={handleAdjustWeight}
              isMinimumChargeApplied={estimate.isMinimumChargeApplied}
              billedWeightKg={estimate.billedWeightKg}
              error={errors.weight}
              inputRef={weightInputRef}
            />

            <AddOnSelector
              useDelivery={useDelivery}
              useFragrance={useFragrance}
              onToggleAddOn={handleToggleAddOn}
              fragranceCost={estimate.fragranceCost}
              isValidWeight={estimate.isValidWeight}
            />

            <CustomerForm
              customerName={customerName}
              pickupAddress={pickupAddress}
              notes={notes}
              useDelivery={useDelivery}
              errors={errors}
              onCustomerNameChange={handleCustomerNameChange}
              onPickupAddressChange={handlePickupAddressChange}
              onNotesChange={handleNotesChange}
              nameInputRef={nameInputRef}
              addressInputRef={addressInputRef}
            />
          </main>

          <div className="lg:col-span-5">
            <PriceSummary
              estimate={estimate}
              useDelivery={useDelivery}
              useFragrance={useFragrance}
              onSubmitOrder={handleSubmitOrder}
              lastWhatsAppUrl={lastWhatsAppUrl}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
