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

      <div className="w-full max-w-sm relative z-10">
        {/* Card */}
        <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-zinc-100 italic-shadow">
          {/* Header/Banner Area */}
          <div className="relative pt-12 pb-8 px-8 text-center bg-zinc-900">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
            </div>
            
            <div className="relative inline-block mb-6 pt-2">
              <div 
                className="w-28 h-28 rounded-[2.5rem] border-4 border-white shadow-2xl flex items-center justify-center text-white font-black text-4xl overflow-hidden ring-8 ring-zinc-800"
                style={{ backgroundColor: member.avatarColor }}
              >
                {member.image ? (
                  <img src={member.image} alt={member.firstName} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
                {member.firstName} {member.lastName}
              </h1>
              {member.jobTitle && (
                <p className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em]">
                  {member.jobTitle}
                </p>
              )}
            </div>
          </div>

          <div className="p-8 space-y-4">
            {/* Contact Grid */}
            <div className="space-y-3">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-white hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 bg-white shadow-sm border border-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail size={18} className="text-zinc-900" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-zinc-900 truncate">{member.email}</p>
                  </div>
                </a>
              )}

              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-white hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 bg-white shadow-sm border border-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone size={18} className="text-zinc-900" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Téléphone</p>
                    <p className="text-sm font-bold text-zinc-900 truncate">{member.phone}</p>
                  </div>
                </a>
              )}

              {member.company && (
                <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-transparent">
                  <div className="w-10 h-10 bg-white shadow-sm border border-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} className="text-zinc-900" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Entreprise</p>
                    <p className="text-sm font-bold text-zinc-900 truncate">{member.company}</p>
                  </div>
                </div>
              )}

              {(member.website || member.linkedin || member.address) && (
                <div className="pt-4 space-y-3">
                  {member.website && (
                    <a
                      href={member.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-white hover:shadow-sm transition-all group"
                    >
                      <div className="w-10 h-10 bg-white shadow-sm border border-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Globe size={18} className="text-zinc-900" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Site Web</p>
                        <p className="text-sm font-bold text-zinc-900 truncate">{member.website}</p>
                      </div>
                    </a>
                  )}

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-white hover:shadow-sm transition-all group"
                    >
                      <div className="w-10 h-10 bg-white shadow-sm border border-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Link2 size={18} className="text-zinc-900" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">LinkedIn</p>
                        <p className="text-sm font-bold text-zinc-900 truncate uppercase tracking-tighter">
                          {member.linkedin.split('/').pop()}
                        </p>
                      </div>
                    </a>
                  )}

                  {member.address && (
                    <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-transparent">
                      <div className="w-10 h-10 bg-white shadow-sm border border-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-zinc-900" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Adresse</p>
                        <p className="text-sm font-bold text-zinc-900 leading-tight">{member.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="pt-6">
              <button
                onClick={downloadVCard}
                className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-zinc-900 text-white rounded-[2rem] font-black text-sm hover:bg-zinc-800 shadow-2xl shadow-zinc-200 active:scale-95 transition-all"
              >
                <UserCheck size={20} />
                ENREGISTRER LE CONTACT
              </button>
              <p className="text-center text-[10px] font-bold text-zinc-300 uppercase tracking-widest mt-4">
                Compatible iOS, Android & PC
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 group cursor-default">
          <div className="w-1 h-1 bg-zinc-200 rounded-full group-hover:w-4 transition-all duration-500" />
          <p className="text-[11px] font-black tracking-[0.3em] text-zinc-300 group-hover:text-zinc-600 transition-colors uppercase">
            teamix digital brand
          </p>
          <div className="w-1 h-1 bg-zinc-200 rounded-full group-hover:w-4 transition-all duration-500" />
        </div>
      </div>
    </div>
  );
}
