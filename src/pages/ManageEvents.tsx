import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  EventItem,
  EventImage,
  EventButton,
  FormField,
  getAllEvents,
  saveAllEvents,
  resetToSeed,
  isCompleted,
} from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Plus, Download, RotateCcw, Save, ImagePlus, X, ArrowUp, ArrowDown } from "lucide-react";
import EventCard from "@/components/EventCard";
import SEO from "@/components/SEO";

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
    toast({ title: "New event created", description: "Edit the fields below to customize." });
  };

  const deleteEvent = (idx: number) => {
    if (!confirm("Delete this event?")) return;
    setEvents((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const saveAll = () => {
    saveAllEvents(events);
    setDirty(false);
    toast({ title: "Changes Saved", description: "Scrapbook initiatives updated in storage." });
  };

  const handleReset = () => {
    if (!confirm("Reset all events to original seed data? This wipes your local changes.")) return;
    resetToSeed();
    setEvents(getAllEvents());
    setDirty(false);
    toast({ title: "Database Reset", description: "Restored default events." });
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
    <main className="min-h-screen bg-[#F8F5EE] paper-texture flex flex-col justify-between select-none relative">
      <SEO
        title="Initiatives Journal Editor — NavYug Alliance"
        description="Internal management dashboard for NavYug Alliance events."
        noindex={true}
      />
      {/* Left red margin line */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] bg-red-400/10 pointer-events-none z-10" />

      <div>
        {/* Header Sheet (Navy paper sheet with torn bottom edge) */}
        <section className="relative bg-primary text-primary-foreground py-16 pb-24 overflow-hidden torn-edge-bottom z-10">
          <div className="absolute inset-0 grid-paper pointer-events-none opacity-5" />
          
          <div className="container mx-auto px-6 lg:px-16 relative z-10">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-primary-foreground/80 hover:text-gold transition-colors text-sm font-sans font-semibold mb-6"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Home
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground tracking-tight">
                  Initiatives Journal Editor
                </h1>
                <p className="mt-3 text-primary-foreground/85 font-handwriting text-2xl rotate-[-1deg] inline-block">
                  Review, write, and layout campaigns in the scrapbook database.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 z-20">
                <Button onClick={addEvent} variant="outline" className="border-primary-foreground/20 text-primary-foreground bg-primary/20 hover:bg-primary-foreground hover:text-primary transition-all">
                  <Plus className="w-4 h-4 mr-1.5" /> New Event
                </Button>
                <Button onClick={exportJson} variant="outline" className="border-primary-foreground/20 text-primary-foreground bg-primary/20 hover:bg-primary-foreground hover:text-primary transition-all">
                  <Download className="w-4 h-4 mr-1.5" /> Export JSON
                </Button>
                <Button onClick={handleReset} variant="outline" className="border-primary-foreground/20 text-primary-foreground bg-primary/20 hover:bg-primary-foreground hover:text-primary transition-all">
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Reset to Seed
                </Button>
                <Button onClick={saveAll} className="bg-gold text-primary hover:bg-gold-light transition-all" disabled={!dirty}>
                  <Save className="w-4 h-4 mr-1.5" /> {dirty ? "Save Changes" : "Saved"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Editors List */}
        <section className="py-16 relative z-20">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="space-y-16">
              {events.map((event, idx) => (
                <EventEditor
                  key={event.id + idx}
                  event={event}
                  onChange={(patch) => updateEvent(idx, patch)}
                  onDelete={() => deleteEvent(idx)}
                />
              ))}
              {events.length === 0 && (
                <div className="text-center py-32 bg-white/40 border border-dashed border-primary/20 rounded-sm">
                  <p className="font-handwriting text-3xl text-neutral-500 italic">No events. Click "New Event" above to write a page.</p>
                </div>
              )}
            </div>
          </div>
        </section>
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
        newImages.push({ src, aspect: "1:1", alt: event.title });
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

  const updateFormField = (i: number, patch: Partial<FormField>) => {
    const next = [...(event.formFields || [])];
    next[i] = { ...next[i], ...patch } as FormField;
    onChange({ formFields: next });
  };

  const addFormField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: "",
      type: "text",
      required: true,
    };
    onChange({ formFields: [...(event.formFields || []), newField] });
  };

  const removeFormField = (i: number) => {
    const next = (event.formFields || []).filter((_, idx) => idx !== i);
    onChange({ formFields: next });
  };

  const moveFormField = (i: number, direction: -1 | 1) => {
    const fields = [...(event.formFields || [])];
    const targetIdx = i + direction;
    if (targetIdx < 0 || targetIdx >= fields.length) return;
    const temp = fields[i];
    fields[i] = fields[targetIdx];
    fields[targetIdx] = temp;
    onChange({ formFields: fields });
  };

  const loadDefaultFormFields = () => {
    const defaults: FormField[] = [
      { id: "fullName", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
      { id: "phone", label: "Phone Number", type: "tel", required: true },
      { id: "age", label: "Age", type: "number", required: true },
      { id: "role", label: "Player Role", type: "select", required: true, options: ["Batsman", "Bowler", "All-Rounder", "Wicketkeeper"] },
      { id: "teamName", label: "Team Name", type: "text", required: false }
    ];
    onChange({ formFields: defaults });
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start border-b border-primary/10 pb-16">
      
      {/* LEFT COLUMN: Editing Form (Notebook Page) */}
      <div className="lg:col-span-7 xl:col-span-8 bg-white border border-neutral-300/40 p-6 md:p-8 rounded-sm shadow-sm relative">
        <div className="absolute top-[-10px] left-10 w-24 h-5 bg-[#D4A64A]/10 border-l border-r border-dashed border-[#D4A64A]/25 rotate-[-2deg] pointer-events-none" />
        
        <div className="flex items-start justify-between gap-3 mb-6 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary">{event.title || "Untitled Campaign"}</h2>
            <span
              className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider ${
                completed ? "bg-neutral-100 text-neutral-500 border border-neutral-200" : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {completed ? "Completed" : "Upcoming"}
            </span>
          </div>
          <Button onClick={onDelete} variant="ghost" size="sm" className="text-destructive hover:bg-destructive/5 hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="ID (unique lowercase string)">
            <Input value={event.id} onChange={(e) => onChange({ id: e.target.value })} className="font-sans border-neutral-300" />
          </Field>
          <Field label="Campaign Name">
            <Input value={event.title} onChange={(e) => onChange({ title: e.target.value })} className="font-sans border-neutral-300" />
          </Field>
          <Field label="Launch Date">
            <Input
              type="date"
              value={event.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className="font-sans border-neutral-300"
            />
          </Field>
          <Field label="Status Override">
            <select
              className="flex h-10 w-full rounded-sm border border-neutral-300 bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-primary"
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
          <Field label="Slogan / Tagline (Optional)" className="md:col-span-2">
            <Input value={event.tagline || ""} onChange={(e) => onChange({ tagline: e.target.value })} className="font-sans border-neutral-300" />
          </Field>
          <Field label="Teaser Narrative (Full Description)" className="md:col-span-2">
            <Textarea
              rows={4}
              value={event.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="font-sans border-neutral-300 leading-relaxed"
            />
          </Field>
          <Field label="Organizer">
            <Input value={event.organizer || ""} onChange={(e) => onChange({ organizer: e.target.value })} className="font-sans border-neutral-300" />
          </Field>
          <Field label="Presented By">
            <Input value={event.presentedBy || ""} onChange={(e) => onChange({ presentedBy: e.target.value })} className="font-sans border-neutral-300" />
          </Field>
          <Field label="Location">
            <Input value={event.location || ""} onChange={(e) => onChange({ location: e.target.value })} className="font-sans border-neutral-300" />
          </Field>
          <Field label="Campaign Focus (Bullet tags separated by •)">
            <Input value={event.theme || ""} onChange={(e) => onChange({ theme: e.target.value })} className="font-sans border-neutral-300" placeholder="Focus 1 • Focus 2" />
          </Field>
          <Field label="Core Objective" className="md:col-span-2">
            <Textarea rows={2} value={event.objective || ""} onChange={(e) => onChange({ objective: e.target.value })} className="font-sans border-neutral-300 leading-relaxed" />
          </Field>
          <Field label="Featured Highlight">
            <Input value={event.featuredAttraction || ""} onChange={(e) => onChange({ featuredAttraction: e.target.value })} className="font-sans border-neutral-300" />
          </Field>
          <Field label="Recipient Circle (Comma separated list)">
            <Input value={event.targetAudience || ""} onChange={(e) => onChange({ targetAudience: e.target.value })} className="font-sans border-neutral-300" placeholder="Daily passengers, Travelers" />
          </Field>
          <Field label="Instagram handle">
            <Input value={event.instagram || ""} onChange={(e) => onChange({ instagram: e.target.value })} className="font-sans border-neutral-300" />
          </Field>
          <Field label="Supported By / With the Help of">
            <Input value={event.helpOf || ""} onChange={(e) => onChange({ helpOf: e.target.value })} className="font-sans border-neutral-300" />
          </Field>
          <Field label="Media Partner">
            <Input value={event.socialMediaPartner || ""} onChange={(e) => onChange({ socialMediaPartner: e.target.value })} className="font-sans border-neutral-300" />
          </Field>
          <Field label="Current Status Info text">
            <Input value={event.currentStatus || ""} onChange={(e) => onChange({ currentStatus: e.target.value })} className="font-sans border-neutral-300" placeholder="Preparations Underway 💧" />
          </Field>
        </div>

        {/* Images Upload */}
        <div className="mt-6 border-t border-dashed border-neutral-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-sm font-bold text-primary">Cover & Campaign Images</Label>
            <label className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-sm border border-neutral-300 bg-background cursor-pointer hover:bg-neutral-100 transition-all font-semibold font-sans">
              <ImagePlus className="w-3.5 h-3.5" /> Upload Image
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
            <p className="text-xs text-neutral-400 font-sans">No custom images uploaded. Will fall back to seeded assets or default sketches.</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(event.images || []).map((img, i) => (
              <div key={i} className="border border-neutral-200 rounded-sm overflow-hidden bg-neutral-50/50 p-2 space-y-2 relative shadow-sm">
                <div className="w-full aspect-[4/3] bg-[#F3ECE0]/30 rounded-sm overflow-hidden flex items-center justify-center border border-neutral-200/20">
                  <img src={img.src} alt={img.alt || ""} className="w-full h-full object-contain p-1" />
                </div>
                <div className="space-y-1.5">
                  <Input
                    placeholder="Image Alt text"
                    className="h-8 text-xs font-sans"
                    value={img.alt || ""}
                    onChange={(e) => updateImage(i, { alt: e.target.value })}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 h-8 text-xs font-sans"
                    onClick={() => removeImage(i)}
                  >
                    <X className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-neutral-400 mt-2 font-sans">
            Note: The first uploaded image is set as the cover poster in the scrapbook teaser.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 border-t border-dashed border-neutral-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-sm font-bold text-primary">CTA Action Buttons (Forms / Registration)</Label>
            <Button onClick={addButton} variant="outline" size="sm" className="h-7 text-xs border-neutral-300 font-sans">
              <Plus className="w-3 h-3 mr-1" /> Add Action Link
            </Button>
          </div>
          <div className="space-y-2">
            {(event.buttons || []).map((btn, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="Button Label (e.g. Register Now)"
                  value={btn.label}
                  onChange={(e) => updateButton(i, { label: e.target.value })}
                  className="font-sans border-neutral-300"
                />
                <Input
                  placeholder="Button URL (e.g. https://forms.gle/...)"
                  value={btn.url}
                  onChange={(e) => updateButton(i, { url: e.target.value })}
                  className="font-sans border-neutral-300"
                />
                <Button onClick={() => removeButton(i)} variant="ghost" size="sm" className="text-destructive hover:bg-destructive/5 hover:text-destructive">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Registration Form Builder */}
        <div className="mt-6 border-t border-dashed border-neutral-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-sm font-bold text-primary block">Registration Setup (Google Forms integration)</Label>
              <span className="text-[10px] text-neutral-400 font-sans block mt-0.5">
                Enable self-hosted forms or link straight to an external Google Form.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans text-neutral-500 font-semibold">Registration Type</span>
              <select
                className="flex h-8 rounded-sm border border-neutral-300 bg-background px-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary w-40 text-primary"
                value={event.registrationType || (event.registrationEnabled ? "internal" : "none")}
                onChange={(e) => {
                  const val = e.target.value as "none" | "internal" | "external";
                  onChange({
                    registrationType: val,
                    registrationEnabled: val !== "none"
                  });
                }}
              >
                <option value="none">Disabled</option>
                <option value="internal">Internal Form Builder</option>
                <option value="external">External Google Form</option>
              </select>
            </div>
          </div>

          {event.registrationType === "external" && (
            <div className="space-y-4 bg-neutral-50/50 p-4 border border-neutral-200 rounded-sm">
              <Field label="Google Form / External Link URL">
                <Input
                  placeholder="https://docs.google.com/forms/d/..."
                  value={event.externalFormUrl || ""}
                  onChange={(e) => onChange({ externalFormUrl: e.target.value })}
                  className="font-sans border-neutral-300 bg-white text-primary"
                />
              </Field>
              <p className="text-[10px] text-neutral-400 font-sans">
                When users click "Register Now", they will be redirected to this Google Form / URL in a new tab.
              </p>
            </div>
          )}

          {(event.registrationType === "internal" || (!event.registrationType && event.registrationEnabled)) && (
            <div className="space-y-4 bg-neutral-50/50 p-4 border border-neutral-200 rounded-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Form Submit Endpoint (Vercel API / Apps Script)">
                  <Input
                    placeholder="/api/register or Google Apps Script URL"
                    value={event.formSubmitUrl || ""}
                    onChange={(e) => onChange({ formSubmitUrl: e.target.value })}
                    className="font-sans border-neutral-300 bg-white text-primary"
                  />
                </Field>
                <div className="flex items-end">
                  <Button
                    onClick={loadDefaultFormFields}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full h-10 border-neutral-300 bg-white hover:bg-neutral-100 font-sans font-semibold text-xs text-primary"
                  >
                    Load Default Fields (Cricket)
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                  <Label className="text-xs font-bold text-neutral-600">Form Questions / Fields</Label>
                  <Button
                    onClick={addFormField}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-neutral-300 font-sans bg-white text-primary"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Custom Field
                  </Button>
                </div>

                {(event.formFields || []).length === 0 && (
                  <p className="text-xs text-neutral-400 text-center py-4 italic font-sans">
                    No fields added yet. Click "Load Default Fields" or add custom fields.
                  </p>
                )}

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {(event.formFields || []).map((field, i) => (
                    <div
                      key={field.id + i}
                      className="bg-white p-3 border border-neutral-200 rounded-sm shadow-sm space-y-2 relative"
                    >
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder="Question Label (e.g. Player Name)"
                          value={field.label}
                          onChange={(e) => updateFormField(i, { label: e.target.value })}
                          className="font-sans border-neutral-300 h-8 text-xs flex-1 text-primary"
                        />
                        <select
                          className="flex h-8 rounded-sm border border-neutral-300 bg-background px-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary w-28 text-primary"
                          value={field.type}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            updateFormField(i, {
                              type: val,
                              options: val === "select" || val === "radio" || val === "checkboxes" ? field.options || [] : undefined,
                            });
                          }}
                        >
                          <option value="text">Short Text</option>
                          <option value="textarea">Paragraph (Long)</option>
                          <option value="number">Number</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone</option>
                          <option value="select">Dropdown (Select)</option>
                          <option value="radio">Multiple Choice (Radio)</option>
                          <option value="checkboxes">Checkboxes (Select Many)</option>
                          <option value="checkbox">Single Agreement Checkbox</option>
                          <option value="date">Date Picker</option>
                          <option value="time">Time Picker</option>
                        </select>

                        <div className="flex items-center gap-1.5 px-1">
                          <label className="text-[10px] font-sans font-semibold text-neutral-500">Required</label>
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateFormField(i, { required: e.target.checked })}
                            className="rounded-sm border-neutral-300"
                          />
                        </div>

                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            disabled={i === 0}
                            onClick={() => moveFormField(i, -1)}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            disabled={i === (event.formFields || []).length - 1}
                            onClick={() => moveFormField(i, 1)}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/5 hover:text-destructive"
                            onClick={() => removeFormField(i)}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {(field.type === "select" || field.type === "radio" || field.type === "checkboxes") && (
                        <div className="flex gap-2 items-center pl-1">
                          <Label className="text-[10px] text-neutral-400 font-bold uppercase w-16">Options:</Label>
                          <Input
                            placeholder="Options (comma separated, e.g. Option 1, Option 2)"
                            value={field.options ? field.options.join(", ") : ""}
                            onChange={(e) =>
                              updateFormField(i, {
                                options: e.target.value.split(",").map((s) => s.trim()),
                              })
                            }
                            className="font-sans border-neutral-300 h-7 text-[11px] flex-1 text-primary"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Live Interactive Preview */}
      <div className="lg:col-span-5 xl:col-span-4 sticky top-6 z-10 space-y-4">
        <span className="font-handwriting text-xl text-gold block text-center rotate-[-1deg]">
          Live Scrapbook Preview
        </span>
        <div className="max-w-sm mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
          <EventCard event={event} compact={true} />
        </div>
        <p className="text-[10.5px] text-neutral-500 font-sans text-center max-w-[280px] mx-auto leading-relaxed">
          Click the <span className="font-bold text-primary">"View Story"</span> button in the preview to open and inspect the detailed campaign modal storyboard.
        </p>
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
    <Label className="text-xs text-neutral-500 mb-1.5 block font-sans font-bold uppercase tracking-wider">{label}</Label>
    {children}
  </div>
);

export default ManageEvents;
