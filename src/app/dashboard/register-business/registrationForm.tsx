"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Upload, Plus, Trash2 } from 'lucide-react';

export default function BusinessRegistrationForm() {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    businessCategory: '',
    businessDescription: '',
    partners: [{ name: '' }],
    categories: [{ main: '', sub: '' }],
    registeredAddress: {
      office: '',
      branch: '',
      location: ''
    },
    photos: {
      product: [],
      office: []
    }
  });

  const organizationTypes = [
    'Proprietorship',
    'Partnership',
    'Limited Liability Partnership (LLP)',
    'Private Limited',
    'Private Limited (One Person)',
    'Public Limited'
  ];

  const businessCategories = [
    'Manufacturing',
    'Dealer/Distributor',
    'Retail',
    'Service'
  ];

  const mainCategories = [
    'Health & Beauty',
    'Apparel & Fashion',
    'Chemicals',
    'Machinery',
    'Construction & Real Estate',
    'Electronics & Electrical',
    'Hospital & Medical',
    'Gifts & Crafts',
    'Packaging & Paper',
    'Agriculture',
    'Home Supplies',
    'Minerals & Metals',
    'Industrial Supplies',
    'Pipes, Tubes & Fittings'
  ];

  const handleInputChange = (field : any, value : any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: any, field: any, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (arrayName: any, index: any, field: any, value: any) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item : any, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName : any, template : any) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template]
    }));
  };

  const removeArrayItem = (arrayName : any, index : any) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_: any, i: any) => i !== index)
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Business registered successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6  min-h-screen">
      <Card className="shadow-lg  border border-yellow-200">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold text-red-700 mb-6 text-center">
            Add your Business House/Company
          </h1>
          
          <div className="space-y-6">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                1) Name of Organization *
              </label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter organization name"
                required
              />
            </div>

            {/* Organization Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                2) Type of Organization *
              </label>
              <select
                value={formData.organizationType}
                onChange={(e) => handleInputChange('organizationType', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select organization type</option>
                {organizationTypes.map((type, index) => (
                  <option key={index} value={type}>{index + 1}) {type}</option>
                ))}
              </select>
            </div>

            {/* Business Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                3) Business Category *
              </label>
              <select
                value={formData.businessCategory}
                onChange={(e) => handleInputChange('businessCategory', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select business category</option>
                {businessCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Business Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                4) Describe your business *
              </label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-32"
                placeholder="Write up to 400 words describing your business..."
                maxLength= {2400}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.businessDescription.length}/2400 characters
              </div>
            </div>

            {/* Partners/Directors */}
            {(formData.organizationType.includes('Partnership') || 
              formData.organizationType.includes('Limited') || 
              formData.organizationType.includes('Public')) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Partners/Directors Names
                </label>
                {formData.partners.map((partner, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={partner.name}
                      onChange={(e) => handleArrayInputChange('partners', index, 'name', e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Partner/Director name"
                    />
                    {formData.partners.length > 1 && (
                      <Button
                        onClick={() => removeArrayItem('partners', index)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => addArrayItem('partners', { name: '' })}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  <Plus size={16} className="mr-1" /> Add Partner/Director
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  * Multiple partners or directors can be added
                </p>
              </div>
            )}

            {/* Product/Service Categories */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                5) Business Categories & Products/Services *
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Add your product lines/services. Note: Add "Education" as a category if applicable. 
                Multiple categories & subcategories can be added.
              </p>
              
              {formData.categories.map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Main Category
                      </label>
                      <select
                        value={category.main}
                        onChange={(e) => handleArrayInputChange('categories', index, 'main', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      >
                        <option value="">Select main category</option>
                        {mainCategories.map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                        <option value="Education">Education</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Sub Category/Product
                      </label>
                      <input
                        type="text"
                        value={category.sub}
                        onChange={(e) => handleArrayInputChange('categories', index, 'sub', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="e.g., LED Bulbs, Surgical Masks"
                      />
                    </div>
                  </div>
                  {formData.categories.length > 1 && (
                    <Button
                      onClick={() => removeArrayItem('categories', index)}
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

            {/* Registered Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                6) Registered Address *
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Office/Branch Office/Location Address
                  </label>
                  <textarea
                    value={formData.registeredAddress.office}
                    onChange={(e) => handleNestedInputChange('registeredAddress', 'office', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-24"
                    placeholder="Enter complete office address..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Photo Uploads */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                7) Add Photos
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Product Photos</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="product-photos"
                  />
                  <Button
                    onClick={() => document.getElementById('product-photos').click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Choose Product Photos
                  </Button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Office Photos</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="office-photos"
                  />
                  <Button
                    onClick={() => document.getElementById('office-photos').click()}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    Choose Office Photos
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <Button
                onClick={handleSubmit}
                className="w-full bg-red-700 hover:bg-red-800 text-white py-3 text-lg font-semibold"
              >
                Register Business
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Display Preview */}
      {/* <Card className="mt-8 shadow-lg bg-white border-2 border-yellow-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-red-700 mb-4">
            Business Display Preview
          </h2>
          
          
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                <span className="text-xs text-gray-500">Thumbnail</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {formData.organizationName || 'Organization Name'}
                </h3>
                <p className="text-sm text-gray-600">
                  Name of Owners/Directors
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Products/Service:</p>
                  <p className="text-sm text-gray-700">
                    {formData.categories.map(cat => `${cat.main} - ${cat.sub}`).join(', ') || 'Product/Service write-up'}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-sm">Product/Office photos</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1">
                    Enquiry
                  </Button>
                  <Button className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-4 py-1">
                    Know More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}