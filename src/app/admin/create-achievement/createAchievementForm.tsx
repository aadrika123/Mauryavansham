"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Loader from "@/src/components/ui/loader";
import { useToast } from "@/src/components/ui/toastProvider";
import { useRouter } from "next/navigation";

interface Achievement {
  id?: number;
  name: string;
  title: string;
  description: string;
  image: string;
  category:
    | "Healthcare"
    | "Sports"
    | "Technology"
    | "Education"
    | "Business"
    | "Arts";
  isVerified: boolean;
  isFeatured: boolean;
  isHallOfFame: boolean;
  year: number;
  location: string;
  keyAchievement: string;
  impact: string;
  achievements: string[];
}

interface Props {
  initialData?: Achievement;
  onSuccess?: () => void;
}

export default function CreateAchievementForm({
  initialData,
  onSuccess,
}: Props) {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState<Achievement>({
    id: initialData?.id,
    name: initialData?.name || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    category: initialData?.category || "Education",
    isVerified: initialData?.isVerified || false,
    isFeatured: initialData?.isFeatured || false,
    isHallOfFame: initialData?.isHallOfFame || false,
    year: initialData?.year || new Date().getFullYear(),
    location: initialData?.location || "",
    keyAchievement: initialData?.keyAchievement || "",
    impact: initialData?.impact || "",
    achievements: initialData?.achievements || [],
  });

  const [achievementInput, setAchievementInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ handle input change
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ✅ handle checkbox/toggle
  function handleCheckbox(e: ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  }

  // ✅ handle image upload
  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  }

  // ✅ add individual achievement point
  function handleAddAchievement() {
    const trimmed = achievementInput.trim();
    if (!trimmed) return;
    setForm((s) => ({
      ...s,
      achievements: [...s.achievements, trimmed],
    }));
    setAchievementInput("");
  }

  // ✅ remove achievement
  function removeAchievement(idx: number) {
    setForm((s) => ({
      ...s,
      achievements: s.achievements.filter((_, i) => i !== idx),
    }));
  }

  // ✅ validation
  function validate() {
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.title.trim()) err.title = "Title is required";
    if (!form.description.trim()) err.description = "Description is required";
    if (!form.location.trim()) err.location = "Location is required";
    if (!form.keyAchievement.trim())
      err.keyAchievement = "Key achievement required";
    if (!form.impact.trim()) err.impact = "Impact field required";
    if (!form.year) err.year = "Year required";
    if (form.achievements.length === 0)
      err.achievements = "Add at least one achievement point";

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  // ✅ upload file to server/cloudinary
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/achievement-upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Image upload failed");
    return data.url; // ✅ matches backend
  };

  // ✅ submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadFile(imageFile);
      }

      const payload = {
        ...form,
        image: imageUrl,
        userId: session?.user?.id || null,
      };

      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `/api/achievements/${initialData.id}`
        : "/api/achievements";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        addToast({
          title: "Success",
          description: initialData
            ? "Achievement updated successfully!"
            : "Achievement added successfully!",
          variant: "success",
        });
        router.push("/admin/created-achievement");
        onSuccess?.();
      } else {
        addToast({
          title: "Error",
          description: result.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      addToast({
        title: "Error",
        description: "Submission failed",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      {submitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <Loader />
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">
        {initialData ? "Edit Achievement" : "Create Achievement"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg p-2"
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg p-2"
            />
            {errors.title && (
              <p className="text-red-600 text-sm">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Year *</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg p-2"
            />
            {errors.year && (
              <p className="text-red-600 text-sm">{errors.year}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Location *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg p-2"
            />
            {errors.location && (
              <p className="text-red-600 text-sm">{errors.location}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-lg p-2"
          >
            {[
              "Healthcare",
              "Sports",
              "Technology",
              "Education",
              "Business",
              "Arts",
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border rounded-lg p-2"
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Key Achievement *</label>
          <input
            name="keyAchievement"
            value={form.keyAchievement}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-lg p-2"
          />
          {errors.keyAchievement && (
            <p className="text-red-600 text-sm">{errors.keyAchievement}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Impact *</label>
          <textarea
            name="impact"
            value={form.impact}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border rounded-lg p-2"
          />
          {errors.impact && (
            <p className="text-red-600 text-sm">{errors.impact}</p>
          )}
        </div>

        {/* Achievements List */}
        <div>
          <label className="block text-sm font-medium">Achievements *</label>
          <div className="flex gap-2 mt-2">
            <input
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              placeholder="Enter achievement point"
              className="flex-1 border rounded-lg p-2"
            />
            <button
              type="button"
              onClick={handleAddAchievement}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              Add
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {form.achievements.map((a, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2"
              >
                {a}
                <button
                  type="button"
                  onClick={() => removeAchievement(i)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          {errors.achievements && (
            <p className="text-red-600 text-sm">{errors.achievements}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium">Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 h-32 w-32 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Toggles */}
        <div className="grid md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isVerified"
              checked={form.isVerified}
              onChange={handleCheckbox}
            />
            Verified
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleCheckbox}
            />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isHallOfFame"
              checked={form.isHallOfFame}
              onChange={handleCheckbox}
            />
            Hall of Fame
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {submitting ? "Submitting..." : "Save Achievement"}
          </button>
        </div>
      </form>
    </div>
  );
}
