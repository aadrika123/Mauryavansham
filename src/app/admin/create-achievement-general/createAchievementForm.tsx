'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Loader from '@/src/components/ui/loader';
import { useToast } from '@/src/components/ui/toastProvider';
import { useRouter } from 'next/navigation';

interface Achievement {
  id?: number;
  name: string;
  fatherName: string;
  motherName: string;
  achievementTitle: string;
  description: string;
  category:
    | 'Healthcare'
    | 'Sports'
    | 'Technology'
    | 'Education'
    | 'Business'
    | 'Arts'
    | 'Central Government'
    | 'PSU'
    | 'State Government'
    | 'Other';
  otherCategory?: string;
  images: string[];
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

export default function CreateAchievementForm({ initialData, onSuccess }: Props) {
  const { addToast } = useToast();
  const router = useRouter();

  // ✅ default form
  const emptyForm: Achievement = {
    name: '',
    fatherName: '',
    motherName: '',
    achievementTitle: '',
    description: '',
    category: 'Education',
    otherCategory: '',
    images: [],
    isVerified: false,
    isFeatured: false,
    isHallOfFame: false,
    year: new Date().getFullYear(),
    location: '',
    keyAchievement: '',
    impact: '',
    achievements: []
  };

  const [form, setForm] = useState<Achievement>(initialData || emptyForm);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null]);
  const [achievementInput, setAchievementInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // ✅ prefill edit data
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setImagePreviews([
        initialData.images?.[0] || null,
        initialData.images?.[1] || null,
        initialData.images?.[2] || null
      ]);
    }
  }, [initialData]);

  // ✅ handle text inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ✅ handle checkbox
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  // ✅ handle images
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...imagePreviews];

    updatedFiles[index] = file;
    updatedPreviews[index] = URL.createObjectURL(file);

    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  // ✅ Add achievement point
  const handleAddAchievement = () => {
    const trimmed = achievementInput.trim();
    if (!trimmed) return;
    setForm(prev => ({
      ...prev,
      achievements: [...prev.achievements, trimmed]
    }));
    setAchievementInput('');
  };

  const removeAchievement = (idx: number) => {
    setForm(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== idx)
    }));
  };

  // ✅ Validation
  const validate = () => {
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = 'Name is required';
    if (!form.fatherName.trim()) err.fatherName = "Father's name is required";
    if (!form.motherName.trim()) err.motherName = "Mother's name is required";
    if (!form.achievementTitle.trim()) err.achievementTitle = 'Achievement Title is required';
    if (!form.description.trim()) err.description = 'Description is required';
    if (!form.location.trim()) err.location = 'Location is required';
    if (!form.keyAchievement.trim()) err.keyAchievement = 'Key Achievement is required';
    if (!form.impact.trim()) err.impact = 'Impact is required';
    if (!form.year) err.year = 'Year is required';
    if (!form.images?.[0] && !imageFiles[0]) err.image1 = 'At least 1 image is mandatory';
    if (form.achievements.length === 0) err.achievements = 'Add at least one achievement point';
    if (form.category === 'Other' && !form.otherCategory?.trim()) err.otherCategory = 'Please specify category';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ upload single image
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/achievement-upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.url;
  };

  // ✅ handle submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      // upload new images if selected
      const uploadedUrls = await Promise.all(
        imageFiles.map(async (file, idx) => {
          if (file) return await uploadFile(file);
          return imagePreviews[idx]; // keep old image if exists
        })
      );

      const payload = {
        ...form,
        images: uploadedUrls.filter((url): url is string => !!url)
      };

      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/achievements/${initialData.id}` : '/api/achievements/general';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        addToast({
          title: 'Success',
          description: initialData ? 'Achievement updated successfully!' : 'Achievement added successfully!',
          variant: 'success'
        });
        router.push('/admin/created-achievement-general');
        onSuccess?.();
      } else {
        addToast({
          title: 'Error',
          description: result.error || 'Something went wrong',
          variant: 'destructive'
        });
      }
    } catch (err) {
      console.error('Error:', err);
      addToast({
        title: 'Error',
        description: 'Submission failed',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      {submitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <Loader />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ✅ Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'name', label: 'Name', required: true },
            { name: 'fatherName', label: "Father's Name", required: true },
            { name: 'motherName', label: "Mother's Name", required: true },
            {
              name: 'achievementTitle',
              label: 'Achievement Title',
              required: true
            }
          ].map(field => (
            <div key={field.name}>
              <label className="block font-medium mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
            </div>
          ))}
        </div>

        {/* ✅ Category */}
        <div>
          <label className="block font-medium mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {[
              'Education',
              'Technology',
              'Healthcare',
              'Business',
              'Sports',
              'Arts',
              'Central Government',
              'PSU',
              'State Government',
              'Other'
            ].map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {form.category === 'Other' && (
            <input
              name="otherCategory"
              placeholder="Specify category"
              value={form.otherCategory}
              onChange={handleChange}
              className="border p-2 rounded mt-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}
        </div>

        {/* ✅ Description */}
        <div>
          <label className="block font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* ✅ Location + Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* ✅ Key Achievement */}
        <div>
          <label className="block font-medium mb-1">
            Key Achievement <span className="text-red-500">*</span>
          </label>
          <input
            name="keyAchievement"
            value={form.keyAchievement}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* ✅ Impact */}
        <div>
          <label className="block font-medium mb-1">
            Impact <span className="text-red-500">*</span>
          </label>
          <textarea
            name="impact"
            value={form.impact}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* ✅ Achievement Points */}
        <div>
          <label className="block font-medium mb-1">
            Achievement Points <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={achievementInput}
              onChange={e => setAchievementInput(e.target.value)}
              placeholder="Add achievement point"
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddAchievement}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>
          <ul className="list-disc ml-5 mt-2">
            {form.achievements.map((a, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{a}</span>
                <button type="button" onClick={() => removeAchievement(i)} className="text-red-500">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Images */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i}>
              <label className="block font-medium mb-1">
                Image {i + 1} {i === 0 && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImageChange(e, i)}
                className="border p-1 rounded w-full"
              />
              {imagePreviews[i] && (
                <img
                  src={imagePreviews[i]!}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-40 object-cover mt-2 rounded-md border"
                />
              )}
            </div>
          ))}
        </div>

        {/* ✅ Flags */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "isVerified", label: "Verified" },
            { name: "isFeatured", label: "Featured" },
            { name: "isHallOfFame", label: "Hall of Fame" },
          ].map((cb) => (
            <label key={cb.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={cb.name}
                checked={(form as any)[cb.name]}
                onChange={handleCheckboxChange}
                className="w-5 h-5 accent-blue-600"
              />
              <span>{cb.label}</span>
            </label>
          ))}
        </div> */}

        {/* ✅ Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            {submitting ? <Loader /> : initialData ? 'Update Achievement' : 'Submit Achievement'}
          </button>
        </div>
      </form>
    </div>
  );
}
