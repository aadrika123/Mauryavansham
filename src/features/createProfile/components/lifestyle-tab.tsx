"use client"

import { Home } from "lucide-react"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

interface LifestyleTabProps {
  data: {
    diet: string
    smoking: string
    drinking: string
    exercise: string
    religiousBeliefs: string
    musicPreferences: string
    moviePreferences: string
    readingInterests: string
    travelInterests: string
    castPreferences: string
  }
  onUpdate: (data: Partial<LifestyleTabProps["data"]>) => void
}

export function LifestyleTab({ data, onUpdate }: LifestyleTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Home className="w-5 h-5 text-gray-600" />
        <div>
          <h2 className="text-xl font-semibold">Lifestyle & Preferences</h2>
          <p className="text-sm text-gray-600">Your lifestyle choices and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="diet">Diet</Label>
          <Select value={data.diet} onValueChange={(value) => onUpdate({ diet: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select diet preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="jain">Jain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="smoking">Smoking</Label>
          <Select value={data.smoking} onValueChange={(value) => onUpdate({ smoking: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Smoking habits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="occasionally">Occasionally</SelectItem>
              <SelectItem value="regularly">Regularly</SelectItem>
              <SelectItem value="quit">Quit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="drinking">Drinking</Label>
          <Select value={data.drinking} onValueChange={(value) => onUpdate({ drinking: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Drinking habits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="socially">Socially</SelectItem>
              <SelectItem value="occasionally">Occasionally</SelectItem>
              <SelectItem value="regularly">Regularly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exercise">Exercise</Label>
          <Select value={data.exercise} onValueChange={(value) => onUpdate({ exercise: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Exercise routine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="occasionally">Occasionally</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 ">
          <Label htmlFor="religiousBeliefs">Religious Beliefs</Label>
          <Select value={data.religiousBeliefs} onValueChange={(value) => onUpdate({ religiousBeliefs: value })}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select religious inclination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-religious">Very Religious</SelectItem>
              <SelectItem value="religious">Religious</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="not-religious">Not Religious</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 ">
          <Label htmlFor="castPreferences">Cast Preference</Label>
          <Select value={data.castPreferences} onValueChange={(value) => onUpdate({ castPreferences: value })}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select cast preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="same-caste">Same Caste</SelectItem>
              <SelectItem value="different-caste">Different Caste</SelectItem>
            </SelectContent>
          </Select>
         
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="musicPreferences">Music Preferences</Label>
          <Input
            id="musicPreferences"
            placeholder="e.g., Classical, Bollywood, Western"
            value={data.musicPreferences}
            onChange={(e) => onUpdate({ musicPreferences: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="moviePreferences">Movie Preferences</Label>
          <Input
            id="moviePreferences"
            placeholder="e.g., Drama, Comedy, Action"
            value={data.moviePreferences}
            onChange={(e) => onUpdate({ moviePreferences: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="readingInterests">Reading Interests</Label>
          <Input
            id="readingInterests"
            placeholder="e.g., Fiction, Non-fiction, Spiritual"
            value={data.readingInterests}
            onChange={(e) => onUpdate({ readingInterests: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="travelInterests">Travel Interests</Label>
          <Textarea
            id="travelInterests"
            placeholder="Places you've visited or would like to visit"
            value={data.travelInterests}
            onChange={(e) => onUpdate({ travelInterests: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
