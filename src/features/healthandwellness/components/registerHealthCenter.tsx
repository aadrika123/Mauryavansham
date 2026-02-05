'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Loader from '@/src/components/ui/loader';

interface Branch {
  name: string;
  address: string;
  phone: string;
}

interface FormDataState {
  centerName: string;
  category: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  offeringsInput: string;
  offerings: string[];
  branches: Branch[];
  about: string;
}

export default function RegisterHealthService() {
  const { data: session } = useSession();

  const [form, setForm] = useState<FormDataState>({
    centerName: '',
    category: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    offeringsInput: '',
    offerings: [],
    branches: [{ name: '', address: '', phone: '' }],
    about: ''
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [docs, setDocs] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const states = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];

  const categories = [
    'Clinic',
    'Hospital',
    'Gym',
    'Yoga Center',
    'Nutrition',
    'Spa',
    'Physiotherapy',
    'Meditation Center',
    'Other'
  ];

  // Generic field change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Numeric-only input
  const handleNumericChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setForm(s => ({ ...s, [name]: value }));
    }
  };

  // Offerings (services/activities)
  const addOffering = () => {
    const trimmed = form.offeringsInput.trim();
    if (!trimmed) return;
    setForm(s => ({
      ...s,
      offerings: [...s.offerings, trimmed],
      offeringsInput: ''
    }));
  };

  const removeOffering = (i: number) => {
    setForm(s => ({ ...s, offerings: s.offerings.filter((_, idx) => idx !== i) }));
  };

  // Branches
  const updateBranch = (i: number, field: keyof Branch, value: string) => {
    const updated = [...form.branches];
    updated[i] = { ...updated[i], [field]: value };
    setForm(s => ({ ...s, branches: updated }));
  };

  const addBranch = () =>
    setForm(s => ({
      ...s,
      branches: [...s.branches, { name: '', address: '', phone: '' }]
    }));

  const removeBranch = (i: number) =>
    setForm(s => ({
      ...s,
      branches: s.branches.filter((_, idx) => idx !== i)
    }));

  // File inputs
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  };

  const handleDocsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocs(d => [...d, ...files]);
  };

  const removeDoc = (i: number) => {
    setDocs(d => d.filter((_, idx) => idx !== i));
  };

  // Validation
  const validate = () => {
    const err: Record<string, string> = {};
    if (!form.centerName) err.centerName = 'Center name required';
    if (!form.category) err.category = 'Category required';
    if (!form.ownerName) err.ownerName = 'Owner name required';
    if (!form.phone) err.phone = 'Phone required';
    else if (!/^\d{10}$/.test(form.phone)) err.phone = 'Phone must be 10 digits';
    if (!form.city) err.city = 'City required';
    if (!form.state) err.state = 'State required';
    if (!form.pincode) err.pincode = 'Pincode required';
    else if (!/^\d{6}$/.test(form.pincode)) err.pincode = 'Pincode must be 6 digits';
    if (form.offerings.length === 0) err.offerings = 'Add at least one offering/service';
    if (!form.about) err.about = 'About section required';
    if (docs.length === 0) err.docs = 'Upload at least one document';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Upload helper
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/health-docs', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const result = await res.json();
    return result.imageUrl;
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      let logoUrl = null;
      if (logoFile) logoUrl = await uploadFile(logoFile);
      const docUrls = await Promise.all(docs.map(uploadFile));

      const payload = {
        ...form,
        logoUrl,
        docUrls,
        userId: session?.user?.id || null
      };

      const res = await fetch('/api/health-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Health & Wellness Center Registered!');
        setForm({
          centerName: '',
          category: '',
          ownerName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          offeringsInput: '',
          offerings: [],
          branches: [{ name: '', address: '', phone: '' }],
          about: ''
        });
        setLogoFile(null);
        setLogoPreview(null);
        setDocs([]);
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
      {submitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <Loader />
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Register Health & Wellness Center</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Center Name *</label>
            <input
              name="centerName"
              value={form.centerName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            {errors.centerName && <p className="text-red-600 text-sm">{errors.centerName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded w-full">
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Owner / Contact Person *</label>
            <input
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            {errors.ownerName && <p className="text-red-600 text-sm">{errors.ownerName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleNumericChange}
              className="border p-2 rounded w-full"
              maxLength={10}
            />
            {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium">Address *</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            rows={2}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select name="state" value={form.state} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select State</option>
            {states.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleNumericChange}
            className="border p-2 rounded"
            maxLength={6}
          />
        </div>

        {/* Offerings */}
        <div>
          <label className="block text-sm font-medium">Services / Offerings *</label>
          <div className="flex gap-2 mt-1">
            <input
              value={form.offeringsInput}
              onChange={e => setForm(s => ({ ...s, offeringsInput: e.target.value }))}
              className="border p-2 rounded flex-1"
              placeholder="e.g. Yoga, Gym Training, Physiotherapy"
            />
            <button type="button" onClick={addOffering} className="bg-blue-600 text-white px-3 py-1 rounded">
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.offerings.map((s, i) => (
              <span key={i} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                {s}
                <button type="button" onClick={() => removeOffering(i)} className="text-red-500">
                  ✕
                </button>
              </span>
            ))}
          </div>
          {errors.offerings && <p className="text-red-600 text-sm">{errors.offerings}</p>}
        </div>

        {/* Branches */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Branches</label>
            <button type="button" className="text-blue-600 text-sm" onClick={addBranch}>
              + Add Branch
            </button>
          </div>

          {form.branches.map((b, i) => (
            <div key={i} className="border rounded p-3 mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Branch #{i + 1}</span>
                {form.branches.length > 1 && (
                  <button type="button" className="text-red-600 text-sm" onClick={() => removeBranch(i)}>
                    Remove
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                <input
                  placeholder="Branch name"
                  value={b.name}
                  onChange={e => updateBranch(i, 'name', e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  placeholder="Branch address"
                  value={b.address}
                  onChange={e => updateBranch(i, 'address', e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  placeholder="Branch phone"
                  value={b.phone}
                  onChange={e => updateBranch(i, 'phone', e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
            </div>
          ))}
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium">About *</label>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={3}
            className="border p-2 rounded w-full"
          />
          {errors.about && <p className="text-red-600 text-sm">{errors.about}</p>}
        </div>

        {/* Logo and Docs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoChange} className="mt-1" />
            {logoPreview && <img src={logoPreview} className="mt-2 w-24 h-24 rounded object-cover" />}
          </div>
          <div>
            <label className="block text-sm font-medium">Documents *</label>
            <input type="file" multiple onChange={handleDocsChange} className="mt-1" />
            <div className="mt-2 space-y-1">
              {docs.map((d, i) => (
                <div key={i} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                  <span>{d.name}</span>
                  <button type="button" onClick={() => removeDoc(i)} className="text-red-500">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {errors.docs && <p className="text-red-600 text-sm">{errors.docs}</p>}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-4">
          <button type="submit" disabled={submitting} className="bg-green-600 text-white px-4 py-2 rounded">
            {submitting ? 'Submitting...' : 'Register Center'}
          </button>
        </div>
      </form>
    </div>
  );
}
