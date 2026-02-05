'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/src/components/ui/toastProvider';
import { useRouter } from 'next/navigation';

interface PremiumFeature {
  product: number;
  office: number;
  notifications: string[];
}

interface PremiumFeatures {
  [key: string]: PremiumFeature;
}

interface Partner {
  name: string;
}

interface Category {
  main: string;
  sub: string;
}

interface BranchOffice {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Photo {
  file: File;
  preview: string;
  url: string;
}

interface FormData {
  organizationName: string;
  organizationType: string;
  businessCategory: string;
  businessDescription: string;
  partners: Partner[];
  categories: Category[];
  companyWebsite: string;
  officialEmail: string;
  officialContactNumber: string;
  registeredAddress: {
    office: string;
    branch: string;
    location: string;
    branchOffices: BranchOffice[];
  };
  cin: string;
  gst: string;
  udyam: string;
  photos: {
    product: Photo[];
    office: Photo[];
  };
  premiumCategory: string;
  dateOfestablishment: string;
}

interface Errors {
  [key: string]: string;
}

const premiumFeatures: PremiumFeatures = {
  Platinum: {
    product: 3,
    office: 2,
    notifications: ['WhatsApp', 'Email', 'In-App', 'SMS']
  },
  Gold: { product: 2, office: 2, notifications: ['Email', 'In-App', 'SMS'] },
  Silver: { product: 2, office: 1, notifications: ['Email', 'In-App'] },
  General: { product: 1, office: 1, notifications: ['Email'] }
};

export default function BusinessRegistrationForm() {
  const [loading, setLoading] = useState({ upload: false, submit: false });
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const { addToast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    organizationName: '',
    organizationType: '',
    businessCategory: '',
    businessDescription: '',
    partners: [{ name: '' }],
    categories: [{ main: '', sub: '' }],
    companyWebsite: '',
    officialEmail: '',
    officialContactNumber: '',
    registeredAddress: {
      office: '',
      branch: '',
      location: '',
      branchOffices: []
    },
    cin: '',
    gst: '',
    udyam: '',
    photos: {
      product: [],
      office: []
    },
    premiumCategory: 'General',
    dateOfestablishment: ''
  });

  const organizationTypes = [
    'Proprietorship',
    'Partnership',
    'Limited Liability Partnership (LLP)',
    'Private Limited',
    'Private Limited (One Person)',
    'Public Limited'
  ];

  const businessCategories = ['Dealer/Distributor', 'Manufacturing', 'Retail', 'Service'];

  const mainCategories = [
    'Agriculture',
    'Apparel & Fashion',
    'Chemicals',
    'Construction & Real Estate',
    'Consulting',
    'Education',
    'Electronics & Electrical',
    'Gifts & Crafts',
    'Health & Beauty',
    'Home Supplies',
    'Hospital & Medical',
    'Industrial Supplies',
    'IT/ITES',
    'Machinery',
    'Minerals & Metals',
    'Packaging & Paper',
    'Pipes, Tubes & Fittings',
    'Others'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleNestedInputChange = (parent: keyof FormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...(prev[parent] as Record<string, unknown>), [field]: value }
    }));
    setErrors(prev => ({ ...prev, [`${parent}.${field}`]: '' }));
  };

  const handleArrayInputChange = (
    arrayName: 'partners' | 'categories',
    index: number,
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => (i === index ? { ...item, [field]: value } : item))
    }));
    setErrors(prev => ({ ...prev, [`${arrayName}.${index}.${field}`]: '' }));
  };

  const addArrayItem = (arrayName: 'partners' | 'categories', template: Partner | Category) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template] as Partner[] | Category[]
    }));
  };

  const removeArrayItem = (arrayName: 'partners' | 'categories', index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    setLoading(prev => ({ ...prev, upload: true }));

    try {
      const form = new FormData();
      form.append('image', file);

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: form
      });

      if (!res.ok) throw new Error('Upload failed');

      const result = await res.json();
      return result.imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, upload: false }));
    }
  };

  const handleFileUpload = async (type: 'product' | 'office', files: FileList | null) => {
    if (!files) return;
    const maxAllowed = premiumFeatures[formData.premiumCategory][type];
    const newFiles = Array.from(files).slice(0, maxAllowed);

    const previews: Photo[] = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      url: ''
    }));
    setFormData(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [type]: [...prev.photos[type], ...previews].slice(0, maxAllowed)
      }
    }));

    setLoading(prev => ({ ...prev, upload: true }));

    try {
      for (const file of newFiles) {
        try {
          const url = await uploadImage(file);
          setFormData(prev => ({
            ...prev,
            photos: {
              ...prev.photos,
              [type]: prev.photos[type].map(p => (p.file === file ? { ...p, url } : p))
            }
          }));
        } catch (e) {
          console.error(e);
        }
      }
    } finally {
      setLoading(prev => ({ ...prev, upload: false }));
    }
  };

  const removePhoto = (type: 'product' | 'office', index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [type]: prev.photos[type].filter((_, i) => i !== index)
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization Name is required';
    if (!formData.organizationType.trim()) newErrors.organizationType = 'Organization Type is required';

    if (
      formData.organizationType.includes('Partnership') ||
      formData.organizationType.includes('Limited') ||
      formData.organizationType.includes('Public')
    ) {
      formData.partners.forEach((p, idx) => {
        if (!p.name.trim()) newErrors[`partners.${idx}.name`] = 'Partner/Director name is required';
      });
    }

    if (
      [
        'Limited Liability Partnership (LLP)',
        'Private Limited',
        'Private Limited (One Person)',
        'Public Limited'
      ].includes(formData.organizationType)
    ) {
      if (!formData.cin || !formData.cin.trim()) {
        newErrors.cin = 'CIN is mandatory for this organization type';
      }
    }

    if (!formData.gst || !formData.gst.trim()) {
      newErrors.gst = 'GST number is mandatory for all organizations';
    }

    if (formData.registeredAddress.branchOffices && formData.registeredAddress.branchOffices.length > 0) {
      formData.registeredAddress.branchOffices.forEach((branch, idx) => {
        if (!branch.address.trim()) {
          newErrors[`branchOffice.${idx}.address`] = 'Branch office address is required';
        }
        if (!branch.city.trim()) {
          newErrors[`branchOffice.${idx}.city`] = 'City is required';
        }
        if (!branch.state.trim()) {
          newErrors[`branchOffice.${idx}.state`] = 'State is required';
        }
        if (!branch.pincode.trim()) {
          newErrors[`branchOffice.${idx}.pincode`] = 'Pin code is required';
        } else if (!/^\d{6}$/.test(branch.pincode)) {
          newErrors[`branchOffice.${idx}.pincode`] = 'Pin code must be 6 digits';
        }
      });
    }

    if (!formData.businessCategory.trim()) newErrors.businessCategory = 'Business Category is required';
    if (!formData.businessDescription.trim()) newErrors.businessDescription = 'Business Description is required';

    if (!formData.officialEmail.trim()) {
      newErrors.officialEmail = 'Official Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
      newErrors.officialEmail = 'Please enter a valid email address';
    }

    if (!formData.officialContactNumber.trim()) {
      newErrors.officialContactNumber = 'Official Contact Number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.officialContactNumber)) {
      newErrors.officialContactNumber = 'Please enter a valid 10-digit mobile number';
    }

    formData.categories.forEach((c, idx) => {
      if (!c.main.trim()) newErrors[`categories.${idx}.main`] = 'Main Category required';
      if (!c.sub.trim()) newErrors[`categories.${idx}.sub`] = 'Sub Category required';
    });

    if (!formData.registeredAddress.office.trim())
      newErrors['registeredAddress.office'] = 'Registered Address is required';

    if (!formData.premiumCategory.trim()) newErrors.premiumCategory = 'Select Premium Category';

    if (formData.photos.product.length === 0) newErrors.photosProduct = 'Upload at least one Product Photo';
    if (formData.photos.office.length === 0) newErrors.photosOffice = 'Upload at least one Office Photo';

    if (formData.dateOfestablishment === '' || formData.dateOfestablishment === null)
      newErrors.dateOfestablishment = 'Date of Establishment is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const finalData = {
        ...formData,
        photos: {
          product: formData.photos.product.map(p => p.url),
          office: formData.photos.office.map(p => p.url)
        }
      };

      const res = await fetch('/api/register-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      if (res.ok) {
        addToast({
          title: 'Success',
          description: 'Business registered successfully!',
          variant: 'success'
        });
        router.push('/dashboard/view-business');
      } else {
        const error = await res.json();
        addToast({
          title: 'Failed',
          description: error?.message || 'Failed to register business',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: 'Error',
        description: 'Something went wrong!',
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const showPartners =
    formData.organizationType.includes('Partnership') ||
    formData.organizationType.includes('Limited') ||
    formData.organizationType.includes('Public');

  const PremiumPopup = () => {
    if (!showPopup) return null;

    const { product, office, notifications } = premiumFeatures[formData.premiumCategory];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6 relative">
          <h2 className="text-xl font-bold mb-4 text-center text-red-700">
            Premium Category: {formData.premiumCategory}
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Product Photos allowed:</strong> {product}
            </p>
            <p>
              <strong>Office Photos allowed:</strong> {office}
            </p>
            <p>
              <strong>Notifications included:</strong> {notifications.join(', ')}
            </p>
          </div>
          <div className="text-center mt-6">
            <Button onClick={() => setShowPopup(false)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">
              OK
            </Button>
          </div>
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {(loading.upload || loading.submit) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 min-h-screen">
        <PremiumPopup />

        <Card className="shadow-lg border border-yellow-200">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-red-700 mb-6 text-center">Add your Business House/Company</h1>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">1) Name of Organization *</label>
                <input
                  type="text"
                  value={formData.organizationName}
                  onChange={e => handleInputChange('organizationName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                {errors.organizationName && <p className="text-red-600 text-xs mt-1">{errors.organizationName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">2) Type of Organization *</label>
                <select
                  value={formData.organizationType}
                  onChange={e => handleInputChange('organizationType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select organization type</option>
                  {organizationTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {index + 1}) {type}
                    </option>
                  ))}
                </select>
                {errors.organizationType && <p className="text-red-600 text-xs mt-1">{errors.organizationType}</p>}
              </div>

              {showPartners && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Partners/Directors Names *</label>
                  {formData.partners.map((p, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={p.name}
                        onChange={e => handleArrayInputChange('partners', idx, 'name', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      {formData.partners.length > 1 && (
                        <Button
                          onClick={() => removeArrayItem('partners', idx)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                      {errors[`partners.${idx}.name`] && (
                        <p className="text-red-600 text-xs mt-1">{errors[`partners.${idx}.name`]}</p>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={() => addArrayItem('partners', { name: '' })}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    <Plus size={16} className="mr-1" /> Add Partner/Director
                  </Button>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">3) Type of Business *</label>
                <select
                  value={formData.businessCategory}
                  onChange={e => handleInputChange('businessCategory', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select business category</option>
                  {businessCategories.map((c, idx) => (
                    <option key={idx} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.businessCategory && <p className="text-red-600 text-xs mt-1">{errors.businessCategory}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">4) Date Of Establishment *</label>
                <input
                  type="date"
                  value={formData.dateOfestablishment}
                  onChange={e => handleInputChange('dateOfestablishment', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                {errors.dateOfestablishment && (
                  <p className="text-red-600 text-xs mt-1">{errors.dateOfestablishment}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">5) Describe your business *</label>
                <textarea
                  value={formData.businessDescription}
                  onChange={e => handleInputChange('businessDescription', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-32"
                  maxLength={2400}
                />
                {errors.businessDescription && (
                  <p className="text-red-600 text-xs mt-1">{errors.businessDescription}</p>
                )}
                <div className="text-xs text-gray-500 mt-1">{formData.businessDescription.length}/2400 characters</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  6) Business Categories & Products/Services *
                </label>
                {formData.categories.map((cat, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Main Category</label>
                        <select
                          value={cat.main}
                          onChange={e => handleArrayInputChange('categories', idx, 'main', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="">Select main category</option>
                          {mainCategories.map((m, i) => (
                            <option key={i} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                        {errors[`categories.${idx}.main`] && (
                          <p className="text-red-600 text-xs mt-1">{errors[`categories.${idx}.main`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Sub Category/Product</label>
                        <input
                          type="text"
                          value={cat.sub}
                          onChange={e => handleArrayInputChange('categories', idx, 'sub', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="e.g., LED Bulbs, Surgical Masks"
                        />
                        {errors[`categories.${idx}.sub`] && (
                          <p className="text-red-600 text-xs mt-1">{errors[`categories.${idx}.sub`]}</p>
                        )}
                      </div>
                    </div>
                    {formData.categories.length > 1 && (
                      <Button
                        onClick={() => removeArrayItem('categories', idx)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs mt-2"
                      >
                        <Trash2 size={14} className="mr-1" /> Remove Category
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => addArrayItem('categories', { main: '', sub: '' })}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Plus size={16} className="mr-1" /> Add Category
                </Button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">7) Registered Address *</label>
                <textarea
                  value={formData.registeredAddress.office}
                  onChange={e => handleNestedInputChange('registeredAddress', 'office', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-24"
                  placeholder="Enter complete office address..."
                />
                {errors['registeredAddress.office'] && (
                  <p className="text-red-600 text-xs mt-1">{errors['registeredAddress.office']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  8) Corporate/Branch Office Address (Optional, multiple allowed)
                </label>
                {formData.registeredAddress.branchOffices?.map((branch, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Branch Office Address *</label>
                        <textarea
                          value={branch.address}
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              registeredAddress: {
                                ...prev.registeredAddress,
                                branchOffices: prev.registeredAddress.branchOffices.map((b, i) =>
                                  i === idx ? { ...b, address: e.target.value } : b
                                )
                              }
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-20"
                          placeholder="Enter complete branch office address"
                        />
                        {errors[`branchOffice.${idx}.address`] && (
                          <p className="text-red-600 text-xs mt-1">{errors[`branchOffice.${idx}.address`]}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">City *</label>
                          <input
                            type="text"
                            value={branch.city}
                            onChange={e =>
                              setFormData(prev => ({
                                ...prev,
                                registeredAddress: {
                                  ...prev.registeredAddress,
                                  branchOffices: prev.registeredAddress.branchOffices.map((b, i) =>
                                    i === idx ? { ...b, city: e.target.value } : b
                                  )
                                }
                              }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="Enter city"
                          />
                          {errors[`branchOffice.${idx}.city`] && (
                            <p className="text-red-600 text-xs mt-1">{errors[`branchOffice.${idx}.city`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">State *</label>
                          <select
                            value={branch.state}
                            onChange={e =>
                              setFormData(prev => ({
                                ...prev,
                                registeredAddress: {
                                  ...prev.registeredAddress,
                                  branchOffices: prev.registeredAddress.branchOffices.map((b, i) =>
                                    i === idx ? { ...b, state: e.target.value } : b
                                  )
                                }
                              }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          >
                            <option value="">Select State</option>
                            {[
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
                            ].map(state => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                          {errors[`branchOffice.${idx}.state`] && (
                            <p className="text-red-600 text-xs mt-1">{errors[`branchOffice.${idx}.state`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Pin Code *</label>
                          <input
                            type="number"
                            value={branch.pincode}
                            onChange={e => {
                              const value = e.target.value;
                              if (value === '' || (/^\d+$/.test(value) && value.length <= 6)) {
                                setFormData(prev => ({
                                  ...prev,
                                  registeredAddress: {
                                    ...prev.registeredAddress,
                                    branchOffices: prev.registeredAddress.branchOffices.map((b, i) =>
                                      i === idx ? { ...b, pincode: value } : b
                                    )
                                  }
                                }));
                              }
                            }}
                            onKeyDown={e => {
                              if (
                                !/[0-9]/.test(e.key) &&
                                !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
                              ) {
                                e.preventDefault();
                              }
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="Enter 6-digit pin code"
                            maxLength={6}
                            min="0"
                            max="999999"
                          />
                          {errors[`branchOffice.${idx}.pincode`] && (
                            <p className="text-red-600 text-xs mt-1">{errors[`branchOffice.${idx}.pincode`]}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          registeredAddress: {
                            ...prev.registeredAddress,
                            branchOffices: prev.registeredAddress.branchOffices.filter((_, i) => i !== idx)
                          }
                        }))
                      }
                      className="bg-red-600 hover:bg-red-700 text-white text-sm mt-3"
                    >
                      <Trash2 size={14} className="mr-1" /> Remove Branch Office
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={() =>
                    setFormData(prev => ({
                      ...prev,
                      registeredAddress: {
                        ...prev.registeredAddress,
                        branchOffices: [
                          ...(prev.registeredAddress.branchOffices || []),
                          { address: '', city: '', state: '', pincode: '' }
                        ]
                      }
                    }))
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Plus size={16} className="mr-1" /> Add Branch Office
                </Button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">9) Official Email Address *</label>
                <input
                  type="email"
                  placeholder="business@example.com"
                  value={formData.officialEmail || ''}
                  onChange={e => handleInputChange('officialEmail', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                {errors.officialEmail && <p className="text-red-600 text-xs mt-1">{errors.officialEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">10) Official Contact Number *</label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.officialContactNumber || ''}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
                      handleInputChange('officialContactNumber', value);
                    }
                  }}
                  onKeyDown={e => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  maxLength={10}
                />
                {errors.officialContactNumber && (
                  <p className="text-red-600 text-xs mt-1">{errors.officialContactNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">11) Company Website URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.companyWebsite || ''}
                  onChange={e => handleInputChange('companyWebsite', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">12) GST Number *</label>
                <input
                  type="text"
                  value={formData.gst || ''}
                  onChange={e => handleInputChange('gst', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter GST Number"
                />
                {errors.gst && <p className="text-red-600 text-xs mt-1">{errors.gst}</p>}
              </div>

              {[
                'Limited Liability Partnership (LLP)',
                'Private Limited',
                'Private Limited (One Person)',
                'Public Limited'
              ].includes(formData.organizationType) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">CIN *</label>
                    <input
                      type="text"
                      value={formData.cin || ''}
                      onChange={e => handleInputChange('cin', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter CIN"
                    />
                    {errors.cin && <p className="text-red-600 text-xs mt-1">{errors.cin}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Udyam (Optional)</label>
                    <input
                      type="text"
                      value={formData.udyam || ''}
                      onChange={e => handleInputChange('udyam', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter Udyam No."
                    />
                  </div>
                </div>
              )}

              {![
                'Limited Liability Partnership (LLP)',
                'Private Limited',
                'Private Limited (One Person)',
                'Public Limited'
              ].includes(formData.organizationType) &&
                formData.organizationType && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Udyam (Optional)</label>
                    <input
                      type="text"
                      value={formData.udyam || ''}
                      onChange={e => handleInputChange('udyam', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter Udyam No."
                    />
                  </div>
                )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">13) Premium Category *</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(premiumFeatures).map(category => (
                    <label key={category} className="flex items-center gap-2 border p-2 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="premiumCategory"
                        value={category}
                        checked={formData.premiumCategory === category}
                        onChange={e => {
                          handleInputChange('premiumCategory', e.target.value);
                          setShowPopup(true);
                        }}
                      />
                      {category}
                    </label>
                  ))}
                </div>
                {errors.premiumCategory && <p className="text-red-600 text-xs mt-1">{errors.premiumCategory}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">14) Add Photos *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Product Photos (Max: {premiumFeatures[formData.premiumCategory].product})
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="product-photos"
                      onChange={e => handleFileUpload('product', e.target.files)}
                    />
                    <Button
                      onClick={() => document.getElementById('product-photos')?.click()}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      disabled={loading.upload || loading.submit}
                    >
                      {loading.upload ? 'Uploading...' : 'Upload'}
                    </Button>

                    {errors.photosProduct && <p className="text-red-600 text-xs mt-1">{errors.photosProduct}</p>}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {formData.photos.product.map((p, idx) => (
                        <div key={idx} className="relative">
                          <img src={p.preview} alt={`Product ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                          <Button
                            size="sm"
                            className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white p-1"
                            onClick={() => removePhoto('product', idx)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Office Photos (Max: {premiumFeatures[formData.premiumCategory].office})
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="office-photos"
                      onChange={e => handleFileUpload('office', e.target.files)}
                    />
                    <Button
                      onClick={() => document.getElementById('office-photos')?.click()}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      disabled={loading.upload || loading.submit}
                    >
                      {loading.upload ? 'Uploading...' : 'Upload'}
                    </Button>

                    {errors.photosOffice && <p className="text-red-600 text-xs mt-1">{errors.photosOffice}</p>}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {formData.photos.office.map((p, idx) => (
                        <div key={idx} className="relative">
                          <img src={p.preview} alt={`Office ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                          <Button
                            size="sm"
                            className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white p-1"
                            onClick={() => removePhoto('office', idx)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={loading.submit || loading.upload}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                >
                  {loading.submit ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
