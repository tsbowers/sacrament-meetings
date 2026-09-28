"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { MeetingFormState } from "@/lib/actions";
import type { SacramentMeeting } from "@/lib/types";

const initialState: MeetingFormState = { message: null, errors: {} };

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-black dark:text-zinc-50";

const hintClass = "mb-1 block text-xs text-zinc-500 dark:text-zinc-400";

const labelClass =
  "mb-1 block text-sm font-medium text-black dark:text-zinc-50";

/**
 * Error container for a single field. It is always rendered (empty when
 * there are no errors) so the aria-live region exists before messages
 * arrive and screen readers announce validation updates.
 */
function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  return (
    <div
      id={id}
      aria-live="polite"
      className="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {messages?.map((message, i) => (
        <p key={i}>{message}</p>
      ))}
    </div>
  );
}

export default function MeetingForm({
  action,
  meeting,
  submitLabel,
}: {
  /** createMeeting, or updateMeeting pre-bound with the meeting id. */
  action: (
    state: MeetingFormState,
    formData: FormData
  ) => Promise<MeetingFormState>;
  /** When present, the form is pre-filled to edit this meeting. */
  meeting?: SacramentMeeting;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const hymnValues = (hymn: SacramentMeeting["openingHymn"]) => ({
    number: hymn ? String(hymn.number) : "",
    title: hymn ? hymn.title : "",
  });

  const opening = hymnValues(meeting?.openingHymn ?? false);
  const sacrament = hymnValues(meeting?.sacramentHymn ?? false);
  const closing = hymnValues(meeting?.closingHymn ?? false);

  const speakers = meeting?.speakers.filter((s) => s.type === "speaker") ?? [];
  const musicalNumbers =
    meeting?.speakers.filter((s) => s.type === "musical-number") ?? [];
  const programLines = (items: SacramentMeeting["speakers"]) =>
    items.map((s) => `${s.name} | ${s.topic}`).join("\n");

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <p
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelClass}>
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={meeting?.date ?? ""}
            aria-describedby="date-error"
            aria-invalid={state.errors.date ? true : undefined}
            className={inputClass}
          />
          <FieldError id="date-error" messages={state.errors.date} />
        </div>

        <div>
          <label htmlFor="meetingType" className={labelClass}>
            Meeting type
          </label>
          <select
            id="meetingType"
            name="meetingType"
            defaultValue={meeting?.meetingType ?? "regular"}
            aria-describedby="meetingType-error"
            aria-invalid={state.errors.meetingType ? true : undefined}
            className={inputClass}
          >
            <option value="testimony">Fast &amp; Testimony Meeting</option>
            <option value="regular">Sacrament Meeting</option>
            <option value="stake">Stake Conference</option>
            <option value="general">General Conference</option>
          </select>
          <FieldError
            id="meetingType-error"
            messages={state.errors.meetingType}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="presiding" className={labelClass}>
            Presiding
          </label>
          <input
            id="presiding"
            name="presiding"
            type="text"
            defaultValue={meeting?.presiding ?? ""}
            aria-describedby="presiding-error"
            aria-invalid={state.errors.presiding ? true : undefined}
            className={inputClass}
          />
          <FieldError
            id="presiding-error"
            messages={state.errors.presiding}
          />
        </div>

        <div>
          <label htmlFor="conducting" className={labelClass}>
            Conducting
          </label>
          <input
            id="conducting"
            name="conducting"
            type="text"
            defaultValue={meeting?.conducting ?? ""}
            aria-describedby="conducting-error"
            aria-invalid={state.errors.conducting ? true : undefined}
            className={inputClass}
          />
          <FieldError
            id="conducting-error"
            messages={state.errors.conducting}
          />
        </div>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-black dark:text-zinc-50">
          Hymns &amp; Prayers
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="openingPrayer" className={labelClass}>
              Opening prayer (who gives it)
            </label>
            <input
              id="openingPrayer"
              name="openingPrayer"
              type="text"
              defaultValue={meeting?.openingPrayer ?? ""}
              aria-describedby="openingPrayer-error"
              className={inputClass}
            />
            <FieldError
              id="openingPrayer-error"
              messages={state.errors.openingPrayer}
            />
          </div>

          <div>
            <label htmlFor="closingPrayer" className={labelClass}>
              Closing prayer (who gives it)
            </label>
            <input
              id="closingPrayer"
              name="closingPrayer"
              type="text"
              defaultValue={meeting?.closingPrayer ?? ""}
              aria-describedby="closingPrayer-error"
              className={inputClass}
            />
            <FieldError
              id="closingPrayer-error"
              messages={state.errors.closingPrayer}
            />
          </div>
        </div>

        {(
          [
            {
              legend: "Opening hymn",
              numberId: "openingHymnNumber",
              titleId: "openingHymnTitle",
              values: opening,
            },
            {
              legend: "Sacrament hymn",
              numberId: "sacramentHymnNumber",
              titleId: "sacramentHymnTitle",
              values: sacrament,
            },
            {
              legend: "Closing hymn",
              numberId: "closingHymnNumber",
              titleId: "closingHymnTitle",
              values: closing,
            },
          ] as const
        ).map((hymn) => (
          <fieldset key={hymn.numberId} className="space-y-2">
            <legend className="text-sm font-medium text-black dark:text-zinc-50">
              {hymn.legend}{" "}
              <span className="font-normal text-zinc-500 dark:text-zinc-400">
                (leave both blank for none)
              </span>
            </legend>
            <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <div>
                <label htmlFor={hymn.numberId} className={labelClass}>
                  Number
                </label>
                <input
                  id={hymn.numberId}
                  name={hymn.numberId}
                  type="text"
                  inputMode="numeric"
                  defaultValue={hymn.values.number}
                  aria-describedby={`${hymn.numberId}-error`}
                  aria-invalid={state.errors[hymn.numberId] ? true : undefined}
                  className={inputClass}
                />
                <FieldError
                  id={`${hymn.numberId}-error`}
                  messages={state.errors[hymn.numberId]}
                />
              </div>
              <div>
                <label htmlFor={hymn.titleId} className={labelClass}>
                  Title
                </label>
                <input
                  id={hymn.titleId}
                  name={hymn.titleId}
                  type="text"
                  defaultValue={hymn.values.title}
                  aria-describedby={`${hymn.titleId}-error`}
                  aria-invalid={state.errors[hymn.titleId] ? true : undefined}
                  className={inputClass}
                />
                <FieldError
                  id={`${hymn.titleId}-error`}
                  messages={state.errors[hymn.titleId]}
                />
              </div>
            </div>
          </fieldset>
        ))}

        <div className="flex items-center gap-2">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={meeting?.stakeBusiness}
            aria-describedby="stakeBusiness-error"
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="stakeBusiness" className="text-sm">
            Stake business will be conducted
          </label>
        </div>
        <FieldError
          id="stakeBusiness-error"
          messages={state.errors.stakeBusiness}
        />
      </fieldset>

      <div className="space-y-4">
        <div>
          <label htmlFor="announcements" className={labelClass}>
            Announcements
          </label>
          <p id="announcements-hint" className={hintClass}>
            One announcement per line. Leave blank for none.
          </p>
          <textarea
            id="announcements"
            name="announcements"
            rows={3}
            defaultValue={(meeting?.announcements ?? []).join("\n")}
            aria-describedby="announcements-hint announcements-error"
            className={inputClass}
          />
          <FieldError
            id="announcements-error"
            messages={state.errors.announcements}
          />
        </div>

        <div>
          <label htmlFor="wardBusiness" className={labelClass}>
            Ward business
          </label>
          <p id="wardBusiness-hint" className={hintClass}>
            One item per line (e.g. releases and sustainings). Leave blank for
            none.
          </p>
          <textarea
            id="wardBusiness"
            name="wardBusiness"
            rows={3}
            defaultValue={(meeting?.wardBusiness ?? [])
              .map((item) => item.description)
              .join("\n")}
            aria-describedby="wardBusiness-hint wardBusiness-error"
            className={inputClass}
          />
          <FieldError
            id="wardBusiness-error"
            messages={state.errors.wardBusiness}
          />
        </div>

        <div>
          <label htmlFor="speakers" className={labelClass}>
            Speakers
          </label>
          <p id="speakers-hint" className={hintClass}>
            {"One per line, formatted \"Name | Topic\". Leave blank for none."}
          </p>
          <textarea
            id="speakers"
            name="speakers"
            rows={3}
            defaultValue={programLines(speakers)}
            aria-describedby="speakers-hint speakers-error"
            className={inputClass}
          />
          <FieldError id="speakers-error" messages={state.errors.speakers} />
        </div>

        <div>
          <label htmlFor="musicalNumbers" className={labelClass}>
            Musical numbers
          </label>
          <p id="musicalNumbers-hint" className={hintClass}>
            {"One per line, formatted \"Performer | Song\". Leave blank for none."}
          </p>
          <textarea
            id="musicalNumbers"
            name="musicalNumbers"
            rows={3}
            defaultValue={programLines(musicalNumbers)}
            aria-describedby="musicalNumbers-hint musicalNumbers-error"
            className={inputClass}
          />
          <FieldError
            id="musicalNumbers-error"
            messages={state.errors.musicalNumbers}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/meetings"
          className="text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}