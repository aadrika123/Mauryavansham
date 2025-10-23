"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Loader from "@/src/components/ui/loader";

interface Branch {
  name: string;
  address: string;
  phone: string;
}

interface FormDataState {
  centerName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coursesInput: string;
  courses: string[];
  branches: Branch[];
  about: string;
}

interface Message {
  type: "success" | "error";
  text: string;
}
interface CoachingFormProps {
  initialData?: FormDataState & {
    logoUrl?: string;
    docUrls?: string[];
    id?: number;
  };
  onSuccess?: () => void; // callback after submit
}

export default function CoachingExperienceCenterRegistration({
  initialData,
  onSuccess,
}: CoachingFormProps) {
  const { data: session } = useSession();

  const [form, setForm] = useState<FormDataState>({
    centerName: initialData?.centerName || "",
    ownerName: initialData?.ownerName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    coursesInput: "",
    courses: initialData?.courses || [],
    branches: initialData?.branches || [{ name: "", address: "", phone: "" }],
    about: initialData?.about || "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logoUrl || null
  );

  const [docs, setDocs] = useState<File[]>([]); // new files
  const [existingDocs, setExistingDocs] = useState<string[]>(
    initialData?.docUrls || []
  );

  const [logoFile, setLogoFile] = useState<File | null>(null);
  // const [logoPreview, setLogoPreview] = useState<string | null>(null);
  // const [docs, setDocs] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<Message | null>(null);

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleCourseAdd() {
    const trimmed = form.coursesInput.trim();
    if (!trimmed) return;
    setForm((s) => ({
      ...s,
      courses: [...s.courses, trimmed],
      coursesInput: "",
    }));
  }

  function removeCourse(idx: number) {
    setForm((s) => ({ ...s, courses: s.courses.filter((_, i) => i !== idx) }));
  }

  // ✅ Restrict numeric-only inputs
  function handleNumericChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setForm((s) => ({ ...s, [name]: value }));
    }
  }

  function updateBranch(idx: number, field: keyof Branch, value: string) {
    const newBranches = [...form.branches];
    newBranches[idx] = { ...newBranches[idx], [field]: value };
    setForm((s) => ({ ...s, branches: newBranches }));
  }

  function addBranch() {
    setForm((s) => ({
      ...s,
      branches: [...s.branches, { name: "", address: "", phone: "" }],
    }));
  }

  function removeBranch(idx: number) {
    setForm((s) => ({
      ...s,
      branches: s.branches.filter((_, i) => i !== idx),
    }));
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  }

  function handleDocsChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setDocs((d) => [...d, ...files]);
  }

  function removeDoc(idx: number) {
    setDocs((d) => d.filter((_, i) => i !== idx));
  }

  // ✅ Validation function
  function validate() {
    const err: Record<string, string> = {};
    if (!form.centerName.trim()) err.centerName = "Center name required";
    if (!form.ownerName.trim()) err.ownerName = "Owner name required";
    if (!form.email.trim()) err.email = "Email required";
    if (!form.phone.trim()) err.phone = "Phone required";
    else if (!/^\d{10}$/.test(form.phone))
      err.phone = "Phone must be 10 digits";

    if (!form.address.trim()) err.address = "Address required";
    if (!form.city.trim()) err.city = "City required";
    if (!form.state.trim()) err.state = "State required";

    if (!form.pincode.trim()) err.pincode = "Pincode required";
    else if (!/^\d{6}$/.test(form.pincode))
      err.pincode = "Pincode must be 6 digits";

    if (form.courses.length === 0)
      err.courses = "Add at least one course/service";

    if (
      form.branches.some(
        (b) => !b.name.trim() || !b.address.trim() || !b.phone.trim()
      )
    ) {
      err.branches = "All branch fields are required";
    }
    if (!form.about.trim()) err.about = "About section cannot be empty";

    if (docs.length === 0) err.docs = "Upload at least one document";

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  // ✅ Upload file to Cloudinary via your API route
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/coaching-docs", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const result = await res.json();
    return result.imageUrl;
  };

  // ✅ Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      let logoUrl = logoPreview;
      if (logoFile) {
        logoUrl = await uploadFile(logoFile);
      }

      const newDocUrls =
        docs.length > 0 ? await Promise.all(docs.map(uploadFile)) : [];
      const allDocUrls = [...existingDocs, ...newDocUrls];

      const payload = {
        ...form,
        logoUrl,
        docUrls: allDocUrls,
        userId: session?.user?.id || null,
      };

      const url = initialData
        ? `/api/coaching-centers/${initialData.id}`
        : "/api/coaching-centers";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          initialData ? "Updated successfully!" : "Registration successful!"
        );
        onSuccess?.();
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      {submitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <Loader /> {/* ✅ Center loader overlay */}
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">
        Register Coaching / Experience Center
      </h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Center Name *</label>
            <input
              name="centerName"
              value={form.centerName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border p-2"
            />
            {errors.centerName && (
              <p className="text-sm text-red-600">{errors.centerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Owner / Contact Person *
            </label>
            <input
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border p-2"
            />
            {errors.ownerName && (
              <p className="text-sm text-red-600">{errors.ownerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border p-2"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Phone *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleNumericChange}
              className="mt-1 block w-full rounded-lg border p-2"
              maxLength={10}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full rounded-lg border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">State</label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border p-2"
              required
            >
              <option value="">Select State</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Pincode *</label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleNumericChange}
              className="mt-1 block w-full rounded-lg border p-2"
              maxLength={6}
            />
            {errors.pincode && (
              <p className="text-sm text-red-600">{errors.pincode}</p>
            )}
          </div>
        </div>

        {/* Courses input */}
        <div>
          <label className="block text-sm font-medium">
            Courses / Services (add one by one)
          </label>
          <div className="flex gap-2 mt-2">
            <input
              value={form.coursesInput}
              onChange={(e) =>
                setForm((s) => ({ ...s, coursesInput: e.target.value }))
              }
              className="flex-1 rounded-lg border p-2"
              placeholder="e.g. Spoken English"
            />
            <button
              type="button"
              onClick={handleCourseAdd}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Add
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {form.courses.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100"
              >
                {c}
                <button
                  type="button"
                  onClick={() => removeCourse(i)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Branches */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Branches</label>
            <button
              type="button"
              className="text-sm text-blue-600"
              onClick={addBranch}
            >
              + Add branch
            </button>
          </div>

          <div className="mt-2 space-y-3">
            {form.branches.map((b, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Branch #{idx + 1}</div>
                  {form.branches.length > 1 && (
                    <button
                      type="button"
                      className="text-red-600 text-sm"
                      onClick={() => removeBranch(idx)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    placeholder="Branch name"
                    value={b.name}
                    onChange={(e) => updateBranch(idx, "name", e.target.value)}
                    className="p-2 rounded border"
                  />
                  <input
                    placeholder="Branch address"
                    value={b.address}
                    onChange={(e) =>
                      updateBranch(idx, "address", e.target.value)
                    }
                    className="p-2 rounded border"
                  />
                  <input
                    placeholder="Branch phone"
                    value={b.phone}
                    onChange={(e) => updateBranch(idx, "phone", e.target.value)}
                    className="p-2 rounded border"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">About Center *</label>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-lg border p-2"
            placeholder="Describe your coaching/experience center..."
          />
          {errors.about && (
            <p className="text-sm text-red-600">{errors.about}</p>
          )}
        </div>

        {/* 🔹 Logo and Documents */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-2"
            />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="logo"
                className="mt-2 h-24 w-24 object-cover rounded"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Documents (IDs, Licenses)
            </label>
            <input
              type="file"
              multiple
              onChange={handleDocsChange}
              className="mt-2"
            />
            <div className="mt-2 space-y-1">
              {docs.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <div className="text-sm">{f.name}</div>
                  <button
                    type="button"
                    onClick={() => removeDoc(i)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-1">
          {existingDocs.map((url, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <a
                href={url}
                target="_blank"
                className="text-sm text-blue-600 underline"
              >{`Document ${i + 1}`}</a>
              <button
                type="button"
                onClick={() =>
                  setExistingDocs((d) => d.filter((_, idx) => idx !== i))
                }
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            {submitting ? "Submitting..." : "Register Center"}
          </button>
        </div>
      </form>
    </div>
  );
}
