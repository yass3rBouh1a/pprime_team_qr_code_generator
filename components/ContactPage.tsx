"use client";

import {
  Mail,
  Phone,
  Globe,
  Link2,
  MapPin,
  MessageSquare,
  Plus,
  ChevronRight,
  Building2,
  ChevronDown,
  FileText,
} from "lucide-react";
import { TeamMember } from "@/lib/types";
import { generateVCard } from "@/lib/vcard";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface Props {
  member: TeamMember;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function ContactPage({ member }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.12]);
  const heroContentOpacity = useTransform(smoothProgress, [0, 0.6], [1, 0]);
  const heroContentY = useTransform(smoothProgress, [0, 0.6], [0, -40]);
  const heroContentX = useTransform(smoothProgress, [0, 0.6], [0, -30]); // Avatar/identity move left
  const logoOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]); // Logo fades out fast
  const glowX = useTransform(smoothProgress, [0, 0.8], [0, -100]); // Glow moves far left
  const glowOpacity = useTransform(smoothProgress, [0, 0.8], [0.2, 0]);

  const initials =
    `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase();

  const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  type ContactRow = {
    label: string;
    value: string;
    href?: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    actionable: boolean;
    external?: boolean;
    whatsapp?: string;
  };

  const rows: ContactRow[] = [
    ...(member.phone
      ? [
        {
          label: "Phone",
          value: member.phone,
          href: `tel:${member.phone}`,
          icon: <Phone size={16} />,
          iconBg: "bg-[#41A9D8]",
          iconColor: "text-white",
          actionable: true,
          whatsapp: `https://wa.me/${member.phone.replace(/\D/g, "")}`,
        },
      ]
      : []),
    ...(member.email
      ? [
        {
          label: "Email",
          value: member.email,
          href: `mailto:${member.email}`,
          icon: <Mail size={16} />,
          iconBg: "bg-[#41A9D8]",
          iconColor: "text-white",
          actionable: true,
        },
      ]
      : []),
    ...(member.website
      ? [
        {
          label: "Website",
          value: member.website.replace(/^https?:\/\/(www\.)?/, "www.").replace(/\/$/, ""),
          href: member.website,
          icon: <Globe size={16} />,
          iconBg: "bg-[#41A9D8]",
          iconColor: "text-white",
          actionable: true,
          external: true,
        },
      ]
      : []),
    ...(member.address
      ? [
        {
          label: "Address",
          value: member.address,
          icon: <MapPin size={16} />,
          iconBg: "bg-[#41A9D8]",
          iconColor: "text-white",
          actionable: false,
        },
      ]
      : []),
    {
      label: "P Prime",
      value: "Suivre P Prime",
      href: "https://www.linkedin.com/company/p-prime/",
      icon: <LinkedInIcon size={16} />,
      iconBg: "bg-[#0077B5]",
      iconColor: "text-white",
      actionable: true,
      external: true,
    },
  ];

  const actions = [
    { label: "Call", href: `tel:${member.phone}`, icon: <Phone size={15} />, enabled: !!member.phone },

    { label: "Email", href: `mailto:${member.email}`, icon: <Mail size={15} />, enabled: !!member.email },
    { label: "Website", href: member.website ?? "#", icon: <Globe size={15} />, enabled: !!member.website, external: true },
    { label: "LinkedIn", href: member.linkedin ?? "#", icon: <LinkedInIcon size={15} />, enabled: !!member.linkedin, external: true },
  ];

  function downloadVCard() {
    const vcf = generateVCard(member);
    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${member.firstName}-${member.lastName}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-[#07101f] min-h-screen">

      {/* ══════════════════════════════════════
          HERO — full-viewport cinematic section
      ══════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col overflow-hidden"
      >
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 will-change-transform pointer-events-none"
          style={{ y: bgY, scale: bgScale }}
        >
          <img
            src="/assets/bg-contact.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* ── Top bar Logo ── */}
        <motion.div
          className="fixed top-6 left-6 z-50 pointer-events-none"
          style={{ opacity: logoOpacity }}
        >
          <img
            src="/assets/logo-slogan.png"
            alt="P Prime Logo"
            className="h-10 w-auto object-contain drop-shadow-xl"
          />
        </motion.div>

        {/* ── Hero center ── */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col items-center justify-end px-6 pt-24 pb-28 gap-0"
          initial={false}
        >
          {/* Avatar */}
          <div className="relative mb-4">
            {/* Ambient glow */}
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-60 scale-125"
              style={{
                background: `radial-gradient(circle, ${member.avatarColor}88, transparent 70%)`,
              }}
            />

            {/* Animated gradient ring */}
            <div className="relative w-28 h-28 rounded-full p-[2.5px] shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #2ebd59, #34d399, #06b6d4, #6366f1)",
              }}
            >
              <div className="w-full h-full rounded-full bg-[#0a1628] p-[2.5px]">
                <div
                  className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-white text-4xl font-black"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="select-none">{initials}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Pulsing presence dot */}
            <div className="absolute bottom-1 right-1 z-20">
              <span className="relative flex w-4 h-4">
                <motion.span
                  className="absolute inset-0 rounded-full bg-emerald-400"
                  animate={{ 
                    scale: [1, 2.2], 
                    opacity: [0.5, 0] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "loop",
                    ease: "easeOut" 
                  }}
                />
                <span className="relative w-4 h-4 rounded-full bg-emerald-500 border-[2px] border-white shadow-lg" />
              </span>
            </div>
          </div>

          {/* Name */}
          <h1 className="text-[2.2rem] font-bold text-white text-center leading-[1.1] tracking-tight">
            {member.firstName} {member.lastName}
          </h1>

          {/* Job title */}
          {member.jobTitle && (
            <p className="mt-[5px] text-[15px] text-white/70 font-medium text-center tracking-wide">
              {member.jobTitle}
            </p>
          )}

          {/* Floating action icon circles — horizontal row */}
          <div className="flex flex-row gap-6 mt-8 justify-center">
            {actions.map(({ label, href, icon, enabled, external }) =>
              enabled ? (
                <div key={label} className="flex flex-col items-center gap-2">
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-12 h-12 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-white flex items-center justify-center active:scale-90 transition-transform hover:bg-white/25"
                  >
                    {icon}
                  </a>
                  <span className="text-[9px] uppercase tracking-[0.12em] font-bold text-white/40">
                    {label}
                  </span>
                </div>
              ) : null
            )}
          </div>

        </motion.div>

        {/* Background Decorative Glow (Top Left) */}
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -z-10"
          style={{ x: glowX, opacity: glowOpacity }}
        />

        {/* Scroll hint — clickable */}
        <motion.button
          onClick={() => detailsRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="relative z-10 pb-90 flex flex-col items-center gap-1 text-white/35 hover:text-white/60 transition-colors cursor-pointer bg-transparent border-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <span className="text-[9px] uppercase tracking-[0.25em] font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={15} className="rotate-180" />
          </motion.div>
        </motion.button>
      </div>

      {/* ══════════════════════════════════════
          DETAILS SHEET — slides up from dark
      ══════════════════════════════════════ */}
      <div ref={detailsRef} className="relative z-10 bg-[#f1f5f9] rounded-t-[2.5rem] -mt-[22rem] pb-36 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">

        {/* Drag handle */}
        <div className="flex justify-center pt-4 pb-1">
          <div className="w-9 h-1 rounded-full bg-slate-300/80" />
        </div>

        {/* ── Contact info section ── */}
        <div className="px-4 pt-5">
          <p className="text-[9.5px] font-black uppercase tracking-[0.22em] text-slate-400/80 px-1 mb-3">
            Contact P Prime
          </p>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100/80">
            {rows.map((row, i) => {
              const content = (
                <>
                  <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#41A9D8]/20 border border-[#41A9D8]/40 backdrop-blur-md text-[#41A9D8] flex items-center justify-center">
                      {row.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-[9.5px] font-black text-slate-400/70 uppercase tracking-[0.18em] leading-none mb-1">
                      {row.label}
                    </p>
                    <p className={`text-[13px] font-semibold leading-snug truncate ${row.label === "LinkedIn" ? "text-blue-600" : "text-slate-800"
                      }`}>
                      {row.value}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
                    {row.whatsapp && (
                      <a
                        href={row.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 backdrop-blur-md text-[#25D366] flex items-center justify-center active:scale-95 transition-transform hover:bg-[#25D366]/30"
                      >
                        <WhatsAppIcon />
                      </a>
                    )}
                  </div>
                </>
              );

              return row.actionable ? (
                <motion.div
                  key={row.label}
                  onClick={() => {
                    if (row.href) {
                      if (row.external) {
                        window.open(row.href, "_blank", "noopener,noreferrer");
                      } else {
                        window.location.href = row.href;
                      }
                    }
                  }}
                  className="group flex items-center gap-3.5 px-4 py-3.5 hover:bg-slate-50/80 active:bg-slate-100 transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.45, ease }}
                >
                  {content}
                </motion.div>
              ) : (
                <motion.div
                  key={row.label}
                  className="flex items-center gap-3.5 px-4 py-3.5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.45, ease }}
                >
                  {content}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Notes section ── */}
        {member.notes && (
          <motion.div
            className="px-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease }}
          >
            <p className="text-[9.5px] font-black uppercase tracking-[0.22em] text-slate-400/80 px-1 mb-3">
              Note
            </p>
            <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-start gap-4">
              <p className="flex-1 text-[13px] text-slate-500 leading-relaxed italic pt-1">
                &ldquo;{member.notes}&rdquo;
              </p>
              <div className="w-10 h-10 rounded-full bg-[#41A9D8]/20 border border-[#41A9D8]/40 backdrop-blur-md text-[#41A9D8] flex items-center justify-center flex-shrink-0">
                <MessageSquare size={16} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Branding ── */}
        <motion.div
          className="mt-6 mb-6 flex flex-col items-center opacity-30 pointer-events-none grayscale"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-[7.5px] uppercase tracking-[0.3em] font-black text-slate-400">
            Powered by Smart Solutions · P Prime
          </p>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          STICKY CTA
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-5 pb-8 pt-6 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #f1f5f9 55%, transparent)",
        }}
      >
        <div className="w-full max-w-md pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.965 }}
            onClick={downloadVCard}
            className="relative w-full py-[15px] rounded-2xl text-white font-bold text-[13px] tracking-[0.18em] uppercase flex items-center justify-center gap-2.5 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #41A9D8 0%, #012434 100%)",
              boxShadow: "0 8px 32px rgba(1,36,52,0.35), 0 2px 8px rgba(65,169,216,0.2)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5, ease }}
          >
            {/* Glass shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -skew-x-12 pointer-events-none" />
            <Plus size={17} strokeWidth={2.5} />
            Add Contact
          </motion.button>
        </div>
      </div>
    </div>
  );
}
