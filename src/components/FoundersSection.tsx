import { motion } from "framer-motion";
import { User } from "lucide-react";

const founders = [
  "Chirag Nawgaje",
  "Harsh Baraliya",
  "Vidhan Zambad",
  "Krishna Rathi",
  "Vansh Maheshwari",
  "Soham Ujjainkar",
  "Sarth Takalkar",
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

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {founders.map((name, i) => (
            <motion.div
              key={name}
              className="group flex flex-col items-center text-center p-6 rounded-xl border border-border hover:border-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/5 border border-gold/20 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/50 transition-all duration-300">
                <User className="w-7 h-7 text-gold/70 group-hover:text-gold transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 text-sm md:text-base font-semibold text-primary tracking-wide">
                {name}
              </h3>
              <span className="mt-1 text-xs text-gold/60 font-sans uppercase tracking-widest">
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
