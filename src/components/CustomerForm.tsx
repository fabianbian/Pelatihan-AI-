// Komponen FT-05 untuk mengisi nama pemesan, alamat penjemputan kondisional, dan catatan khusus.

import { AlertCircle } from 'lucide-react';
import type { RefObject } from 'react';
import { STORE_INFO } from '../config';
import type { OrderErrorField } from '../lib/whatsapp';

interface CustomerFormProps {
  customerName: string;
  pickupAddress: string;
  notes: string;
  useDelivery: boolean;
  errors: Partial<Record<OrderErrorField, string>>;
  onCustomerNameChange: (value: string) => void;
  onPickupAddressChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  nameInputRef: RefObject<HTMLInputElement | null>;
  addressInputRef: RefObject<HTMLTextAreaElement | null>;
}

export function CustomerForm({
  customerName,
  pickupAddress,
  notes,
  useDelivery,
  errors,
  onCustomerNameChange,
  onPickupAddressChange,
  onNotesChange,
  nameInputRef,
  addressInputRef,
}: CustomerFormProps) {
  return (
    <section aria-labelledby="heading-pemesan" className="space-y-4">
      <h2 id="heading-pemesan" className="text-lg font-semibold text-neutral-900">
        Data pemesan
      </h2>

      <div className="rounded-2xl bg-white p-4 sm:p-6 space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="customer-name"
            className="block text-sm font-medium text-neutral-900"
          >
            Nama
          </label>
          <input
            ref={nameInputRef}
            id="customer-name"
            name="customerName"
            type="text"
            autoComplete="name"
            value={customerName}
            onChange={(event) => onCustomerNameChange(event.target.value)}
            aria-invalid={Boolean(errors.customerName)}
            aria-describedby={errors.customerName ? 'name-error' : undefined}
            placeholder="Contoh: Budi Santoso"
            className={`min-h-[44px] w-full rounded-xl border bg-white px-4 py-2.5 text-base text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
              errors.customerName ? 'border-red-600' : 'border-neutral-200'
            }`}
          />
          {errors.customerName && (
            <p
              id="name-error"
              role="alert"
              className="flex items-start gap-2 text-sm text-red-800"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
                aria-hidden="true"
              />
              <span>{errors.customerName}</span>
            </p>
          )}
        </div>

        {useDelivery ? (
          <div className="space-y-2">
            <label
              htmlFor="pickup-address"
              className="block text-sm font-medium text-neutral-900"
            >
              Alamat penjemputan
            </label>
            <textarea
              ref={addressInputRef}
              id="pickup-address"
              name="pickupAddress"
              autoComplete="street-address"
              rows={3}
              value={pickupAddress}
              onChange={(event) => onPickupAddressChange(event.target.value)}
              aria-invalid={Boolean(errors.pickupAddress)}
              aria-describedby={errors.pickupAddress ? 'address-error' : 'address-helper'}
              placeholder="Contoh: Jl. Melati No. 12, Kost Putri"
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-base text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                errors.pickupAddress ? 'border-red-600' : 'border-neutral-200'
              }`}
            />
            {errors.pickupAddress ? (
              <p
                id="address-error"
                role="alert"
                className="flex items-start gap-2 text-sm text-red-800"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
                  aria-hidden="true"
                />
                <span>{errors.pickupAddress}</span>
              </p>
            ) : (
              <p id="address-helper" className="text-sm text-neutral-600">
                Dalam radius maks {STORE_INFO.pickupRadiusMaxKm} km dari toko.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-neutral-50 p-3 text-sm text-neutral-600">
            Antar sendiri ke toko. Aktifkan Antar-Jemput jika cucian perlu dijemput.
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="order-notes"
            className="block text-sm font-medium text-neutral-900"
          >
            Catatan khusus (opsional)
          </label>
          <textarea
            id="order-notes"
            name="notes"
            rows={2}
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Contoh: Pisahkan baju putih dan berwarna"
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-base text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          />
        </div>
      </div>
    </section>
  );
}
