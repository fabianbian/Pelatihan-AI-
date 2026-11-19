// Komponen FT-04 dan FT-06 untuk menampilkan ringkasan biaya live (sticky bar ponsel & panel desktop) serta tombol kirim WhatsApp.

import { CheckCircle2, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { ESTIMATE_DISCLAIMER } from '../config';
import type { OrderEstimate } from '../lib/calculator';
import { formatRupiah, formatWeight } from '../lib/format';

interface PriceSummaryProps {
  estimate: OrderEstimate;
  useDelivery: boolean;
  useFragrance: boolean;
  onSubmitOrder: () => void;
  lastWhatsAppUrl: string | null;
}

function BreakdownContent({
  estimate,
  useDelivery,
  useFragrance,
}: {
  estimate: OrderEstimate;
  useDelivery: boolean;
  useFragrance: boolean;
}) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="text-neutral-600">
          <div className="font-medium text-neutral-900">{estimate.service.name}</div>
          <div className="tabular-nums">
            {estimate.isValidWeight && estimate.billedWeightKg !== null
              ? `${formatWeight(estimate.billedWeightKg)} kg x ${formatRupiah(estimate.service.pricePerKg)}`
              : 'Masukkan berat untuk menghitung'}
          </div>
        </div>
        <div className="shrink-0 font-semibold tabular-nums text-neutral-900">
          {estimate.isValidWeight ? formatRupiah(estimate.mainCost) : '-'}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-3 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium text-neutral-900">Layanan tambahan</span>
          <span className="font-semibold tabular-nums text-neutral-900">
            {estimate.isValidWeight ? formatRupiah(estimate.addOnsCost) : '-'}
          </span>
        </div>

        {useDelivery && (
          <div className="flex items-center justify-between gap-4 text-neutral-600">
            <span>Antar-Jemput</span>
            <span className="tabular-nums">+{formatRupiah(estimate.deliveryCost)}</span>
          </div>
        )}

        {useFragrance && (
          <div className="flex items-center justify-between gap-4 text-neutral-600">
            <span>
              Pewangi Premium
              {estimate.isValidWeight && estimate.billedWeightKg !== null
                ? ` (${formatWeight(estimate.billedWeightKg)} kg)`
                : ''}
            </span>
            <span className="tabular-nums">
              {estimate.isValidWeight ? `+${formatRupiah(estimate.fragranceCost)}` : '-'}
            </span>
          </div>
        )}

        {!useDelivery && !useFragrance && (
          <div className="text-neutral-600">Tidak ada tambahan dipilih</div>
        )}
      </div>

      <p className="border-t border-neutral-200 pt-3 text-sm text-neutral-600">
        {ESTIMATE_DISCLAIMER}
      </p>
    </div>
  );
}

export function PriceSummary({
  estimate,
  useDelivery,
  useFragrance,
  onSubmitOrder,
  lastWhatsAppUrl,
}: PriceSummaryProps) {
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const totalDisplay = estimate.isValidWeight ? formatRupiah(estimate.totalCost) : '-';

  return (
    <>
      {/* Panel ringkasan tetap di sisi kanan untuk layar desktop */}
      <aside aria-labelledby="heading-ringkasan-desktop" className="hidden lg:block">
        <div className="sticky top-6 rounded-2xl bg-white p-6 space-y-6">
          <h2
            id="heading-ringkasan-desktop"
            className="text-lg font-semibold text-neutral-900"
          >
            Ringkasan biaya
          </h2>

          <BreakdownContent
            estimate={estimate}
            useDelivery={useDelivery}
            useFragrance={useFragrance}
          />

          <div className="border-t border-neutral-200 pt-4 space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-base font-medium text-neutral-900">
                Estimasi total
              </span>
              <span className="text-3xl font-semibold tabular-nums text-neutral-900">
                {totalDisplay}
              </span>
            </div>

            <button
              type="button"
              onClick={onSubmitOrder}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-base font-medium text-white hover:bg-blue-800 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap"
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>Kirim ke WhatsApp</span>
            </button>

            {lastWhatsAppUrl && (
              <div
                role="status"
                className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Pesan siap di WhatsApp.</span>
                </span>
                <a
                  href={lastWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-semibold underline underline-offset-2 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  Buka lagi
                </a>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Bar ringkasan menempel di bawah layar untuk ponsel dan tablet */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto max-w-2xl px-4">
          {isMobileDetailOpen && (
            <div
              id="mobile-price-breakdown"
              className="border-b border-neutral-200 py-4 space-y-3"
            >
              <BreakdownContent
                estimate={estimate}
                useDelivery={useDelivery}
                useFragrance={useFragrance}
              />
            </div>
          )}

          {lastWhatsAppUrl && (
            <div
              role="status"
              className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Pesan siap di WhatsApp.</span>
              </span>
              <a
                href={lastWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 font-semibold underline underline-offset-2"
              >
                Buka lagi
              </a>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 py-3">
            <button
              type="button"
              onClick={() => setIsMobileDetailOpen((open) => !open)}
              aria-expanded={isMobileDetailOpen}
              aria-controls="mobile-price-breakdown"
              className="flex min-h-[44px] flex-col justify-center rounded-xl pr-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <span className="flex items-center gap-1 text-sm text-neutral-600">
                <span>Estimasi total</span>
                {isMobileDetailOpen ? (
                  <ChevronDown className="h-4 w-4 text-blue-700" aria-hidden="true" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-blue-700" aria-hidden="true" />
                )}
              </span>
              <span className="text-2xl font-semibold leading-tight tabular-nums text-neutral-900">
                {totalDisplay}
              </span>
            </button>

            <button
              type="button"
              onClick={onSubmitOrder}
              className="flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-base font-medium text-white hover:bg-blue-800 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Kirim ke WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
