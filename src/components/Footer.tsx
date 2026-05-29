import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="relative py-12 bg-[#F8F5EE] border-t border-primary/10 select-none paper-texture text-foreground">
      {/* Red margin line on left */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] bg-red-400/10 pointer-events-none z-10" />

      <div className="container mx-auto px-6 lg:px-16 relative z-20">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-dashed border-primary/10">
          {/* Left copyright */}
          <div className="text-center md:text-left space-y-1">
            <span className="font-serif text-lg font-bold text-primary block">
              NavYug Alliance
            </span>
            <p className="text-neutral-500 text-xs font-sans">
              © 2026 NavYug Alliance. All rights reserved.
            </p>
          </div>

          {/* Center tagline and handle */}
          <div className="text-center space-y-1">
            <p className="text-gold font-serif italic text-sm tracking-widest font-semibold uppercase">
              Together We Rise
            </p>
            <p className="font-handwriting text-xl text-primary leading-none">
              @navyugalliance
            </p>
          </div>

          {/* Right Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="NavYug Logo" className="w-9 h-9 object-contain" />
          </div>
        </div>

        {/* Bottom handwritten closing message */}
        <div className="mt-8 text-center relative">
          <p className="font-handwriting text-2xl text-neutral-600 italic inline-block">
            "The story is still being written."
          </p>
          {/* Sketchy highlight underline */}
          <svg className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-48 h-3 text-gold/40 pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4,5 Q50,9 96,4" strokeLinecap="round" />
          </svg>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
