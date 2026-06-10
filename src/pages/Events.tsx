import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import { getAllEvents, isCompleted } from "@/lib/events";
import SEO from "@/components/SEO";

const Events = () => {
  const all = getAllEvents();
  const upcoming = all.filter((e) => !isCompleted(e));
  const past = all.filter((e) => isCompleted(e));

  return (
    <main className="overflow-x-hidden bg-[#F8F5EE] paper-texture min-h-screen flex flex-col justify-between select-none">
      <SEO 
        title="NavYug Alliance Initiatives & Milestones — Together We Rise"
        description="Explore the journal of upcoming initiatives and past milestones of NavYug Alliance, promoting youth leadership and social impact."
        keywords="Navyug Alliance Events, Navyug Foundation Initiatives, Community Projects, Social Campaigns, Youth Leadership Action"
      />
      
      {/* Red margin line on left */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] bg-red-400/10 pointer-events-none z-10" />

      <div>
        {/* Header (Navy paper sheet with a torn bottom edge) */}
        <section className="relative bg-primary text-primary-foreground py-24 pb-32 overflow-hidden torn-edge-bottom">
          <div className="absolute inset-0 grid-paper pointer-events-none opacity-5" />
          
          <div className="container mx-auto px-6 lg:px-16 relative z-10">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-primary-foreground/80 hover:text-gold transition-colors text-sm font-sans font-semibold mb-6"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Home
            </Link>
            
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground tracking-tight">
                All Events
              </h1>
              <div className="w-16 h-0.5 bg-gold/50 mx-auto mt-4" />
              
              <p className="mt-6 text-primary-foreground/85 font-handwriting text-2xl max-w-xl mx-auto rotate-[-1deg]">
                A journal of NavYug Alliance initiatives — every milestone, every step ahead.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        {upcoming.length > 0 && (
          <section className="py-20 relative z-20">
            <div className="container mx-auto px-6 lg:px-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary inline-block relative">
                  Upcoming Initiatives
                  <svg className="absolute -bottom-3 left-0 w-full h-2 text-gold" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1,4 Q50,7 99,2" strokeLinecap="round" />
                  </svg>
                </h2>
              </div>

              <div
                className={`mt-16 grid gap-10 ${
                  upcoming.length === 1
                    ? "max-w-md mx-auto"
                    : upcoming.length === 2
                      ? "md:grid-cols-2 max-w-3xl mx-auto"
                      : "md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
                }`}
              >
                {upcoming.map((e, i) => (
                  <div key={e.id} className="rotate-[0.5deg]">
                    <EventCard event={e} index={i} compact />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Past Events Section */}
        {past.length > 0 && (
          <section className="py-20 relative z-20 border-t border-dashed border-primary/10 bg-[#F4ECE1]/30">
            <div className="container mx-auto px-6 lg:px-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary inline-block relative">
                  Past Milestones
                  <svg className="absolute -bottom-3 left-0 w-full h-2 text-gold" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1,5 Q50,8 99,3" strokeLinecap="round" />
                  </svg>
                </h2>
              </div>

              <div
                className={`mt-16 grid gap-10 ${
                  past.length === 1
                    ? "max-w-md mx-auto"
                    : past.length === 2
                      ? "md:grid-cols-2 max-w-3xl mx-auto"
                      : "md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
                }`}
              >
                {past.map((e, i) => (
                  <div key={e.id} className="rotate-[-0.8deg]">
                    <EventCard event={e} index={i} compact />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {all.length === 0 && (
          <section className="py-32 text-center">
            <p className="font-handwriting text-2xl text-neutral-500 italic">No events recorded in the journal yet. Stay tuned.</p>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default Events;
