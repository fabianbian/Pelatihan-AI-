// Komponen utama LaundryCalc yang menyatukan FT-01 s.d. FT-06 dan FT-08 dengan tata letak tegas beraksen biru.

import { useMemo, useRef, useState } from 'react';
import { AddOnSelector } from './components/AddOnSelector';
import { CustomerForm } from './components/CustomerForm';
import { MemberCreditSection } from './components/MemberCreditSection';
import { PriceSummary } from './components/PriceSummary';
import { ServiceCatalog } from './components/ServiceCatalog';
import { WeightInput } from './components/WeightInput';
import {
  APP_INFO,
  DEFAULT_SERVICE_CODE,
  DISTANCE_RULES,
  MEMBER_CREDIT_RULES,
  WEIGHT_RULES,
  type AddOnCode,
  type ServiceCode,
} from './config';
import {
  adjustDecimalValue,
  adjustWeight,
  calculateOrderEstimate,
  isEligibleForMemberCredit,
} from './lib/calculator';
import {
  formatDistance,
  formatWeight,
  parseDecimalInput,
} from './lib/format';
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
  const [distanceInput, setDistanceInput] = useState<string>(
    formatDistance(DISTANCE_RULES.defaultKm),
  );
  const [useFragrance, setUseFragrance] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isMember, setIsMember] = useState<boolean>(false);
  const [memberYearsInput, setMemberYearsInput] = useState<string>('');
  const [requestPayLater, setRequestPayLater] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<OrderErrorField, string>>>({});
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string | null>(null);

  const weightInputRef = useRef<HTMLInputElement>(null);
  const distanceInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLTextAreaElement>(null);
  const memberYearsInputRef = useRef<HTMLInputElement>(null);

  const parsedWeight = useMemo(
    () => parseDecimalInput(weightInput, WEIGHT_RULES.minKg, WEIGHT_RULES.maxKg),
    [weightInput],
  );

  const parsedDistance = useMemo(
    () => parseDecimalInput(distanceInput, DISTANCE_RULES.minKm, DISTANCE_RULES.maxKm),
    [distanceInput],
  );

  const parsedMemberYears = useMemo(
    () =>
      parseDecimalInput(
        memberYearsInput,
        MEMBER_CREDIT_RULES.minInputYears,
        MEMBER_CREDIT_RULES.maxInputYears,
      ),
    [memberYearsInput],
  );

  const isEligibleForPayLater = isEligibleForMemberCredit(
    isMember,
    parsedMemberYears.value,
  );

  const isPayLaterActive = isEligibleForPayLater && requestPayLater;

  const estimate = useMemo(
    () =>
      calculateOrderEstimate({
        serviceCode: selectedServiceCode,
        actualWeightKg: parsedWeight.value,
        useDelivery,
        distanceKm: parsedDistance.value,
        useFragrance,
      }),
    [
      selectedServiceCode,
      parsedWeight.value,
      useDelivery,
      parsedDistance.value,
      useFragrance,
    ],
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

  function handleDistanceInputChange(value: string) {
    setDistanceInput(value);
    clearFieldError('distance');
    setLastWhatsAppUrl(null);
  }

  function handleAdjustDistance(deltaKm: number) {
    const nextKm = adjustDecimalValue(
      parsedDistance.value,
      deltaKm,
      DISTANCE_RULES.minKm,
      DISTANCE_RULES.maxKm,
    );
    setDistanceInput(formatDistance(nextKm));
    clearFieldError('distance');
    setLastWhatsAppUrl(null);
  }

  function handleToggleAddOn(code: AddOnCode) {
    if (code === 'T01') {
      setUseDelivery((prev) => {
        const next = !prev;
        if (!next) {
          clearFieldError('distance');
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

  function handleToggleMember() {
    setIsMember((prev) => {
      const next = !prev;
      if (!next) {
        setRequestPayLater(false);
        clearFieldError('memberYears');
      }
      return next;
    });
    setLastWhatsAppUrl(null);
  }

  function handleMemberYearsChange(value: string) {
    setMemberYearsInput(value);
    clearFieldError('memberYears');
    const parsed = parseDecimalInput(
      value,
      MEMBER_CREDIT_RULES.minInputYears,
      MEMBER_CREDIT_RULES.maxInputYears,
    );
    if (!isEligibleForMemberCredit(true, parsed.value)) {
      setRequestPayLater(false);
    }
    setLastWhatsAppUrl(null);
  }

  function handleTogglePayLater() {
    if (!isEligibleForPayLater) {
      setRequestPayLater(false);
      return;
    }
    setRequestPayLater((prev) => !prev);
    setLastWhatsAppUrl(null);
  }

  function focusErrorField(field: OrderErrorField) {
    const target =
      field === 'weight'
        ? weightInputRef.current
        : field === 'distance'
          ? distanceInputRef.current
          : field === 'customerName'
            ? nameInputRef.current
            : field === 'pickupAddress'
              ? addressInputRef.current
              : memberYearsInputRef.current;

    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function handleSubmitOrder() {
    const validation = validateOrderForm({
      weightInput,
      distanceInput,
      customerName,
      pickupAddress,
      notes,
      useDelivery,
      useFragrance,
      isMember,
      memberYearsInput,
      requestPayLater: isPayLaterActive,
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
      distanceKm: validation.parsedDistanceKm,
      useFragrance,
    });

    const message = buildWhatsAppMessage({
      customerName,
      pickupAddress,
      notes,
      useDelivery,
      useFragrance,
      isMember,
      memberYears: validation.parsedMemberYears,
      requestPayLater: isPayLaterActive,
      estimate: confirmedEstimate,
    });

    const url = buildWhatsAppUrl(message);
    setLastWhatsAppUrl(url);
    openExternalLinkInNewTab(url);
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {APP_INFO.name}
          </h1>
          <p className="mt-1 text-base text-neutral-600">{APP_INFO.subtitle}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:py-8">
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmitOrder();
          }}
          className="space-y-8"
        >
          <ServiceCatalog
            selectedServiceCode={selectedServiceCode}
            onSelectService={handleSelectService}
          />

          <div className="grid grid-cols-1 gap-8 border-t border-neutral-200 pt-8 lg:grid-cols-12 lg:items-start">
            <main className="space-y-8 lg:col-span-7">
              <WeightInput
                weightInput={weightInput}
                onWeightInputChange={handleWeightInputChange}
                onAdjustWeight={handleAdjustWeight}
                error={errors.weight}
                inputRef={weightInputRef}
              />

              <AddOnSelector
                useDelivery={useDelivery}
                useFragrance={useFragrance}
                distanceInput={distanceInput}
                distanceKm={estimate.distanceKm}
                deliveryCost={estimate.deliveryCost}
                fragranceCost={estimate.fragranceCost}
                isValidWeight={estimate.isValidWeight}
                isValidDistance={estimate.isValidDistance}
                distanceError={errors.distance}
                onToggleAddOn={handleToggleAddOn}
                onDistanceInputChange={handleDistanceInputChange}
                onAdjustDistance={handleAdjustDistance}
                distanceInputRef={distanceInputRef}
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

              <MemberCreditSection
                isMember={isMember}
                memberYearsInput={memberYearsInput}
                parsedMemberYears={parsedMemberYears.value}
                isEligibleForPayLater={isEligibleForPayLater}
                requestPayLater={isPayLaterActive}
                memberYearsError={errors.memberYears}
                onToggleMember={handleToggleMember}
                onMemberYearsChange={handleMemberYearsChange}
                onTogglePayLater={handleTogglePayLater}
                memberYearsInputRef={memberYearsInputRef}
              />
            </main>

            <div className="lg:col-span-5">
              <PriceSummary
                estimate={estimate}
                useDelivery={useDelivery}
                useFragrance={useFragrance}
                isPayLaterActive={isPayLaterActive}
                memberYears={parsedMemberYears.value}
                onSubmitOrder={handleSubmitOrder}
                lastWhatsAppUrl={lastWhatsAppUrl}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
