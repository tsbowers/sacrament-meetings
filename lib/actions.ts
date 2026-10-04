"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import {
  createMeeting as createMeetingInDb,
  updateMeeting as updateMeetingInDb,
  deleteMeeting as deleteMeetingInDb,
  type MeetingInput,
} from "@/lib/meetings-db";

/**
 * Server Actions for meeting mutations.
 *
 * Each action:
 *   1. Extracts the raw FormData values and runs them through
 *      MeetingFormSchema.safeParse — on failure it returns a
 *      MeetingFormState (message + per-field error arrays) instead of
 *      throwing, so the form can display the errors inline.
 *   2. Calls the matching function in lib/meetings-db.ts inside a
 *      try...catch, logging the original error and re-throwing a
 *      user-friendly Error so unexpected failures surface in the
 *      nearest error.tsx boundary.
 *   3. Calls revalidatePath("/meetings") and (for create/update)
 *      redirects back to the list, which re-renders in the same
 *      response so the list is immediately fresh.
 */

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

/**
 * Validates the raw form values. Multi-value textareas stay plain strings
 * here (one item per line); they are split into arrays/objects only after
 * validation passes, in toMeetingInput() below.
 */
const MeetingFormSchema = z
  .object({
    date: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
    meetingType: z.enum(["testimony", "regular", "stake", "general"], {
      message: "Choose a meeting type.",
    }),
    presiding: z.string().trim().min(1, "Enter who is presiding."),
    conducting: z.string().trim().min(1, "Enter who is conducting."),
    openingPrayer: z.string().trim(),
    closingPrayer: z.string().trim(),
    stakeBusiness: z.boolean(),
    openingHymnNumber: z.string().trim(),
    openingHymnTitle: z.string().trim(),
    sacramentHymnNumber: z.string().trim(),
    sacramentHymnTitle: z.string().trim(),
    closingHymnNumber: z.string().trim(),
    closingHymnTitle: z.string().trim(),
    announcements: z.string().trim(),
    wardBusiness: z.string().trim(),
    speakers: z.string().trim(),
    musicalNumbers: z.string().trim(),
  })
  .superRefine((value, ctx) => {
    const hymnPairs = [
      { number: "openingHymnNumber", title: "openingHymnTitle" },
      { number: "sacramentHymnNumber", title: "sacramentHymnTitle" },
      { number: "closingHymnNumber", title: "closingHymnTitle" },
    ] as const;

    for (const { number, title } of hymnPairs) {
      const hasNumber = value[number].length > 0;
      const hasTitle = value[title].length > 0;

      if (hasNumber && !/^\d+$/.test(value[number])) {
        ctx.addIssue({
          code: "custom",
          path: [number],
          message: "Hymn numbers must be whole numbers (e.g. 19).",
        });
      }
      if (hasNumber && !hasTitle) {
        ctx.addIssue({
          code: "custom",
          path: [title],
          message: "Enter the hymn title to go with the number.",
        });
      }
      if (!hasNumber && hasTitle) {
        ctx.addIssue({
          code: "custom",
          path: [number],
          message: "Enter the hymn number to go with the title.",
        });
      }
    }
  });

type MeetingFormField = keyof z.infer<typeof MeetingFormSchema>;

/** Shape returned by the create/update actions for useActionState. */
export type MeetingFormState = {
  message: string | null;
  errors: Partial<Record<MeetingFormField, string[]>>;
};

// ---------------------------------------------------------------------------
// Authentication / authorization
// ---------------------------------------------------------------------------

/**
 * Owner-only model: this app has a single authorized owner account, so any
 * valid session is the owner. Every mutation calls this first -- the client
 * can never be trusted, because Server Actions can be invoked directly.
 */
async function requireOwnerSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  return session;
}

/** Login form action (used with useActionState in components/login-form.tsx). */
export async function authenticate(
  _prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong.";
      }
    }
    throw error; // re-throw so Next.js handles the redirect correctly
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Pulls the raw values out of FormData into a plain object for safeParse. */
function rawValues(formData: FormData) {
  const get = (key: string) => String(formData.get(key) ?? "").trim();

  return {
    date: get("date"),
    meetingType: get("meetingType"),
    presiding: get("presiding"),
    conducting: get("conducting"),
    openingPrayer: get("openingPrayer"),
    closingPrayer: get("closingPrayer"),
    // Unchecked checkboxes are simply absent from FormData.
    stakeBusiness: formData.get("stakeBusiness") === "on",
    openingHymnNumber: get("openingHymnNumber"),
    openingHymnTitle: get("openingHymnTitle"),
    sacramentHymnNumber: get("sacramentHymnNumber"),
    sacramentHymnTitle: get("sacramentHymnTitle"),
    closingHymnNumber: get("closingHymnNumber"),
    closingHymnTitle: get("closingHymnTitle"),
    announcements: get("announcements"),
    wardBusiness: get("wardBusiness"),
    speakers: get("speakers"),
    musicalNumbers: get("musicalNumbers"),
  };
}

/** Groups Zod issues into per-field error arrays for inline display. */
function fieldErrors(issues: z.ZodIssue[]): MeetingFormState["errors"] {
  const errors: MeetingFormState["errors"] = {};
  for (const issue of issues) {
    const field = issue.path[0] as MeetingFormField | undefined;
    if (field) {
      errors[field] = [...(errors[field] ?? []), issue.message];
    }
  }
  return errors;
}

/** Converts validated form values into the DB input shape. */
function toMeetingInput(data: z.infer<typeof MeetingFormSchema>): MeetingInput {
  const hymn = (number: string, title: string) =>
    number ? { number: Number(number), title } : false;

  const lines = (text: string) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

  const programItems = (text: string, type: "speaker" | "musical-number") =>
    lines(text).map((line) => {
      const [name, ...rest] = line.split("|");
      return { name: name.trim(), topic: rest.join("|").trim(), type };
    });

  return {
    date: data.date,
    meetingType: data.meetingType,
    presiding: data.presiding,
    conducting: data.conducting,
    announcements: lines(data.announcements),
    openingHymn: hymn(data.openingHymnNumber, data.openingHymnTitle),
    openingPrayer: data.openingPrayer,
    wardBusiness: lines(data.wardBusiness).map((description) => ({
      description,
    })),
    stakeBusiness: data.stakeBusiness,
    sacramentHymn: hymn(data.sacramentHymnNumber, data.sacramentHymnTitle),
    speakers: [
      ...programItems(data.speakers, "speaker"),
      ...programItems(data.musicalNumbers, "musical-number"),
    ],
    closingHymn: hymn(data.closingHymnNumber, data.closingHymnTitle),
    closingPrayer: data.closingPrayer,
  };
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function createMeeting(
  _prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  await requireOwnerSession();

  const parsed = MeetingFormSchema.safeParse(rawValues(formData));

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields and try again.",
      errors: fieldErrors(parsed.error.issues),
    };
  }

  try {
    await createMeetingInDb(toMeetingInput(parsed.data));
  } catch (error) {
    console.error("createMeeting action failed:", error);
    throw new Error("Could not save the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

export async function updateMeeting(
  id: number,
  _prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  await requireOwnerSession();

  const parsed = MeetingFormSchema.safeParse(rawValues(formData));

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields and try again.",
      errors: fieldErrors(parsed.error.issues),
    };
  }

  try {
    await updateMeetingInDb(id, toMeetingInput(parsed.data));
  } catch (error) {
    console.error("updateMeeting action failed:", error);
    throw new Error(
      "Could not update the meeting — it may have been deleted. Please try again."
    );
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
  redirect("/meetings");
}

export async function deleteMeeting(formData: FormData): Promise<void> {
  await requireOwnerSession();

  const parsedId = z.coerce
    .number()
    .int()
    .positive()
    .safeParse(formData.get("id"));

  if (!parsedId.success) {
    throw new Error("That meeting could not be identified. Please try again.");
  }

  try {
    await deleteMeetingInDb(parsedId.data);
  } catch (error) {
    console.error("deleteMeeting action failed:", error);
    throw new Error("Could not delete the meeting. Please try again.");
  }

  revalidatePath("/meetings");
}