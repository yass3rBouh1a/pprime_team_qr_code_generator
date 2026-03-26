import { notFound } from "next/navigation";
import { getMember } from "@/lib/storage";
import ContactPage from "@/components/ContactPage";

export default async function Contact({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = getMember(id);
  if (!member) notFound();
  return <ContactPage member={member} />;
}
