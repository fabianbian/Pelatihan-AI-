// Komponen FT-01 untuk menampilkan katalog paket layanan utama dalam grid kontras tinggi.

import { Check } from 'lucide-react';
import { MAIN_SERVICES, type ServiceCode } from '../config';
import { formatRupiah } from '../lib/format';

interface ServiceCatalogProps {
  selectedServiceCode: ServiceCode;
  onSelectService: (code: ServiceCode) => void;
}

export function ServiceCatalog({
  selectedServiceCode,
  onSelectService,
}: ServiceCatalogProps) {
  return (
    <section aria-labelledby="heading-layanan" className="space-y-4">
      <h2
        id="heading-layanan"
        className="text-lg font-semibold tracking-tight text-neutral-900"
      >
        Pilih layanan utama
      </h2>

      <div
        role="radiogroup"
        aria-labelledby="heading-layanan"
        className="grid grid-cols-1 gap-3 md:grid-cols-3"
      >
        {MAIN_SERVICES.map((service) => {
          const isSelected = service.code === selectedServiceCode;
          return (
            <button
              key={service.code}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectService(service.code)}
              className={`flex min-h-[44px] w-full flex-col justify-between gap-4 rounded-2xl p-4 text-left transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                isSelected
                  ? 'border-2 border-blue-700 bg-blue-50'
                  : 'border border-neutral-300 bg-white hover:border-neutral-400'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-base font-semibold text-neutral-900">
                      {service.name}
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        isSelected ? 'text-blue-700' : 'text-neutral-600'
                      }`}
                    >
                      Selesai {service.durationDays} hari
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? 'border-blue-700 bg-blue-700 text-white'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
                  </span>
                </div>

                <p className="text-sm text-neutral-600">{service.description}</p>
              </div>

              <div className="border-t border-neutral-200 pt-3 flex items-baseline justify-between gap-2">
                <span className="text-xl font-semibold tracking-tight tabular-nums text-neutral-900">
                  {formatRupiah(service.pricePerKg)}
                </span>
                <span className="text-sm font-medium text-neutral-600">per kg</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
