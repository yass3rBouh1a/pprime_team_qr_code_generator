"use client";

import { Mail, Phone, Globe, Link2, MapPin, Building2, UserCheck, MessageSquare, Plus } from "lucide-react";
import { TeamMember } from "@/lib/types";
import { generateVCard } from "@/lib/vcard";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Props {
  member: TeamMember;
}

export default function ContactPage({ member }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Scroll animations
  const avatarSize = useTransform(scrollY, [0, 100], [112, 56]); // 28 (w-28) -> 14 (w-14)
  const avatarX = useTransform(scrollY, [0, 100], [0, -140]); // Center to left
  const iconsOpacity = useTransform(scrollY, [0, 50], [1, 0]); // Hide old icons
  const stickyIconsOpacity = useTransform(scrollY, [80, 120], [0, 1]); // Show sticky icons
  const headerPadding = useTransform(scrollY, [0, 100], [48, 16]); // pt-12 (48px) to pt-4 (16px)

  const initials = `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase();

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
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center pt-24 pb-32 px-4 relative">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-1/2 bg-zinc-900 -skew-y-6 -translate-y-1/2 -z-10" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="fixed top-1/2 -left-24 w-64 h-64 bg-zinc-100 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="w-full max-w-md relative z-10 space-y-4">
        {/* Main Card */}
        <div className="bg-white overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl relative">
          
          {/* Animated Header Section (Sticky) */}
          <motion.div 
            className="bg-[#0F1D36] sticky top-0 z-30 text-white overflow-hidden"
            style={{ paddingTop: headerPadding, paddingBottom: headerPadding }}
          >
            <div className="relative px-6 flex flex-col items-center">
              {/* Avatar Transition */}
              <motion.div 
                className="relative z-10 flex items-center justify-center"
                style={{ x: avatarX }}
              >
                <motion.div 
                  className="rounded-full border-2 border-white/20 p-1 bg-[#0F1D36]"
                  style={{ width: avatarSize, height: avatarSize }}
                >
                  <div 
                    className="w-full h-full rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-4xl overflow-hidden"
                    style={{ backgroundColor: member.avatarColor }}
                  >
                    {member.image ? (
                      <img src={member.image} alt={member.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <motion.span style={{ fontSize: useTransform(avatarSize, [56, 112], [20, 36]) }}>
                        {initials}
                      </motion.span>
                    )}
                  </div>
                </motion.div>

                {/* Sticky Icons (Repositioned to right of avatar) */}
                <motion.div 
                  className="absolute left-full ml-4 flex items-center gap-3"
                  style={{ opacity: stickyIconsOpacity }}
                >
                  <a href={`tel:${member.phone}`} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Phone size={18} />
                  </a>
                  <a href={`sms:${member.phone}`} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <MessageSquare size={18} />
                  </a>
                  <a href={`mailto:${member.email}`} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Mail size={18} />
                  </a>
                </motion.div>
              </motion.div>

              {/* Name & Title (Fade out on scroll if needed, or keep) */}
              <motion.div 
                className="mt-6 text-center space-y-1"
                style={{ opacity: iconsOpacity, scale: iconsOpacity }}
              >
                <h1 className="text-2xl font-bold tracking-tight">
                  {member.firstName} {member.lastName}
                </h1>
                {member.jobTitle && (
                  <p className="text-sm font-light text-slate-300">
                    {member.jobTitle} {member.company && `at ${member.company}`}
                  </p>
                )}
              </motion.div>

              {/* Large Icons Grid (Original) */}
              <motion.div 
                className="grid grid-cols-4 gap-2 mt-8 w-full max-w-[320px]"
                style={{ opacity: iconsOpacity, display: useTransform(iconsOpacity, (v) => v === 0 ? "none" : "grid") }}
              >
                <div className="flex flex-col items-center gap-2 group">
                  <a href={`tel:${member.phone}`} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0F1D36] shadow-lg transition-all">
                    <Phone size={20} />
                  </a>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Call</span>
                </div>
                <div className="flex flex-col items-center gap-2 group">
                  <a href={`sms:${member.phone}`} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0F1D36] shadow-lg transition-all">
                    <MessageSquare size={20} />
                  </a>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Message</span>
                </div>
                <div className="flex flex-col items-center gap-2 group">
                  <a href={`mailto:${member.email}`} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0F1D36] shadow-lg transition-all">
                    <Mail size={20} />
                  </a>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Email</span>
                </div>
                <div className="flex flex-col items-center gap-2 group">
                  <a href={member.website || "#"} target={member.website ? "_blank" : undefined} rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0F1D36] shadow-lg transition-all">
                    <Globe size={20} />
                  </a>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Site</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Details Section */}
          <div className="bg-white px-8 py-10">
            <div className="space-y-8">
              {member.phone && (
                <div className="border-b border-slate-50 pb-6 last:border-0 last:pb-0 group">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Phone size={12} className="text-indigo-500" /> Phone
                  </p>
                  <p className="text-lg font-semibold text-slate-800">{member.phone}</p>
                </div>
              )}

              {member.email && (
                <div className="border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Mail size={12} className="text-indigo-500" /> Email
                  </p>
                  <p className="text-lg font-semibold text-slate-800 break-all">{member.email}</p>
                </div>
              )}

              {member.address && (
                <div className="border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <MapPin size={12} className="text-indigo-500" /> Address
                  </p>
                  <p className="text-base font-medium text-slate-600 leading-relaxed">
                    {member.address}
                  </p>
                </div>
              )}

              {member.linkedin && (
                <div className="border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Link2 size={12} className="text-indigo-500" /> Professional
                  </p>
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                  >
                    LinkedIn Profile <span className="text-lg">→</span>
                  </a>
                </div>
              )}
            </div>
            
            {/* Logo in details section for branding */}
            <div className="mt-16 flex justify-center opacity-20 grayscale pointer-events-none">
              <img src="/assets/Logo+slogan_Plan de travail 1 copie 2.png" alt="logo" className="h-4" />
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="pt-8 pb-12 text-center text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300">
          Powered by Smart Solutions - P Prime
        </div>
      </div>

      {/* Sticky Call to Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-center pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadVCard}
            className="w-full py-4 bg-[#0F1D36] text-white font-bold rounded-xl shadow-[0_15px_30px_rgba(15,29,54,0.3)] hover:bg-[#1a2d4f] transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
          >
            <Plus size={18} />
            Add Contact
          </motion.button>
        </div>
      </div>
    </div>
  );
}
