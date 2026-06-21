import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Check, X, ArrowRight } from "lucide-react";
import { EventItem, FormField, isCompleted, formatEventDate } from "@/lib/events";
import jaldharaImg from "@/assets/jaldhara.webp";
import sankalpImg from "@/assets/sankalp.webp";
import careerImg from "@/assets/career.webp";

interface Props {
  event: EventItem;
  index?: number;
  compact?: boolean;
}

const EventIllustration = ({ id }: { id: string }) => {
  if (id === "jal-dhara") {
    return <img src={jaldharaImg} alt="Jal Dhara Poster" className="w-full h-full object-contain p-2" />;
  }
  if (id === "sankalp-hanuman-sangeet-mahotsav") {
    return <img src={sankalpImg} alt="Sankalp Poster" className="w-full h-full object-contain p-2" />;
  }
  if (id === "sapno-ki-udaan") {
    return <img src={careerImg} alt="Career Guidance Poster" className="w-full h-full object-contain p-2" />;
  }

  return (
    <svg className="w-full h-full text-gold" viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60,20 C40,20 30,35 30,50 C30,70 60,90 60,90 C60,90 90,70 90,50 C90,35 80,20 60,20 Z" fill="currentColor" className="opacity-10" />
      <path d="M60,20 C40,20 30,35 30,50 C30,70 60,90 60,90 C60,90 90,70 90,50 C90,35 80,20 60,20 Z" strokeWidth="2.5" />
      <circle cx="60" cy="46" r="8" strokeDasharray="3 3" />
      <path d="M48,46 L72,46 M60,34 L60,58" strokeWidth="2" />
    </svg>
  );
};

interface RegistrationFormProps {
  event: EventItem;
  onBack: () => void;
  onClose: () => void;
}

const RegistrationForm = ({ event, onBack, onClose }: RegistrationFormProps) => {
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const initialAnswers: Record<string, any> = {};
    const hasRoster = event.formFields?.some((f) => f.type === "playersGrid");
    if (hasRoster) {
      initialAnswers.players = Array.from({ length: 8 }, (_, i) => ({
        number: i + 1,
        fullName: "",
        age: "",
        mobileNumber: "",
        playingRole: "Batsman",
        mail: "",
        isSubstitute: i === 7 ? "Yes" : "No",
      }));
    }
    // Prepopulate registration date
    const today = new Date().toISOString().slice(0, 10);
    initialAnswers.registrationDate = today;
    return initialAnswers;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fields = event.formFields || [];

  const handleInputChange = (fieldId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: val }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handlePlayerChange = (idx: number, key: string, val: any) => {
    const nextPlayers = [...(answers.players || [])];
    nextPlayers[idx] = { ...nextPlayers[idx], [key]: val };
    handleInputChange("players", nextPlayers);
    
    // Clear specific player cell validation error if it exists
    const errId = `players_${idx}_${key}`;
    if (errors[errId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errId];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const val = answers[field.id];
      if (field.type === "section") return;

      if (field.required) {
        if (field.type === "checkboxes") {
          if (!val || !Array.isArray(val) || val.length === 0) {
            nextErrors[field.id] = `At least one option must be selected`;
          }
        } else if (field.type === "checkbox") {
          if (!val) {
            nextErrors[field.id] = `This checkbox is required`;
          }
        } else if (field.type === "playersGrid") {
          const playersList = answers.players || [];
          if (playersList.length < 8) {
            nextErrors[field.id] = "Roster must contain 8 players";
          } else {
            playersList.forEach((p: any, idx: number) => {
              if (!p.fullName || p.fullName.trim() === "") {
                nextErrors[`players_${idx}_fullName`] = `Player ${p.number} Name is required`;
              }
              if (!p.age || String(p.age).trim() === "") {
                nextErrors[`players_${idx}_age`] = `Player ${p.number} Age is required`;
              }
              if (!p.mobileNumber || p.mobileNumber.trim() === "") {
                nextErrors[`players_${idx}_mobileNumber`] = `Player ${p.number} Mobile is required`;
              } else if (!/^\+?[0-9\s-]{10,15}$/.test(p.mobileNumber)) {
                nextErrors[`players_${idx}_mobileNumber`] = `Invalid mobile number`;
              }
              if (!p.mail || p.mail.trim() === "") {
                nextErrors[`players_${idx}_mail`] = `Player ${p.number} Email is required`;
              } else if (!/\S+@\S+\.\S+/.test(p.mail)) {
                nextErrors[`players_${idx}_mail`] = `Invalid email address`;
              }
            });
          }
        } else if (val === undefined || val === null || val === "") {
          nextErrors[field.id] = `${field.label} is required`;
        }
      } else if (val) {
        if (field.type === "email" && !/\S+@\S+\.\S+/.test(val)) {
          nextErrors[field.id] = "Invalid email address";
        }
        if (field.type === "tel" && !/^\+?[0-9\s-]{10,15}$/.test(val)) {
          nextErrors[field.id] = "Invalid phone number";
        }
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(event.formSubmitUrl || "/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          answers,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.success) {
          setSuccess(true);
        } else {
          alert(result.message || "Failed to submit registration. Please try again.");
        }
      } else {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        alert(
          "Submission failed: The server returned an invalid (non-JSON) response. " +
          "If testing locally, please ensure you are running 'npx vercel dev' instead of 'npm run dev' to activate the API endpoints."
        );
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 relative z-10"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full border border-green-200 flex items-center justify-center shadow-inner text-green-600">
          <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="text-3xl font-bold font-serif text-primary animate-pulse">Registration Confirmed!</h3>
          <p className="font-handwriting text-2xl text-gold">Every Victory Has a Story</p>
        </div>

        <div className="max-w-md bg-white border border-neutral-200 p-6 rounded-sm shadow-sm font-sans text-sm text-neutral-600 leading-relaxed text-left space-y-4">
          <p className="font-semibold text-primary text-base">Thank you, {answers.captainName || answers.fullName || answers.Name || "Participant"}!</p>
          <p>
            Your team registration for the <strong>{event.title}</strong> has been received! A confirmation email has been sent to <strong>{answers.captainEmail || answers.email || answers.Email}</strong>.
          </p>
          <div className="bg-[#EBF7FF] border border-blue-200 p-3.5 rounded-sm">
            <p className="font-bold text-blue-900 mb-1 text-xs uppercase tracking-wide">📢 Join WhatsApp Group for Updates</p>
            <p className="text-xs text-blue-800 mb-2">Please join the official WhatsApp group for match schedules and tournament updates:</p>
            <a
              href="https://chat.whatsapp.com/DkanlL2if1d0VEtZfhiMWm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs uppercase px-4 py-2 rounded-sm transition-all shadow-sm"
            >
              Join WhatsApp Group
            </a>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-sm text-xs text-amber-800">
            <strong>Payment Required:</strong> Note that your registration will be officially confirmed only after payment is verified. Our team will contact you shortly to guide you through the process.
          </div>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="px-8 py-3 bg-primary text-background border border-primary text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-primary transition-all shadow-sm"
        >
          Back to Journal
        </button>
      </motion.div>
    );
  }

  return (
    <div className="relative z-10 max-h-[80vh] overflow-y-auto px-4 md:px-8 py-4">
      {/* Back button */}
      <button
        onClick={onBack}
        type="button"
        className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-primary text-xs font-bold font-sans uppercase tracking-wider mb-6"
      >
        ← Back to Story
      </button>

      <div className="mb-6">
        <h3 className="text-3xl font-bold text-primary font-serif">Event Registration</h3>
        <p className="font-handwriting text-2xl text-gold mt-1">{event.title}</p>
        <div className="w-16 h-0.5 bg-gold/50 mt-3" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl pb-6 text-primary">
        {fields.map((field) => {
          if (field.type === "section") {
            return (
              <div key={field.id} className="pt-6 pb-2 border-b border-dashed border-neutral-300 mb-2 first:pt-0">
                <h4 className="text-base font-bold text-primary font-sans uppercase tracking-wider">{field.label}</h4>
              </div>
            );
          }

          if (field.type === "playersGrid") {
            const playersList = answers.players || [];
            return (
              <div key={field.id} className="space-y-4">
                <div className="pt-2 pb-1">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-sans">{field.label}</h4>
                  <p className="text-[10px] text-neutral-400 font-sans leading-relaxed mt-0.5">
                    Please fill out details for all 8 players. Player 8 will default as the Substitute.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {playersList.map((player: any, idx: number) => {
                    return (
                      <div key={idx} className="bg-[#FFFDF6] p-4 border border-neutral-200 shadow-sm rounded-sm space-y-3 relative">
                        <div className="flex justify-between items-center pb-1 border-b border-neutral-100">
                          <span className="text-[11px] font-bold text-primary font-sans uppercase tracking-wide">
                            Player #{player.number} {idx === 7 && <span className="text-gold font-bold font-handwriting lowercase text-sm ml-1">(Substitute)</span>}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-primary">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase font-sans">Full Name *</label>
                            <input
                              type="text"
                              value={player.fullName}
                              onChange={(e) => handlePlayerChange(idx, "fullName", e.target.value)}
                              className="flex h-8 w-full rounded-sm border border-neutral-300 bg-background px-2.5 py-1 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                            />
                            {errors[`players_${idx}_fullName`] && (
                              <p className="text-[10px] text-red-500 font-sans font-semibold">{errors[`players_${idx}_fullName`]}</p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase font-sans">Age *</label>
                            <input
                              type="number"
                              value={player.age}
                              onChange={(e) => handlePlayerChange(idx, "age", e.target.value)}
                              className="flex h-8 w-full rounded-sm border border-neutral-300 bg-background px-2.5 py-1 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                            />
                            {errors[`players_${idx}_age`] && (
                              <p className="text-[10px] text-red-500 font-sans font-semibold">{errors[`players_${idx}_age`]}</p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase font-sans">Mobile Number *</label>
                            <input
                              type="tel"
                              value={player.mobileNumber}
                              onChange={(e) => handlePlayerChange(idx, "mobileNumber", e.target.value)}
                              className="flex h-8 w-full rounded-sm border border-neutral-300 bg-background px-2.5 py-1 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                            />
                            {errors[`players_${idx}_mobileNumber`] && (
                              <p className="text-[10px] text-red-500 font-sans font-semibold">{errors[`players_${idx}_mobileNumber`]}</p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase font-sans">Playing Role *</label>
                            <select
                              value={player.playingRole}
                              onChange={(e) => handlePlayerChange(idx, "playingRole", e.target.value)}
                              className="flex h-8 w-full rounded-sm border border-neutral-300 bg-background px-2 py-1 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                            >
                              <option value="Batsman">Batsman</option>
                              <option value="Bowler">Bowler</option>
                              <option value="All-Rounder">All-Rounder</option>
                              <option value="Wicket-Keeper">Wicket-Keeper</option>
                            </select>
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase font-sans">Email Address (mail) *</label>
                            <input
                              type="email"
                              value={player.mail}
                              onChange={(e) => handlePlayerChange(idx, "mail", e.target.value)}
                              className="flex h-8 w-full rounded-sm border border-neutral-300 bg-background px-2.5 py-1 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                            />
                            {errors[`players_${idx}_mail`] && (
                              <p className="text-[10px] text-red-500 font-sans font-semibold">{errors[`players_${idx}_mail`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <div key={field.id} className="space-y-1.5">
              {field.type !== "checkbox" && (
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-sans block">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
              )}

              {field.type === "textarea" ? (
                <textarea
                  rows={3}
                  required={field.required}
                  value={answers[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full rounded-sm border border-neutral-300 bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              ) : field.type === "select" ? (
                <select
                  required={field.required}
                  value={answers[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="flex h-10 w-full rounded-sm border border-neutral-300 bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                >
                  <option value="">Select option</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "radio" ? (
                <div className="space-y-2 pt-1 font-sans">
                  {(field.options || []).map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer text-primary">
                      <input
                        type="radio"
                        name={field.id}
                        required={field.required}
                        checked={answers[field.id] === opt}
                        onChange={() => handleInputChange(field.id, opt)}
                        className="text-primary border-neutral-300 focus:ring-primary w-4 h-4"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : field.type === "checkboxes" ? (
                <div className="space-y-2 pt-1 font-sans">
                  {(field.options || []).map((opt) => {
                    const currentSelections = (answers[field.id] as string[]) || [];
                    const handleCheckboxChange = (checked: boolean) => {
                      let next: string[];
                      if (checked) {
                        next = [...currentSelections, opt];
                      } else {
                        next = currentSelections.filter((s) => s !== opt);
                      }
                      handleInputChange(field.id, next);
                    };
                    return (
                      <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer text-primary">
                        <input
                          type="checkbox"
                          checked={currentSelections.includes(opt)}
                          onChange={(e) => handleCheckboxChange(e.target.checked)}
                          className="rounded-sm border-neutral-300 text-primary focus:ring-primary w-4 h-4"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              ) : field.type === "checkbox" ? (
                <label className="flex items-start gap-2.5 text-sm font-sans cursor-pointer text-primary pt-1">
                  <input
                    type="checkbox"
                    required={field.required}
                    checked={!!answers[field.id]}
                    onChange={(e) => handleInputChange(field.id, e.target.checked)}
                    className="rounded-sm border-neutral-300 text-primary focus:ring-primary w-4 h-4 mt-0.5"
                  />
                  <span>
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </span>
                </label>
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  value={answers[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="flex h-10 w-full rounded-sm border border-neutral-300 bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                />
              )}

            {errors[field.id] && (
              <p className="text-[11px] text-red-500 font-sans font-semibold">{errors[field.id]}</p>
            )}
          </div>
          );
        })}

        <div className="pt-4 flex justify-between items-center">
          <span className="text-xs text-neutral-400 font-sans">
            * Indicates a required question.
          </span>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-primary text-background border border-primary text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-primary transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const EventCard = ({ event, index = 0 }: Props) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const completed = isCompleted(event);
  
  // Resolve image source: use correct uploaded image for each event
  const getPosterSrc = () => {
    if (event.id === "jal-dhara") {
      return jaldharaImg;
    }
    if (event.id === "sankalp-hanuman-sangeet-mahotsav") {
      return sankalpImg;
    }
    if (event.id === "sapno-ki-udaan") {
      return careerImg;
    }
    if (event.images && event.images.length > 0) {
      return event.images[0].src;
    }
    return null;
  };

  const posterSrc = getPosterSrc();

  return (
    <motion.div
      className="relative w-full select-none flex"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12, type: "spring", stiffness: 90 }}
    >
      {/* 1. Main Card Wrapper (Scrapbook Board page) */}
      <div className="relative bg-[#FFFDF6] border border-neutral-300/40 shadow-md hover:shadow-xl transition-all duration-300 w-full rounded-sm p-5 md:p-6 flex flex-col justify-between tape-effect group/card overflow-hidden">
        
        {/* 2. Left Side Spiral Notebook punch holes */}
        <div className="absolute left-1.5 top-0 bottom-0 w-2 flex flex-col justify-around py-6 pointer-events-none opacity-35">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-neutral-400/40 shadow-inner" />
          ))}
        </div>

        {/* 3. Graph paper fragment behind image */}
        <div className="absolute inset-x-6 top-6 aspect-[4/5] bg-opacity-50 grid-paper pointer-events-none opacity-20 border border-neutral-300/20 rotate-[-2.5deg] z-0" />

        {/* 4. Torn notebook paper page behind image */}
        <div className="absolute inset-x-5 top-5 aspect-[4/5] bg-[#F4ECE1]/60 shadow-sm border border-neutral-300/30 rotate-[1.5deg] z-0" />

        {/* 5. Main Image Container (Hero visual - 70% height feel) */}
        <div className="w-full aspect-[4/5] bg-[#F5EFEB]/40 rounded-sm overflow-hidden flex items-center justify-center relative border border-neutral-200/50 shadow-md z-10 transition-shadow duration-300 group-hover/card:shadow-lg">
          
          {/* 6. Status Badge Tag absolutely overlayed */}
          <div className="absolute top-3 left-3 z-20">
            <span className={`text-[10px] px-2.5 py-0.5 font-sans font-bold uppercase tracking-widest border rounded shadow-sm ${
              completed ? "bg-neutral-100 text-neutral-500 border-neutral-300/40" : "bg-amber-100 text-amber-800 border-amber-300/40"
            }`}>
              {completed ? "Completed" : "Upcoming"}
            </span>
          </div>

          {/* 7. Actual Event Image (No cropping, maintain aspect ratio) */}
          {posterSrc ? (
            <img
              src={posterSrc}
              alt={event.title}
              className="w-full h-full object-contain p-1 z-10 transition-transform duration-500 group-hover/card:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full p-4 flex items-center justify-center z-10">
              <EventIllustration id={event.id} />
            </div>
          )}

          {/* 8. Masking tape piece on top-left of image */}
          <div className="absolute top-[-8px] left-[-8px] w-14 h-5 bg-[#D4A64A]/25 backdrop-blur-[0.5px] border-l border-r border-dashed border-[#D4A64A]/30 rotate-[-12deg] z-20 shadow-sm pointer-events-none" />

          {/* 9. Metal paper clip on top-right of image */}
          <svg className="absolute -top-3.5 right-2 w-7 h-9 text-neutral-500/70 z-20 drop-shadow-sm select-none pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M7 10v7a5 5 0 0 0 10 0v-9a3 3 0 0 0-6 0v8a1 1 0 0 0 2 0v-6" />
          </svg>
        </div>

        {/* 10. Card Footer Info Section (Editorial layout below image) */}
        <div className="mt-6 flex flex-col pl-4 text-left relative z-20">
          
          {/* 11. Handwritten Annotation bottom-left */}
          <div className="absolute -left-2 top-0 font-handwriting text-primary/80 text-sm rotate-[-8deg] pointer-events-none select-none max-w-[120px] leading-tight">
            {event.id === "jal-dhara" && "Summer Initiative"}
            {event.id === "sankalp-hanuman-sangeet-mahotsav" && "Community Impact"}
            {event.id === "sapno-ki-udaan" && "Guiding Futures"}
          </div>

          <div className="pt-4 space-y-2.5">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-primary leading-tight">
              {event.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 font-sans">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                {formatEventDate(event.date)}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5 relative">
                  {/* Highlight marker line behind location */}
                  <span className="absolute inset-x-0 bottom-0.5 h-1.5 bg-yellow-200/40 -rotate-1 z-0" />
                  <MapPin className="w-3.5 h-3.5 text-gold z-10" />
                  <span className="z-10 relative">{event.location}</span>
                </span>
              )}
            </div>

            {/* View Story CTA button & Ink Stamp */}
            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => {
                  setDetailOpen(true);
                  setRegisterMode(false);
                }}
                className="group relative inline-flex items-center gap-1.5 px-5 py-2 border border-primary/20 bg-background text-primary font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:border-primary hover:bg-primary hover:text-background active:scale-95"
              >
                View Story <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              {/* 12. Hand-drawn ink status stamp on bottom-right margin */}
              <div className="font-handwriting text-xs text-[#0B2D55]/60 border border-dashed border-[#0B2D55]/30 rounded-full px-2.5 py-0.5 rotate-[12deg] select-none pointer-events-none mr-2">
                {completed ? "Archive ✓" : "Upcoming ⚑"}
              </div>
            </div>
          </div>

          {/* 13. Small yellow sticky note bottom-right */}
          <div className="absolute -right-2 -bottom-2 bg-[#FCF6D6] shadow-md border border-[#E9DF9E] p-2 rotate-[4deg] max-w-[85px] z-10 text-center font-handwriting text-[10px] text-amber-900 leading-tight select-none pointer-events-none">
            {event.id === "jal-dhara" && "Thousands Served"}
            {event.id === "sankalp-hanuman-sangeet-mahotsav" && "Faith & Unity"}
            {event.id === "sapno-ki-udaan" && "Making a Difference"}
          </div>
        </div>

      </div>

      {/* PREMIUM FULL-SCREEN DETAILS DIARY MODAL */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {detailOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 z-[9999] overflow-y-auto"
              onClick={() => setDetailOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.93, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.93, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative bg-[#F8F5EE] paper-texture max-w-4xl w-full border border-primary/20 rounded-md shadow-2xl p-6 md:p-10 text-left overflow-hidden my-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Notebook binding styling inside modal */}
                <div className="absolute inset-0 lined-paper opacity-25 pointer-events-none" />
                <div className="absolute left-6 top-0 bottom-0 w-[1.5px] bg-red-400/20 pointer-events-none" />

                {/* Close button */}
                <button
                  onClick={() => setDetailOpen(false)}
                  className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full border border-primary/10 hover:border-gold hover:text-gold transition-all z-20 bg-background/80"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Detailed Content Collage Grid */}
                {registerMode ? (
                  <RegistrationForm
                    event={event}
                    onBack={() => setRegisterMode(false)}
                    onClose={() => {
                      setDetailOpen(false);
                      setRegisterMode(false);
                    }}
                  />
                ) : (
                  <div className="grid lg:grid-cols-12 gap-8 items-start pt-6 relative z-10 max-h-[80vh] overflow-y-auto pr-2">
                  
                  {/* Collage Left: Mounted Poster & Dates */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Polaroid styled mounted frame with tape pin */}
                    <div className="bg-white p-3 pb-5 shadow-lg border border-neutral-200/40 rotate-[-1.5deg] relative max-w-sm mx-auto">
                      {/* Centered top masking tape on modal poster */}
                      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-6 bg-[#D4A64A]/30 backdrop-blur-[0.5px] border-l border-r border-dashed border-[#D4A64A]/40 rotate-[2deg] z-20" />
                      
                      <div className="w-full bg-[#F3ECE0]/30 overflow-hidden border border-neutral-300/10 flex items-center justify-center rounded-sm">
                        {posterSrc ? (
                          <img 
                            src={posterSrc} 
                            alt={event.title} 
                            className="w-full h-auto object-contain block" 
                            style={{ imageRendering: "auto" }}
                          />
                        ) : (
                          <div className="w-full aspect-[3/4] p-4 flex items-center justify-center">
                            <EventIllustration id={event.id} />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 text-center">
                        <h4 className="font-handwriting text-2xl font-bold text-primary">
                          {event.title}
                        </h4>
                        <p className="text-[10px] text-gold uppercase tracking-widest font-sans font-bold mt-1">
                          {completed ? "Archive Milestone" : "Live Campaign"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#FFFEEB] border border-neutral-300/40 p-4 shadow-sm rotate-[1deg] space-y-1.5 pl-6">
                      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 font-sans">
                        <Calendar className="w-4 h-4 text-gold" />
                        {formatEventDate(event.date)}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans">
                          <MapPin className="w-4 h-4 text-gold" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Collage Right: Narrative Storyboard */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Title banner */}
                    <div>
                      <h3 className="text-3xl font-bold text-primary font-serif leading-none">
                        {event.title}
                      </h3>
                      {event.tagline && (
                        <span className="font-handwriting text-2xl text-gold mt-2 block">
                          "{event.tagline}"
                        </span>
                      )}
                    </div>

                    {/* Split horizontal line */}
                    <svg className="w-full h-2 text-gold opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1,5 Q50,8 99,3" strokeLinecap="round" />
                    </svg>

                    {/* Detailed descriptions */}
                    <div className="space-y-2">
                      <span className="font-handwriting text-2xl text-gold block">The Narrative</span>
                      <p className="text-neutral-700 text-sm leading-relaxed font-sans">
                        {event.description}
                      </p>
                    </div>

                    {/* Core objectives */}
                    {event.objective && (
                      <div className="bg-[#FFFDEB] border border-neutral-300/40 p-5 rounded-sm shadow-sm relative">
                        <h4 className="font-handwriting text-xl font-bold text-primary mb-1">Our Core Objective</h4>
                        <p className="text-neutral-600 text-xs leading-relaxed font-sans">
                          {event.objective}
                        </p>
                      </div>
                    )}

                    {/* Focus & Recipients */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {event.theme && (
                        <div className="bg-white border border-neutral-200 p-4 rounded-sm">
                          <span className="font-handwriting text-xl text-gold mb-1.5 block">Campaign Focus</span>
                          <div className="flex flex-wrap gap-1.5">
                            {event.theme.split("•").map((tag) => (
                              <span key={tag.trim()} className="text-[10px] px-2 py-0.5 bg-[#F4ECE1]/40 text-[#173E70] font-sans font-bold rounded-full">
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.targetAudience && (
                        <div className="bg-white border border-neutral-200 p-4 rounded-sm">
                          <span className="font-handwriting text-xl text-gold mb-1.5 block">Recipient Circle</span>
                          <ul className="space-y-1 text-[11px] text-neutral-600 font-sans">
                            {event.targetAudience.split(",").slice(0, 3).map((aud) => (
                              <li key={aud.trim()} className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-gold" />
                                <span className="truncate">{aud.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Partner Stamps & CTAs */}
                    <div className="pt-4 border-t border-dashed border-primary/10 flex flex-wrap justify-between items-center gap-4">
                  <div className="text-[11px] text-neutral-500 font-sans space-y-0.5">
                        {event.helpOf && <p><span className="font-semibold text-neutral-600">Supported By: </span>{event.helpOf}</p>}
                        {event.socialMediaPartner && <p><span className="font-semibold text-neutral-600">Media Partner: </span>{event.socialMediaPartner}</p>}
                      </div>

                      <div className="flex items-center gap-3">
                        {!completed && event.registrationType === "external" && event.externalFormUrl && (
                          <a
                            href={event.externalFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-primary text-background border border-primary text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-primary transition-all shadow-sm block text-center"
                          >
                            Register Now
                          </a>
                        )}

                        {!completed && (event.registrationType === "internal" || (!event.registrationType && event.registrationEnabled && !event.externalFormUrl)) && event.formSubmitUrl && (
                          <button
                            onClick={() => setRegisterMode(true)}
                            type="button"
                            className="px-6 py-2.5 bg-primary text-background border border-primary text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-primary transition-all shadow-sm"
                          >
                            Register Now
                          </button>
                        )}

                        {!completed && event.buttons && event.buttons.length > 0 && (
                          <div className="flex gap-2">
                            {event.buttons.map((btn) => (
                              <a
                                key={btn.url}
                                href={btn.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2.5 bg-primary text-background border border-primary text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-primary transition-all shadow-sm"
                              >
                                {btn.label}
                              </a>
                            ))}
                          </div>
                        )}
                        
                        {event.currentStatus && (
                          <div className="px-3 py-1 bg-gold/15 border border-dashed border-gold text-[10px] font-bold text-primary uppercase">
                            {event.currentStatus}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default EventCard;
