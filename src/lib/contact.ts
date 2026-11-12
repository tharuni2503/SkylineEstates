/** Agent phone number. Set NEXT_PUBLIC_CONTACT_PHONE (e.g. +91XXXXXXXXXX); call links are hidden when it is empty. */
export const PHONE = (process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "").trim();
