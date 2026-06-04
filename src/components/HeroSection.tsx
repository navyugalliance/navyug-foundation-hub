import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const menuItems = [
    { label: "Who We Are", href: "#about" },
    { label: "Core Values", href: "#values" },
    { label: "Founding Members", href: "#founders" },
    { label: "Our Initiatives", href: "#event" },
    { label: "Join The Movement", href: "#contact" },
  ];

  return (
    <section className="relative min-h-[135vh] md:min-h-[120vh] flex flex-col justify-between overflow-hidden bg-[#F8F5EE] paper-texture pt-24 pb-20 select-none">
      {/* Blueprint Grid & Construction Circles backdrop */}
      <div className="absolute inset-0 grid-paper pointer-events-none opacity-25 z-0" />
      
      {/* Left red margin line to simulate notebook paper */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] bg-red-400/20 pointer-events-none z-10" />

      {/* Ink Splotches / Gold Splatters in corners */}
      <div className="absolute right-4 top-20 text-gold/15 pointer-events-none select-none hidden md:block">
        <svg width="150" height="150" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="20" cy="30" r="2" />
          <circle cx="25" cy="27" r="1.5" />
          <circle cx="35" cy="40" r="1" />
          <circle cx="50" cy="50" r="3" />
          <circle cx="55" cy="58" r="1.5" />
          <circle cx="70" cy="65" r="2.5" />
          <circle cx="80" cy="75" r="1" />
        </svg>
      </div>

      {/* The Continuous Golden Route - Part 1: Hero */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 text-gold" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Golden brush line */}
        <motion.path
          d="M50,18 C48,8 20,8 16,24 C10,38 12,50 15,62 C18,74 82,70 82,82 C82,90 54,92 50,100"
          fill="none"
          stroke="#D4A64A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        {/* Thin ink trace overlay */}
        <motion.path
          d="M50.2,18 C50.2,8.1 20.3,8.1 16.3,24.1 C10.3,38.1 12.3,50.1 15.3,62.1 C18.3,73.8 81.7,70.2 81.7,82.1 C81.7,89.8 53.8,91.9 49.8,100"
          fill="none"
          stroke="#0B2D55"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="opacity-30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.08, ease: "easeInOut" }}
        />
      </svg>

      {/* Top Header Bar */}
      <header className="absolute top-0 left-0 w-full px-6 md:px-12 py-5 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <img src={logo} alt="NavYug Logo" className="w-10 h-10 object-contain" />
          <div className="hidden sm:block text-left">
            <span className="font-serif text-sm font-bold text-primary block leading-none">
              NAVYUG ALLIANCE
            </span>
            <span className="font-handwriting text-xs text-gold font-bold">
              Together We Rise
            </span>
          </div>
        </div>

        {/* Hamburger Menu Trigger */}
        <button
          onClick={toggleMenu}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-primary/20 bg-background/80 hover:bg-background hover:border-gold/60 transition-all shadow-sm z-50 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>
      </header>

      {/* Full screen Notebook Scrapbook Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={toggleMenu} />

            {/* Menu Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm h-full paper-texture lined-paper border-l border-primary/20 shadow-2xl p-8 flex flex-col justify-between"
            >
              {/* Notebook binding rings */}
              <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around py-12 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-6 h-3 bg-neutral-400/40 rounded-full border border-neutral-500/20 -translate-x-1/2" />
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-12 pl-6">
                  <div className="flex items-center gap-2">
                    <img src={logo} alt="NavYug Logo" className="w-8 h-8 object-contain" />
                    <span className="font-serif text-sm font-bold text-primary">NavYug</span>
                  </div>
                  <button
                    onClick={toggleMenu}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/10 hover:border-primary/30 transition-all"
                  >
                    <X className="w-4 h-4 text-primary" />
                  </button>
                </div>

                <nav className="space-y-6 pl-6">
                  {menuItems.map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <a
                        href={item.href}
                        onClick={toggleMenu}
                        className="font-handwriting text-3xl text-primary hover:text-gold transition-colors inline-block relative py-1"
                      >
                        {item.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold/50 group-hover:w-full transition-all duration-300" />
                      </a>
                    </motion.div>
                  ))}
                </nav>
              </div>

              <div className="pl-6 text-left">
                <p className="font-handwriting text-xl text-gold">Together We Rise</p>
                <p className="text-xs text-muted-foreground mt-2 font-sans">@navyugalliance</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area: Massive Monumental Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 z-20 text-center relative max-w-4xl mx-auto w-full pt-12">
        
        {/* Relative Wrapper for Logo and Blueprint layout */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] flex items-center justify-center">
          
          {/* Blueprint SVG grid behind logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 select-none scale-105">
            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="#0B2D55" strokeWidth="0.3" strokeLinecap="round" strokeDasharray="1 3">
              {/* Construction Circles */}
              <circle cx="50" cy="50" r="42" strokeWidth="0.25" strokeDasharray="none" />
              <circle cx="50" cy="50" r="32" />
              <circle cx="50" cy="20" r="6" />
              
              {/* Angle projection lines */}
              <path d="M8,50 L92,50" strokeWidth="0.2" strokeDasharray="none" />
              <path d="M50,8 L50,92" strokeWidth="0.2" strokeDasharray="none" />
              <path d="M20,20 L80,80" />
              <path d="M80,20 L20,80" />
            </svg>
          </div>

          {/* Monumental Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-0 w-48 h-48 sm:w-60 sm:h-60 md:w-[280px] md:h-[280px] flex items-center justify-center"
          >
            <img
              src={logo}
              alt="NavYug Alliance Monumental Logo"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </motion.div>

          {/* Absolute Handwritten Annotations & SVG Arrows */}
          
          {/* Annotation 1 (Top Left): Flame of purpose */}
          <div className="absolute -top-10 -left-6 sm:-left-12 max-w-[140px] text-left rotate-[-4deg] z-30">
            <p className="font-handwriting text-base md:text-lg text-primary font-bold leading-snug">
              The flame of purpose. Fuelled by values, driven by youth.
            </p>
            {/* Hand-drawn Arrow to gold flame */}
            <svg className="w-12 h-6 text-gold -rotate-12 mt-1 ml-4" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5,5 Q20,18 35,5" strokeLinecap="round" />
              <path d="M30,3 L35,5 L32,10" strokeLinecap="round" />
            </svg>
          </div>

          {/* Annotation 2 (Top Right): Rising together */}
          <div className="absolute top-2 -right-8 sm:-right-16 max-w-[140px] text-left rotate-[3deg] z-30">
            <p className="font-handwriting text-base md:text-lg text-primary font-bold leading-snug">
              Rising together, creating impact.
            </p>
            {/* Handdrawn Arrow pointing left-down to top columns */}
            <svg className="w-12 h-6 text-gold rotate-[145deg] mt-1 ml-2" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5,5 Q20,18 35,5" strokeLinecap="round" />
              <path d="M30,3 L35,5 L32,10" strokeLinecap="round" />
            </svg>
          </div>

          {/* Annotation 3 (Middle Left): Eight minds */}
          <div className="absolute top-1/2 -left-12 sm:-left-24 max-w-[130px] text-left rotate-[-3deg] border-b border-gold pb-1 z-30">
            <p className="font-handwriting text-base md:text-lg text-primary font-bold leading-none">
              Eight minds. One vision.
            </p>
            {/* Horizontal Arrow pointing right */}
            <svg className="w-8 h-4 text-gold mt-1 ml-6 rotate-12" viewBox="0 0 30 15" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2,7 L26,7" strokeLinecap="round" />
              <path d="M20,3 L26,7 L20,11" strokeLinecap="round" />
            </svg>
          </div>

          {/* Annotation 4 (Middle Right): Growth */}
          <div className="absolute top-3/5 -right-8 sm:-right-20 max-w-[125px] text-left rotate-[2deg] z-30">
            <p className="font-handwriting text-base md:text-lg text-primary font-bold leading-snug">
              Growth that uplifts everyone.
            </p>
            {/* Arrow pointing down-left */}
            <svg className="w-10 h-6 text-gold rotate-45 mt-1 ml-1" viewBox="0 0 35 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5,5 Q18,18 30,5" strokeLinecap="round" />
              <path d="M25,3 L30,5 L28,10" strokeLinecap="round" />
            </svg>
          </div>

          {/* Annotation 5 (Bottom Right): A movement */}
          <div className="absolute -bottom-14 right-2 sm:-right-12 max-w-[150px] text-left rotate-[-1deg] border-b border-gold pb-1 z-30">
            <p className="font-handwriting text-base md:text-lg text-primary font-bold leading-snug">
              A movement. A legacy. A better tomorrow.
            </p>
            <svg className="absolute -left-6 -top-6 w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22,12 Q12,18 5,5" strokeLinecap="round" />
              <path d="M10,4 L5,5 L6,10" strokeLinecap="round" />
            </svg>
          </div>

          {/* Small hand-drawn wireframe logo sketch (Bottom Left) */}
          <div className="absolute -bottom-16 -left-12 w-14 h-14 opacity-25 hidden sm:block">
            <svg className="w-full h-full text-neutral-600" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M25,5 L40,15 L40,35 L25,45 L10,35 L10,15 Z" />
              <path d="M25,5 L25,45 M10,15 L40,35 M10,35 L40,15" strokeWidth="0.5" strokeDasharray="1 1" />
              <circle cx="25" cy="25" r="18" />
            </svg>
            <span className="font-handwriting text-[9px] block text-neutral-400 rotate-12 -mt-2">scale draft</span>
          </div>

          {/* Torn masking tape overlay (Bottom Left) */}
          <div className="absolute -bottom-24 -left-6 w-24 h-8 bg-amber-200/25 border-l border-dashed border-amber-900/10 shadow-sm rotate-[12deg] hidden md:block" />

        </div>

        {/* Brand Slogans and Slogan Stack */}
        <div className="mt-16 md:mt-20 space-y-4">
          {/* Main Editorial Typography Title */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black font-serif text-primary tracking-tight leading-none uppercase">
            NavYug Alliance
          </h1>

          {/* Handwritten script tagline with gold underline */}
          <div className="relative inline-block mt-2">
            <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl text-gold rotate-[-1deg] font-bold">
              Together We Rise
            </h2>
            <svg className="absolute -bottom-3 left-0 w-full h-3 text-gold/75" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M2,4 Q50,8 98,3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Stacked Handwritten Statement: Ideas. Action. Impact. */}
        <div className="mt-10 mb-8 font-handwriting text-3xl text-neutral-500 italic space-y-1">
          <p>"Ideas."</p>
          <p>"Action."</p>
          <p>"Impact."</p>
        </div>

        {/* Premium CTA explore button */}
        <div className="mt-8 flex flex-col items-center z-30 relative">
          <a
            href="#about"
            className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-primary bg-primary text-background font-semibold text-xs tracking-widest uppercase transition-all duration-300 hover:bg-transparent hover:text-primary hover:shadow-lg hover:shadow-primary/5 active:scale-95"
          >
            Explore Our Vision
            <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-gold pointer-events-none" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-gold pointer-events-none" />
          </a>
        </div>

      </div>

      {/* Bottom Scroll Indicator & Fold Details */}
      <div className="w-full flex flex-col items-center z-20 relative select-none">
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col items-center gap-1.5"
        >
          <a
            href="#about"
            className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:text-gold hover:border-gold hover:shadow-md transition-all duration-300"
            aria-label="Scroll Down"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          
          <div className="relative">
            <span className="font-handwriting text-sm text-neutral-600 tracking-wide select-none">
              Scroll to begin the journey
            </span>
            {/* Sketched Underline Arrow */}
            <svg
              className="absolute left-1/2 -bottom-4 -translate-x-1/2 text-gold w-36 h-4 pointer-events-none opacity-70"
              viewBox="0 0 150 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M10,5 Q75,15 135,4" />
              <path d="M125,1 Q135,4 138,5 Q130,9 125,12" />
            </svg>
          </div>
        </motion.div>

      </div>

      {/* Ripped-paper bottom edge transition */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-background torn-edge-top z-30" />
    </section>
  );
};

export default HeroSection;
