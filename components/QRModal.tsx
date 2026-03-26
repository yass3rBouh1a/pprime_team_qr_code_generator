"use client";

import { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Download } from "lucide-react";
import { TeamMember } from "@/lib/types";

interface Props {
  member: TeamMember;
  onClose: () => void;
}

export default function QRModal({ member, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const contactUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/contact/${member.id}`
      : `/contact/${member.id}`;

  function downloadQR() {
    const svg = document.getElementById("qr-svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      const a = document.createElement("a");
      a.download = `${member.firstName}-${member.lastName}-qr.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgStr)));
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-1 pr-6">
          {member.firstName} {member.lastName}
        </h2>
        <p className="text-sm text-gray-500 mb-5">{member.jobTitle}</p>

        <div className="flex justify-center mb-5">
          <div className="p-3 bg-white border-2 border-gray-100 rounded-xl shadow-inner">
            <QRCodeSVG
              id="qr-svg"
              value={contactUrl}
              size={200}
              level="H"
              includeMargin={false}
              fgColor="#1e1b4b"
            />
          </div>
        </div>

        <p className="text-xs text-center text-gray-400 mb-5">
          Scan to view contact & save to phone
        </p>

        <button
          onClick={downloadQR}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Download size={16} />
          Download QR Code
        </button>
      </div>
    </div>
  );
}
