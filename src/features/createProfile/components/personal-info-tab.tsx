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

interface PersonalInfoTabProps {
  data: {
    name: string;
    nickName: string;
    phoneNo: string;
    email: string;
    website: string;
    dob: string;
    height: string;
    weight: string;
    complexion: string;
    bodyType: string;
    maritalStatus: string;
    languagesKnown: string;
    hobbies: string;
    aboutMe: string;
  };
  onUpdate: (data: Partial<PersonalInfoTabProps["data"]>) => void;
}

export function PersonalInfoTab({ data, onUpdate }: PersonalInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-5 h-5 text-gray-600" />
        <div>
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p className="text-sm text-gray-600">Basic details about yourself</p>
        </div>
      </div>

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
            placeholder="Enter your date of birth"
            value={data.dob}
            onChange={(e) => onUpdate({ dob: e.target.value })}
            type="date"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNo">
            Phone No. <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNo"
            placeholder="Enter your phone number"
            value={data.phoneNo}
            onChange={(e) => onUpdate({ phoneNo: e.target.value })}
            type="tel"
          />
          
        </div>
         <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            placeholder="Enter your email address"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            type="email"
          />
          
        </div>
         <div className="space-y-2">
          <Label htmlFor="website">
            Website <span className="text-red-500">*</span>
          </Label>
          <Input
            id="website"
            placeholder="Enter your website URL"
            value={data.website}
            onChange={(e) => onUpdate({ website: e.target.value })}
            type="url"
          />
          
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">
            Height <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.height}
            onValueChange={(value) => onUpdate({ height: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select height" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5'0">{"5'0\""}</SelectItem>
              <SelectItem value="5'1">{"5'1\""}</SelectItem>
              <SelectItem value="5'2">{"5'2\""}</SelectItem>
              <SelectItem value="5'3">{"5'3\""}</SelectItem>
              <SelectItem value="5'4">{"5'4\""}</SelectItem>
              <SelectItem value="5'5">{"5'5\""}</SelectItem>
              <SelectItem value="5'6">{"5'6\""}</SelectItem>
              <SelectItem value="5'7">{"5'7\""}</SelectItem>
              <SelectItem value="5'8">{"5'8\""}</SelectItem>
              <SelectItem value="5'9">{"5'9\""}</SelectItem>
              <SelectItem value="5'10">{"5'10\""}</SelectItem>
              <SelectItem value="5'11">{"5'11\""}</SelectItem>
              <SelectItem value="6'0">{"6'0\""}</SelectItem>
              <SelectItem value="6'1">{"6'1\""}</SelectItem>
              <SelectItem value="6'2">{"6'2\""}</SelectItem>
              <SelectItem value="6'3">{"6'3\""}</SelectItem>
              <SelectItem value="6'4">{"6'4\""}</SelectItem>
              <SelectItem value="6'5">{"6'5\""}</SelectItem>
              <SelectItem value="6'6">{"6'6\""}</SelectItem>
              <SelectItem value="6'7">{"6'7\""}</SelectItem>
              <SelectItem value="6'8">{"6'8\""}</SelectItem>
              <SelectItem value="6'9">{"6'9\""}</SelectItem>
              <SelectItem value="6'10">{"6'10\""}</SelectItem>
              <SelectItem value="6'11">{"6'11\""}</SelectItem>
              <SelectItem value="7'0">{"7'0\""}</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="very-fair">Very Fair</SelectItem>
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
              <SelectItem value="slim">Slim</SelectItem>
              <SelectItem value="average">Average</SelectItem>
              <SelectItem value="athletic">Athletic</SelectItem>
              <SelectItem value="heavy">Heavy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 ">
          <Label htmlFor="maritalStatus">
            Marital Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.maritalStatus}
            onValueChange={(value) => onUpdate({ maritalStatus: value })}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never-married">Never Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
              <SelectItem value="separated">Separated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 ">
          <Label htmlFor="languagesKnown">Languages Known</Label>
          <Input
            id="languagesKnown"
            placeholder="e.g., Hindi, English, Marathi"
            value={data.languagesKnown}
            onChange={(e) => onUpdate({ languagesKnown: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="hobbies">Hobbies & Interests</Label>
          <Textarea
            id="hobbies"
            placeholder="Tell us about your hobbies and interests"
            value={data.hobbies}
            onChange={(e) => onUpdate({ hobbies: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="aboutMe">About Me</Label>
          <Textarea
            id="aboutMe"
            placeholder="Write a brief description about yourself"
            value={data.aboutMe}
            onChange={(e) => onUpdate({ aboutMe: e.target.value })}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
