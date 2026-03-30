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

const ease = [0.22, 1, 0.36, 1];

export default function ContactPage({ member }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);

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

  const initials =
    `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase();

  type ContactRow = {
    label: string;
    value: string;
    href?: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    actionable: boolean;
    external?: boolean;
  };

  const rows: ContactRow[] = [
    member.phone
      ? {
          label: "Phone",
          value: member.phone,
          href: `tel:${member.phone}`,
          icon: <Phone size={16} />,
          iconBg: "bg-indigo-100",
          iconColor: "text-indigo-600",
          actionable: true,
        }
      : null,
    member.email
      ? {
          label: "Email",
          value: member.email,
          href: `mailto:${member.email}`,
          icon: <Mail size={16} />,
          iconBg: "bg-sky-100",
          iconColor: "text-sky-600",
          actionable: true,
        }
      : null,
    member.website
      ? {
          label: "Website",
          value: member.website.replace(/^https?:\/\//, ""),
          href: member.website,
          icon: <Globe size={16} />,
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          actionable: true,
          external: true,
        }
      : null,
    member.address
      ? {
          label: "Address",
          value: member.address,
          icon: <MapPin size={16} />,
          iconBg: "bg-rose-100",
          iconColor: "text-rose-500",
          actionable: false,
        }
      : null,
    member.linkedin
      ? {
          label: "LinkedIn",
          value: "View Profile",
          href: member.linkedin,
          icon: <Link2 size={16} />,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          actionable: true,
          external: true,
        }
      : null,
  ].filter((r): r is ContactRow => r !== null);

  const actions = [
    { label: "Call", href: `tel:${member.phone}`, icon: <Phone size={15} />, enabled: !!member.phone },
    { label: "Message", href: `sms:${member.phone}`, icon: <MessageSquare size={15} />, enabled: !!member.phone },
    { label: "Email", href: `mailto:${member.email}`, icon: <Mail size={15} />, enabled: !!member.email },
    { label: "Website", href: member.website ?? "#", icon: <Globe size={15} />, enabled: !!member.website, external: true },
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
          className="absolute inset-0 will-change-transform"
          style={{ y: bgY, scale: bgScale }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/bg-contact.png')" }}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#07101f]/10 to-[#07101f]" />
        <div className="absolute inset-0 bg-[#0F1D36]/40" />



        {/* ── Hero center ── */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-12 gap-0"
          style={{ opacity: heroContentOpacity, y: heroContentY }}
        >
          {/* Avatar */}
          <motion.div
            className="relative mb-5"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
          >
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
                <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-70" />
                <span className="relative w-4 h-4 rounded-full bg-emerald-500 border-[2px] border-white shadow-lg" />
              </span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-[2.2rem] font-black text-white text-center leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease }}
          >
            {member.firstName}{" "}
            <span className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.55) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {member.lastName}
            </span>
          </motion.h1>

          {/* Job title */}
          {member.jobTitle && (
            <motion.p
              className="mt-1 text-[13px] text-white/65 font-medium text-center tracking-wide"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease }}
            >
              {member.jobTitle}
            </motion.p>
          )}

          {/* Company chip */}
          {member.company && (
            <motion.div
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.44, duration: 0.45, ease }}
            >
              <Building2 size={10} className="text-white/60" />
              <span className="text-[10px] font-semibold text-white/85 tracking-wider">
                {member.company}
              </span>
            </motion.div>
          )}

          {/* Action pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mt-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.55, ease }}
          >
            {actions.map(({ label, href, icon, enabled, external }) => (
              <a
                key={label}
                href={href}
                target={external && enabled ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md border text-xs font-semibold tracking-wide transition-all active:scale-90 ${
                  enabled
                    ? "bg-white/15 border-white/25 text-white hover:bg-white/25 hover:border-white/40"
                    : "bg-white/5 border-white/10 text-white/25 pointer-events-none"
                }`}
              >
                {icon}
                {label}
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Background Decorative Glow (Top Left) */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -z-10" />

        {/* Scroll hint */}
        <motion.div
          className="relative z-10 pb-24 flex flex-col items-center gap-1 text-white/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <span className="text-[9px] uppercase tracking-[0.25em] font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={15} />
          </motion.div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          DETAILS SHEET — slides up from dark
      ══════════════════════════════════════ */}
      <div className="relative z-10 bg-[#f1f5f9] rounded-t-[2.5rem] -mt-32 pb-36 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">

        {/* Drag handle */}
        <div className="flex justify-center pt-4 pb-1">
          <div className="w-9 h-1 rounded-full bg-slate-300/80" />
        </div>

        {/* ── Contact info section ── */}
        <div className="px-4 pt-5">
          <p className="text-[9.5px] font-black uppercase tracking-[0.22em] text-slate-400/80 px-1 mb-3">
            Contact Info
          </p>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100/80">
            {rows.map((row, i) => {
              const content = (
                <>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${row.iconBg} ${row.iconColor}`}>
                    {row.icon}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-[9.5px] font-black text-slate-400/70 uppercase tracking-[0.18em] leading-none mb-1">
                      {row.label}
                    </p>
                    <p className={`text-[13px] font-semibold leading-snug truncate ${
                      row.label === "LinkedIn" ? "text-blue-600" :
                      row.label === "Website" ? "text-emerald-600" : "text-slate-800"
                    }`}>
                      {row.value}
                    </p>
                  </div>
                  {row.actionable && (
                    <ChevronRight size={14} className="text-slate-300 flex-shrink-0 group-hover:text-slate-400 transition-colors" />
                  )}
                </>
              );

              return row.actionable ? (
                <motion.a
                  key={row.label}
                  href={row.href}
                  target={row.external ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3.5 px-4 py-3.5 hover:bg-slate-50/80 active:bg-slate-100 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.45, ease }}
                >
                  {content}
                </motion.a>
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
            <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center flex-shrink-0">
                <FileText size={16} />
              </div>
              <p className="text-[13px] text-slate-500 leading-relaxed italic pt-1">
                &ldquo;{member.notes}&rdquo;
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Branding ── */}
        <motion.div
          className="mt-14 mb-2 flex flex-col items-center gap-3 opacity-30 pointer-events-none grayscale"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.7 }}
        >
          <img
            src="/assets/Logo+slogan_Plan de travail 1 copie 2.png"
            alt="logo"
            className="h-[14px] w-auto object-contain"
          />
          <p className="text-[8.5px] uppercase tracking-[0.3em] font-black text-slate-400">
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
              background: "linear-gradient(135deg, #0F1D36 0%, #1e3d6b 50%, #3730a3 100%)",
              boxShadow: "0 8px 32px rgba(15,29,54,0.45), 0 2px 8px rgba(55,48,163,0.3)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5, ease }}
          >
            {/* Glass shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -skew-x-12 pointer-events-none" />
            <Plus size={17} strokeWidth={2.5} />
            Save to Contacts
          </motion.button>
        </div>
      </div>
    </div>
  );
}
