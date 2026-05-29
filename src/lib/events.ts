import eventsData from "@/data/events.json";

export interface EventButton {
  label: string;
  url: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  description: string;
  tagline?: string;
  completed?: boolean;
  buttons?: EventButton[];
}

export const isCompleted = (e: EventItem): boolean => {
  if (e.completed === true) return true;
  const eventDate = new Date(e.date);
  eventDate.setHours(23, 59, 59, 999);
  return eventDate.getTime() < Date.now();
};

export const formatEventDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

export const getAllEvents = (): EventItem[] => {
  return [...(eventsData as EventItem[])].sort(
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
