"use client";

import { User } from "lucide-react";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useState } from "react";

interface PersonalInfoTabProps {
  data: {
    name: string;
    nickName: string;
    phoneNo: string;
    email: string;
    dob: string;
    height: string;
    weight: string;
    complexion: string;
    bodyType: string;
    maritalStatus: string;
    languagesKnown: string;
    hobbies: string;
    aboutMe: string;
    profileImage: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    gender: string;
  };
  onUpdate: (data: Partial<PersonalInfoTabProps["data"]>) => void;
}

export function PersonalInfoTab({ data, onUpdate }: PersonalInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* Header and Profile Image */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-600" />
          <div>
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <p className="text-sm text-gray-600">
              Basic details about yourself
            </p>
          </div>
        </div>

        {/* Profile image section */}
        <div className="flex flex-col items-center space-y-2">
          <label htmlFor="profileImage" className="cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden shadow border border-gray-300 hover:opacity-80">
              {data.profileImage ? (
                <img
                  src={data.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-sm text-gray-500">
                  Upload
                </div>
              )}
            </div>
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (reader.result) {
                    onUpdate({ profileImage: reader.result as string });
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <span className="text-xs text-gray-500">Max 2MB</span>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nickName">
            Nick Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nickName"
            placeholder="Enter your nick name"
            value={data.nickName}
            onChange={(e) => onUpdate({ nickName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">
            Date Of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dob"
            type="date"
            value={data.dob}
            onChange={(e) => onUpdate({ dob: e.target.value })}
          />
        </div>
        {/* add gender */}
       <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={data.gender}
            onValueChange={(value) => onUpdate({ gender: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {["Male", "Female", "Other"].map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        <div className="space-y-2">
          <Label htmlFor="phoneNo">
            Phone No. <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNo"
            type="tel"
            placeholder="Enter your phone number"
            value={data.phoneNo}
            onChange={(e) => onUpdate({ phoneNo: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">
            Height <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Select
              value={data.height?.split("'")[0] || ""}
              onValueChange={(feet) => {
                const inches =
                  data.height?.split("'")[1]?.replace('"', "") || "0";
                onUpdate({ height: `${feet}'${inches}"` });
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Feet" />
              </SelectTrigger>
              <SelectContent>
                {["3", "4", "5", "6", "7"].map((ft) => (
                  <SelectItem key={ft} value={ft}>
                    {ft} ft
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={data.height?.split("'")[1]?.replace('"', "") || ""}
              onValueChange={(inches) => {
                const feet = data.height?.split("'")[0] || "5";
                onUpdate({ height: `${feet}'${inches}"` });
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Inches" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => String(i)).map((inch) => (
                  <SelectItem key={inch} value={inch}>
                    {inch} in
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            placeholder="Enter weight (kg)"
            value={data.weight}
            onChange={(e) => onUpdate({ weight: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="complexion">Complexion</Label>
          <Select
            value={data.complexion}
            onValueChange={(value) => onUpdate({ complexion: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select complexion" />
            </SelectTrigger>
            <SelectContent>
              {["fair", "medium", "dark", "very-fair"].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyType">Body Type</Label>
          <Select
            value={data.bodyType}
            onValueChange={(value) => onUpdate({ bodyType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              {["slim", "average", "athletic", "heavy"].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maritalStatus">
            Marital Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.maritalStatus}
            onValueChange={(value) => onUpdate({ maritalStatus: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              {["single", "married", "divorced", "widowed", "separated"].map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="languagesKnown">Languages Known</Label>
          <Input
            id="languagesKnown"
            placeholder="e.g., Hindi, English, Sadari"
            value={data.languagesKnown}
            onChange={(e) => onUpdate({ languagesKnown: e.target.value })}
          />
        </div>
        {/* Facebook Link */}
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook Profile Link</Label>
          <Input
            id="facebook"
            type="url"
            placeholder="https://facebook.com/yourprofile"
            value={data.facebook || ""}
            onChange={(e) => onUpdate({ facebook: e.target.value })}
          />
        </div>

        {/* Instagram Link */}
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram Profile Link</Label>
          <Input
            id="instagram"
            type="url"
            placeholder="https://instagram.com/yourprofile"
            value={data.instagram || ""}
            onChange={(e) => onUpdate({ instagram: e.target.value })}
          />
        </div>

        {/* LinkedIn Link */}
        <div className="space-y-2 ">
          <Label htmlFor="linkedin">LinkedIn Profile Link</Label>
          <Input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            value={data.linkedin || ""}
            onChange={(e) => onUpdate({ linkedin: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="hobbies">Hobbies & Interests</Label>
          <Textarea
            id="hobbies"
            placeholder="Tell us about your hobbies and interests"
            rows={3}
            value={data.hobbies}
            onChange={(e) => onUpdate({ hobbies: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="aboutMe">About Me</Label>
          <Textarea
            id="aboutMe"
            placeholder="Write a brief description about yourself"
            rows={3}
            value={data.aboutMe}
            onChange={(e) => onUpdate({ aboutMe: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
