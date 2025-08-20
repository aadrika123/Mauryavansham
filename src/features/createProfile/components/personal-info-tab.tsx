"use client";
import * as yup from "yup";
import { User, Sparkles, RefreshCw, X } from "lucide-react";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// AI-generated About Me templates based on gender and relation
const aboutMeTemplates = {
  male: {
    myself: [
      "I believe in living life with purpose and passion. A family-oriented person who values traditions while embracing modern values. Looking for a life partner who shares similar values and dreams of building a beautiful future together.",
      "Simple yet ambitious, I find joy in life's small moments and meaningful conversations. With a strong belief in respect and understanding, I'm seeking someone who appreciates genuine connections and shared growth in life's journey.",
      "Grounded in my roots yet open to new experiences, I value honesty, loyalty, and mutual respect. I'm looking for a companion who believes in partnership, shared dreams, and creating wonderful memories together.",
    ],
    son: [
      "A well-mannered young man with strong family values and a bright future ahead. He is respectful, hardworking, and believes in treating everyone with kindness. We are looking for a suitable match who will be a perfect addition to our loving family.",
      "Our son is a responsible and caring individual who values traditions and family bonds. With his dedication to work and respect for elders, he would make an ideal life partner for someone who shares similar values and aspirations.",
      "Brought up with good values and education, he is a perfect blend of traditional thinking and modern outlook. He believes in mutual respect and is ready to build a harmonious relationship based on trust and understanding.",
    ],
    brother: [
      "My brother is a gentleman with strong moral values and a caring nature. He believes in treating everyone with respect and kindness. Well-established in his career, he is ready to take on the responsibilities of married life.",
      "A responsible and family-oriented man who values relationships and traditions. He has always been supportive of family and friends, and we believe he will make an excellent husband for the right person.",
      "My brother is a perfect combination of strength and sensitivity. He respects women and believes in equality in relationships. We are seeking a life partner who will appreciate his qualities and share his dreams.",
    ],
  },
  female: {
    myself: [
      "A blend of traditional values and modern thinking, I believe in the beauty of relationships built on trust and understanding. Family-oriented and career-focused, I'm looking for a life partner who respects individuality while cherishing togetherness.",
      "Graceful yet strong, I find happiness in life's simple pleasures and meaningful relationships. With a heart full of dreams and feet firmly on the ground, I seek a companion who values love, respect, and shared aspirations.",
      "Rooted in culture yet progressive in thoughts, I believe in the power of mutual respect and understanding. Looking for someone who appreciates genuine connections and is ready to embark on life's beautiful journey together.",
    ],
    daughter: [
      "Our daughter is a beautiful soul with strong values and a bright personality. Well-educated and family-oriented, she believes in balancing career aspirations with family responsibilities. We seek a caring family for our precious daughter.",
      "A perfect blend of grace and strength, she is well-mannered and has been brought up with good values. She respects traditions while being open to new ideas. We are looking for a suitable match from a loving and understanding family.",
      "Our beloved daughter is kind-hearted, well-educated, and ready to embrace married life with joy and responsibility. She values family bonds and believes in creating a harmonious home filled with love and understanding.",
    ],
    sister: [
      "My sister is a wonderful person with a golden heart and strong character. Well-educated and family-oriented, she has always been the pillar of strength for our family. We are seeking a loving and respectful partner for her.",
      "A caring and responsible woman who believes in the importance of family values and relationships. She is ready to start a new chapter in her life with someone who appreciates her qualities and shares similar values.",
      "My dear sister combines traditional values with modern thinking. She is kind, understanding, and has a positive outlook on life. We are looking for a suitable match who will treasure her and build a happy life together.",
    ],
  },
  other: {
    myself: [
      "I am a person who believes in living life with authenticity and compassion. Family values are important to me, and I seek meaningful connections. Looking for someone who appreciates genuine relationships and shared growth.",
      "A thoughtful individual who values respect, understanding, and mutual support. I believe in the importance of communication and building strong foundations for lasting relationships.",
      "With a balanced approach to life, I appreciate both tradition and progress. Seeking a life partner who shares similar values and is ready to build a beautiful future together based on trust and understanding.",
    ],
  },
};

// Profile relation options for display
const profileRelationLabels = {
  myself: "Myself",
  daughter: "Daughter",
  son: "Son",
  sister: "Sister",
  brother: "Brother",
  other: "Other",
};

// AI About Me Suggestions Component
const AboutMeSuggestions = ({
  gender,
  relation,
  onSelect,
}: {
  gender: string;
  relation: string;
  onSelect: (text: string) => void;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateSuggestions = () => {
    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      const genderKey = gender.toLowerCase() as keyof typeof aboutMeTemplates;
      let relationKey = relation === "other" ? "myself" : relation;

      let templates: string[] = [];

      if (
        aboutMeTemplates[genderKey] &&
        aboutMeTemplates[genderKey][
          relationKey as keyof (typeof aboutMeTemplates)[typeof genderKey]
        ]
      ) {
        templates =
          aboutMeTemplates[genderKey][
            relationKey as keyof (typeof aboutMeTemplates)[typeof genderKey]
          ];
      } else if (aboutMeTemplates.other && aboutMeTemplates.other.myself) {
        // Fallback to other templates
        templates = aboutMeTemplates.other.myself;
      } else {
        // Final fallback
        templates = aboutMeTemplates.male.myself;
      }

      setSuggestions(templates);
      setIsGenerating(false);
    }, 1500);
  };
 

  useEffect(() => {
    if (gender && relation) {
      generateSuggestions();
    }
  }, [gender, relation]);

  if (!gender || !relation) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" />
          AI Suggested About Me
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateSuggestions}
          disabled={isGenerating}
          className="h-7 px-2"
        >
          {isGenerating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
        </Button>
      </div>

      {isGenerating ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 border rounded-md hover:border-orange-300 cursor-pointer transition-colors bg-orange-50/30 hover:bg-orange-50"
              onClick={() => onSelect(suggestion)}
            >
              <p className="text-sm text-gray-700 leading-relaxed">
                {suggestion}
              </p>
              <Badge variant="outline" className="mt-2 text-xs">
                Click to use
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
    // profileImage: string;
    profileImage1: string;
    profileImage2: string;
    profileImage3: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    gender: string;
  };
  onUpdate: (data: Partial<PersonalInfoTabProps["data"]>) => void;
  profileRelation?: string;
  customRelation?: string;
  validationErrors?: Record<string, string>;
}

export function PersonalInfoTab({
  data,
  onUpdate,
  profileRelation,
  customRelation,
  validationErrors = {},
}: PersonalInfoTabProps) {
  const getRelationDisplayText = () => {
    if (profileRelation === "other" && customRelation) {
      return customRelation;
    }
    return (
      profileRelationLabels[
        profileRelation as keyof typeof profileRelationLabels
      ] || "Unknown"
    );
  };
  function getMaxDob() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${today.getFullYear()}-${month}-${day}`;
  }
  const isEmpty = (val: string | undefined) => !val || val.trim() === "";
  const getFieldError = (fieldName: string): string => {
    return validationErrors[fieldName] || "";
  };

  const hasError = (fieldName: string): boolean => {
    return !!validationErrors[fieldName];
  };

  return (
    <div className="space-y-6">
      {/* Header and Profile Image */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-red-600" />
          <div>
            <h2 className="text-xl font-semibold text-red-800">
              Personal Information
            </h2>
            {/* <p className="text-sm text-red-600">
              Basic details about yourself
            </p> */}
            {profileRelation && (
              <p className="text-sm text-orange-600 font-medium mt-1">
                Profile For: {getRelationDisplayText()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-red-800">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter name"
            value={data.name}
            required
            className={hasError('name') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
          {hasError('name') && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('name')}</p>
          )}
          {isEmpty(data.name) && (
            <p className="text-xs text-red-500 mt-1">Name is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="nickName">
            Nick Name
          </Label>
          <Input
            id="nickName"
            placeholder="Enter nick name"
            value={data.nickName}
            onChange={(e) => onUpdate({ nickName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="dob">
            Date Of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dob"
            type="date"
            required
            value={data.dob}
            max={getMaxDob()}
            className={hasError('dob') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            onChange={(e) => onUpdate({ dob: e.target.value })}
          />
          {hasError('dob') && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('dob')}</p>
          )}
          {isEmpty(data.dob) && (
            <p className="text-xs text-red-500 mt-1">
              Date of birth is required
            </p>
          )}
        </div>

        {/* add gender */}
        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="gender">
            Gender <span className="text-red-500">*</span>
          </Label>
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
          {isEmpty(data.gender) && (
            <p className="text-xs text-red-500 mt-1">Gender is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="phoneNo">
            Phone No. <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNo"
            type="tel"
            required
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            placeholder="Enter 10 digit phone number"
            value={data.phoneNo}
            className={hasError('phoneNo') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              if (numericValue.length <= 10) {
                onUpdate({ phoneNo: numericValue });
              }
            }}
          />
          {hasError('phoneNo') && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('phoneNo')}</p>
          )}
          {isEmpty(data.phoneNo) ? (
            <p className="text-xs text-red-500 mt-1">
              Phone number is required
            </p>
          ) : (
            data.phoneNo.length !== 10 && (
              <p className="text-xs text-red-500 mt-1">
                Phone number must be 10 digits
              </p>
            )
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={data.email}
            required
            onChange={(e) => onUpdate({ email: e.target.value })}
          />
          {isEmpty(data.email) ? (
            <p className="text-xs text-red-500 mt-1">Email is required</p>
          ) : (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && (
              <p className="text-xs text-red-500 mt-1">
                Please enter a valid email address (e.g., example@mail.com)
              </p>
            )
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="height">
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
          {(!data.height ||
            !data.height.includes("'") ||
            data.height === "'") && (
            <p className="text-xs text-red-500 mt-1">Height is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="weight">
            Weight
          </Label>
          <Input
            id="weight"
            placeholder="Enter weight (kg)"
            type="number"
            value={data.weight}
            onChange={(e) => onUpdate({ weight: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="complexion">
            Complexion
          </Label>
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
          <Label className="text-red-800" htmlFor="bodyType">
            Body Type
          </Label>
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
          <Label className="text-red-800" htmlFor="maritalStatus">
            Marital Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.maritalStatus}
            onValueChange={(value) => onUpdate({ maritalStatus: value })}
          >
            <SelectTrigger className={hasError('maritalStatus') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}>
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              {["single", "married", "divorced", "widowed", "separated"].map(
                (status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          {hasError('maritalStatus') && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('maritalStatus')}</p>
          )}
          
        </div>

        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="languagesKnown">
            Languages Known
          </Label>
          <LanguagesInput
            value={data.languagesKnown} 
            onChange={(val) => onUpdate({ languagesKnown: val })} 
          />
        </div>

        {/* Facebook Link */}
        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="facebook">
            Facebook Profile Link
          </Label>
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
          <Label className="text-red-800" htmlFor="instagram">
            Instagram Profile Link
          </Label>
          <Input
            id="instagram"
            type="url"
            placeholder="https://instagram.com/yourprofile"
            value={data.instagram || ""}
            onChange={(e) => onUpdate({ instagram: e.target.value })}
          />
        </div>

        {/* LinkedIn Link */}
        <div className="space-y-2">
          <Label className="text-red-800" htmlFor="linkedin">
            LinkedIn Profile Link
          </Label>
          <Input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            value={data.linkedin || ""}
            onChange={(e) => onUpdate({ linkedin: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-red-800" htmlFor="hobbies">
            Hobbies & Interests
          </Label>
          <Textarea
            id="hobbies"
            placeholder="Tell us about your hobbies and interests"
            rows={3}
            value={data.hobbies}
            onChange={(e) => onUpdate({ hobbies: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-red-800" htmlFor="aboutMe">
            About Me
          </Label>
          <Textarea
            id="aboutMe"
            placeholder="Write a brief description about yourself or select from AI suggestions below..."
            rows={4}
            value={data.aboutMe}
            onChange={(e) => onUpdate({ aboutMe: e.target.value })}
          />

          {/* AI Suggestions for About Me */}
          {data.gender && profileRelation && (
            <AboutMeSuggestions
              gender={data.gender}
              relation={profileRelation}
              onSelect={(text) => onUpdate({ aboutMe: text })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

 function LanguagesInput({
    value,
    onChange,
  }: {
    value: string;
    onChange: (val: string) => void;
  }) {
    const languages = value ? value.split(",") : [];
    const [inputValue, setInputValue] = useState("");

    const addLanguage = () => {
      const newLang = inputValue.trim();
      if (newLang && !languages.includes(newLang)) {
        const updated = [...languages, newLang];
        onChange(updated.join(","));
      }
      setInputValue("");
    };

    const removeLanguage = (lang: string) => {
      const updated = languages.filter((l) => l !== lang);
      onChange(updated.join(","));
    };

    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            placeholder="Type language and press Add/Enter"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLanguage();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addLanguage}>
            Add
          </Button>
        </div>

        {/* Show added languages as tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {languages.map((lang, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
            >
              {lang}
              <X
                className="w-4 h-4 cursor-pointer hover:text-red-600"
                onClick={() => removeLanguage(lang)}
              />
            </span>
          ))}
        </div>
      </div>
    );
  }