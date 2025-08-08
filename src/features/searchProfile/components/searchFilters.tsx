"use client";

import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Slider } from "@/src/components/ui/slider";
import { Search, Filter } from "lucide-react";

interface SearchFiltersProps {
  filters: {
    searchName: string;
    ageRange: [number, number];
    location: string;
    education: string;
    occupation: string;
    gotra: string;
    height: string;
    verifiedOnly: boolean;
    withPhotos: boolean;
    onlineRecently: boolean;
  };
  onFiltersChange: (filters: Partial<SearchFiltersProps["filters"]>) => void;
}

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  return (
    <Card className="p-4 sticky top-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <div>
            <h2 className="text-lg font-semibold text-red-900">Search Filters</h2>
            <p className="text-sm text-red-600">Find your perfect match</p>
          </div>
        </div>

        {/* Search by Name */}
        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="searchName">Search by Name</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="searchName"
              placeholder="Enter name..."
              value={filters.searchName}
              onChange={(e) => onFiltersChange({ searchName: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Age Range */}
        <div className="space-y-3">
          <Label className="text-red-800">
            Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
          </Label>
          <Slider
            value={filters.ageRange}
            onValueChange={(value) => onFiltersChange({ ageRange: value as [number, number] })}
            max={60}
            min={18}
            step={1}
            className="w-full"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="location">Location</Label>
          <Select value={filters.location} onValueChange={(value) => onFiltersChange({ location: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-cities">All Cities</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
              <SelectItem value="pune">Pune</SelectItem>
              <SelectItem value="hyderabad">Hyderabad</SelectItem>
              <SelectItem value="chennai">Chennai</SelectItem>
              <SelectItem value="kolkata">Kolkata</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="education">Education</Label>
          <Select value={filters.education} onValueChange={(value) => onFiltersChange({ education: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select education" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-education">All Education</SelectItem>
              <SelectItem value="bachelors">{"Bachelor's Degree"}</SelectItem>
              <SelectItem value="masters">{"Master's Degree"}</SelectItem>
              <SelectItem value="mba">MBA</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="professional">Professional Degree</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Occupation */}
        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="occupation">Occupation</Label>
          <Select value={filters.occupation} onValueChange={(value) => onFiltersChange({ occupation: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select occupation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-occupations">All Occupations</SelectItem>
              <SelectItem value="software-engineer">Software Engineer</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="government">Government Job</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="consultant">Consultant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gotra */}
        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="gotra">Gotra</Label>
          <Select value={filters.gotra} onValueChange={(value) => onFiltersChange({ gotra: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select gotra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-gotras">All Gotras</SelectItem>
              <SelectItem value="kashyap">Kashyap</SelectItem>
              <SelectItem value="bharadwaj">Bharadwaj</SelectItem>
              <SelectItem value="vishwamitra">Vishwamitra</SelectItem>
              <SelectItem value="atri">Atri</SelectItem>
              <SelectItem value="jamadagni">Jamadagni</SelectItem>
              <SelectItem value="vashishtha">Vashishtha</SelectItem>
              <SelectItem value="gautam">Gautam</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="height">Height</Label>
          <Select value={filters.height} onValueChange={(value) => onFiltersChange({ height: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select height range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-heights">All Heights</SelectItem>
              <SelectItem value="below-5-4">Below 5'4"</SelectItem>
              <SelectItem value="5-4-to-5-6">5'4" to 5'6"</SelectItem>
              <SelectItem value="5-6-to-5-8">5'6" to 5'8"</SelectItem>
              <SelectItem value="5-8-to-6-0">5'8" to 6'0"</SelectItem>
              <SelectItem value="above-6-0">Above 6'0"</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        <div className="space-y-3">
          <Label  className="text-base text-red-800 font-medium">Advanced Filters</Label>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="verifiedOnly"
              checked={filters.verifiedOnly}
              onCheckedChange={(checked) => onFiltersChange({ verifiedOnly: checked === true })}
            />
            <Label htmlFor="verifiedOnly" className="text-sm font-normal text-red-800">
              Verified profiles only
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="withPhotos"
              checked={filters.withPhotos}
              onCheckedChange={(checked) => onFiltersChange({ withPhotos: checked === true })}
            />
            <Label htmlFor="withPhotos" className="text-sm font-normal text-red-800">
              With photos
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="onlineRecently"
              checked={filters.onlineRecently}
              onCheckedChange={(checked) => onFiltersChange({ onlineRecently: checked === true })}
            />
            <Label htmlFor="onlineRecently" className="text-sm font-normal text-red-800">
              Online in last 7 days
            </Label>
          </div>
        </div>
      </div>
    </Card>
  );
}
