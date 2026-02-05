'use client';

import { TreePine, AlertTriangle } from 'lucide-react';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';

interface GenealogyTabProps {
  data: {
    gotraDetails: string;
    ancestralVillage: string;
    familyHistory: string;
    communityContributions: string;
    familyTraditions: string;
    // knownCommunityRelatives: string
    // familyName: string
    // familyTreeVisibility: string
    // familyTreeVisibility: string
  };
  onUpdate: (data: Partial<GenealogyTabProps['data']>) => void;
}

export function GenealogyTab({ data, onUpdate }: GenealogyTabProps) {
  const isEmpty = (val: string | undefined) => !val || val.trim() === '';
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <TreePine className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-red-800">Genealogy & Heritage</h2>
          <p className="text-sm text-red-600">Your ancestral lineage and community connections</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="gotraDetails">
            Gotra Details <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="gotraDetails"
            placeholder="Provide detailed information about your gotra and lineage"
            value={data.gotraDetails}
            onChange={e => onUpdate({ gotraDetails: e.target.value })}
            rows={4}
          />
          {isEmpty(data.gotraDetails) && <p className="text-sm text-red-600">Please provide gotra details</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="ancestralVillage">
            Ancestral Village/Place
          </Label>
          <Input
            id="ancestralVillage"
            placeholder="Original village or place of your ancestors"
            value={data.ancestralVillage}
            onChange={e => onUpdate({ ancestralVillage: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="familyHistory">
            Family History
          </Label>
          <Textarea
            id="familyHistory"
            placeholder="Brief history of your family, notable ancestors, traditions"
            value={data.familyHistory}
            onChange={e => onUpdate({ familyHistory: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="communityContributions">
            Community Contributions
          </Label>
          <Textarea
            id="communityContributions"
            placeholder="Your or your family's contributions to the Mouryavansh community"
            value={data.communityContributions}
            onChange={e => onUpdate({ communityContributions: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="familyTraditions">
            Family Traditions
          </Label>
          <Textarea
            id="familyTraditions"
            placeholder="Special traditions, customs, or practices followed by your family"
            value={data.familyTraditions}
            onChange={e => onUpdate({ familyTraditions: e.target.value })}
            rows={4}
          />
        </div>

        {/* <div className="space-y-2">
          <Label className="text-red-800" htmlFor="knownCommunityRelatives">Known Community Relatives</Label>
          <Textarea
            id="knownCommunityRelatives"
            placeholder="Names of known relatives or connections within the community"
            value={data.knownCommunityRelatives}
            onChange={(e) => onUpdate({ knownCommunityRelatives: e.target.value })}
            rows={3}
          />
        </div> */}

        {/* <div className="space-y-2">
          <Label className="text-red-800" htmlFor="familyName">
            Family Name (Based on Topmost Ancestor) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="familyName"
            placeholder="e.g., Chandragupta Maurya Vansh, Kashyap Maurya Vansh"
            value={data.familyName}
            onChange={(e) => onUpdate({ familyName: e.target.value })}
          />
          <p className="text-xs text-gray-500">
            This will be your {"family's"} identifying name in the community directory
          </p>
        </div> */}

        {/* <div className="space-y-2">
          <Label className="text-red-800" htmlFor="familyTreeVisibility">Family Tree Visibility</Label>
          <Select
            value={data.familyTreeVisibility}
            onValueChange={(value) => onUpdate({ familyTreeVisibility: value })}
          >
            <SelectTrigger className="md:w-1/2">
              <SelectValue placeholder="Who can see your family tree?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public - Everyone can see</SelectItem>
              <SelectItem value="community">Community Members Only</SelectItem>
              <SelectItem value="relatives">Known Relatives Only</SelectItem>
              <SelectItem value="private">Private - Only Me</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>
    </div>
  );
}
