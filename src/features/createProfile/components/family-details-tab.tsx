"use client"

import { Users } from "lucide-react"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

interface FamilyDetailsTabProps {
  data: {
    fatherName: string
    fatherOccupation: string
    motherName: string
    motherOccupation: string
    brothers: string
    sisters: string
    familyIncome: string
    // marriedSiblings: string
    // familyType: string
    // familyValues: string
    // familyIncome: string
    // familyLocation: string
  }
  onUpdate: (data: Partial<FamilyDetailsTabProps["data"]>) => void
}

export function FamilyDetailsTab({ data, onUpdate }: FamilyDetailsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-5 h-5 text-gray-600" />
        <div>
          <h2 className="text-xl font-semibold">Family Details</h2>
          <p className="text-sm text-gray-600">Information about your family background</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fatherName">
            {"Father's Name"} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fatherName"
            placeholder="Enter father's name"
            value={data.fatherName}
            onChange={(e) => onUpdate({ fatherName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatherOccupation">{"Father's Occupation"}</Label>
          <Input
            id="fatherOccupation"
            placeholder="Enter father's occupation"
            value={data.fatherOccupation}
            onChange={(e) => onUpdate({ fatherOccupation: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="motherName">
            {"Mother's Name"} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="motherName"
            placeholder="Enter mother's name"
            value={data.motherName}
            onChange={(e) => onUpdate({ motherName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="motherOccupation">{"Mother's Occupation"}</Label>
          <Input
            id="motherOccupation"
            placeholder="Enter mother's occupation"
            value={data.motherOccupation}
            onChange={(e) => onUpdate({ motherOccupation: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brothers">Brothers</Label>
          <Select value={data.brothers} onValueChange={(value) => onUpdate({ brothers: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4+">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sisters">Sisters</Label>
          <Select value={data.sisters} onValueChange={(value) => onUpdate({ sisters: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4+">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="familyIncome">Family Income (Annual)</Label>
          <Select value={data.familyIncome} onValueChange={(value) => onUpdate({ familyIncome: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select income range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="below-5">Below 5 Lakhs</SelectItem>
              <SelectItem value="5-10">5-10 Lakhs</SelectItem>
              <SelectItem value="10-20">10-20 Lakhs</SelectItem>
              <SelectItem value="20-50">20-50 Lakhs</SelectItem>
              <SelectItem value="above-50">Above 50 Lakhs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
