"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/src/components/ui/toastProvider";

export default function HeritageFormPage() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("id");
  const { addToast } = useToast();

  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    badge: "",
    imageUrl: "",
    order: 0,
    isActive: true,
  });

  // 🔹 Load existing heritage data if editing
  useEffect(() => {
    if (editId) {
      fetch(`/api/heritage/${editId}`)
        .then((res) => res.json())
        .then((data) => setFormData(data));
    }
  }, [editId]);

  // 🔹 Handle normal input change
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Handle Cloudinary Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image (JPG, PNG, WEBP, or GIF).");
      return;
    }
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload-heritage", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const result = await response.json();
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
        // alert("Image uploaded successfully!");
        addToast({
            title: "Success",
            description: "Image uploaded successfully!",
        })
      } else {
        const error = await response.json();
        // alert(error.error || "Upload failed");
        addToast({
            title: "Error",
            description: error.error || "Upload failed",
            variant: "destructive",
        })
      }
    } catch {
    //   alert("Error uploading image.");
        addToast({
            title: "Error",
            description: "Error uploading image.",
            variant: "destructive",
        })
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Submit create/update form
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/heritage/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, id: editId }),
    });
    const result = await res.json();
    // alert(result.message);
    // if (result.success) router.push("/admin/heritage/list");
    addToast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "success" : "destructive",
    })
    if (result.success) router.push("/admin/createHeritage/list");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-red-700 mb-6">
        {editId ? "Edit Heritage" : "Create Heritage"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border w-full p-2 rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border w-full p-2 rounded-md"
            rows={4}
            required
          />
        </div>

        {/* Badge & Order */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Badge</label>
            <input
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              className="border w-full p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="border w-full p-2 rounded-md"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1 font-semibold">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}

          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-48 h-32 object-cover rounded-md mt-2 border"
            />
          )}
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label>Active</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          disabled={uploading}
        >
          {uploading
            ? "Please wait..."
            : editId
            ? "Update Heritage"
            : "Create Heritage"}
        </button>
      </form>
    </div>
  );
}
