import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="relative py-28 bg-background border-t border-primary/10 overflow-hidden select-none">
      {/* Lined paper pattern in background */}
      <div className="absolute inset-0 lined-paper pointer-events-none opacity-30 z-0" />
      
      {/* Margin lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] bg-red-400/15 pointer-events-none z-10" />

      {/* The Continuous Golden Route - Part 2: Who We Are */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 text-gold" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Golden brush line */}
        <motion.path
          d="M50,0 C45,15 14,25 14,42 C14,60 50,55 55,68 C60,82 30,85 20,100"
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
          d="M50.2,0 C45.2,15.1 14.3,25.1 14.3,42.1 C14.3,59.8 49.7,55.1 54.7,68.1 C59.7,81.8 29.8,85.2 19.8,100"
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

      <div className="container mx-auto px-6 lg:px-16 relative z-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Polaroid & Sketched Path */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-12">
            
            {/* Polaroid Photo Frame */}
            <motion.div
              initial={{ opacity: 0, rotate: -4, y: 30 }}
              whileInView={{ opacity: 1, rotate: -2, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="relative bg-white p-5 pb-8 shadow-xl border border-neutral-200/50 max-w-sm w-full tape-effect"
            >
              {/* Gold heart doodle in corner */}
              <div className="absolute -right-3 -bottom-3 text-gold w-10 h-10 z-20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12,21 C12,21 3,14 3,8.5 C3,5.5 5.5,3 8.5,3 C10.2,3 11.3,4 12,5 C12.7,4 13.8,3 15.5,3 C18.5,3 21,5.5 21,8.5 C21,14 12,21 12,21 Z" />
                </svg>
              </div>

              {/* Hand-drawn Group Silhouette Sketch */}
              <div className="aspect-[4/3] bg-[#EAE5D9] border border-neutral-300/40 relative overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full text-primary/80 p-6" viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="130" cy="30" r="8" strokeDasharray="3 3" />
                  <path d="M122,22 L118,18 M138,22 L142,18 M130,18 L130,12 M130,42 L130,48" strokeWidth="1" />
                  <path d="M20,25 Q40,20 60,25" strokeWidth="1" strokeDasharray="4 4" />
                  
                  {[...Array(8)].map((_, idx) => {
                    const offset = idx * 14 + 25;
                    const height = 45 + (idx % 3) * 4;
                    return (
                      <g key={idx} className="opacity-90">
                        <circle cx={offset} cy={110 - height} r="5" />
                        <path d={`M${offset - 6},110 L${offset},${110 - height + 4} L${offset + 6},110`} />
                        {idx < 7 && (
                          <path d={`M${offset + 3},${110 - height + 12} Q${offset + 7},${110 - height + 15} M${offset + 11},${110 - height + 12}`} strokeWidth="1" />
                        )}
                      </g>
                    );
                  })}
                  <path d="M10,110 L150,110" strokeWidth="2" />
                </svg>
              </div>

              {/* Handwritten captions */}
              <div className="mt-6 text-center">
                <h3 className="font-handwriting text-2xl font-bold text-primary mb-2">
                  Eight minds. One vision.
                </h3>
                <p className="font-handwriting text-lg text-neutral-600 leading-snug px-2">
                  Bound by trust. Driven by values. United by a vision to uplift society and inspire the youth.
                </p>
              </div>
            </motion.div>

            {/* Sketched Path Winding */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1 }}
              className="w-full max-w-sm hidden lg:block relative pl-6"
            >
              <svg className="w-full h-36 text-gold" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M10,90 Q40,80 60,60 T120,40 T180,10" strokeDasharray="3 3" />
                <path d="M15,90 Q43,82 62,63 T121,43 T178,13" />
                
                <g className="text-primary" strokeWidth="1">
                  <circle cx="118" cy="35" r="2" />
                  <path d="M118,37 L118,43 M116,40 L120,40 M117,43 L116,46 M119,43 L120,46" />
                  <circle cx="125" cy="34" r="2" />
                  <path d="M125,36 L125,42 M123,39 L127,39 M124,42 L123,45 M126,42 L127,45" />
                  <circle cx="112" cy="37" r="2" />
                  <path d="M112,39 L112,45 M110,42 L114,42 M111,45 L110,48 M113,45 L114,48" />
                </g>
                <path d="M5,70 Q40,55 90,68 T195,50" strokeWidth="0.75" className="opacity-40" />
              </svg>
              <span className="font-handwriting text-xs text-neutral-500 absolute bottom-0 right-4 rotate-3">
                the long winding road ahead...
              </span>
            </motion.div>

          </div>

          {/* Right Column: Title & Connected Story Spread */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Who We Are Header & Story */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="relative inline-block">
                <h2 className="text-4xl md:text-5xl font-bold text-primary">Who We Are</h2>
                <svg className="absolute -bottom-3 left-0 w-full h-3 text-gold" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M2,3 Q50,9 98,2" strokeLinecap="round" />
                </svg>
              </div>

              <p className="text-neutral-700 text-lg leading-relaxed font-sans pt-4 max-w-xl">
                NavYug is not just a group — it is a shared journey. Eight individuals, one vision. Built on unity, leadership and lifelong brotherhood.
              </p>
            </motion.div>

            {/* Connected Story Flow */}
            <div className="relative space-y-8 md:space-y-0 md:h-[480px] w-full flex flex-col md:block mt-12">
              
              {/* Connection SVGs for Desktop */}
              <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none text-gold/40" viewBox="0 0 500 480" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6">
                <path d="M180,120 Q240,160 210,220" />
                <path d="M205,210 L210,220 L219,215" strokeWidth="2.5" fill="none" />
                <path d="M280,290 Q340,320 290,370" />
                <path d="M288,358 L290,370 L300,365" strokeWidth="2.5" fill="none" />
              </svg>

              {/* Note 1: Unity */}
              <motion.div
                initial={{ opacity: 0, rotate: 1, y: 20 }}
                whileInView={{ opacity: 1, rotate: -1.5, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:absolute md:top-0 md:left-4 w-full md:w-[280px] bg-background border border-primary/10 shadow-md p-6 rounded-sm relative select-none hover:shadow-lg transition-shadow"
              >
                <div className="absolute -top-3 left-1/3 -translate-x-1/2 w-20 h-5 bg-gold/15 rotate-[-5deg] border-x border-dashed border-gold/30" />
                <h3 className="font-serif text-xl font-bold text-primary mb-2 flex items-center gap-2">
                  <span className="text-gold font-handwriting text-2xl font-bold">1.</span> Unity
                </h3>
                <p className="text-neutral-600 text-sm font-sans leading-relaxed">
                  Eight minds bound by a shared purpose, unwavering trust, and mutual strength.
                </p>
              </motion.div>

              {/* Note 2: Social Initiatives */}
              <motion.div
                initial={{ opacity: 0, rotate: -2, y: 20 }}
                whileInView={{ opacity: 1, rotate: 2, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="md:absolute md:top-[160px] md:left-[180px] w-full md:w-[280px] bg-background border border-primary/10 shadow-md p-6 rounded-sm relative select-none hover:shadow-lg transition-shadow"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-gold/15 rotate-[3deg] border-x border-dashed border-gold/30" />
                <h3 className="font-serif text-xl font-bold text-primary mb-2 flex items-center gap-2">
                  <span className="text-gold font-handwriting text-2xl font-bold">2.</span> Social Initiatives
                </h3>
                <p className="text-neutral-600 text-sm font-sans leading-relaxed">
                  Driving meaningful change through community-driven relief and development programs.
                </p>
              </motion.div>

              {/* Note 3: Creative Events */}
              <motion.div
                initial={{ opacity: 0, rotate: 1, y: 20 }}
                whileInView={{ opacity: 1, rotate: -1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="md:absolute md:bottom-0 md:left-[60px] w-full md:w-[280px] bg-background border border-primary/10 shadow-md p-6 rounded-sm relative select-none hover:shadow-lg transition-shadow"
              >
                <div className="absolute -top-3 left-2/3 -translate-x-1/2 w-20 h-5 bg-gold/15 rotate-[-2deg] border-x border-dashed border-gold/30" />
                <h3 className="font-serif text-xl font-bold text-primary mb-2 flex items-center gap-2">
                  <span className="text-gold font-handwriting text-2xl font-bold">3.</span> Creative Events
                </h3>
                <p className="text-neutral-600 text-sm font-sans leading-relaxed">
                  Curating experiences that inspire, educate, and empower the youth to take action.
                </p>
              </motion.div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
