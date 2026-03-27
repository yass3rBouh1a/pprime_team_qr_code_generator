"use client";

import { Mail, Phone, Globe, Link2, MapPin, Building2, UserCheck, MessageSquare } from "lucide-react";
import { TeamMember } from "@/lib/types";
import { generateVCard } from "@/lib/vcard";

interface Props {
  member: TeamMember;
}

export default function ContactPage({ member }: Props) {
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
    <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-zinc-900 -skew-y-6 -translate-y-1/2" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 -left-24 w-64 h-64 bg-zinc-100 rounded-full blur-3xl opacity-50" />

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-white overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500">
          {/* Dark Header Section (Jason Watson Style) */}
          <div className="bg-[#0F1D36] pt-12 pb-10 px-6 text-center text-white">
            <div className="relative inline-block mb-6">
              <div className="w-28 h-28 rounded-full border-2 border-white/20 p-1">
                <div 
                  className="w-full h-full rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-bold text-4xl overflow-hidden"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {member.image ? (
                    <img src={member.image} alt={member.firstName} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {member.firstName} {member.lastName}
              </h1>
              {member.jobTitle && (
                <p className="text-sm font-light text-slate-300">
                  {member.jobTitle} {member.company && `at ${member.company}`}
                </p>
              )}
            </div>

            {/* Quick Action Icons */}
            <div className="grid grid-cols-4 gap-2 mt-10 max-w-[320px] mx-auto">
              <div className="flex flex-col items-center gap-2 group">
                <a
                  href={`tel:${member.phone}`}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0F1D36] shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <Phone size={20} />
                </a>
                <span className="text-[10px] font-medium text-slate-400">Call</span>
              </div>

              <div className="flex flex-col items-center gap-2 group">
                <a
                  href={`sms:${member.phone}`}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0F1D36] shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <MessageSquare size={20} />
                </a>
                <span className="text-[10px] font-medium text-slate-400">Message</span>
              </div>

              <div className="flex flex-col items-center gap-2 group">
                <a
                  href={`mailto:${member.email}`}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0F1D36] shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <Mail size={20} />
                </a>
                <span className="text-[10px] font-medium text-slate-400">Email</span>
              </div>

              <div className="flex flex-col items-center gap-2 group">
                <a
                  href={member.website || "#"}
                  target={member.website ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0F1D36] shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <Globe size={20} />
                </a>
                <span className="text-[10px] font-medium text-slate-400">Website</span>
              </div>
            </div>
          </div>

          {/* Details Section (White List Style) */}
          <div className="bg-white px-8 py-6">
            <div className="space-y-6">
              {member.phone && (
                <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Contact (work)</p>
                  <p className="text-base font-medium text-slate-900">{member.phone}</p>
                </div>
              )}

              {member.email && (
                <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-base font-medium text-slate-900 break-all">{member.email}</p>
                </div>
              )}

              {member.address && (
                <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {member.address}
                  </p>
                </div>
              )}

              {member.linkedin && (
                <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">LinkedIn</p>
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    View professional profile
                  </a>
                </div>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 mb-4">
              <button
                onClick={downloadVCard}
                className="w-full py-4 bg-[#0F1D36] text-white font-semibold rounded-lg shadow-xl shadow-slate-200 hover:bg-[#1a2d4f] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-8 text-center text-[8px] uppercase tracking-[0.2em] font-medium text-slate-400">
          Powered by Smart Solutions - P Prime
        </div>
      </div>
    </div>
  );
}
