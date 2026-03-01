import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const EventSection = () => {
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
          <h2 className="text-4xl md:text-5xl font-bold text-primary">Upcoming Event</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        <motion.div
          className="mt-12 max-w-2xl mx-auto relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Card */}
          <div className="relative rounded-lg border-2 border-primary overflow-hidden shadow-xl">
            {/* Gold top strip */}
            <div className="h-1.5 bg-gold" />

            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 600 400" fill="none">
                <path d="M300 400 Q350 200 300 0" stroke="hsl(var(--navy))" strokeWidth="40" />
                <path d="M250 400 Q300 250 250 50" stroke="hsl(var(--navy))" strokeWidth="30" />
              </svg>
            </div>

            <div className="relative p-10 md:p-14 text-center">
              <div className="flex items-center justify-center gap-2 text-gold">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-widest uppercase font-sans">Featured Initiative</span>
                <Sparkles className="w-5 h-5" />
              </div>

              <h3 className="mt-4 text-3xl md:text-4xl font-bold text-primary">
                Sapno Ki Udaan
              </h3>

              <p className="mt-4 text-muted-foreground font-sans leading-relaxed max-w-md mx-auto">
                Sapno Ki Udaan is an initiative dedicated to empowering young minds, encouraging dreams, and creating opportunities for growth.
              </p>

              <a
                href="https://forms.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center px-10 py-3.5 rounded bg-gold text-primary font-semibold text-sm tracking-wide hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20"
              >
                Register Now
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventSection;
