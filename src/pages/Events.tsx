import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import { getAllEvents, isCompleted } from "@/lib/events";

const Events = () => {
  const all = getAllEvents();
  const upcoming = all.filter((e) => !isCompleted(e));
  const past = all.filter((e) => isCompleted(e));

  return (
    <main className="overflow-x-hidden">
      {/* Header */}
      <section className="relative bg-primary py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute -right-20 -top-20 w-[500px] h-[500px] opacity-10"
            viewBox="0 0 600 600"
            fill="none"
          >
            <circle cx="300" cy="300" r="280" stroke="hsl(var(--gold))" strokeWidth="1.5" />
            <circle cx="300" cy="300" r="220" stroke="hsl(var(--gold))" strokeWidth="1" />
          </svg>
        </div>
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-gold transition-colors text-sm font-sans"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground tracking-tight">
              All Events
            </h1>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
            <p className="mt-6 text-primary-foreground/80 font-sans max-w-xl mx-auto">
              A complete journey of NavYug Alliance initiatives — every milestone and every step ahead.
            </p>
          </motion.div>
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6 lg:px-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
              Upcoming
            </h2>
            <div className="w-12 h-0.5 bg-gold mx-auto mt-3" />
            <div
              className={`mt-12 grid gap-8 ${
                upcoming.length === 1
                  ? "max-w-2xl mx-auto"
                  : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {upcoming.map((e, i) => (
                <EventCard key={e.id} event={e} index={i} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 lg:px-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
              Past Events
            </h2>
            <div className="w-12 h-0.5 bg-gold mx-auto mt-3" />
            <div
              className={`mt-12 grid gap-8 ${
                past.length === 1
                  ? "max-w-2xl mx-auto"
                  : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {past.map((e, i) => (
                <EventCard key={e.id} event={e} index={i} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {all.length === 0 && (
        <section className="py-32 bg-background text-center">
          <p className="text-muted-foreground font-sans">No events yet. Stay tuned.</p>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default Events;
