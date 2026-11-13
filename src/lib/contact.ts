/**
 * Public contact details.
 *
 * `PHONE` is only rendered when a real business number is supplied via
 * NEXT_PUBLIC_CONTACT_PHONE. No placeholder number is ever shown to visitors —
 * the UI falls back to a callback request instead.
 */
export const PHONE = (process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "").trim();

/** Demo contact identity — replace with approved business details at launch. */
export const CONTACT_EMAIL = "hello@skylineestates.in";
export const CONTACT_ADDRESS = "Skyline Estates, Financial District, Hyderabad 500032";
export const CONTACT_HOURS = "Monday – Saturday · 10:00 AM – 7:00 PM";

/** Shown wherever contact details are presented so the demo is never mistaken for a live office. */
export const CONTACT_NOTE = "Demonstration contact details — replace with approved business information before launch.";
