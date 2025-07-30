"use client"

import { GraduationCap } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Label } from "@/src/components/ui/label"

interface EducationCareerTabProps {
  data: {
    highestEducation: string
    collegeUniversity: string
    occupation: string
    companyOrganization: string
    designation: string
    workLocation: string
    annualIncome: string
    workExperience: string
  }
  onUpdate: (data: Partial<EducationCareerTabProps["data"]>) => void
}

export function EducationCareerTab({ data, onUpdate }: EducationCareerTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="w-5 h-5 text-gray-600" />
        <div>
          <h2 className="text-xl font-semibold">Education & Career</h2>
          <p className="text-sm text-gray-600">Your educational background and professional details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="highestEducation">
            Highest Education <span className="text-red-500">*</span>
          </Label>
          <Select value={data.highestEducation} onValueChange={(value) => onUpdate({ highestEducation: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="bachelors">{"Bachelor's Degree"}</SelectItem>
              <SelectItem value="masters">{"Master's Degree"}</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="professional">Professional Degree</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="collegeUniversity">College/University</Label>
          <Input
            id="collegeUniversity"
            placeholder="Name of your college/university"
            value={data.collegeUniversity}
            onChange={(e) => onUpdate({ collegeUniversity: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">
            Occupation <span className="text-red-500">*</span>
          </Label>
          <Select value={data.occupation} onValueChange={(value) => onUpdate({ occupation: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select occupation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="software-engineer">Software Engineer</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="government">Government Job</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyOrganization">Company/Organization</Label>
          <Input
            id="companyOrganization"
            placeholder="Current company or organization"
            value={data.companyOrganization}
            onChange={(e) => onUpdate({ companyOrganization: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            placeholder="Your current position/title"
            value={data.designation}
            onChange={(e) => onUpdate({ designation: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workLocation">Work Location</Label>
          <Input
            id="workLocation"
            placeholder="City where you work"
            value={data.workLocation}
            onChange={(e) => onUpdate({ workLocation: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="annualIncome">Annual Income</Label>
          <Select value={data.annualIncome} onValueChange={(value) => onUpdate({ annualIncome: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select income range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="below-3">Below 3 Lakhs</SelectItem>
              <SelectItem value="3-5">3-5 Lakhs</SelectItem>
              <SelectItem value="5-10">5-10 Lakhs</SelectItem>
              <SelectItem value="10-20">10-20 Lakhs</SelectItem>
              <SelectItem value="20-50">20-50 Lakhs</SelectItem>
              <SelectItem value="above-50">Above 50 Lakhs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="workExperience">Work Experience</Label>
          <Textarea
            id="workExperience"
            placeholder="Brief description of your work experience and achievements"
            value={data.workExperience}
            onChange={(e) => onUpdate({ workExperience: e.target.value })}
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}
