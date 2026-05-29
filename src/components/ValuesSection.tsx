import { motion } from "framer-motion";

const values = [
  {
    title: "Leadership",
    desc: "Guiding with vision, inspiring by example, and cultivating future leaders.",
    style: "bg-[#FFFDEB] rotate-[-2.5deg]",
    tapeStyle: "bg-amber-500/15 rotate-[-5deg]",
    illustration: (
      <svg className="w-12 h-12 text-amber-600/60" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="25" cy="25" r="16" strokeDasharray="3 3" />
        <path d="M25,9 L25,41 M9,25 L41,25" strokeWidth="1" />
        <path d="M25,17 L29,25 L25,33 L21,25 Z" fill="currentColor" className="opacity-10" />
        <path d="M25,17 L29,25 L25,33 L21,25 Z" />
      </svg>
    )
  },
  {
    title: "Brotherhood",
    desc: "A bond forged in trust, loyalty, and a shared commitment to each other.",
    style: "bg-white rotate-[3deg] grid-paper",
    tapeStyle: "bg-blue-500/15 rotate-[6deg]",
    illustration: (
      <svg className="w-12 h-12 text-primary/60" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M18,32 C13,32 9,28 9,23 C9,17 18,12 18,12 C18,12 27,17 27,23 C27,28 23,32 18,32 Z" />
        <path d="M32,32 C27,32 23,28 23,23 C23,17 32,12 32,12 C32,12 41,17 41,23 C41,28 37,32 32,32 Z" />
      </svg>
    )
  },
  {
    title: "Growth",
    desc: "Embracing continuous learning and personal development at every step.",
    style: "bg-[#F3ECE0] rotate-[-1.5deg] border-dashed border-amber-900/20",
    tapeStyle: "bg-neutral-500/15 rotate-[-8deg]",
    illustration: (
      <svg className="w-12 h-12 text-emerald-700/60" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M25,42 L25,15 Q25,8 35,10" />
        <path d="M25,25 Q15,22 15,14 Q20,12 25,20" />
        <path d="M25,32 Q35,32 38,26 Q32,23 25,29" />
        <path d="M12,42 Q25,39 38,42" strokeWidth="1" />
      </svg>
    )
  },
  {
    title: "Impact",
    desc: "Creating lasting positive change in our communities and beyond.",
    style: "bg-[#FDFBF7] rotate-[2deg] lined-paper",
    tapeStyle: "bg-gold/25 rotate-[4deg]",
    illustration: (
      <svg className="w-12 h-12 text-gold/80" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M25,25 L25,5 M25,25 L25,45 M25,25 L5,25 M25,25 L45,25" strokeDasharray="2 2" />
        <path d="M25,25 L11,11 M25,25 L39,39 M25,25 L11,39 M25,25 L39,11" />
        <circle cx="25" cy="25" r="4" fill="currentColor" />
        <path d="M20,20 Q25,15 30,20 Q35,25 30,30 Q25,35 20,30 Q15,25 20,20 Z" strokeWidth="1" />
      </svg>
    )
  },
];

const ValuesSection = () => {
  return (
    <section id="values" className="relative py-28 bg-[#F4ECE1]/60 overflow-hidden border-t border-primary/10 select-none">
      {/* Subtle grid lines background overlay */}
      <div className="absolute inset-0 grid-paper pointer-events-none opacity-30 z-0" />
      
      {/* Margin Line */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] bg-red-400/10 pointer-events-none z-10" />

      {/* The Continuous Golden Route - Part 3: Core Values */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 text-gold" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Golden brush line */}
        <motion.path
          d="M20,0 C22,18 85,25 85,50 C85,75 58,85 80,100"
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
          d="M19.8,0 C21.8,18.1 84.7,25.1 84.7,50.1 C84.7,74.9 57.7,85.2 79.8,100"
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

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        
        {/* Section Title */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Core Values</h2>
            <svg className="absolute -inset-x-6 -inset-y-4 text-gold/30 pointer-events-none w-[calc(100%+3rem)] h-[calc(100%+2rem)]" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5,30 C5,10 195,5 195,25 C195,45 10,55 5,35 C2,27 30,10 100,8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-handwriting text-2xl text-gold mt-6 rotate-[-1deg]">
            Our notebook of principles
          </p>
        </motion.div>

        {/* Visual Board Content */}
        <div className="relative mt-16 max-w-5xl mx-auto">
          
          {/* Grid of Values */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className={`relative p-6 pt-10 pb-8 border border-neutral-300/60 shadow-lg rounded-sm flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${v.style}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, type: "spring", stiffness: 80 }}
              >
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 border-x border-dashed border-gold/40 z-10 ${v.tapeStyle}`} />

                <div className="mb-4 flex items-center justify-center p-2 bg-background/30 rounded-full">
                  {v.illustration}
                </div>

                <h3 className="text-2xl font-handwriting font-bold text-primary mb-3">
                  {v.title}
                </h3>

                <p className="text-neutral-700 text-sm leading-relaxed font-sans mt-1">
                  {v.desc}
                </p>

                <div className="absolute top-2 right-2 text-neutral-400/40 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom sketchy note */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <p className="font-handwriting text-xl text-neutral-500 max-w-md mx-auto italic">
              "Bound by action, guided by truth — these values form the baseline of every step we take together."
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
