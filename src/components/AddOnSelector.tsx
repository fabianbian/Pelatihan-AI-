// Komponen FT-03 untuk memilih layanan tambahan Antar-Jemput (per km desimal) dan Pewangi Premium.

import { AlertCircle, Check, Minus, Plus } from 'lucide-react';
import type { RefObject } from 'react';
import { ADD_ONS, DISTANCE_RULES, type AddOnCode } from '../config';
import { formatDistance, formatRupiah } from '../lib/format';

interface AddOnSelectorProps {
  useDelivery: boolean;
  useFragrance: boolean;
  distanceInput: string;
  distanceKm: number | null;
  deliveryCost: number;
  fragranceCost: number;
  isValidWeight: boolean;
  isValidDistance: boolean;
  distanceError?: string;
  onToggleAddOn: (code: AddOnCode) => void;
  onDistanceInputChange: (value: string) => void;
  onAdjustDistance: (deltaKm: number) => void;
  distanceInputRef: RefObject<HTMLInputElement | null>;
}

export function AddOnSelector({
  useDelivery,
  useFragrance,
  distanceInput,
  distanceKm,
  deliveryCost,
  fragranceCost,
  isValidWeight,
  isValidDistance,
  distanceError,
  onToggleAddOn,
  onDistanceInputChange,
  onAdjustDistance,
  distanceInputRef,
}: AddOnSelectorProps) {
  const stepText = formatDistance(DISTANCE_RULES.quickStepKm);

  return (
    <section aria-labelledby="heading-addon" className="space-y-4">
      <h2
        id="heading-addon"
        className="text-lg font-semibold tracking-tight text-neutral-900"
      >
        Layanan tambahan
      </h2>

      <div className="space-y-3">
        {ADD_ONS.map((addOn) => {
          const isDelivery = addOn.code === 'T01';
          const checked = isDelivery ? useDelivery : useFragrance;

          return (
            <label
              key={addOn.code}
              className={`flex min-h-[44px] cursor-pointer items-start justify-between gap-4 rounded-2xl p-4 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.99] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-700 ${
                checked
                  ? 'border-2 border-blue-700 bg-blue-50'
                  : 'border border-neutral-300 bg-white hover:border-neutral-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name={`addon-${addOn.code}`}
                  checked={checked}
                  onChange={() => onToggleAddOn(addOn.code)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    checked
                      ? 'border-blue-700 bg-blue-700 text-white'
                      : 'border-neutral-300 bg-white'
                  }`}
                >
                  {checked && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
                </span>

                <div className="space-y-1">
                  <span className="block text-base font-semibold text-neutral-900">
                    {addOn.name}
                  </span>
                  <span className="block text-sm text-neutral-600">{addOn.notes}</span>
                </div>
              </div>

              <div className="shrink-0 text-right tabular-nums">
                {isDelivery ? (
                  <>
                    <div className="text-base font-semibold text-neutral-900">
                      {checked && isValidDistance && distanceKm !== null
                        ? `+${formatRupiah(deliveryCost)}`
                        : `+${formatRupiah(addOn.price)}`}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {checked && isValidDistance && distanceKm !== null
                        ? `${formatDistance(distanceKm)} km`
                        : 'per km'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-base font-semibold text-neutral-900">
                      {checked && isValidWeight
                        ? `+${formatRupiah(fragranceCost)}`
                        : `+${formatRupiah(addOn.price)}`}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {checked && isValidWeight
                        ? `${formatRupiah(addOn.price)}/kg`
                        : 'per kg'}
                    </div>
                  </>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {useDelivery && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 space-y-2">
          <label
            htmlFor="distance-input"
            className="block text-sm font-semibold text-neutral-900"
          >
            Jarak penjemputan (km)
          </label>

          <div className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => onAdjustDistance(-DISTANCE_RULES.quickStepKm)}
              aria-label={`Kurangi ${stepText} km`}
              className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
              <span className="ml-1 tabular-nums">{stepText}</span>
            </button>

            <div className="relative flex-1">
              <input
                ref={distanceInputRef}
                id="distance-input"
                name="distance"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={distanceInput}
                onChange={(event) => onDistanceInputChange(event.target.value)}
                aria-invalid={Boolean(distanceError)}
                aria-describedby={distanceError ? 'distance-error' : 'distance-helper'}
                placeholder="Contoh: 2,35"
                className={`min-h-[44px] w-full rounded-xl border bg-white py-2.5 pl-4 pr-12 text-base font-semibold tabular-nums text-neutral-900 placeholder:font-normal placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  distanceError ? 'border-red-600' : 'border-neutral-300'
                }`}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-neutral-600"
              >
                km
              </span>
            </div>

            <button
              type="button"
              onClick={() => onAdjustDistance(DISTANCE_RULES.quickStepKm)}
              aria-label={`Tambah ${stepText} km`}
              className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span className="ml-1 tabular-nums">{stepText}</span>
            </button>
          </div>

          {distanceError ? (
            <p
              id="distance-error"
              role="alert"
              className="flex items-start gap-2 text-sm text-red-800"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
                aria-hidden="true"
              />
              <span>{distanceError}</span>
            </p>
          ) : (
            <p id="distance-helper" className="text-sm text-neutral-600">
              Maksimal {DISTANCE_RULES.maxKm} km, desimal tidak dibulatkan.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
