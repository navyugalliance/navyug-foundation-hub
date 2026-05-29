import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";

interface Founder {
  name: string;
  image: string;
  role: string;
  story: string;
  rotation: number;
}

const founders: Founder[] = [
  {
    name: "Chirag Nawgaje",
    image: "/chirag.jpeg",
    role: "Co-Founder",
    story: "Driven by a deep passion for social change and youth mobilization, Chirag helps shape the vision and strategic direction of NavYug Alliance, inspiring collective action and community empowerment.",
    rotation: -1.5,
  },
  {
    name: "Vansh Maheshwari",
    image: "/vansh.jpg",
    role: "Co-Founder",
    story: "Committed to community welfare and creative solutions, Vansh brings structured leadership to our initiatives, ensuring that every idea is executed with precision and care.",
    rotation: 2.5,
  },
  {
    name: "Harsh Baraliya",
    image: "/Harsh.jpeg",
    role: "Co-Founder",
    story: "With a focus on innovation and social impact, Harsh drives our technology and community outreach, connecting minds to build a stronger and more united society.",
    rotation: -2,
  },
  {
    name: "Vidhan Zambad",
    role: "Co-Founder",
    image: "/vidhan.jpg",
    story: "Believing in the power of youth-driven projects, Vidhan leads coordination and outreach efforts, fostering teamwork and brotherhood across all our active campaigns.",
    rotation: 1,
  },
  {
    name: "Krishna Rathi",
    image: "/krishna.jpeg",
    role: "Co-Founder",
    story: "A strong advocate for cultural heritage and social service, Krishna helps organize devotional and community-centered events that connect people through shared values.",
    rotation: -2.5,
  },
  {
    name: "Soham Ujjainkar",
    image: "/soham.png",
    role: "Co-Founder",
    story: "Dedicated to youth development and leadership, Soham guides our creative campaigns, inspiring young minds to unlock their potential and make a lasting impact.",
    rotation: 2,
  },
  {
    name: "Sarth Takalkar",
    image: "/sarth.png",
    role: "Co-Founder",
    story: "With a strong focus on strategic execution and service, Sarth works to expand the reach of our initiatives, turning individual actions into community milestones.",
    rotation: -1,
  },
  {
    name: "Jayesh Laddha",
    image: "/jayesh.png",
    role: "Co-Founder",
    story: "Jayesh brings energy, creative insight, and dedication to our initiatives, guiding local volunteers and ensuring our campaigns resonate deeply with the public.",
    rotation: 1.5,
  },
];

const FoundersSection = () => {
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);

  return (
    <section id="founders" className="relative py-28 bg-[#F8F5EE] overflow-hidden border-t border-primary/10 select-none">
      {/* Notebook Grid Lines */}
      <div className="absolute inset-0 grid-paper pointer-events-none opacity-30 z-0" />
      
      {/* Margin lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] bg-red-400/10 pointer-events-none z-10" />

      {/* The Continuous Golden Route - Part 4: Founders Board */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 text-gold" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Golden brush line */}
        <motion.path
          d="M80,0 C78,15 22,25 22,40 C22,55 78,55 78,75 C78,88 20,88 15,100"
          fill="none"
          stroke="#D4A64A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        {/* Thin ink trace overlay */}
        <motion.path
          d="M79.8,0 C77.8,15.1 22.3,25.1 22.3,40.1 C22.3,54.8 77.7,55.2 77.7,75.1 C77.7,87.8 20.2,88.2 14.8,100"
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
          transition={{ duration: 2, delay: 0.08, ease: "easeInOut" }}
        />
      </svg>

      <div className="container mx-auto px-6 lg:px-16 relative z-20">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Founding Members</h2>
            <svg className="absolute -bottom-3 left-0 w-full h-3 text-gold" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M1,5 Q50,9 99,1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="font-handwriting text-2xl text-gold mt-6 rotate-[-1deg]">
            Connected by trust. Unified by a single route.
          </p>
        </motion.div>

        {/* Polaroid Board Gallery */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 max-w-5xl mx-auto">
          {founders.map((founder, i) => (
            <motion.div
              key={founder.name}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setSelectedFounder(founder)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              {/* Polaroid Frame */}
              <motion.div
                className="bg-white p-3.5 pb-6 shadow-md border border-neutral-200/40 relative flex flex-col items-center w-full max-w-[210px] tape-effect hover:shadow-xl hover:border-gold/30 transition-all duration-300"
                style={{ rotate: `${founder.rotation}deg` }}
                whileHover={{ y: -8, rotate: `${founder.rotation * 0.6}deg` }}
              >
                {/* Photo container */}
                <div className="w-full aspect-square bg-[#EAE5D9] relative overflow-hidden border border-neutral-300/20">
                  {founder.image ? (
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                      <User className="w-10 h-10 text-gold/40" />
                    </div>
                  )}
                </div>

                {/* Hand-signed caption */}
                <div className="mt-4 text-center w-full">
                  <h3 className="font-handwriting text-xl md:text-2xl font-bold text-primary truncate leading-tight">
                    {founder.name.split(" ")[0]}
                  </h3>
                  <span className="text-[10px] text-gold tracking-widest font-sans uppercase block mt-1">
                    {founder.role}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Marginal quote */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative inline-block">
            <p className="font-handwriting text-2xl text-neutral-500 italic max-w-xl">
              "Eight minds. One brotherhood. A lifetime of purpose."
            </p>
            <div className="absolute -right-8 -top-4 text-gold opacity-60">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12,2 L15,9 L22,9 L17,14 L19,21 L12,17 L5,21 L7,14 L2,9 L9,9 Z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Premium Scrapbook Modal Overlay */}
        <AnimatePresence>
          {selectedFounder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto"
              onClick={() => setSelectedFounder(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative bg-[#F8F5EE] paper-texture max-w-2xl w-full border border-primary/20 rounded-md shadow-2xl p-6 md:p-10 text-left overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 lined-paper opacity-20 pointer-events-none" />
                <div className="absolute left-6 top-0 bottom-0 w-[1.5px] bg-red-400/20 pointer-events-none" />

                <button
                  onClick={() => setSelectedFounder(null)}
                  className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full border border-primary/10 hover:border-gold hover:text-gold transition-all z-10 bg-background/80"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid md:grid-cols-12 gap-8 items-center pt-4 relative z-10">
                  <div className="md:col-span-5 flex justify-center">
                    <div className="bg-white p-4 pb-6 shadow-lg border border-neutral-200/40 w-full max-w-[220px] rotate-[-2deg]">
                      <div className="w-full aspect-square bg-[#EAE5D9] overflow-hidden border border-neutral-300/10">
                        {selectedFounder.image ? (
                          <img
                            src={selectedFounder.image}
                            alt={selectedFounder.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <User className="w-12 h-12 text-gold/40" />
                          </div>
                        )}
                      </div>
                      <p className="font-handwriting text-center text-primary text-xl font-bold mt-4 leading-tight">
                        {selectedFounder.name}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <h3 className="text-3xl font-bold text-primary font-serif leading-none">
                        {selectedFounder.name}
                      </h3>
                      <span className="text-xs text-gold font-sans font-semibold tracking-widest uppercase block mt-2">
                        {selectedFounder.role}
                      </span>
                    </div>

                    <svg className="w-full h-2 text-gold opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2,5 Q50,8 98,3" strokeLinecap="round" />
                    </svg>

                    <p className="text-neutral-700 text-base leading-relaxed font-sans mt-2">
                      {selectedFounder.story}
                    </p>

                    <div className="pt-2 font-handwriting text-xl text-gold">
                      "Together We Rise"
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FoundersSection;
