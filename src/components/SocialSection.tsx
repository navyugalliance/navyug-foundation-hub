import { motion } from "framer-motion";
import { Instagram, Linkedin, Youtube } from "lucide-react";

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

const SocialSection = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-6 lg:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Connect With Us</h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-4" />
        </motion.div>

        <motion.div
          className="mt-10 flex justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:border-gold hover:text-gold hover:bg-gold/10 transition-all"
            >
              <s.icon className="w-5 h-5" strokeWidth={1.5} />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialSection;
