"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Download, AlertCircle } from "lucide-react";
import { TeamMember } from "@/lib/types";
import { generateVCard } from "@/lib/vcard";
import { getSettings } from "@/lib/settings";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  member: TeamMember;
  onClose: () => void;
}

export default function QRModal({ member, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(getSettings().baseUrl);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const contactUrl = `${baseUrl}/contact/${member.id}`;
  const vCardData = generateVCard(member);

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
      ctx.drawImage(img, 50, 50, 200, 200);

      if (member.showCornerLogos && member.qrLogo) {
        const logoImg = new Image();
        logoImg.onload = () => {
          const logoSize = 34;
          const drawLogo = (x: number, y: number) => {
            ctx.fillStyle = "#fff";
            ctx.fillRect(x - 3, y - 3, logoSize + 6, logoSize + 6);
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          };
          // Adjust coordinates to match the 200px SVG centered in 300px canvas (padding 50px)
          // Center of finder patterns is at ~33px relative to SVG
          const offset = 33 - (logoSize / 2);
          drawLogo(50 + offset, 50 + offset); // Top Left
          drawLogo(50 + 200 - offset - logoSize, 50 + offset); // Top Right
          drawLogo(50 + offset, 50 + 200 - offset - logoSize); // Bottom Left

          const a = document.createElement("a");
          a.download = `${member.firstName}-${member.lastName}-qr.png`;
          a.href = canvas.toDataURL("image/png");
          a.click();
        };
        logoImg.src = member.qrLogo;
      } else {
        const a = document.createElement("a");
        a.download = `${member.firstName}-${member.lastName}-qr.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgStr)));
  }

  return (
    <AnimatePresence>
      <div
        ref={overlayRef}
        onClick={(e) => e.target === overlayRef.current && onClose()}
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] w-full max-w-sm p-8 relative border border-zinc-100"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all outline-none"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-1">
              {member.firstName} {member.lastName}
            </h2>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">{member.jobTitle}</p>
          </div>

          {!baseUrl && (
            <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                <span className="font-bold">Warning:</span> Base URL is not configured in settings. QR code will use a relative link.
              </p>
            </div>
          )}

          <div className="flex justify-center mb-8">
            <div className="p-5 bg-white border border-zinc-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group">
              <QRCodeSVG
                id="qr-svg"
                value={baseUrl ? contactUrl : vCardData}
                size={200}
                level="H"
                includeMargin={false}
                fgColor="#09090b"
                imageSettings={member.qrLogo ? {
                  src: member.qrLogo,
                  x: undefined,
                  y: undefined,
                  height: 48,
                  width: 48,
                  excavate: true,
                } : undefined}
              />
              {/* Corner Logos Logic (Unchanged) */}
              {member.showCornerLogos && member.qrLogo && (
                <>
                  <div className="absolute top-[36px] left-[36px] w-[34px] h-[34px] bg-white flex items-center justify-center rounded-sm">
                    <img src={member.qrLogo} className="w-[28px] h-[28px] object-contain" alt="" />
                  </div>
                  <div className="absolute top-[36px] right-[36px] w-[34px] h-[34px] bg-white flex items-center justify-center rounded-sm">
                    <img src={member.qrLogo} className="w-[28px] h-[28px] object-contain" alt="" />
                  </div>
                  <div className="absolute bottom-[36px] left-[36px] w-[34px] h-[34px] bg-white flex items-center justify-center rounded-sm">
                    <img src={member.qrLogo} className="w-[28px] h-[28px] object-contain" alt="" />
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-center text-zinc-400 font-medium mb-8 max-w-[200px] mx-auto leading-relaxed">
            {baseUrl 
              ? "Scan to open profile page and save contact."
              : "Scan to save contact info directly."}
          </p>

          <button
            onClick={downloadQR}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 shadow-xl shadow-zinc-200 hover:shadow-zinc-300 transition-all active:scale-[0.98]"
          >
            <Download size={18} />
            Download PNG image
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
