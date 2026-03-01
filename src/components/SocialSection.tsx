import { motion } from "framer-motion";
import { Instagram, Mail, Phone } from "lucide-react";

const socials = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/navyug.alliance" },
  { icon: Mail, label: "Email", href: "mailto:navyugalliance@gmail.com" },
  { icon: Phone, label: "Phone", href: "tel:+917414984390" },
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
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={s.label}
              className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:border-gold hover:text-gold hover:bg-gold/10 transition-all"
            >
              <s.icon className="w-5 h-5" strokeWidth={1.5} />
            </a>
          ))}
        </motion.div>

        <motion.div
          className="mt-6 flex flex-col items-center gap-1 text-sm text-muted-foreground font-sans"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p>navyugalliance@gmail.com</p>
          <p>+91 7414 984 390</p>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialSection;
