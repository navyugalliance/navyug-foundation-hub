import { motion } from "framer-motion";
import { User } from "lucide-react";

// Option 1: If images are in same folder → use relative import (Vite/esbuild style)
// import chiragImg from "./chirag-nawgaje.jpg";
// import vanshImg from "./vansh-maheshwari.jpg";
// ...etc

// Option 2: Most common → images in /public folder → use /filename directly
const founders = [
  {
    name: "Chirag Nawgaje",
    image: "/chirag.jpeg",     // ← change to your real filename
  },
  {
    name: "Vansh Maheshwari",
    image: "/vansh.jpg",
  },
  {
    name: "Harsh Baraliya",
    image: "/Harsh.jpeg",
  },
  {
    name: "Vidhan Zambad",
    image: "/vidhan.jpg",
  },
  {
    name: "Krishna Rathi",
    image: "/krishna.jpeg",
  },
  {
    name: "Soham Ujjainkar",
    image: "/soham.png",
  },
  {
    name: "Sarth Takalkar",
    image: "/sarth.png",
  },
];

const FoundersSection = () => {
  return (
    <section id="founders" className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary">Founding Members</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          <p className="mt-4 text-muted-foreground text-lg font-sans max-w-xl mx-auto">
            Seven visionaries united by purpose, passion, and brotherhood.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {founders.map((founder, i) => (
            <motion.div
              key={founder.name}
              className="group flex flex-col items-center text-center p-6 rounded-xl border border-border hover:border-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gold/30 group-hover:border-gold/70 transition-all duration-300 shadow-md group-hover:shadow-gold/20">
                {founder.image ? (
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.removeAttribute("hidden");
                    }}
                  />
                ) : null}

                {/* Fallback icon when image fails to load or not set */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-primary/5"
                  hidden={!!founder.image}
                >
                  <User className="w-12 h-12 sm:w-14 sm:h-14 text-gold/60" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="mt-5 text-base sm:text-lg font-semibold text-primary tracking-wide">
                {founder.name}
              </h3>
              <span className="mt-1 text-xs sm:text-sm text-gold/70 font-sans uppercase tracking-widest">
                Co-Founder
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
