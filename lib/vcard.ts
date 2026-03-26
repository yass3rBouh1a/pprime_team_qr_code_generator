import { TeamMember } from "./types";

export function generateVCard(member: TeamMember): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${member.lastName};${member.firstName};;;`,
    `FN:${member.firstName} ${member.lastName}`,
    member.jobTitle ? `TITLE:${member.jobTitle}` : null,
    member.company ? `ORG:${member.company}` : null,
    member.email ? `EMAIL;TYPE=WORK:${member.email}` : null,
    member.phone ? `TEL;TYPE=WORK:${member.phone}` : null,
    member.website ? `URL:${member.website}` : null,
    member.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${member.linkedin}` : null,
    member.address ? `ADR;TYPE=WORK:;;${member.address};;;;` : null,
    member.notes ? `NOTE:${member.notes}` : null,
    "END:VCARD",
  ];
  return lines.filter(Boolean).join("\r\n");
}

export function vCardDataUrl(member: TeamMember): string {
  const vcf = generateVCard(member);
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(vcf)}`;
}
