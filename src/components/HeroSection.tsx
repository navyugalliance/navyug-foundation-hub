import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-primary">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute -right-20 -top-20 w-[600px] h-[600px] opacity-10" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="280" stroke="hsl(var(--gold))" strokeWidth="1.5" />
          <circle cx="300" cy="300" r="220" stroke="hsl(var(--gold))" strokeWidth="1" />
          <circle cx="300" cy="300" r="160" stroke="hsl(var(--gold))" strokeWidth="0.5" />
        </svg>
        <svg className="absolute -left-32 bottom-0 w-[500px] h-[700px] opacity-[0.07]" viewBox="0 0 500 700" fill="none">
          <path d="M0 700 Q250 400 100 0" stroke="hsl(var(--gold))" strokeWidth="2" />
          <path d="M80 700 Q330 350 180 0" stroke="hsl(var(--gold))" strokeWidth="1.5" />
          <path d="M160 700 Q410 300 260 0" stroke="hsl(var(--gold))" strokeWidth="1" />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary-foreground leading-tight">
            NAVYUG ALLIANCE
          </h1>

          <p className="mt-4 text-lg font-serif italic text-gold tracking-widest">
            Together We Rise
          </p>

          <p className="mt-6 text-primary-foreground/80 text-lg max-w-xl leading-relaxed font-sans">
            NavYug Alliance is a youth-driven movement formed by seven united minds committed to leadership, creativity, and social impact.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#about"
              className="inline-flex items-center justify-center px-8 py-3 rounded bg-gold text-primary font-semibold text-sm tracking-wide hover:bg-gold-dark transition-colors"
            >
              Explore Our Vision
            </a>
            <a
              href="#event"
              className="inline-flex items-center justify-center px-8 py-3 rounded border border-primary-foreground/40 text-primary-foreground font-semibold text-sm tracking-wide hover:bg-primary-foreground/10 transition-colors"
            >
              Upcoming Event
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
