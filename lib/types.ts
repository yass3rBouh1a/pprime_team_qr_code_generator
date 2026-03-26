export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  linkedin?: string;
  address?: string;
  notes?: string;
  avatarColor: string;
  image?: string; // Base64
  qrLogo?: string; // Base64
  showCornerLogos?: boolean;
  createdAt: string;
}
