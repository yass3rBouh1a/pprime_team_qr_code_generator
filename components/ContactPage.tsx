"use client";

import { Mail, Phone, Globe, Link2, MapPin, Building2, UserCheck } from "lucide-react";
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

      <div className="w-full max-w-lg relative z-10 px-4">
        {/* Card */}
        <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden border border-zinc-100 italic-shadow">
          {/* Header/Banner Area */}
          <div className="relative pt-16 pb-10 px-10 text-center bg-zinc-900 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>
            
            <div className="relative inline-block mb-8">
              <div 
                className="w-36 h-36 rounded-[3rem] border-8 border-white shadow-2xl flex items-center justify-center text-white font-black text-5xl overflow-hidden ring-[12px] ring-zinc-800"
                style={{ backgroundColor: member.avatarColor }}
              >
                {member.image ? (
                  <img src={member.image} alt={member.firstName} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
                {member.firstName} {member.lastName}
              </h1>
              {member.jobTitle && (
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.3em]">
                  {member.jobTitle}
                </p>
              )}
            </div>
          </div>

          <div className="p-10 space-y-5">
            {/* Contact Grid */}
            <div className="space-y-4">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-5 p-5 bg-zinc-50 rounded-[2rem] border border-transparent hover:border-zinc-100 hover:bg-white hover:shadow-xl hover:shadow-zinc-100 transition-all group"
                >
                  <div className="w-12 h-12 bg-white shadow-sm border border-zinc-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail size={20} className="text-zinc-900" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Email Professionnel</p>
                    <p className="text-base font-bold text-zinc-900 truncate">{member.email}</p>
                  </div>
                </a>
              )}

              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-5 p-5 bg-zinc-50 rounded-[2rem] border border-transparent hover:border-zinc-100 hover:bg-white hover:shadow-xl hover:shadow-zinc-100 transition-all group"
                >
                  <div className="w-12 h-12 bg-white shadow-sm border border-zinc-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone size={20} className="text-zinc-900" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Ligne Directe</p>
                    <p className="text-base font-bold text-zinc-900 truncate">{member.phone}</p>
                  </div>
                </a>
              )}

              {member.company && (
                <div className="flex items-center gap-5 p-5 bg-zinc-50 rounded-[2rem] border border-transparent">
                  <div className="w-12 h-12 bg-white shadow-sm border border-zinc-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Building2 size={20} className="text-zinc-900" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Entreprise</p>
                    <p className="text-base font-bold text-zinc-900 truncate">{member.company}</p>
                  </div>
                </div>
              )}

              {(member.website || member.linkedin || member.address) && (
                <div className="pt-6 space-y-4">
                  {member.website && (
                    <a
                      href={member.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-5 p-5 bg-zinc-50 rounded-[2rem] border border-transparent hover:border-zinc-100 hover:bg-white hover:shadow-xl hover:shadow-zinc-100 transition-all group"
                    >
                      <div className="w-12 h-12 bg-white shadow-sm border border-zinc-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Globe size={20} className="text-zinc-900" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Portail Web</p>
                        <p className="text-base font-bold text-zinc-900 truncate">{member.website}</p>
                      </div>
                    </a>
                  )}

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-5 p-5 bg-zinc-50 rounded-[2rem] border border-transparent hover:border-zinc-100 hover:bg-white hover:shadow-xl hover:shadow-zinc-100 transition-all group"
                    >
                      <div className="w-12 h-12 bg-white shadow-sm border border-zinc-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Link2 size={20} className="text-zinc-900" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Réseau LinkedIn</p>
                        <p className="text-base font-bold text-zinc-900 truncate">
                          Voir le profil
                        </p>
                      </div>
                    </a>
                  )}

                  {member.address && (
                    <div className="flex items-center gap-5 p-5 bg-zinc-50 rounded-[2rem] border border-transparent">
                      <div className="w-12 h-12 bg-white shadow-sm border border-zinc-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} className="text-zinc-900" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Localisation</p>
                        <p className="text-sm font-bold text-zinc-900 leading-relaxed font-sans">{member.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="pt-8">
              <button
                onClick={downloadVCard}
                className="w-full flex items-center justify-center gap-4 px-8 py-6 bg-zinc-900 text-white rounded-[2.5rem] font-black text-sm tracking-widest uppercase hover:bg-zinc-800 shadow-2xl shadow-zinc-200 active:scale-95 transition-all"
              >
                <UserCheck size={22} />
                Enregistrer la fiche
              </button>
              <div className="flex items-center justify-center gap-2 mt-6">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  Fiche certifiée par Teamix
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 group cursor-default">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full group-hover:w-6 transition-all duration-700" />
            <p className="text-[11px] font-black tracking-[0.4em] text-zinc-300 group-hover:text-zinc-900 transition-colors uppercase">
              pprime smart solutions
            </p>
            <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full group-hover:w-6 transition-all duration-700" />
          </div>
          <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">Digital Ecosystem V4.0</p>
        </div>
      </div>
    </div>
  );
}
