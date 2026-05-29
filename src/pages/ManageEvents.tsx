import { useEffect, useMemo, useState } from "react";
import {
  EventItem,
  EventImage,
  EventImageAspect,
  EventButton,
  getAllEvents,
  saveAllEvents,
  resetToSeed,
  isCompleted,
  aspectToClass,
} from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Download, RotateCcw, Save, ImagePlus, X } from "lucide-react";

const ASPECTS: EventImageAspect[] = ["16:9", "4:3", "1:1", "3:4", "21:9"];

const emptyEvent = (): EventItem => ({
  id: `event-${Date.now()}`,
  title: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  images: [],
  buttons: [],
});

// Compress image file to base64 JPEG/PNG (max 1600px, quality 0.85)
const fileToCompressedDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 1600;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const scale = Math.min(MAX / width, MAX / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unsupported"));
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = file.type === "image/png";
        resolve(canvas.toDataURL(isPng ? "image/png" : "image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

const ManageEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setEvents(getAllEvents());
  }, []);

  const updateEvent = (idx: number, patch: Partial<EventItem>) => {
    setEvents((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
    setDirty(true);
  };

  const addEvent = () => {
    setEvents((prev) => [emptyEvent(), ...prev]);
    setDirty(true);
  };

  const deleteEvent = (idx: number) => {
    if (!confirm("Delete this event?")) return;
    setEvents((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const saveAll = () => {
    saveAllEvents(events);
    setDirty(false);
    toast({ title: "Saved", description: "Events updated." });
  };

  const handleReset = () => {
    if (!confirm("Reset all events to original seed data? This wipes your local changes.")) return;
    resetToSeed();
    setEvents(getAllEvents());
    setDirty(false);
    toast({ title: "Reset", description: "Restored seed events." });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-muted/20 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Manage Events</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add, edit, delete events and images. Changes are stored in your browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={addEvent} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" /> New Event
            </Button>
            <Button onClick={exportJson} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" /> Export JSON
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" /> Reset to Seed
            </Button>
            <Button onClick={saveAll} size="sm" disabled={!dirty}>
              <Save className="w-4 h-4 mr-1" /> {dirty ? "Save Changes" : "Saved"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {events.map((event, idx) => (
            <EventEditor
              key={event.id + idx}
              event={event}
              onChange={(patch) => updateEvent(idx, patch)}
              onDelete={() => deleteEvent(idx)}
            />
          ))}
          {events.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No events. Click <span className="font-semibold">New Event</span> to add one.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

interface EditorProps {
  event: EventItem;
  onChange: (patch: Partial<EventItem>) => void;
  onDelete: () => void;
}

const EventEditor = ({ event, onChange, onDelete }: EditorProps) => {
  const completed = isCompleted(event);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;
    const newImages: EventImage[] = [];
    for (const file of Array.from(files)) {
      try {
        const src = await fileToCompressedDataUrl(file);
        newImages.push({ src, aspect: "16:9", alt: event.title });
      } catch {
        toast({ title: "Image error", description: file.name, variant: "destructive" });
      }
    }
    onChange({ images: [...(event.images || []), ...newImages] });
  };

  const updateImage = (i: number, patch: Partial<EventImage>) => {
    const next = [...(event.images || [])];
    next[i] = { ...next[i], ...patch };
    onChange({ images: next });
  };

  const removeImage = (i: number) => {
    const next = (event.images || []).filter((_, idx) => idx !== i);
    onChange({ images: next });
  };

  const updateButton = (i: number, patch: Partial<EventButton>) => {
    const next = [...(event.buttons || [])];
    next[i] = { ...next[i], ...patch };
    onChange({ buttons: next });
  };

  const addButton = () => onChange({ buttons: [...(event.buttons || []), { label: "", url: "" }] });
  const removeButton = (i: number) =>
    onChange({ buttons: (event.buttons || []).filter((_, idx) => idx !== i) });

  return (
    <div className="bg-background border rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-primary">{event.title || "Untitled event"}</h2>
          <span
            className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
              completed ? "bg-muted text-muted-foreground" : "bg-gold/20 text-primary"
            }`}
          >
            {completed ? "Completed" : "Upcoming"}
          </span>
        </div>
        <Button onClick={onDelete} variant="ghost" size="sm" className="text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="ID (unique)">
          <Input value={event.id} onChange={(e) => onChange({ id: e.target.value })} />
        </Field>
        <Field label="Title">
          <Input value={event.title} onChange={(e) => onChange({ title: e.target.value })} />
        </Field>
        <Field label="Date">
          <Input
            type="date"
            value={event.date}
            onChange={(e) => onChange({ date: e.target.value })}
          />
        </Field>
        <Field label="Status override">
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={event.completed === true ? "completed" : event.completed === false ? "upcoming" : "auto"}
            onChange={(e) => {
              const v = e.target.value;
              onChange({
                completed: v === "completed" ? true : v === "upcoming" ? false : undefined,
              });
            }}
          >
            <option value="auto">Auto (by date)</option>
            <option value="upcoming">Force Upcoming</option>
            <option value="completed">Force Completed</option>
          </select>
        </Field>
        <Field label="Tagline" className="md:col-span-2">
          <Input value={event.tagline || ""} onChange={(e) => onChange({ tagline: e.target.value })} />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <Textarea
            rows={3}
            value={event.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </Field>
        <Field label="Organizer">
          <Input value={event.organizer || ""} onChange={(e) => onChange({ organizer: e.target.value })} />
        </Field>
        <Field label="Presented By">
          <Input value={event.presentedBy || ""} onChange={(e) => onChange({ presentedBy: e.target.value })} />
        </Field>
        <Field label="Location">
          <Input value={event.location || ""} onChange={(e) => onChange({ location: e.target.value })} />
        </Field>
        <Field label="Theme">
          <Input value={event.theme || ""} onChange={(e) => onChange({ theme: e.target.value })} />
        </Field>
        <Field label="Objective" className="md:col-span-2">
          <Textarea rows={2} value={event.objective || ""} onChange={(e) => onChange({ objective: e.target.value })} />
        </Field>
        <Field label="Featured Attraction">
          <Input value={event.featuredAttraction || ""} onChange={(e) => onChange({ featuredAttraction: e.target.value })} />
        </Field>
        <Field label="Target Audience">
          <Input value={event.targetAudience || ""} onChange={(e) => onChange({ targetAudience: e.target.value })} />
        </Field>
        <Field label="Instagram">
          <Input value={event.instagram || ""} onChange={(e) => onChange({ instagram: e.target.value })} />
        </Field>
        <Field label="With the help of">
          <Input value={event.helpOf || ""} onChange={(e) => onChange({ helpOf: e.target.value })} />
        </Field>
        <Field label="Social Media Partner">
          <Input value={event.socialMediaPartner || ""} onChange={(e) => onChange({ socialMediaPartner: e.target.value })} />
        </Field>
        <Field label="Current Status">
          <Input value={event.currentStatus || ""} onChange={(e) => onChange({ currentStatus: e.target.value })} />
        </Field>
      </div>

      {/* Images */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold">Images</Label>
          <label className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded border cursor-pointer hover:bg-muted">
            <ImagePlus className="w-3 h-3" /> Add images
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                handleImageUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {(event.images || []).length === 0 && (
          <p className="text-xs text-muted-foreground">No images yet.</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(event.images || []).map((img, i) => (
            <div key={i} className="border rounded overflow-hidden bg-muted/30">
              <div className={`w-full overflow-hidden bg-muted ${aspectToClass(img.aspect)}`}>
                <img src={img.src} alt={img.alt || ""} className="w-full h-full object-cover" />
              </div>
              <div className="p-2 space-y-2">
                <select
                  className="w-full text-xs h-8 rounded border border-input bg-background px-2"
                  value={img.aspect || "16:9"}
                  onChange={(e) => updateImage(i, { aspect: e.target.value as EventImageAspect })}
                >
                  {ASPECTS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Alt text"
                  className="h-8 text-xs"
                  value={img.alt || ""}
                  onChange={(e) => updateImage(i, { alt: e.target.value })}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-destructive h-7 text-xs"
                  onClick={() => removeImage(i)}
                >
                  <X className="w-3 h-3 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          First image is shown as the card cover. Images are resized to 1600px max and stored in your browser.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold">CTA Buttons</Label>
          <Button onClick={addButton} variant="outline" size="sm" className="h-7 text-xs">
            <Plus className="w-3 h-3 mr-1" /> Add button
          </Button>
        </div>
        <div className="space-y-2">
          {(event.buttons || []).map((btn, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                placeholder="Label"
                value={btn.label}
                onChange={(e) => updateButton(i, { label: e.target.value })}
              />
              <Input
                placeholder="https://..."
                value={btn.url}
                onChange={(e) => updateButton(i, { url: e.target.value })}
              />
              <Button onClick={() => removeButton(i)} variant="ghost" size="sm" className="text-destructive">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <Label className="text-xs text-muted-foreground mb-1 block">{label}</Label>
    {children}
  </div>
);

export default ManageEvents;
