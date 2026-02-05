'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ArrowLeft, Crown, Users } from 'lucide-react';
import Link from 'next/link';
import { createRegistration } from '../actions/registration';
import { toast } from '@/src/components/ui/use-toast';

export default function CommunityRegistrationPage() {
  const [formData, setFormData] = useState({
    familyHeadName: '',
    email: '',
    phone: '',
    gotra: '',
    address: '',
    city: '',
    state: '',
    country: '',
    occupation: '',
    businessName: '',
    familyMembers: '',
    agreeToTerms: true,
    roles: 'member' // Default role
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, (formData as any)[key]);
    }

    const result = await createRegistration(null, data);

    if (result?.success) {
      toast({
        title: 'Success',
        description: result.message || 'Registration successful!',
        variant: 'default'
      });

      // Reset form
      setFormData({
        familyHeadName: '',
        email: '',
        phone: '',
        gotra: '',
        address: '',
        city: '',
        state: '',
        country: '',
        occupation: '',
        businessName: '',
        familyMembers: '',
        agreeToTerms: true,
        roles: 'member' // Reset to default role
      });
    } else {
      toast({
        title: 'Error',
        description: result?.message || 'Something went wrong',
        variant: 'destructive'
      });
    }

    console.log('Server response:', result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Community Registration</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="container mx-auto px-8 py-8 text-center">
        <Crown className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg transform "></div>
          <h1 className="relative text-3xl md:text-4xl font-bold text-red-700">Join Our Maurya Community</h1>
        </div>
        <p className="text-lg text-red-600 max-w-3xl mx-auto leading-relaxed mb-12">
          Register your family with our global Maurya community portal and connect with fellow descendants of our
          glorious heritage
        </p>

        {/* Registration Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-2 text-xl text-red-700">
                <Users className="h-6 w-6 text-red-600" />
                Member Registration Form
              </CardTitle>
              <p className="text-red-600 text-sm">
                Please provide accurate information to help us maintain our community records
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Family Head Name and Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="familyHeadName" className="text-red-700 font-medium">
                      Family Head Name *
                    </Label>
                    <Input
                      id="familyHeadName"
                      placeholder="Enter family head's full name"
                      value={formData.familyHeadName}
                      onChange={e => handleInputChange('familyHeadName', e.target.value)}
                      className="bg-white border-yellow-300 focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-red-700 font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="bg-white border-yellow-300 focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Phone Number and Gotra */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-red-700 font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className="bg-white border-yellow-300 focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gotra" className="text-red-700 font-medium">
                      Gotra
                    </Label>
                    <Input
                      id="gotra"
                      placeholder="Enter gotra"
                      value={formData.gotra}
                      onChange={e => handleInputChange('gotra', e.target.value)}
                      className="bg-white border-yellow-300 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Complete Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-red-700 font-medium">
                    Complete Address *
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="House number, street, locality"
                    value={formData.address}
                    onChange={e => handleInputChange('address', e.target.value)}
                    className="bg-white border-yellow-300 focus:border-red-500"
                    rows={3}
                    required
                  />
                </div>

                {/* Row 3: City, State, Country */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-red-700 font-medium">
                      City *
                    </Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={e => handleInputChange('city', e.target.value)}
                      className="bg-white border-yellow-300 focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-red-700 font-medium">
                      State *
                    </Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={e => handleInputChange('state', e.target.value)}
                      className="bg-white border-yellow-300 focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-red-700 font-medium">
                      Country *
                    </Label>
                    <Input
                      id="country"
                      placeholder="Enter country"
                      value={formData.country}
                      onChange={e => handleInputChange('country', e.target.value)}
                      className="bg-white border-yellow-300 focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                {/* Row 4: Occupation and Business Name */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="occupation" className="text-red-700 font-medium">
                      Occupation/Profession
                    </Label>
                    <Input
                      id="occupation"
                      placeholder="e.g. Engineer, Doctor, Teacher"
                      value={formData.occupation}
                      onChange={e => handleInputChange('occupation', e.target.value)}
                      className="bg-white border-yellow-300 focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-red-700 font-medium">
                      Business/Company Name
                    </Label>
                    <Input
                      id="businessName"
                      placeholder="Enter business or company name"
                      value={formData.businessName}
                      onChange={e => handleInputChange('businessName', e.target.value)}
                      className="bg-white border-yellow-300 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Number of Family Members */}
                <div className="space-y-2">
                  <Label htmlFor="familyMembers" className="text-red-700 font-medium">
                    Number of Family Members
                  </Label>
                  <Input
                    id="familyMembers"
                    type="number"
                    placeholder="Enter total family members"
                    value={formData.familyMembers}
                    onChange={e => handleInputChange('familyMembers', e.target.value)}
                    className="bg-white border-yellow-300 focus:border-red-500"
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2 py-4">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={checked => handleInputChange('agreeToTerms', checked as boolean)}
                    className="border-red-300 data-[state=checked]:bg-red-600"
                  />
                  <Label htmlFor="terms" className="text-sm text-red-700 leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="text-red-600 hover:underline font-medium">
                      terms and conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/community-guidelines" className="text-red-600 hover:underline font-medium">
                      community guidelines
                    </Link>{' '}
                    of Mauryavansh.com
                  </Label>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-3 text-lg font-semibold rounded-lg shadow-lg"
                    disabled={!formData.agreeToTerms}
                  >
                    👥 Register
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
