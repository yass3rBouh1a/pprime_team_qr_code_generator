import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MemberForm from "@/components/MemberForm";

export default function AddPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft size={15} />
          Back to team
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Add Team Member</h1>
          <p className="text-sm text-gray-500 mb-6">
            Fill in the contact details. A QR code will be generated automatically.
          </p>
          <MemberForm />
        </div>
      </div>
    </div>
  );
}
