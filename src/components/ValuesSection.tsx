import { motion } from "framer-motion";

const values = [
  { title: "Leadership", desc: "Guiding with vision, inspiring by example, and cultivating future leaders." },
  { title: "Brotherhood", desc: "A bond forged in trust, loyalty, and a shared commitment to each other." },
  { title: "Growth", desc: "Embracing continuous learning and personal development at every step." },
  { title: "Impact", desc: "Creating lasting positive change in our communities and beyond." },
];

const ValuesSection = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
          <path d="M0 600 Q300 200 600 400 T1200 200" stroke="hsl(var(--gold))" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">Core Values</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="relative rounded-lg p-6 pt-8 bg-primary-foreground/[0.06] backdrop-blur-sm border border-primary-foreground/10 hover:border-gold/30 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="absolute top-0 left-6 right-6 h-0.5 bg-gold rounded-full" />
              <h3 className="text-xl font-semibold text-gold">{v.title}</h3>
              <p className="mt-3 text-primary-foreground/70 font-sans text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
