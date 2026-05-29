import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EventCard from "./EventCard";
import { getRecentEvents } from "@/lib/events";

const EventSection = () => {
  const events = getRecentEvents(3);

  return (
    <section id="event" className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary">Our Events</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          <p className="mt-6 text-muted-foreground font-sans max-w-xl mx-auto">
            Initiatives that bring our vision to life — past milestones and what's next.
          </p>
        </motion.div>

        <div
          className={`mt-12 grid gap-8 ${
            events.length === 1
              ? "max-w-2xl mx-auto"
              : events.length === 2
                ? "md:grid-cols-2 max-w-4xl mx-auto"
                : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {events.map((e, i) => (
            <EventCard key={e.id} event={e} index={i} compact />
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-8 py-3 rounded border-2 border-primary text-primary font-semibold text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EventSection;
