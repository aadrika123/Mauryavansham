'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Upload, FileText, ImageIcon, Mic } from 'lucide-react';

export default function ContributeHeritagePage() {
  const [contributionType, setContributionType] = useState('');

  const contributionTypes = [
    { value: 'family_story', label: 'Family Story', icon: FileText },
    { value: 'historical_document', label: 'Historical Document', icon: FileText },
    { value: 'photograph', label: 'Historical Photograph', icon: ImageIcon },
    { value: 'oral_history', label: 'Oral History', icon: Mic },
    { value: 'cultural_practice', label: 'Cultural Practice', icon: FileText },
    { value: 'genealogy', label: 'Family Tree/Genealogy', icon: FileText }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Contribute to Maurya Heritage</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help us preserve and share the rich history of our community. Your contributions will be reviewed and added to
          our heritage archive for future generations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Heritage Contribution Form</CardTitle>
          <CardDescription>
            Share your knowledge, stories, documents, or media related to Maurya heritage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Contribution Type *</Label>
            <Select value={contributionType} onValueChange={setContributionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select the type of contribution" />
              </SelectTrigger>
              <SelectContent>
                {contributionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" placeholder="Give your contribution a descriptive title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeperiod">Time Period</Label>
              <Input id="timeperiod" placeholder="e.g., 1950s, Ancient times, etc." />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" placeholder="Provide detailed information about your contribution..." rows={6} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="City, State, Country" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source/Origin</Label>
              <Input id="source" placeholder="How did you obtain this information?" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>File Uploads</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Upload documents, photos, audio, or video files</p>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: PDF, DOC, JPG, PNG, MP3, MP4 (Max 50MB per file)
              </p>
              <Button variant="outline">Choose Files</Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Additional Information</Label>

            <div className="space-y-2">
              <Label htmlFor="people">People Involved</Label>
              <Input id="people" placeholder="Names of people mentioned in your contribution" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords/Tags</Label>
              <Input id="keywords" placeholder="Add relevant keywords separated by commas" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="references">References</Label>
              <Textarea
                id="references"
                placeholder="Any books, documents, or sources that support your contribution"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Permissions & Rights</Label>

            <div className="flex items-center space-x-2">
              <Checkbox id="ownership" />
              <Label htmlFor="ownership" className="text-sm">
                I confirm that I own the rights to this content or have permission to share it
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="accuracy" />
              <Label htmlFor="accuracy" className="text-sm">
                I believe this information to be accurate to the best of my knowledge
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="public" />
              <Label htmlFor="public" className="text-sm">
                I agree to make this contribution publicly available on the heritage portal
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="contact" />
              <Label htmlFor="contact" className="text-sm">
                I agree to be contacted for clarification or additional information
              </Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1">Submit Contribution</Button>
            <Button variant="outline">Save as Draft</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Contribution Guidelines</h3>
          <div className="space-y-2 text-sm">
            <p>• All contributions will be reviewed by our heritage committee before publication</p>
            <p>• Please provide as much detail and context as possible</p>
            <p>• Include sources and references where available</p>
            <p>• Respect privacy - avoid sharing personal information without consent</p>
            <p>• High-quality images and documents are preferred</p>
            <p>• You will be credited as the contributor unless you request anonymity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
