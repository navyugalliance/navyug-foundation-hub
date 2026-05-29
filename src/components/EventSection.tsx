import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EventCard from "./EventCard";
import { getRecentEvents } from "@/lib/events";

const EventSection = () => {
  const events = getRecentEvents(3).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section id="event" className="relative py-28 bg-[#F8F5EE] overflow-hidden border-t border-primary/10 select-none">
      {/* Lined paper notebook lines overlay */}
      <div className="absolute inset-0 lined-paper pointer-events-none opacity-20 z-0" />
      
      {/* Left side margin line */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] bg-red-400/10 pointer-events-none z-10" />

      {/* The Continuous Golden Route - Part 5: Initiatives/Events */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 text-gold" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Golden brush line */}
        <motion.path
          d="M15,0 C30,15 85,25 85,45 C85,60 15,65 15,78 C15,90 80,90 50,100"
          fill="none"
          stroke="#D4A64A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
        {/* Thin ink trace overlay */}
        <motion.path
          d="M14.8,0 C29.8,15.1 84.7,25.1 84.7,45.1 C84.7,59.8 14.8,65.2 14.8,78.1 C14.8,89.8 79.7,90.2 49.8,100"
          fill="none"
          stroke="#0B2D55"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="opacity-30"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, delay: 0.08, ease: "easeInOut" }}
        />
      </svg>

      <div className="container mx-auto px-6 lg:px-16 relative z-20">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-20 relative max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Paper airplane sketch doodle */}
          <div className="absolute -top-12 right-6 text-gold/40 w-16 h-16 pointer-events-none">
            <svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5,25 L45,5 L30,45 L20,30 Z M20,30 L45,5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12,32 Q5,42 2,45" strokeDasharray="2 2" />
            </svg>
          </div>

          <h2 className="font-handwriting text-5xl font-bold text-primary inline-block">
            Our Initiatives
          </h2>
          <svg className="w-48 h-3 text-gold mx-auto mt-2" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5,5 Q50,9 95,4" strokeLinecap="round" />
          </svg>

          <p className="mt-4 text-neutral-600 font-sans text-base">
            Initiatives that bring our vision to life — memories, achievements, and paths forward.
          </p>
        </motion.div>

        {/* Gallery Grid (3 columns on desktop, 1 column on mobile) */}
        <div className="relative max-w-6xl mx-auto mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {events.map((event, i) => (
            <div key={event.id} className="relative z-10 flex">
              <EventCard event={event} index={i} compact={true} />
            </div>
          ))}
        </div>

        {/* View All Events CTA */}
        <motion.div
          className="mt-20 text-center relative z-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/events"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 border-2 border-primary text-primary font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-primary hover:text-background hover:shadow-lg hover:shadow-primary/5 active:scale-95"
          >
            View All Events
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-gold pointer-events-none" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-gold pointer-events-none" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default EventSection;
