'use client';

import { Users } from 'lucide-react';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';

interface SiblingDetails {
  name?: string;
  occupation: string;
  maritalStatus: string;
  spouseName?: string;
  spouseOccupation?: string;
}

interface FamilyDetailsTabProps {
  data: {
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    brothers: string;
    sisters: string;
    familyIncome: string;
    brothersDetails?: SiblingDetails[];
    sistersDetails?: SiblingDetails[];
  };
  onUpdate: (data: Partial<FamilyDetailsTabProps['data']>) => void;
}

export function FamilyDetailsTab({ data, onUpdate }: FamilyDetailsTabProps) {
  const isEmpty = (val: string | undefined) => !val || val.trim() === '';

  const brothersCount = parseInt(data.brothers) || 0;
  const sistersCount = parseInt(data.sisters) || 0;

  // Initialize sibling details arrays if they don't exist or need resizing
  const initializeSiblingDetails = (count: number, currentDetails: SiblingDetails[] = []): SiblingDetails[] => {
    if (count === 0) return [];

    const details = [...currentDetails];
    while (details.length < count) {
      details.push({
        name: '',
        occupation: '',
        maritalStatus: '',
        spouseName: '',
        spouseOccupation: ''
      });
    }
    return details.slice(0, count);
  };

  // Update sibling details when count changes
  // Update sibling details when count changes
  const updateSiblingCount = (type: 'brothers' | 'sisters', value: string) => {
    const count = parseInt(value) || 0;
    const detailsKey = type === 'brothers' ? 'brothersDetails' : 'sistersDetails';
    const currentDetails = data[detailsKey] || [];

    onUpdate({
      [type]: value,
      [detailsKey]: initializeSiblingDetails(count, currentDetails) // ab 0 pe [] jayega
    });
  };

  // Update individual sibling details
  const updateSiblingDetails = (
    type: 'brothers' | 'sisters',
    index: number,
    field: keyof SiblingDetails,
    value: string
  ) => {
    const detailsKey = type === 'brothers' ? 'brothersDetails' : 'sistersDetails';
    const currentDetails = [...(data[detailsKey] || [])];

    if (!currentDetails[index]) {
      currentDetails[index] = {
        occupation: '',
        maritalStatus: '',
        spouseName: '',
        spouseOccupation: ''
      };
    }

    currentDetails[index] = { ...currentDetails[index], [field]: value };

    onUpdate({ [detailsKey]: currentDetails });
  };
  console.log(data);
  const renderSiblingFields = (type: 'brothers' | 'sisters', count: number) => {
    const detailsKey = type === 'brothers' ? 'brothersDetails' : 'sistersDetails';
    const details = data[detailsKey] || [];
    const siblingType = type === 'brothers' ? 'Brother' : 'Sister';
    const spouseType = type === 'brothers' ? 'Wife' : 'Husband';

    return Array.from({ length: count }, (_, index) => {
      const sibling = details[index] || {
        occupation: '',
        maritalStatus: '',
        spouseName: '',
        spouseOccupation: ''
      };
      const showSpouseDetails = sibling.maritalStatus === 'married';
      const siblingNumber = count > 1 ? ` ${index + 1}` : '';

      return (
        <div
          key={`${type}-${index}`}
          className="col-span-1 md:col-span-2 space-y-4 border border-red-200 rounded-lg p-4 bg-red-50/30"
        >
          <h3 className="font-medium text-red-800">
            {siblingType}
            {siblingNumber} Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-red-800">
                {siblingType}
                {siblingNumber} Name
              </Label>
              <Input
                placeholder={`Enter ${siblingType.toLowerCase()}'s name`}
                value={sibling.name}
                onChange={e => updateSiblingDetails(type, index, 'name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-red-800">
                {siblingType}
                {siblingNumber} Occupation
              </Label>
              <Input
                placeholder={`Enter ${siblingType.toLowerCase()}'s occupation`}
                value={sibling.occupation}
                onChange={e => updateSiblingDetails(type, index, 'occupation', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-red-800">
                {siblingType}
                {siblingNumber} Marital Status
              </Label>
              <Select
                value={sibling.maritalStatus}
                onValueChange={value => updateSiblingDetails(type, index, 'maritalStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showSpouseDetails && (
              <>
                <div className="space-y-2">
                  <Label className="text-red-800">
                    {siblingType}
                    {siblingNumber}'s {spouseType} Name
                  </Label>
                  <Input
                    placeholder={`Enter ${spouseType.toLowerCase()}'s name`}
                    value={sibling.spouseName || ''}
                    onChange={e => updateSiblingDetails(type, index, 'spouseName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-red-800">
                    {siblingType}
                    {siblingNumber}'s {spouseType} Occupation
                  </Label>
                  <Input
                    placeholder={`Enter ${spouseType.toLowerCase()}'s occupation`}
                    value={sibling.spouseOccupation || ''}
                    onChange={e => updateSiblingDetails(type, index, 'spouseOccupation', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-5 h-5 text-gray-600" />
        <div>
          <h2 className="text-xl font-semibold text-red-800">Family Details</h2>
          <p className="text-sm text-red-600">Information about your family background</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="fatherName">
            {"Father's Name"} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fatherName"
            placeholder="Enter father's name"
            value={data.fatherName}
            onChange={e => onUpdate({ fatherName: e.target.value })}
          />
          {isEmpty(data.fatherName) && <p className="text-sm text-red-600">Please enter your father's name</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="fatherOccupation">
            {"Father's Occupation"}
          </Label>
          <Input
            id="fatherOccupation"
            placeholder="Enter father's occupation"
            value={data.fatherOccupation}
            onChange={e => onUpdate({ fatherOccupation: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="motherName">
            {"Mother's Name"} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="motherName"
            placeholder="Enter mother's name"
            value={data.motherName}
            onChange={e => onUpdate({ motherName: e.target.value })}
          />
          {isEmpty(data.motherName) && <p className="text-sm text-red-600">Please enter your mother's name</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="motherOccupation">
            {"Mother's Occupation"}
          </Label>
          <Input
            id="motherOccupation"
            placeholder="Enter mother's occupation"
            value={data.motherOccupation}
            onChange={e => onUpdate({ motherOccupation: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="brothers">
            Brothers
          </Label>
          <Select value={data.brothers} onValueChange={value => updateSiblingCount('brothers', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="sisters">
            Sisters
          </Label>
          <Select value={data.sisters} onValueChange={value => updateSiblingCount('sisters', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="familyIncome">
            Family Income (Annual)
          </Label>
          <Select value={data.familyIncome} onValueChange={value => onUpdate({ familyIncome: value })}>
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

      {/* Render brother details */}
      {brothersCount > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-red-800">Brothers Information</h3>
          {renderSiblingFields('brothers', brothersCount)}
        </div>
      )}

      {/* Render sister details */}
      {sistersCount > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-red-800">Sisters Information</h3>
          {renderSiblingFields('sisters', sistersCount)}
        </div>
      )}
    </div>
  );
}
