// Komponen FT-03 untuk memilih layanan tambahan Antar-Jemput dan Pewangi Premium.

import { Check } from 'lucide-react';
import { ADD_ONS, type AddOnCode } from '../config';
import { formatRupiah } from '../lib/format';

interface AddOnSelectorProps {
  useDelivery: boolean;
  useFragrance: boolean;
  onToggleAddOn: (code: AddOnCode) => void;
  fragranceCost: number;
  isValidWeight: boolean;
}

export function AddOnSelector({
  useDelivery,
  useFragrance,
  onToggleAddOn,
  fragranceCost,
  isValidWeight,
}: AddOnSelectorProps) {
  return (
    <section aria-labelledby="heading-addon" className="space-y-4">
      <h2 id="heading-addon" className="text-lg font-semibold text-neutral-900">
        Layanan tambahan
      </h2>

      <div className="space-y-3">
        {ADD_ONS.map((addOn) => {
          const checked = addOn.code === 'T01' ? useDelivery : useFragrance;
          const isPerKg = addOn.calculationType === 'per_billed_kg';

          return (
            <label
              key={addOn.code}
              className={`flex min-h-[44px] cursor-pointer items-start justify-between gap-4 rounded-2xl p-4 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.99] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-700 ${
                checked
                  ? 'border-2 border-blue-700 bg-blue-50'
                  : 'border border-neutral-200 bg-white hover:border-neutral-300'
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
                {isPerKg ? (
                  <>
                    <div className="text-base font-semibold text-neutral-900">
                      {checked && isValidWeight
                        ? `+${formatRupiah(fragranceCost)}`
                        : `+${formatRupiah(addOn.price)}`}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {checked && isValidWeight
                        ? `${formatRupiah(addOn.price)}/kg`
                        : 'per kg ditagih'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-base font-semibold text-neutral-900">
                      +{formatRupiah(addOn.price)}
                    </div>
                    <div className="text-sm text-neutral-600">per pesanan</div>
                  </>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}
