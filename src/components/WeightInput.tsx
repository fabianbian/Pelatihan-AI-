// Komponen FT-02 untuk input berat cucian (kg), tombol penyesuaian cepat, dan notifikasi minimum charge 3 kg.

import { AlertCircle, Info, Minus, Plus } from 'lucide-react';
import type { RefObject } from 'react';
import { STORE_INFO, WEIGHT_RULES } from '../config';
import { formatWeight } from '../lib/format';

interface WeightInputProps {
  weightInput: string;
  onWeightInputChange: (value: string) => void;
  onAdjustWeight: (deltaKg: number) => void;
  isMinimumChargeApplied: boolean;
  billedWeightKg: number | null;
  error?: string;
  inputRef: RefObject<HTMLInputElement | null>;
}

export function WeightInput({
  weightInput,
  onWeightInputChange,
  onAdjustWeight,
  isMinimumChargeApplied,
  billedWeightKg,
  error,
  inputRef,
}: WeightInputProps) {
  const minChargeText = formatWeight(STORE_INFO.minimumChargeKg);
  const stepText = formatWeight(WEIGHT_RULES.quickStepKg);

  return (
    <section aria-labelledby="heading-berat" className="space-y-4">
      <h2 id="heading-berat" className="text-lg font-semibold text-neutral-900">
        Estimasi berat cucian
      </h2>

      <div className="rounded-2xl bg-white p-4 sm:p-6 space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="weight-input"
            className="block text-sm font-medium text-neutral-900"
          >
            Berat cucian (kg)
          </label>

          <div className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => onAdjustWeight(-WEIGHT_RULES.quickStepKg)}
              aria-label={`Kurangi ${stepText} kg`}
              className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
              <span className="ml-1 tabular-nums">{stepText}</span>
            </button>

            <div className="relative flex-1">
              <input
                ref={inputRef}
                id="weight-input"
                name="weight"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={weightInput}
                onChange={(event) => onWeightInputChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'weight-error' : 'weight-helper'}
                placeholder="Contoh: 3,5"
                className={`min-h-[44px] w-full rounded-xl border bg-white py-2.5 pl-4 pr-12 text-base font-medium tabular-nums text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  error ? 'border-red-600' : 'border-neutral-200'
                }`}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-neutral-600"
              >
                kg
              </span>
            </div>

            <button
              type="button"
              onClick={() => onAdjustWeight(WEIGHT_RULES.quickStepKg)}
              aria-label={`Tambah ${stepText} kg`}
              className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span className="ml-1 tabular-nums">{stepText}</span>
            </button>
          </div>

          {error ? (
            <p
              id="weight-error"
              role="alert"
              className="flex items-start gap-2 text-sm text-red-800"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
                aria-hidden="true"
              />
              <span>{error}</span>
            </p>
          ) : (
            <p id="weight-helper" className="text-sm text-neutral-600">
              Minimal 0,1 kg, pakai koma atau titik.
            </p>
          )}
        </div>

        {isMinimumChargeApplied && billedWeightKg !== null && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p className="tabular-nums">
              Ketentuan minimum {minChargeText} kg berlaku. Berat ditagih menjadi{' '}
              <span className="font-semibold">{formatWeight(billedWeightKg)} kg</span>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
