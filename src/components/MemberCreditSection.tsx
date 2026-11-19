// Komponen FT-08 untuk input status member dan pengajuan Bayar Nanti (hutang) khusus member di atas 1 tahun.

import { AlertCircle, Check, Info } from 'lucide-react';
import type { RefObject } from 'react';
import { MEMBER_CREDIT_RULES } from '../config';

interface MemberCreditSectionProps {
  isMember: boolean;
  memberYearsInput: string;
  parsedMemberYears: number | null;
  isEligibleForPayLater: boolean;
  requestPayLater: boolean;
  memberYearsError?: string;
  onToggleMember: () => void;
  onMemberYearsChange: (value: string) => void;
  onTogglePayLater: () => void;
  memberYearsInputRef: RefObject<HTMLInputElement | null>;
}

export function MemberCreditSection({
  isMember,
  memberYearsInput,
  parsedMemberYears,
  isEligibleForPayLater,
  requestPayLater,
  memberYearsError,
  onToggleMember,
  onMemberYearsChange,
  onTogglePayLater,
  memberYearsInputRef,
}: MemberCreditSectionProps) {
  const showNotEligibleNotice =
    isMember &&
    parsedMemberYears !== null &&
    parsedMemberYears <= MEMBER_CREDIT_RULES.minTenureYearsExclusive;

  return (
    <section aria-labelledby="heading-member" className="space-y-4">
      <h2
        id="heading-member"
        className="text-lg font-semibold tracking-tight text-neutral-900"
      >
        Keanggotaan dan pembayaran
      </h2>

      <label
        className={`flex min-h-[44px] cursor-pointer items-start gap-3 rounded-2xl p-4 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none active:scale-[0.99] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-700 ${
          isMember
            ? 'border-2 border-blue-700 bg-blue-50'
            : 'border border-neutral-300 bg-white hover:border-neutral-400'
        }`}
      >
        <input
          type="checkbox"
          name="isMember"
          checked={isMember}
          onChange={onToggleMember}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
            isMember
              ? 'border-blue-700 bg-blue-700 text-white'
              : 'border-neutral-300 bg-white'
          }`}
        >
          {isMember && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
        </span>

        <div className="space-y-1">
          <span className="block text-base font-semibold text-neutral-900">
            Saya member laundry
          </span>
          <span className="block text-sm text-neutral-600">
            Member di atas 1 tahun bisa mengajukan Bayar Nanti.
          </span>
        </div>
      </label>

      {isMember && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="member-years-input"
              className="block text-sm font-semibold text-neutral-900"
            >
              Lama menjadi member (tahun)
            </label>

            <div className="relative">
              <input
                ref={memberYearsInputRef}
                id="member-years-input"
                name="memberYears"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={memberYearsInput}
                onChange={(event) => onMemberYearsChange(event.target.value)}
                aria-invalid={Boolean(memberYearsError)}
                aria-describedby={
                  memberYearsError ? 'member-years-error' : 'member-years-helper'
                }
                placeholder="Contoh: 1,5"
                className={`min-h-[44px] w-full rounded-xl border bg-white py-2.5 pl-4 pr-16 text-base font-semibold tabular-nums text-neutral-900 placeholder:font-normal placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  memberYearsError ? 'border-red-600' : 'border-neutral-300'
                }`}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-neutral-600"
              >
                tahun
              </span>
            </div>

            {memberYearsError ? (
              <p
                id="member-years-error"
                role="alert"
                className="flex items-start gap-2 text-sm text-red-800"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-red-700"
                  aria-hidden="true"
                />
                <span>{memberYearsError}</span>
              </p>
            ) : (
              <p id="member-years-helper" className="text-sm text-neutral-600">
                Syarat Bayar Nanti: lebih dari 1 tahun.
              </p>
            )}
          </div>

          {showNotEligibleNotice && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
            >
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>Opsi Bayar Nanti khusus member di atas 1 tahun.</p>
            </div>
          )}

          {isEligibleForPayLater && (
            <label
              className={`flex min-h-[44px] cursor-pointer items-start gap-3 rounded-xl p-3.5 transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-700 ${
                requestPayLater
                  ? 'border-2 border-blue-700 bg-blue-50'
                  : 'border border-neutral-300 bg-neutral-50 hover:border-neutral-400'
              }`}
            >
              <input
                type="checkbox"
                name="requestPayLater"
                checked={requestPayLater}
                onChange={onTogglePayLater}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                  requestPayLater
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : 'border-neutral-300 bg-white'
                }`}
              >
                {requestPayLater && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
              </span>

              <div className="space-y-1">
                <span className="block text-base font-semibold text-neutral-900">
                  Ajukan Bayar Nanti (Hutang Member)
                </span>
                <span className="block text-sm text-neutral-600">
                  Persetujuan hutang akan diverifikasi admin saat konfirmasi WhatsApp.
                </span>
              </div>
            </label>
          )}
        </div>
      )}
    </section>
  );
}
