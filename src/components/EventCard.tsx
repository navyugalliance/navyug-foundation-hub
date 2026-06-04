import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Check, X, ArrowRight } from "lucide-react";
import { EventItem, isCompleted, formatEventDate } from "@/lib/events";
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

const EventCard = ({ event, index = 0 }: Props) => {
  const [detailOpen, setDetailOpen] = useState(false);
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
                onClick={() => setDetailOpen(true)}
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
