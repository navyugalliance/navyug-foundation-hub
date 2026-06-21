import seedData from "@/data/events.json";

export interface EventButton {
  label: string;
  url: string;
}

export type EventImageAspect = "16:9" | "4:3" | "1:1" | "3:4" | "21:9";

export interface EventImage {
  src: string; // base64 data URL or absolute URL
  aspect?: EventImageAspect;
  alt?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "email" | "tel" | "select" | "textarea" | "checkbox" | "radio" | "checkboxes" | "date" | "time" | "section" | "playersGrid" | "file";
  required: boolean;
  options?: string[]; // for select / checkbox / radio options
}

export interface EventItem {
  id: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  description: string;
  tagline?: string;
  completed?: boolean; // manual override
  images?: EventImage[];
  // Optional rich metadata
  organizer?: string;
  presentedBy?: string;
  location?: string;
  theme?: string;
  objective?: string;
  featuredAttraction?: string;
  targetAudience?: string;
  instagram?: string;
  helpOf?: string;
  socialMediaPartner?: string;
  currentStatus?: string;
  buttons?: EventButton[];
  // Registration fields
  registrationEnabled?: boolean;
  registrationType?: "none" | "internal" | "external";
  externalFormUrl?: string;
  formSubmitUrl?: string;
  formFields?: FormField[];
}

const STORAGE_KEY = "navyug_events_v1";

export const isCompleted = (e: EventItem): boolean => {
  if (e.completed === true) return true;
  const eventDate = new Date(e.date);
  eventDate.setHours(23, 59, 59, 999);
  return eventDate.getTime() < Date.now();
};

export const formatEventDate = (iso: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const readStorage = (): EventItem[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as EventItem[];
    return null;
  } catch {
    return null;
  }
};

export const getAllEvents = (): EventItem[] => {
  const stored = readStorage();
  const list = stored ?? (seedData as EventItem[]);
  return [...list].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

export const getRecentEvents = (count = 3): EventItem[] => {
  const all = getAllEvents();
  const now = Date.now();
  const upcoming = all
    .filter((e) => !isCompleted(e) && new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = all
    .filter((e) => isCompleted(e) || new Date(e.date).getTime() < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return [...upcoming, ...past].slice(0, count);
};

// ---- Admin mutations ----

export const saveAllEvents = (events: EventItem[]): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const resetToSeed = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
};

export const getSeedEvents = (): EventItem[] => seedData as EventItem[];

export const aspectToClass = (aspect?: EventImageAspect): string => {
  switch (aspect) {
    case "1:1":
      return "aspect-square";
    case "4:3":
      return "aspect-[4/3]";
    case "3:4":
      return "aspect-[3/4]";
    case "21:9":
      return "aspect-[21/9]";
    case "16:9":
    default:
      return "aspect-video";
  }
};
