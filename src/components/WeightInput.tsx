// Komponen FT-02 untuk input berat cucian desimal aktual tanpa pembulatan dan tanpa minimum charge 3 kg.

import { AlertCircle, Minus, Plus } from 'lucide-react';
import type { RefObject } from 'react';
import { WEIGHT_RULES } from '../config';
import { formatWeight } from '../lib/format';

interface WeightInputProps {
  weightInput: string;
  onWeightInputChange: (value: string) => void;
  onAdjustWeight: (deltaKg: number) => void;
  error?: string;
  inputRef: RefObject<HTMLInputElement | null>;
}

export function WeightInput({
  weightInput,
  onWeightInputChange,
  onAdjustWeight,
  error,
  inputRef,
}: WeightInputProps) {
  const stepText = formatWeight(WEIGHT_RULES.quickStepKg);

  return (
    <section aria-labelledby="heading-berat" className="space-y-4">
      <h2
        id="heading-berat"
        className="text-lg font-semibold tracking-tight text-neutral-900"
      >
        Estimasi berat cucian
      </h2>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 space-y-2">
        <label
          htmlFor="weight-input"
          className="block text-sm font-semibold text-neutral-900"
        >
          Berat cucian (kg)
        </label>

        <div className="flex items-stretch gap-2">
          <button
            type="button"
            onClick={() => onAdjustWeight(-WEIGHT_RULES.quickStepKg)}
            aria-label={`Kurangi ${stepText} kg`}
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
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
              placeholder="Contoh: 2,43"
              className={`min-h-[44px] w-full rounded-xl border bg-white py-2.5 pl-4 pr-12 text-base font-semibold tabular-nums text-neutral-900 placeholder:font-normal placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                error ? 'border-red-600' : 'border-neutral-300'
              }`}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-neutral-600"
            >
              kg
            </span>
          </div>

          <button
            type="button"
            onClick={() => onAdjustWeight(WEIGHT_RULES.quickStepKg)}
            aria-label={`Tambah ${stepText} kg`}
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
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
            Minimal 0,1 kg, dihitung sesuai berat tanpa pembulatan.
          </p>
        )}
      </div>
    </section>
  );
}
