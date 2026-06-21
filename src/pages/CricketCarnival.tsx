import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Award, 
  Users, 
  ShieldCheck, 
  Clock, 
  Check, 
  X, 
  Upload, 
  Info
} from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

interface PlayerRoster {
  number: number;
  fullName: string;
  age: string;
  mobileNumber: string;
  playingRole: string;
  mail: string;
  isSubstitute: string;
}

const CricketCarnival = () => {
  const [searchParams] = useSearchParams();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainAge, setCaptainAge] = useState("");
  const [captainWhatsApp, setCaptainWhatsApp] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [captainCity, setCaptainCity] = useState("");
  
  // 8 players roster (7 playing + 1 substitute)
  const [players, setPlayers] = useState<PlayerRoster[]>(() => 
    Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      fullName: "",
      age: "",
      mobileNumber: "",
      playingRole: "Batsman",
      mail: "",
      isSubstitute: i === 7 ? "Yes" : "No"
    }))
  );

  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  const [aadhaarFile, setAadhaarFile] = useState<{
    name: string;
    type: string;
    size: number;
    data: string;
  } | null>(null);

  const [captainSignature, setCaptainSignature] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-open inline wizard if ?register=true is in URL query parameters, reset if not
  useEffect(() => {
    if (searchParams.get("register") === "true") {
      setRegisterModalOpen(true);
      setCurrentStep(1);
    } else {
      setRegisterModalOpen(false);
    }
  }, [searchParams]);

  // Scroll to top when entering registration or changing wizard steps
  useEffect(() => {
    if (registerModalOpen) {
      window.scrollTo(0, 0);
    }
  }, [registerModalOpen, currentStep]);

  // Handle Player Field Change
  const handlePlayerChange = (idx: number, key: keyof PlayerRoster, val: string) => {
    setPlayers(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: val };
      return next;
    });

    const errId = `players_${idx}_${key}`;
    if (errors[errId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[errId];
        return next;
      });
    }
  };

  // Check if player details are filled
  const isPlayerFilled = (idx: number) => {
    const p = players[idx];
    return p.fullName.trim() !== "" && p.age.trim() !== "" && p.mobileNumber.trim() !== "" && p.mail.trim() !== "";
  };

  // Validate form before submitting
  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!teamName.trim()) nextErrors.teamName = "Team Name is required";
    if (!captainName.trim()) nextErrors.captainName = "Captain's Full Name is required";
    
    if (!captainAge) {
      nextErrors.captainAge = "Captain's Age is required";
    } else if (parseInt(captainAge) < 12) {
      nextErrors.captainAge = "Age must be at least 12";
    }

    if (!captainEmail.trim()) {
      nextErrors.captainEmail = "Captain's Email is required";
    } else if (!/\S+@\S+\.\S+/.test(captainEmail)) {
      nextErrors.captainEmail = "Invalid email address";
    }

    if (!captainCity.trim()) nextErrors.captainCity = "Captain's City is required";

    // Validate 8 players roster
    players.forEach((p, idx) => {
      if (!p.fullName.trim()) {
        nextErrors[`players_${idx}_fullName`] = `Player ${p.number} Name is required`;
      }
      if (!p.age.trim()) {
        nextErrors[`players_${idx}_age`] = `Player ${p.number} Age is required`;
      } else if (parseInt(p.age) < 12) {
        nextErrors[`players_${idx}_age`] = `Invalid age`;
      }
      if (!p.mobileNumber.trim()) {
        nextErrors[`players_${idx}_mobileNumber`] = `Mobile is required`;
      } else if (!/^\+?[0-9\s-]{10,15}$/.test(p.mobileNumber)) {
        nextErrors[`players_${idx}_mobileNumber`] = `Invalid mobile number`;
      }
      if (!p.mail.trim()) {
        nextErrors[`players_${idx}_mail`] = `Email is required`;
      } else if (!/\S+@\S+\.\S+/.test(p.mail)) {
        nextErrors[`players_${idx}_mail`] = `Invalid email`;
      }
    });

    if (!aadhaarFile) {
      nextErrors.aadhaarFile = "Aadhaar Card document upload is required";
    }

    if (!captainSignature.trim()) {
      nextErrors.captainSignature = "Captain's signature is required";
    }

    if (!agreement) {
      nextErrors.agreement = "You must check the declaration agreement";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Submit registration form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fix all form validation errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      const answers = {
        teamName,
        captainName,
        captainAge: parseInt(captainAge),
        captainWhatsApp,
        captainEmail,
        captainCity,
        players,
        aadhaarFile,
        captainSignature,
        registrationDate: new Date().toISOString().slice(0, 10),
        agreement: agreement ? "Yes" : "No"
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: "navyug-cricket-carnival-2026",
          eventTitle: "Navyug Cricket Carnival 2026",
          answers,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setCurrentStep(3);
      } else {
        alert(result.message || "Failed to submit registration. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      alert("An error occurred during submission: " + (err.message || err.toString()));
    } finally {
      setLoading(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setTeamName("");
    setCaptainName("");
    setCaptainAge("");
    setCaptainWhatsApp("");
    setCaptainEmail("");
    setCaptainCity("");
    setPlayers(
      Array.from({ length: 8 }, (_, i) => ({
        number: i + 1,
        fullName: "",
        age: "",
        mobileNumber: "",
        playingRole: "Batsman",
        mail: "",
        isSubstitute: i === 7 ? "Yes" : "No"
      }))
    );
    setAadhaarFile(null);
    setCaptainSignature("");
    setAgreement(false);
    setErrors({});
    setAgreedToRules(false);
    setCurrentStep(1);
    setSuccess(false);
    setActivePlayerIndex(0);
  };

  return (
    <main className={`overflow-x-hidden min-h-screen flex flex-col justify-between relative ${
      registerModalOpen 
        ? "bg-[#F0F4F9]" 
        : "bg-[#F8F5EE] paper-texture select-none"
    }`}>
      <SEO 
        title="Navyug Cricket Carnival 2026 — Register Your Team"
        description="Official landing page for Navyug Cricket Carnival 2026. Join Nandura's premium cricket tournament. View match rules, prizes, and register your team roster."
        keywords="Navyug Cricket Carnival, Navyug Alliance, Nandura Cricket, Cricket Registration, Tournament Rules, Youth Sports Maharashtra"
      />

      {/* Red margin binder line on left (Only render on details page) */}
      {!registerModalOpen && (
        <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] bg-red-400/10 pointer-events-none z-10" />
      )}

      <div>
        {/* Header Section (Only render on details page) */}
        {!registerModalOpen && (
          <section className="relative bg-primary text-primary-foreground py-16 pb-24 overflow-hidden torn-edge-bottom">
            <div className="absolute inset-0 grid-paper pointer-events-none opacity-5" />
            
            <div className="container mx-auto pl-12 pr-6 md:pl-24 md:pr-16 relative z-10">
              <Link
                to="/events"
                className="group inline-flex items-center gap-2 text-primary-foreground/80 hover:text-gold transition-colors text-sm font-sans font-semibold mb-6"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Journal
              </Link>
              
              <div className="mt-2 text-center max-w-3xl mx-auto space-y-4">
                <span className="bg-gold/15 text-gold border border-gold/30 px-3.5 py-1 text-[11px] font-sans font-bold uppercase tracking-widest rounded-full shadow-inner">
                  🏏 Registrations Open 🏆
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground tracking-tight font-serif pt-1">
                  Navyug Cricket Carnival 2026
                </h1>
                <p className="font-handwriting text-xl md:text-3xl text-gold rotate-[-1deg] inline-block mt-1">
                  Every Victory Has a Story
                </p>
                
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-primary-foreground/90 font-sans pt-4">
                  <span className="flex items-center gap-2 bg-primary-foreground/5 px-4 py-2 border border-primary-foreground/10 rounded-sm">
                    <Calendar className="w-4 h-4 text-gold" />
                    July 11 & 12, 2026
                  </span>
                  <span className="flex items-center gap-2 bg-primary-foreground/5 px-4 py-2 border border-primary-foreground/10 rounded-sm">
                    <MapPin className="w-4 h-4 text-gold" />
                    Nandura, Maharashtra
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Conditional View: Details page vs Google Form style inline Roster view */}
        {!registerModalOpen ? (
          /* Main Landing Page Details View */
          <section className="py-12 md:py-20 container mx-auto pl-12 pr-6 md:pl-24 md:pr-16 relative z-20">
            <div className="grid lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
              
              {/* Left Collage Details */}
              <div className="lg:col-span-7 space-y-12">
                
                {/* Main Narrative Card (Torn Notepad Fragment) */}
                <div className="relative bg-[#FFFDF6] border border-neutral-300/40 p-6 md:p-8 rounded-sm shadow-md tape-effect select-none">
                  <div className="absolute top-[-8px] left-8 w-14 h-5 bg-[#D4A64A]/20 border-l border-r border-dashed border-[#D4A64A]/30 rotate-[-4deg] z-20 pointer-events-none" />
                  
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                    <span>About the Carnival</span>
                  </h2>
                  <div className="w-12 h-0.5 bg-gold/50 mb-6" />

                  <div className="space-y-4 text-sm md:text-base text-neutral-600 font-sans leading-relaxed">
                    <p>
                      The <strong>Navyug Cricket Carnival 2026</strong> is a premium sports initiative designed to celebrate local talent, foster teamwork, and bring the community together. Every game played writes a new page of grit, perseverance, and triumph.
                    </p>
                    <p>
                      Hosted by the <strong>NavYug Alliance</strong>, this tournament gathers the finest players in a fast-paced knockout format, offering a stage for local champions to rise, showcase their passion, and display sportsmanship.
                    </p>
                    <p className="bg-[#FFFDEB] border-l-4 border-gold p-4 text-neutral-700 italic font-semibold rounded-r-sm">
                      "This is not just about runs and wickets; it is a celebration of stories, struggles, and values that define our youth."
                    </p>
                  </div>
                </div>

                {/* Tournament Format & Key Rules (Grid Paper Collage) */}
                <div className="relative bg-[#FFFDF6] border border-neutral-300/40 p-6 md:p-8 rounded-sm shadow-md rotate-[-0.5deg]">
                  <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-gold" /> Tournament Format & Guidelines
                  </h2>
                  <div className="w-12 h-0.5 bg-gold/50 mb-6" />

                  <div className="space-y-4 text-sm text-neutral-600 font-sans leading-relaxed">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-neutral-200/50 p-4 rounded-sm bg-neutral-50/50">
                        <h4 className="font-bold text-primary flex items-center gap-1.5 mb-1.5 uppercase text-xs tracking-wider">
                          <Users className="w-4 h-4 text-gold" /> Roster Composition
                        </h4>
                        <p className="text-[13px]">Each team must register exactly <strong>8 players</strong>. This includes 7 playing members and 1 substitute. Roster details are locked upon registration.</p>
                      </div>

                      <div className="border border-neutral-200/50 p-4 rounded-sm bg-neutral-50/50">
                        <h4 className="font-bold text-primary flex items-center gap-1.5 mb-1.5 uppercase text-xs tracking-wider">
                          <Clock className="w-4 h-4 text-gold" /> Matches & Over Format
                        </h4>
                        <p className="text-[13px]">Fast-paced tournament with knockout stages. Each inning consists of exactly <strong>6 overs</strong>. Active team management and high scoring rates will be key.</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-dashed border-neutral-200">
                      <h4 className="font-bold text-primary uppercase text-xs tracking-wider mb-3">Core Event Guidelines:</h4>
                      <ul className="list-disc pl-5 space-y-2 text-[13px]">
                        <li>
                          <strong>Aadhaar Card Requirement:</strong> An Aadhaar card upload is mandatory for all 8 team players in a single collective file to ensure transparency and age validation.
                        </li>
                        <li>
                          <strong>Single Team Rule:</strong> A player is strictly prohibited from representing more than one team in the carnival.
                        </li>
                        <li>
                          <strong>Umpire Decisiveness:</strong> Decisions of the official tournament umpires are final. Any arguments or dissent can result in immediate disqualification.
                        </li>
                        <li>
                          <strong>Code of Conduct:</strong> Respect for opponents, officials, and the audience is paramount. Sportsmanship holds more weight than victory.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Sidebar Details */}
              <div className="lg:col-span-5 space-y-10">

                {/* Polaroid Photo Frame Placeholder */}
                <div className="bg-white p-4 pb-6 shadow-xl border border-neutral-200/40 rotate-[1.5deg] relative max-w-sm mx-auto">
                  <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-24 h-6 bg-[#D4A64A]/30 border-l border-r border-dashed border-[#D4A64A]/40 rotate-[-1.5deg] z-20" />
                  
                  <div className="w-full aspect-[4/3] bg-neutral-900 overflow-hidden border border-neutral-300/10 flex items-center justify-center rounded-sm relative">
                    {/* Decorative Cricket Icon/Illustration */}
                    <svg className="w-20 h-20 text-gold/30 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M6 12 A6 6 0 0 1 18 12" strokeDasharray="2 2" />
                      <path d="M6 12 A6 6 0 0 0 18 12" strokeDasharray="2 2" />
                      <path d="M12 2 L12 22" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <span className="text-white text-xs font-sans tracking-widest font-semibold uppercase">NavYug Stadium, Nandura</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <h4 className="font-handwriting text-2xl font-bold text-primary">
                      The Pitch is Set
                    </h4>
                    <p className="text-[10px] text-gold uppercase tracking-widest font-sans font-bold mt-1">
                      July 2026 Edition
                    </p>
                  </div>
                </div>

                {/* Prizes & Awards Card (Premium Gold Scrapbook Style) */}
                <div className="relative bg-[#FFFDF6] border-2 border-gold/40 p-6 md:p-8 rounded-sm shadow-lg rotate-[-1.5deg]">
                  {/* Paper clip style decoration */}
                  <svg className="absolute -top-3.5 right-4 w-7 h-9 text-neutral-500/70 z-20 drop-shadow-sm pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M7 10v7a5 5 0 0 0 10 0v-9a3 3 0 0 0-6 0v8a1 1 0 0 0 2 0v-6" />
                  </svg>

                  <h3 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-gold" /> Rewards & Achievements
                  </h3>
                  <div className="w-12 h-0.5 bg-gold/50 mb-6" />

                  <div className="space-y-4 text-sm font-sans text-neutral-600">
                    <div className="flex justify-between items-center py-2.5 border-b border-dashed border-neutral-200">
                      <span className="font-semibold text-primary">💰 Total Prize Pool</span>
                      <span className="font-bold text-gold text-right">₹40,000</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-dashed border-neutral-200">
                      <span className="font-semibold text-primary">🏆 1st Prize Winners</span>
                      <span className="font-bold text-gold text-right">₹21,000 + Grand Trophy</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-dashed border-neutral-200">
                      <span className="font-semibold text-primary">🥈 Runners-Up</span>
                      <span className="font-bold text-neutral-500 text-right">Cash Prize + Trophy</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="font-semibold text-primary">🎁 More Rewards</span>
                      <span className="text-[11px] text-neutral-500 text-right">Many exciting individual prizes</span>
                    </div>
                  </div>
                </div>

                {/* Registration Call-To-Action Board */}
                <div className="bg-[#0B2D55] text-primary-foreground p-6 md:p-8 rounded-sm shadow-md text-center space-y-5 border-b-4 border-gold">
                  <h3 className="text-xl font-serif font-semibold">Are You Ready to Write Your Victory?</h3>
                  <p className="text-xs text-primary-foreground/80 leading-relaxed font-sans">
                    Register your team roster, submit Aadhaar verification, and apply for Nandura's premier cricket carnival.
                  </p>
                  <div className="bg-amber-500/20 border border-amber-500/40 p-3 rounded-sm text-left space-y-1">
                    <p className="text-[11px] font-bold text-gold uppercase tracking-wider">⚠️ Important Notices:</p>
                    <ul className="list-disc pl-4 text-[10px] text-primary-foreground/90 space-y-0.5 font-sans leading-normal">
                      <li>Registration does <strong>NOT</strong> guarantee a spot in the playing team.</li>
                      <li>Our team will verify details and contact you via email.</li>
                      <li>Limited spots are available on a <strong>First Come First Serve</strong> basis.</li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setRegisterModalOpen(true);
                        setCurrentStep(1);
                      }}
                      className="w-full py-3.5 bg-gold hover:bg-gold/90 text-primary border border-gold font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95"
                    >
                      Register Your Team Now
                    </button>
                  </div>
                  <div className="text-[10px] text-primary-foreground/60 font-sans">
                    Registration Deadline: July 5, 2026
                  </div>
                </div>

              </div>

            </div>
          </section>
        ) : (
          /* Google Form Style Inline Roster Registration View - Standard CSS Layout (No binder lines, no margins) */
          <section className="py-6 md:py-10 max-w-2xl mx-auto px-4 relative z-20 font-sans">
            
            {/* Top Toolbar Actions */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => {
                  if (success || window.confirm("Are you sure you want to go back? Filled details will be lost.")) {
                    setRegisterModalOpen(false);
                    resetForm();
                  }
                }}
                type="button"
                className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-colors uppercase tracking-wider bg-white px-3.5 py-2 rounded-full shadow-sm border border-neutral-200"
              >
                ← Back to Details
              </button>
              {!success && (
                <span className="bg-primary/5 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/10">
                  Step {currentStep} of 2
                </span>
              )}
            </div>

            <div className="space-y-6">

              {/* Card 1: Google-Form Branded Header Block */}
              <div className="bg-white rounded-lg border-t-[10px] border-primary shadow-sm border-x border-b border-neutral-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-3.5">
                  <h1 className="text-2xl md:text-3.5xl font-bold tracking-tight text-neutral-800 font-sans">
                    Navyug Cricket Carnival 2026
                  </h1>
                  <p className="text-neutral-600 text-sm md:text-base font-sans font-medium tracking-wide">
                    Every Victory Has a Story
                  </p>
                  
                  <div className="border-t border-neutral-100 pt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-500 font-sans">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> July 11 & 12, 2026</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> Nandura, Maharashtra</span>
                  </div>
                </div>
              </div>

              {/* STEP 1: RULES & FORMAT AGREEMENT VIEW */}
              {currentStep === 1 && !success && (
                <>
                  {/* Card 2: Rules content block */}
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 space-y-4">
                    <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <h3 className="text-base font-bold text-neutral-800 uppercase tracking-wide">Tournament Guidelines</h3>
                    </div>

                    <div className="space-y-3 text-sm md:text-base text-neutral-600 leading-relaxed max-h-96 overflow-y-auto pr-1">
                      <ol className="list-decimal pl-4 space-y-3.5">
                        <li>
                          <strong>Limited Seats — First Come First Serve:</strong> Team entries are strictly limited. Registering does <strong>NOT</strong> guarantee playing slot allocation. The core committee will verify details and contact you via email.
                        </li>
                        <li>
                          <strong>Aadhaar Card Requirement:</strong> You must upload a single combined file (PDF, ZIP, or Image) containing copies of Aadhaar cards for all 8 roster players.
                        </li>
                        <li>
                          <strong>Roster Constraints:</strong> Each team must register exactly 8 players (7 playing + 1 substitute). Player #8 defaults as the substitute.
                        </li>
                        <li>
                          <strong>Overs Format:</strong> Matches are structured as exactly <strong>6 overs per inning</strong>.
                        </li>
                        <li>
                          <strong>Strict Punctuality:</strong> Teams must report 30 minutes before their match. Failure to do so leads to immediate forfeit.
                        </li>
                        <li>
                          <strong>Code of Conduct:</strong> Absolute respect for umpires and opponents is mandatory. Unsportsmanlike behavior will cause direct disqualification.
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Card 3: Notice & Warnings */}
                  <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-200 p-5 space-y-3 flex flex-col">
                    <div className="flex items-start gap-2.5">
                      <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800 leading-relaxed font-sans">
                        <strong>Review Process:</strong> The committee will verify all players' names and details against Aadhaar records. We will contact you via your captain's email to notify slot allocation results.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 border-t border-amber-200/50 pt-2">
                      <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800 leading-relaxed font-sans">
                        <strong>Upload Check:</strong> Ensure the combined Aadhaar document has legible records for all 8 players before advancing.
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Agreement Action */}
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 flex flex-col gap-5">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreedToRules}
                        onChange={(e) => setAgreedToRules(e.target.checked)}
                        className="rounded border-neutral-300 text-primary focus:ring-primary w-5 h-5 mt-0.5"
                      />
                      <span className="text-xs md:text-sm font-semibold text-neutral-800 leading-snug">
                        I confirm that our team agrees to abide by all the tournament guidelines, overs formats, and first-come first-serve allocation terms.
                      </span>
                    </label>

                    <div className="border-t border-neutral-100 pt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={!agreedToRules}
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-3 bg-primary text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-md transition-all hover:bg-primary/95 disabled:opacity-40 active:scale-95 shadow-sm"
                      >
                        Next: Roster Form
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 2: REGISTRATION DETAILS FORM */}
              {currentStep === 2 && !success && (
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Card 2: Team details */}
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 space-y-4">
                    <div className="border-b border-neutral-100 pb-2">
                      <h4 className="text-sm font-bold text-neutral-800 uppercase tracking-wider font-sans">
                        📋 Section 1: Team Details
                      </h4>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">Team Name *</label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => {
                          setTeamName(e.target.value);
                          if (errors.teamName) setErrors(prev => ({ ...prev, teamName: "" }));
                        }}
                        className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
                        placeholder="e.g. Nandura Stars"
                      />
                      {errors.teamName && (
                        <p className="text-xs text-red-500 font-sans font-semibold mt-1">{errors.teamName}</p>
                      )}
                    </div>
                  </div>

                  {/* Card 3: Captain info */}
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 space-y-6">
                    <div className="border-b border-neutral-100 pb-2">
                      <h4 className="text-sm font-bold text-neutral-800 uppercase tracking-wider font-sans">
                        👤 Section 2: Captain Details
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">Captain's Full Name *</label>
                        <input
                          type="text"
                          value={captainName}
                          onChange={(e) => {
                            setCaptainName(e.target.value);
                            if (errors.captainName) setErrors(prev => ({ ...prev, captainName: "" }));
                          }}
                          className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
                        />
                        {errors.captainName && (
                          <p className="text-xs text-red-500 font-sans font-semibold mt-1">{errors.captainName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">Age *</label>
                        <input
                          type="number"
                          value={captainAge}
                          onChange={(e) => {
                            setCaptainAge(e.target.value);
                            if (errors.captainAge) setErrors(prev => ({ ...prev, captainAge: "" }));
                          }}
                          className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
                        />
                        {errors.captainAge && (
                          <p className="text-xs text-red-500 font-sans font-semibold mt-1">{errors.captainAge}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">WhatsApp Number</label>
                        <input
                          type="tel"
                          value={captainWhatsApp}
                          onChange={(e) => setCaptainWhatsApp(e.target.value)}
                          className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
                          placeholder="e.g. +91 9876543210"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">Email Address *</label>
                        <input
                          type="email"
                          value={captainEmail}
                          onChange={(e) => {
                            setCaptainEmail(e.target.value);
                            if (errors.captainEmail) setErrors(prev => ({ ...prev, captainEmail: "" }));
                          }}
                          className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
                          placeholder="captain@example.com"
                        />
                        {errors.captainEmail && (
                          <p className="text-xs text-red-500 font-sans font-semibold mt-1">{errors.captainEmail}</p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">City / Hometown *</label>
                        <input
                          type="text"
                          value={captainCity}
                          onChange={(e) => {
                            setCaptainCity(e.target.value);
                            if (errors.captainCity) setErrors(prev => ({ ...prev, captainCity: "" }));
                          }}
                          className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
                          placeholder="e.g. Nandura"
                        />
                        {errors.captainCity && (
                          <p className="text-xs text-red-500 font-sans font-semibold mt-1">{errors.captainCity}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Player roster swiper details */}
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 space-y-6">
                    <div className="border-b border-neutral-100 pb-2">
                      <h4 className="text-sm font-bold text-neutral-800 uppercase tracking-wider font-sans">
                        🏏 Section 3: Player Roster (7 Playing + 1 Substitute)
                      </h4>
                      <p className="text-xs md:text-sm text-neutral-500 font-sans mt-1 leading-normal">
                        Select a tab below to enter details. Player #8 is the Substitute.
                      </p>
                    </div>

                    {/* Compact, clean horizontal scrollable buttons */}
                    <div className="flex overflow-x-auto gap-2 py-2.5 -mx-4 px-4 scrollbar-thin">
                      {players.map((p, idx) => {
                        const filled = isPlayerFilled(idx);
                        const active = activePlayerIndex === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActivePlayerIndex(idx)}
                            className={`flex items-center justify-center gap-1.5 px-4 py-3 border rounded-md text-xs font-bold font-sans flex-shrink-0 min-w-[90px] transition-all active:scale-95 ${
                              active
                                ? "bg-primary text-white border-primary shadow-sm"
                                : filled
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                            }`}
                          >
                            Player #{p.number}
                            {filled && <span className="text-green-600 font-bold text-xs">✓</span>}
                            {idx === 7 && <span className="text-[9px] opacity-75 font-normal">(Sub)</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Sub-card active player inputs */}
                    <div className="bg-neutral-50/50 p-5 border border-neutral-200 rounded-md space-y-4">
                      <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                        <span className="text-sm font-bold text-primary font-sans uppercase tracking-wider">
                          Details for Player #{players[activePlayerIndex].number} {activePlayerIndex === 7 && <span className="text-gold font-bold ml-1 font-sans text-xs">(Substitute)</span>}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-primary">
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">Full Name *</label>
                          <input
                            type="text"
                            value={players[activePlayerIndex].fullName}
                            onChange={(e) => handlePlayerChange(activePlayerIndex, "fullName", e.target.value)}
                            className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
                          />
                          {errors[`players_${activePlayerIndex}_fullName`] && (
                            <p className="text-xs text-red-500 font-sans font-semibold mt-1">{errors[`players_${activePlayerIndex}_fullName`]}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">Age *</label>
                          <input
                            type="number"
                            value={players[activePlayerIndex].age}
                            onChange={(e) => handlePlayerChange(activePlayerIndex, "age", e.target.value)}
                            className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
                          />
                          {errors[`players_${activePlayerIndex}_age`] && (
                            <p className="text-xs text-red-500 font-sans font-semibold mt-1">{errors[`players_${activePlayerIndex}_age`]}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">Mobile Number *</label>
                          <input
                            type="tel"
                            value={players[activePlayerIndex].mobileNumber}
                            onChange={(e) => handlePlayerChange(activePlayerIndex, "mobileNumber", e.target.value)}
                            className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
                          />
                          {errors[`players_${activePlayerIndex}_mobileNumber`] && (
                            <p className="text-xs text-red-500 font-sans font-semibold mt-1">{errors[`players_${activePlayerIndex}_mobileNumber`]}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">Playing Role *</label>
                          <select
                            value={players[activePlayerIndex].playingRole}
                            onChange={(e) => handlePlayerChange(activePlayerIndex, "playingRole", e.target.value)}
                            className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
                          >
                            <option value="Batsman">Batsman</option>
                            <option value="Bowler">Bowler</option>
                            <option value="All-Rounder">All-Rounder</option>
                            <option value="Wicket-Keeper">Wicket-Keeper</option>
                          </select>
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">Email Address *</label>
                          <input
                            type="email"
                            value={players[activePlayerIndex].mail}
                            onChange={(e) => handlePlayerChange(activePlayerIndex, "mail", e.target.value)}
                            className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary"
                            placeholder="player@example.com"
                          />
                          {errors[`players_${activePlayerIndex}_mail`] && (
                            <p className="text-xs text-red-500 font-sans font-semibold mt-1">{errors[`players_${activePlayerIndex}_mail`]}</p>
                          )}
                        </div>
                      </div>

                      {/* Card internal togglers */}
                      <div className="flex justify-between items-center pt-3 border-t border-neutral-200 mt-4">
                        <button
                          type="button"
                          disabled={activePlayerIndex === 0}
                          onClick={() => setActivePlayerIndex(prev => prev - 1)}
                          className="px-4 py-2.5 border border-neutral-300 text-neutral-600 rounded-md text-xs font-bold uppercase bg-white hover:bg-neutral-50 disabled:opacity-45"
                        >
                          ← Prev Player
                        </button>
                        <button
                          type="button"
                          disabled={activePlayerIndex === 7}
                          onClick={() => setActivePlayerIndex(prev => prev + 1)}
                          className="px-4 py-2.5 border border-neutral-300 text-neutral-600 rounded-md text-xs font-bold uppercase bg-white hover:bg-neutral-50 disabled:opacity-45"
                        >
                          Next Player →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: Aadhaar Verification Upload */}
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 space-y-4">
                    <div className="border-b border-neutral-100 pb-2">
                      <h4 className="text-sm font-bold text-neutral-800 uppercase tracking-wider font-sans">
                        📎 Section 4: Aadhaar Verification File
                      </h4>
                    </div>

                    <div className="space-y-3 font-sans text-sm">
                      <label className="text-sm font-semibold text-neutral-700 uppercase block tracking-wide">
                        Combined Aadhaar Card Document (Single PDF/ZIP/Image file) *
                      </label>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <label className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3.5 border border-neutral-300 bg-neutral-50 text-neutral-700 font-bold text-xs uppercase tracking-wider rounded-md cursor-pointer hover:bg-neutral-100 active:scale-95 transition-all shadow-sm">
                          <Upload className="w-4 h-4 mr-2" /> Select Collective File
                          <input
                            type="file"
                            accept=".pdf,image/*,.zip"
                            className="hidden"
                            onChange={async (e) => {
                              const fileList = e.target.files;
                              if (fileList && fileList.length > 0) {
                                const file = fileList[0];
                                if (file.size > 8 * 1024 * 1024) {
                                  alert("File size exceeds the 8MB limit. Please upload a smaller file.");
                                  return;
                                }
                                
                                const reader = new FileReader();
                                reader.onload = () => {
                                  const base64Data = reader.result as string;
                                  setAadhaarFile({
                                    name: file.name,
                                    type: file.type,
                                    size: file.size,
                                    data: base64Data
                                  });
                                  if (errors.aadhaarFile) {
                                    setErrors(prev => ({ ...prev, aadhaarFile: "" }));
                                  }
                                };
                                reader.onerror = () => {
                                  alert("Failed to read file.");
                                };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {aadhaarFile && (
                            <button
                              type="button"
                              onClick={() => setAadhaarFile(null)}
                              className="text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-wider flex items-center justify-center gap-1 py-2"
                            >
                              <X className="w-4 h-4" /> Remove Attached File
                            </button>
                          )}
                        </div>

                        {aadhaarFile ? (
                          <p className="text-sm text-neutral-600 font-semibold flex items-center gap-1.5 bg-[#FFFDEB] p-3 border border-[#E9DF9E] rounded-md">
                            📎 Attached: <strong>{aadhaarFile.name}</strong> ({(aadhaarFile.size / (1024 * 1024)).toFixed(2)} MB)
                          </p>
                        ) : (
                          <p className="text-xs md:text-sm text-neutral-500 leading-normal">
                            Please combine scans/photos of Aadhaar cards for all 8 team players into a single PDF, ZIP, or Image file. Max size 8MB.
                          </p>
                        )}
                        
                        {errors.aadhaarFile && (
                          <p className="text-xs text-red-500 font-sans font-semibold">{errors.aadhaarFile}</p>
                        )}
                      </div>
                    </div>

                    {/* Card 6: Declaration & Sign-off */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 space-y-6">
                      <div className="border-b border-neutral-100 pb-2">
                        <h4 className="text-sm font-bold text-neutral-800 uppercase tracking-wider font-sans">
                          📝 Section 5: Declaration & Sign-off
                        </h4>
                      </div>

                      <div className="space-y-4 text-sm">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700 uppercase font-sans tracking-wide block">
                            Captain's Signature (Type Full Name to Sign) *
                          </label>
                          <input
                            type="text"
                            value={captainSignature}
                            onChange={(e) => {
                              setCaptainSignature(e.target.value);
                              if (errors.captainSignature) setErrors(prev => ({ ...prev, captainSignature: "" }));
                            }}
                            className="flex h-12 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-base font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-primary font-semibold"
                            placeholder="Type captain name"
                          />
                          {errors.captainSignature && (
                            <p className="text-xs text-red-500 font-sans font-semibold">{errors.captainSignature}</p>
                          )}
                        </div>

                        <div className="pt-2">
                          <label className="flex items-start gap-3 cursor-pointer text-primary font-sans">
                            <input
                              type="checkbox"
                              checked={agreement}
                              onChange={(e) => {
                                setAgreement(e.target.checked);
                                if (errors.agreement) setErrors(prev => ({ ...prev, agreement: "" }));
                              }}
                              className="rounded border-neutral-300 text-primary focus:ring-primary w-5 h-5 mt-0.5"
                            />
                            <span className="leading-snug font-semibold text-neutral-700 text-sm select-none">
                              I declare that all information, age metrics, and player details provided are 100% accurate. If any player is found ineligible, our team will accept immediate disqualification. *
                            </span>
                          </label>
                          {errors.agreement && (
                            <p className="text-xs text-red-500 font-sans font-semibold mt-1">{errors.agreement}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card 7: Wizard Bottom Actions */}
                    <div className="flex justify-between items-center py-2 text-xs md:text-sm">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-3 border border-neutral-300 text-neutral-600 rounded-md font-bold uppercase tracking-wider bg-white hover:bg-neutral-50 active:scale-95 transition-all"
                      >
                        Back to Rules
                      </button>
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3.5 bg-primary text-white border border-primary font-bold uppercase tracking-wider rounded-md hover:bg-primary/95 transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95 shadow-sm"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Uploading & Submitting...
                          </>
                        ) : (
                          "Submit Registration"
                        )}
                      </button>
                    </div>

                  </form>
                )}

                {/* STEP 3: SUCCESS BLOCK */}
                {success && (
                  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 md:p-10 space-y-6 text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full border border-green-200 flex items-center justify-center shadow-inner text-green-600 mx-auto">
                      <Check className="w-10 h-10 animate-bounce" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-primary tracking-tight font-sans">Team Registered!</h3>
                      <p className="text-gold text-sm md:text-base font-sans font-semibold">Every Victory Has a Story</p>
                    </div>

                    <div className="max-w-md mx-auto text-sm md:text-base text-neutral-600 leading-relaxed text-left space-y-4 pt-2">
                      <p className="font-bold text-primary text-base">Thank you, Captain {captainName}!</p>
                      <p>
                        Your team registration for the <strong>Navyug Cricket Carnival 2026</strong> has been recorded. A confirmation email listing the players roster has been sent to <strong>{captainEmail}</strong>.
                      </p>
                      
                      <div className="bg-[#EBF7FF] border border-blue-200 p-4 rounded-md">
                        <p className="font-bold text-blue-900 mb-1.5 text-xs uppercase tracking-wide">📢 Join WhatsApp Group for Matches & Schedules</p>
                        <p className="text-xs md:text-sm text-blue-800 mb-3">Please join the official WhatsApp group for all upcoming match announcements, schedules, and team guidelines:</p>
                        <a
                          href="https://chat.whatsapp.com/DkanlL2if1d0VEtZfhiMWm"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs uppercase px-4 py-2 rounded-sm transition-all shadow-sm"
                        >
                          Join WhatsApp Group
                        </a>
                      </div>
                      
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-xs md:text-sm text-amber-800 space-y-1.5">
                        <span className="font-bold text-amber-950 block">⚠️ Registration Submitted for Review</span>
                        <p>
                          Please note: <strong>Registration does not guarantee your spot in the playing team.</strong> Slots are strictly limited on a first-come, first-served basis.
                        </p>
                        <p className="border-t border-amber-200/50 pt-1.5 mt-1.5">
                          Our team will verify the submitted roster and Aadhaar details. We will contact you via your registered email (<strong>{captainEmail}</strong>) shortly to confirm if a slot is allocated and provide payment guidelines.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setRegisterModalOpen(false);
                          resetForm();
                        }}
                        type="button"
                        className="px-8 py-3 bg-primary text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-md hover:bg-primary/95 transition-all shadow-sm active:scale-95"
                      >
                        Back to Stadium
                      </button>
                    </div>
                  </div>
                )}
              </div>
          </section>
        )}
      </div>

      {!registerModalOpen ? (
        <Footer />
      ) : (
        /* Google Forms style clean minimal forms footer */
        <div className="py-10 text-center text-xs text-neutral-500 font-sans space-y-2 mt-auto">
          <div className="text-base font-bold text-neutral-600 flex items-center justify-center gap-1.5">
            <span className="text-[#0b2d55]">NavYug</span>
            <span className="font-normal text-neutral-500 border-l border-neutral-300 pl-2">Forms</span>
          </div>
          <div className="text-[11px] text-neutral-400 max-w-md mx-auto px-4 leading-normal">
            This form is secure and verified. All uploaded Aadhaar card data is encrypted and saved directly to our secure cloud storage.
          </div>
        </div>
      )}
    </main>
  );
};

export default CricketCarnival;
