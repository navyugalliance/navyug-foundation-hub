import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { EventItem, isCompleted, formatEventDate } from "@/lib/events";

interface Props {
  event: EventItem;
  index?: number;
  compact?: boolean;
}

const EventCard = ({ event, index = 0, compact = false }: Props) => {
  const completed = isCompleted(event);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="relative rounded-lg border-2 border-primary overflow-hidden shadow-xl h-full bg-background">
        <div className="h-1.5 bg-gold" />

        <div className={`relative ${compact ? "p-8" : "p-10 md:p-14"} text-center flex flex-col h-full`}>
          <div className="flex items-center justify-center gap-2 text-gold">
            {completed ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-semibold tracking-widest uppercase font-sans">
                  Completed
                </span>
                <CheckCircle2 className="w-5 h-5" />
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-semibold tracking-widest uppercase font-sans">
                  {event.tagline || "Upcoming Event"}
                </span>
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </div>

          <h3 className={`mt-4 ${compact ? "text-2xl" : "text-3xl md:text-4xl"} font-bold text-primary`}>
            {event.title}
          </h3>

          <p className="mt-2 text-sm font-semibold text-gold tracking-wide font-sans">
            {formatEventDate(event.date)}
          </p>

          <p className="mt-4 text-muted-foreground font-sans leading-relaxed max-w-md mx-auto flex-1">
            {event.description}
          </p>

          {!completed && event.buttons && event.buttons.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {event.buttons.map((btn) => (
                <a
                  key={btn.url}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3 rounded bg-gold text-primary font-semibold text-sm tracking-wide hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20"
                >
                  {btn.label}
                </a>
              ))}
            </div>
          )}

          {completed && (
            <div className="mt-8">
              <span className="inline-flex items-center justify-center px-6 py-2 rounded border border-primary/20 text-primary/70 text-xs tracking-widest uppercase font-sans">
                Event Concluded
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
