import { motion } from "framer-motion";
import { Instagram, Mail, Phone, ArrowRight } from "lucide-react";

const socials = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/navyug.alliance" },
  { icon: Mail, label: "Email", href: "mailto:navyugalliance@gmail.com" },
  { icon: Phone, label: "Phone", href: "tel:+917414984390" },
];

const SocialSection = () => {
  return (
    <section id="contact" className="relative bg-primary text-primary-foreground py-28 overflow-hidden select-none torn-edge-top">
      {/* Notebook grid line overlay in opacity */}
      <div className="absolute inset-0 grid-paper pointer-events-none opacity-5 z-0" />
      
      {/* Red margin line in dark mode */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1.5px] bg-red-500/10 pointer-events-none z-10" />

      {/* The Continuous Golden Route - Part 6: Join The Movement */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 text-gold" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Golden brush line */}
        <motion.path
          d="M50,0 C50,15 35,28 50,42 C65,56 50,75 50,100"
          fill="none"
          stroke="#D4A64A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
        {/* Thin ink trace overlay */}
        <motion.path
          d="M50.2,0 C50.2,15.1 35.3,28.1 50.2,42.1 C64.8,55.8 49.8,75.2 49.8,100"
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
          transition={{ duration: 1.8, delay: 0.08, ease: "easeInOut" }}
        />
      </svg>

      {/* Decorative Stamp (Postage Stamp) */}
      <motion.div
        className="absolute right-6 top-8 md:right-16 md:top-12 w-20 h-20 text-gold/30 rotate-12 hidden sm:block pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="10" y="10" width="80" height="80" strokeDasharray="3 3" />
          <rect x="14" y="14" width="72" height="72" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="24" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M35,50 C35,42 65,42 65,50 C65,58 35,58 35,50" />
          <text x="50" y="93" fill="currentColor" fontSize="8" fontFamily="Inter" textAnchor="middle" stroke="none" fontWeight="bold">NAVYUG 2026</text>
          <text x="50" y="53" fill="currentColor" fontSize="10" fontFamily="Playfair Display" textAnchor="middle" stroke="none" fontStyle="italic">Rise</text>
        </svg>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center max-w-4xl">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="font-handwriting text-4xl md:text-5xl font-bold text-gold rotate-[-1.5deg] inline-block">
            Be Part of The Movement!
          </h2>
          <p className="text-primary-foreground/90 font-serif text-2xl md:text-3xl max-w-lg mx-auto leading-tight">
            Together, we rise to shape a brighter tomorrow.
          </p>
          <div className="w-16 h-0.5 bg-gold/50 mx-auto mt-6" />
        </motion.div>

        {/* Large touch target join CTA */}
        <motion.div
          className="mt-10 relative inline-block z-20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a
            href="https://www.instagram.com/navyug.alliance"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-10 py-4 bg-gold text-primary font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-xl hover:shadow-gold/10 active:scale-98 min-h-[48px]"
          >
            Join The Movement <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          
          {/* Sketch note pointing to CTA */}
          <div className="absolute -left-36 top-4 text-gold/60 hidden lg:flex items-center gap-2 pointer-events-none">
            <span className="font-handwriting text-lg rotate-[-12deg] inline-block">
              Let's write history together
            </span>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2,12 Q10,12 18,6" strokeLinecap="round" />
              <path d="M14,3 L19,5 L17,10" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          className="mt-14 flex justify-center gap-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={s.label}
              className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-primary hover:border-gold transition-all duration-300 min-h-[44px] min-w-[44px]"
            >
              <s.icon className="w-5 h-5" strokeWidth={1.5} />
            </a>
          ))}
        </motion.div>

        {/* Signatures Section: Rendered as a neat row of signatures signed by co-founders */}
        <motion.div 
          className="mt-12 border-t border-gold/10 pt-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.85 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <p className="text-[10px] text-gold/40 uppercase tracking-widest font-sans font-bold mb-3">
            Signed by the Co-Founders
          </p>
          <div className="flex justify-center gap-x-8 gap-y-3 flex-wrap text-gold/75 font-handwriting text-xl select-none pointer-events-none">
            <span className="rotate-[-2deg]">Chirag N.</span>
            <span className="rotate-[3deg]">Vansh M.</span>
            <span className="rotate-[-1deg]">Harsh B.</span>
            <span className="rotate-[2deg]">Vidhan Z.</span>
            <span className="rotate-[-3deg]">Krishna R.</span>
            <span className="rotate-[1deg]">Soham U.</span>
            <span className="rotate-[-2deg]">Sarth T.</span>
            <span className="rotate-[3deg]">Jayesh L.</span>
          </div>
        </motion.div>

        {/* Contact info */}
        <motion.div
          className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm text-primary-foreground/75 font-sans"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gold" />
            <span>navyugalliance@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gold" />
            <span>+91 7414 984 390 / +91 866 896 1817</span>
          </div>
        </motion.div>

        {/* Signature note */}
        <div className="mt-8 text-gold/40 font-handwriting text-lg text-left max-w-xs pl-6 pointer-events-none">
          * approved by eight co-founders
        </div>

      </div>
    </section>
  );
};

export default SocialSection;
