"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TeamMember } from "@/lib/types";

type FormData = Omit<TeamMember, "id" | "avatarColor" | "createdAt">;

interface Props {
  initial?: Partial<FormData>;
  memberId?: string;
}

export default function MemberForm({ initial, memberId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    jobTitle: initial?.jobTitle ?? "",
    company: initial?.company ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    website: initial?.website ?? "",
    linkedin: initial?.linkedin ?? "",
    address: initial?.address ?? "",
    notes: initial?.notes ?? "",
  });

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = memberId ? `/api/members/${memberId}` : "/api/members";
      const method = memberId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const Field = ({
    label,
    field,
    type = "text",
    placeholder = "",
    required = false,
  }: {
    label: string;
    field: keyof FormData;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={form[field] as string}
        onChange={(e) => set(field, e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" field="firstName" required placeholder="John" />
        <Field label="Last Name" field="lastName" required placeholder="Doe" />
      </div>
      <Field label="Job Title" field="jobTitle" placeholder="Software Engineer" />
      <Field label="Company" field="company" placeholder="Acme Corp" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email" field="email" type="email" placeholder="john@acme.com" />
        <Field label="Phone" field="phone" type="tel" placeholder="+1 555 000 0000" />
      </div>
      <Field label="Website" field="website" type="url" placeholder="https://johndoe.com" />
      <Field label="LinkedIn" field="linkedin" placeholder="https://linkedin.com/in/johndoe" />
      <Field label="Address" field="address" placeholder="123 Main St, New York, NY" />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={form.notes as string}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Additional information..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Saving…" : memberId ? "Update Member" : "Add Member"}
        </button>
      </div>
    </form>
  );
}
