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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Banner */}
          <div
            className="h-24 w-full"
            style={{
              background: `linear-gradient(135deg, ${member.avatarColor}cc, ${member.avatarColor})`,
            }}
          />

          {/* Avatar */}
          <div className="px-6 pb-6">
            <div className="-mt-10 mb-4 flex justify-between items-end">
              <div
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-2xl"
                style={{ backgroundColor: member.avatarColor }}
              >
                {initials}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              {member.firstName} {member.lastName}
            </h1>
            {member.jobTitle && (
              <p className="text-sm font-medium text-indigo-600 mt-0.5">{member.jobTitle}</p>
            )}
            {member.company && (
              <p className="text-sm text-gray-500 mt-0.5">{member.company}</p>
            )}

            {/* Contact rows */}
            <div className="mt-5 space-y-3">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                    <Mail size={16} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{member.email}</p>
                  </div>
                </a>
              )}

              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                    <Phone size={16} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{member.phone}</p>
                  </div>
                </a>
              )}

              {member.company && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 size={16} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Company</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{member.company}</p>
                  </div>
                </div>
              )}

              {member.website && (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                    <Globe size={16} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Website</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{member.website}</p>
                  </div>
                </a>
              )}

              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                    <Link2 size={16} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">LinkedIn</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {member.linkedin.replace("https://linkedin.com/in/", "@")}
                    </p>
                  </div>
                </a>
              )}

              {member.address && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Address</p>
                    <p className="text-sm font-medium text-gray-800">{member.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Add to contacts CTA */}
            <button
              onClick={downloadVCard}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-indigo-600 text-white rounded-2xl font-semibold text-sm hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
            >
              <UserCheck size={18} />
              Add to Contacts
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              Downloads a .vcf file — works on iPhone, Android & desktop
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by <span className="font-semibold text-indigo-500">teamix</span>
        </p>
      </div>
    </div>
  );
}
