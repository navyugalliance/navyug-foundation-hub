import { motion } from "framer-motion";
import { Users, Heart, Sparkles } from "lucide-react";

const features = [
  { icon: Users, title: "Unity", desc: "Seven individuals bound by a shared purpose and unwavering trust." },
  { icon: Heart, title: "Social Initiatives", desc: "Driving meaningful change through community-driven programs." },
  { icon: Sparkles, title: "Creative Events", desc: "Curating experiences that inspire, educate, and empower youth." },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary">Who We Are</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed font-sans">
            NavYug is not just a group — it is a shared journey. Seven individuals, one vision. Built on unity, leadership and lifelong brotherhood.
          </p>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="text-center p-8 rounded-lg border border-border hover:border-gold/40 transition-colors group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="w-14 h-14 mx-auto rounded-full border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors">
                <f.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-primary">{f.title}</h3>
              <p className="mt-3 text-muted-foreground font-sans text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
