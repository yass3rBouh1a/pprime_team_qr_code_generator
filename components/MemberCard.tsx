"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Pencil, Trash2, Mail, Phone, Building2 } from "lucide-react";
import { TeamMember } from "@/lib/types";
import QRModal from "./QRModal";

interface Props {
  member: TeamMember;
  onDeleted: (id: string) => void;
}

export default function MemberCard({ member, onDeleted }: Props) {
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Remove ${member.firstName} ${member.lastName}?`)) return;
    setDeleting(true);
    await fetch(`/api/members/${member.id}`, { method: "DELETE" });
    onDeleted(member.id);
  }

  const initials = `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: member.avatarColor }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {member.firstName} {member.lastName}
            </h3>
            {member.jobTitle && (
              <p className="text-sm text-indigo-600 truncate">{member.jobTitle}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5 text-sm text-gray-500">
          {member.company && (
            <div className="flex items-center gap-2 truncate">
              <Building2 size={13} className="flex-shrink-0 text-gray-400" />
              <span className="truncate">{member.company}</span>
            </div>
          )}
          {member.email && (
            <div className="flex items-center gap-2 truncate">
              <Mail size={13} className="flex-shrink-0 text-gray-400" />
              <span className="truncate">{member.email}</span>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center gap-2 truncate">
              <Phone size={13} className="flex-shrink-0 text-gray-400" />
              <span className="truncate">{member.phone}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setShowQR(true)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
          >
            <QrCode size={14} />
            QR Code
          </button>
          <button
            onClick={() => router.push(`/edit/${member.id}`)}
            className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-2 border border-red-100 text-red-400 rounded-lg text-xs hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {showQR && <QRModal member={member} onClose={() => setShowQR(false)} />}
    </>
  );
}
