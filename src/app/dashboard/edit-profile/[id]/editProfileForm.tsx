"use client";

import type React from "react";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { PersonalInfoTab } from "@/src/features/createProfile/components/personal-info-tab";
import { FamilyDetailsTab } from "@/src/features/createProfile/components/family-details-tab";
import { EducationCareerTab } from "@/src/features/createProfile/components/education-career-tab";
import { LifestyleTab } from "@/src/features/createProfile/components/lifestyle-tab";
import { GenealogyTab } from "@/src/features/createProfile/components/genealogy-tab";
import { Card } from "@/src/components/ui/card";
import { ProfileSidebar } from "@/src/features/createProfile/components/profile-sidebar";
import { useToast } from "@/src/components/ui/use-toast";
import { Toaster } from "@/src/components/ui/toaster";
import { createProfile } from "@/src/features/createProfile/actions/createProfile";
import { updateProfileById } from "@/src/features/updateProfileById/actions/updateProfileById";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Upload,
  X,
  User,
  Heart,
  Users,
  Check,
  Star,
  Sparkles,
  Target,
  Trophy,
  Zap,
  Plus,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import Loader from "@/src/components/ui/loader";
interface SiblingDetails {
  occupation: string;
  maritalStatus: string;
  spouseName?: string;
  spouseOccupation?: string;
  name?: string;
}
// Define the nested ProfileData type with multiple images
export type ProfileData = {
  id?: string;
  userId?: string;
  profileRelation?: string;
  customRelation?: string;
  personalInfo: {
    name: string;
    nickName: string;
    phoneNo: string;
    email: string;
    dob: string;
    gender: string;
    height: string;
    weight: string;
    complexion: string;
    bodyType: string;
    maritalStatus: string;
    languagesKnown: string;
    hobbies: string;
    aboutMe: string;
    profileImage1: string; // Primary image
    profileImage2: string; // Secondary image
    profileImage3: string; // Third image
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  familyDetails: {
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    brothers: string;
    sisters: string;
    marriedSiblings: string;
    familyType: string;
    familyValues: string;
    familyIncome: string;
    familyLocation: string;
    familyStatus?: string;
    brothersDetails?: SiblingDetails[];
    sistersDetails?: SiblingDetails[];
    
  };
  educationCareer: {
    highestEducation: string;
    collegeUniversity: string;
    occupation: string;
    companyOrganization: string;
    designation: string;
    workLocation: string;
    annualIncome: string;
    workExperience: string;
    website: string;
    education?: string;
  };
  lifestyle: {
    diet: string;
    smoking: string;
    drinking: string;
    exercise: string;
    religiousBeliefs: string;
    musicPreferences: string;
    moviePreferences: string;
    readingInterests: string;
    travelInterests: string;
    castPreferences: string;
  };
  genealogy: {
    gotraDetails: string;
    ancestralVillage: string;
    familyHistory: string;
    communityContributions: string;
    familyTraditions: string;
  };
  partnerPreferences?: {
    ageRange: {
      min: string;
      max: string;
    };
    heightRange: {
      min: string;
      max: string;
    };
  };
};

// Updated FlatProfileData type
export type FlatProfileData = {
  id: string;
  userId: string;
  profileRelation: string;
  customRelation: string;
  name: string;
  nickName: string;
  phoneNo: string;
  email: string;
  dob: string;
  gender: string;
  height: string;
  weight: string;
  complexion: string;
  bodyType: string;
  maritalStatus: string;
  languagesKnown: string;
  hobbies: string;
  aboutMe: string;
  profileImage1: string;
  profileImage2: string;
  profileImage3: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brothers: string;
  sisters: string;
  marriedSiblings: string;
  familyType: string;
  familyValues: string;
  familyIncome: string;
  familyLocation: string;
  highestEducation: string;
  collegeUniversity: string;
  occupation: string;
  companyOrganization: string;
  designation: string;
  workLocation: string;
  annualIncome: string;
  workExperience: string;
  website: string;
  diet: string;
  smoking: string;
  drinking: string;
  exercise: string;
  religiousBeliefs: string;
  musicPreferences: string;
  moviePreferences: string;
  readingInterests: string;
  travelInterests: string;
  castPreferences: string;
  gotraDetails: string;
  ancestralVillage: string;
  familyHistory: string;
  communityContributions: string;
  familyTraditions: string;
  brothersDetails?: SiblingDetails[];
  sistersDetails?: SiblingDetails[];
};

// Profile relation options
const profileRelations = [
  { value: "myself", label: "Myself", icon: User },
  { value: "daughter", label: "For Daughter", icon: Heart },
  { value: "son", label: "For Son", icon: Users },
  { value: "sister", label: "For Sister", icon: Heart },
  { value: "brother", label: "For Brother", icon: Users },
  { value: "other", label: "Other", icon: Users },
];

// Function to get gender based on profile relation
const getGenderFromRelation = (relation: string): string => {
  switch (relation) {
    case "son":
    case "brother":
      return "Male";
    case "daughter":
    case "sister":
      return "Female";
    case "myself":
    case "other":
    default:
      return "";
  }
};

// Tab configuration with progress tracking and motivational messages
const tabConfig = [
  {
    id: "personal-info",
    title: "Personal Information",
    step: 1,
    message: {
      title: "Let's start with the basics! ✨",
      subtitle:
        "Share your personal details to create an amazing first impression",
      icon: Star,
    },
  },
  {
    id: "family-details",
    title: "Family Details",
    step: 2,
    message: {
      title: "Tell us about your family! 👨‍👩‍👧‍👦",
      subtitle: "Family background helps create meaningful connections",
      icon: Heart,
    },
  },
  {
    id: "education-career",
    title: "Education & Career",
    step: 3,
    message: {
      title: "Showcase your achievements! 🎓",
      subtitle:
        "Your education and career journey matters to potential matches",
      icon: Trophy,
    },
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    step: 4,
    message: {
      title: "Share your lifestyle choices! 🌟",
      subtitle: "Help others understand your daily life and preferences",
      icon: Sparkles,
    },
  },
  {
    id: "genealogy",
    title: "Genealogy",
    step: 5,
    message: {
      title: "Complete your heritage story! 🏛️",
      subtitle: "Your family traditions and roots create a complete picture",
      icon: Target,
    },
  },
];

// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
      <div
        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
        style={{ width: `${progressPercentage}%` }}
      >
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
      </div>
    </div>
  );
};

// Motivational Message Component
const MotivationalMessage = ({
  title,
  subtitle,
  icon: Icon,
  currentStep,
}: {
  title: string;
  subtitle: string;
  icon: any;
  currentStep: number;
}) => {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-orange-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-orange-800">{title}</h3>
            <div className="flex items-center space-x-1 text-sm text-orange-600">
              <Zap className="w-4 h-4" />
              <span>Step {currentStep} of 5</span>
            </div>
          </div>
          <p className="text-orange-700 text-sm">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

// Profile Relation Popup Component
const ProfileRelationPopup = ({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (relation: string, customRelation?: string) => void;
}) => {
  const [selectedRelation, setSelectedRelation] = useState("");
  const [customRelation, setCustomRelation] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (selectedRelation) {
      onSelect(
        selectedRelation,
        selectedRelation === "other" ? customRelation : undefined
      );
      onClose();
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-700">
            Create Profile For?
          </DialogTitle>
          <DialogDescription>
            Please select who you are creating this profile for
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup
            value={selectedRelation}
            onValueChange={setSelectedRelation}
            className="grid grid-cols-2 gap-3"
          >
            {profileRelations.map((relation) => {
              const Icon = relation.icon;
              return (
                <div
                  key={relation.value}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem value={relation.value} id={relation.value} />
                  <label
                    htmlFor={relation.value}
                    className="flex items-center space-x-2 cursor-pointer text-sm font-medium p-2 rounded-md hover:bg-orange-50 flex-1"
                  >
                    <Icon className="w-4 h-4 text-orange-600" />
                    <span>{relation.label}</span>
                  </label>
                </div>
              );
            })}
          </RadioGroup>

          {selectedRelation === "other" && (
            <div className="space-y-2">
              <Label htmlFor="customRelation">Specify Relationship</Label>
              <Input
                id="customRelation"
                value={customRelation}
                onChange={(e) => setCustomRelation(e.target.value)}
                placeholder="e.g., Cousin, Nephew, Friend"
                className="focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !selectedRelation ||
                (selectedRelation === "other" && !customRelation)
              }
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ValidationPopup = ({
  isOpen,
  onClose,
  errors,
  currentStep,
}: {
  isOpen: boolean;
  onClose: () => void;
  errors: Record<string, string>;
  currentStep: number;
}) => {
  const getStepName = (step: number) => {
    switch (step) {
      case 1:
        return "Personal Information";
      case 2:
        return "Family Details";
      case 3:
        return "Education & Career";
      case 4:
        return "Partner Preferences";
      case 5:
        return "Photos";
      default:
        return "Form";
    }
  };

  const errorMessages = Object.entries(errors).map(([field, message]) => ({
    field,
    message,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-600 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Validation Error
          </DialogTitle>
          <DialogDescription>
            Please fill all the required fields for {getStepName(currentStep)}:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {errorMessages.map(({ field, message }, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-red-50 rounded-md border border-red-200"
            >
              <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-700">{message}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-red-600 hover:bg-red-700">
            Edit form
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type CreateProfilePageProps = {
  profile?: ProfileData;
  type?: "create" | "edit";
};

export default function EditProfileForm({
  profile,
  type = "create",
}: CreateProfilePageProps) {
  const [showRelationPopup, setShowRelationPopup] = useState(type === "create");
  const [profileRelation, setProfileRelation] = useState("");
  const [customRelation, setCustomRelation] = useState("");
  const [activeTab, setActiveTab] = useState("personal-info");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  const router = useRouter();

  // Multiple file input refs
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);

  // State for multiple image uploads
  const [selectedImages, setSelectedImages] = useState<{
    image1: File | null;
    image2: File | null;
    image3: File | null;
  }>({
    image1: null,
    image2: null,
    image3: null,
  });

  const [imagePreviews, setImagePreviews] = useState<{
    preview1: string;
    preview2: string;
    preview3: string;
  }>({
    preview1: "",
    preview2: "",
    preview3: "",
  });

  const [isUploadingImages, setIsUploadingImages] = useState<{
    image1: boolean;
    image2: boolean;
    image3: boolean;
  }>({
    image1: false,
    image2: false,
    image3: false,
  });

  // Get current tab configuration
  const currentTabConfig = tabConfig.find((tab) => tab.id === activeTab);
  const currentStep = currentTabConfig?.step || 1;

  const [profileData, setProfileData] = useState<ProfileData>(() => {
    if (type === "edit" && profile) {
      // For edit mode, don't show popup and set existing data
      setShowRelationPopup(false);
      setProfileRelation(profile.profileRelation || "myself");
      setCustomRelation(profile.customRelation || "");

      // Set image previews if editing existing profile
      setImagePreviews({
        preview1: profile.personalInfo.profileImage1 || "",
        preview2: profile.personalInfo.profileImage2 || "",
        preview3: profile.personalInfo.profileImage3 || "",
      });

      return profile;
    }
    return {
      userId: "",
      profileRelation: "",
      customRelation: "",
      personalInfo: {
        name: "",
        nickName: "",
        phoneNo: "",
        email: "",
        dob: "",
        gender: "",
        height: "",
        weight: "",
        complexion: "",
        bodyType: "",
        maritalStatus: "",
        languagesKnown: "",
        hobbies: "",
        aboutMe: "",
        profileImage1: "",
        profileImage2: "",
        profileImage3: "",
        facebook: "",
        instagram: "",
        linkedin: "",
      },
      familyDetails: {
        fatherName: "",
        fatherOccupation: "",
        motherName: "",
        motherOccupation: "",
        brothers: "",
        sisters: "",
        marriedSiblings: "",
        familyType: "",
        familyValues: "",
        familyIncome: "",
        familyLocation: "",
        familyStatus: "",
        brothersDetails: [],
        sistersDetails: [],
      },
      educationCareer: {
        highestEducation: "",
        collegeUniversity: "",
        occupation: "",
        companyOrganization: "",
        designation: "",
        workLocation: "",
        annualIncome: "",
        workExperience: "",
        website: "",
        education: "",
      },
      lifestyle: {
        diet: "",
        smoking: "",
        drinking: "",
        exercise: "",
        religiousBeliefs: "",
        musicPreferences: "",
        moviePreferences: "",
        readingInterests: "",
        travelInterests: "",
        castPreferences: "",
      },
      genealogy: {
        gotraDetails: "",
        ancestralVillage: "",
        familyHistory: "",
        communityContributions: "",
        familyTraditions: "",
      },
      partnerPreferences: {
        ageRange: {
          min: "",
          max: "",
        },
        heightRange: {
          min: "",
          max: "",
        },
      },
    };
  });

  const updateProfileData = (
    section: keyof Omit<
      ProfileData,
      "id" | "userId" | "profileRelation" | "customRelation"
    >,
    data: Partial<
      ProfileData[keyof Omit<
        ProfileData,
        "id" | "userId" | "profileRelation" | "customRelation"
      >]
    >
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const validateCurrentStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1: // Personal Info
        if (!profileData.personalInfo.name.trim()) {
          errors.name = "Name is required";
        }
        if (!profileData.personalInfo.email.trim()) {
          errors.email = "Email is required";
        } else if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.personalInfo.email)
        ) {
          errors.email = "Please enter a valid email address";
        }
        if (!profileData.personalInfo.phoneNo.trim()) {
          errors.phoneNo = "Phone number is required";
        } else if (profileData.personalInfo.phoneNo.length !== 10) {
          errors.phoneNo = "Phone number must be exactly 10 digits";
        } else if (!/^\d{10}$/.test(profileData.personalInfo.phoneNo)) {
          errors.phoneNo = "Phone number must contain only digits";
        }
        if (!profileData.personalInfo.dob) {
          errors.dob = "Date of birth is required";
        }
        if (!profileData.personalInfo.gender) {
          errors.gender = "Gender is required";
        }
        if (
          !profileData.personalInfo.height ||
          profileData.personalInfo.height === "'" ||
          !profileData.personalInfo.height.includes("'")
        ) {
          errors.height = "Height is required";
        }
        if (!profileData.personalInfo.maritalStatus) {
          errors.maritalStatus = "Marital status is required";
        }
        if (!profileRelation) {
          errors.profileRelation =
            "Please select who you are creating this profile for";
        }
        if (profileRelation === "other" && !customRelation.trim()) {
          errors.customRelation = "Please specify the relationship";
        }
        break;

      case 2: // Family Details
        if (!profileData.familyDetails.fatherName.trim()) {
          errors.fatherName = "Father's name is required";
        }
        if (!profileData.familyDetails.motherName.trim()) {
          errors.motherName = "Mother's name is required";
        }
        // if (!profileData.familyDetails.familyType) {
        //   errors.familyType = "Family type is required";
        // }
        // if (!profileData.familyDetails.familyStatus) {
        //   errors.familyStatus = "Family status is required";
        // }
        break;

      // case 3: // Education & Career
      //   if (!profileData.educationCareer.education?.trim()) {
      //     errors.education = "Education is required";
      //   }
      //   if (!profileData.educationCareer.occupation.trim()) {
      //     errors.occupation = "Occupation is required";
      //   }
      //   if (!profileData.educationCareer.annualIncome.trim()) {
      //     errors.annualIncome = "Annual income is required";
      //   }
      //   break;

      // case 4: // Partner Preferences
      //   if (
      //     !profileData.partnerPreferences?.ageRange?.min ||
      //     !profileData.partnerPreferences?.ageRange?.max
      //   ) {
      //     errors.ageRange = "Age range is required";
      //   }
      //   if (
      //     !profileData.partnerPreferences?.heightRange?.min ||
      //     !profileData.partnerPreferences?.heightRange?.max
      //   ) {
      //     errors.heightRange = "Height range is required";
      //   }
      //   break;

      // case 5: // Photos
      //   if (!profileData.personalInfo.profileImage1) {
      //     errors.profileImage1 = "At least one photo is required";
      //   }
      //   break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = (): boolean => {
    return validateCurrentStep(currentStep);
  };

  // Show validation errors as toast
  // const showValidationErrors = () => {
  //   const errorMessages = Object.values(validationErrors);
  //   if (errorMessages.length > 0) {
  //     toast({
  //       title: "Please fix the following errors:",
  //       description: (
  //         <ul className="list-disc pl-4 mt-2">
  //           {errorMessages.slice(0, 3).map((error, index) => (
  //             <li key={index} className="text-sm">
  //               {error}
  //             </li>
  //           ))}
  //           {errorMessages.length > 3 && (
  //             <li className="text-sm">
  //               ...and {errorMessages.length - 3} more errors
  //             </li>
  //           )}
  //         </ul>
  //       ),
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleRelationSelect = (relation: string, customRel?: string) => {
    setProfileRelation(relation);
    setCustomRelation(customRel || "");

    // Automatically set gender based on relation
    const autoGender = getGenderFromRelation(relation);

    setProfileData((prev) => ({
      ...prev,
      profileRelation: relation,
      customRelation: customRel || "",
      personalInfo: {
        ...prev.personalInfo,
        gender: autoGender, // Auto-set gender here
      },
    }));
  };

  // Handle multiple image selection
  const handleImageSelect = (
    imageNumber: 1 | 2 | 3,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Update selected images
      setSelectedImages((prev) => ({
        ...prev,
        [`image${imageNumber}`]: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => ({
          ...prev,
          [`preview${imageNumber}`]: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleImageRemove = (imageNumber: 1 | 2 | 3) => {
    setSelectedImages((prev) => ({
      ...prev,
      [`image${imageNumber}`]: null,
    }));

    setImagePreviews((prev) => ({
      ...prev,
      [`preview${imageNumber}`]: "",
    }));

    // Update profile data
    const imageField =
      imageNumber === 1
        ? "profileImage1"
        : imageNumber === 2
        ? "profileImage2"
        : "profileImage3";
    updateProfileData("personalInfo", { [imageField]: "" });

    // Clear file input
    const fileInput =
      imageNumber === 1
        ? fileInputRef1.current
        : imageNumber === 2
        ? fileInputRef2.current
        : fileInputRef3.current;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Upload image to server
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      return result.imageUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  // Upload multiple images
  const uploadMultipleImages = async () => {
    const imageUrls = {
      profileImage1: profileData.personalInfo.profileImage1,
      profileImage2: profileData.personalInfo.profileImage2 || "",
      profileImage3: profileData.personalInfo.profileImage3 || "",
    };

    // Upload image 1
    if (selectedImages.image1) {
      setIsUploadingImages((prev) => ({ ...prev, image1: true }));
      try {
        imageUrls.profileImage1 = await uploadImage(selectedImages.image1);
      } catch (error) {
        toast({
          title: "Image 1 Upload Failed",
          description: "Failed to upload primary image.",
          variant: "destructive",
        });
      } finally {
        setIsUploadingImages((prev) => ({ ...prev, image1: false }));
      }
    }

    // Upload image 2
    if (selectedImages.image2) {
      setIsUploadingImages((prev) => ({ ...prev, image2: true }));
      try {
        imageUrls.profileImage2 = await uploadImage(selectedImages.image2);
      } catch (error) {
        toast({
          title: "Image 2 Upload Failed",
          description: "Failed to upload second image.",
          variant: "destructive",
        });
      } finally {
        setIsUploadingImages((prev) => ({ ...prev, image2: false }));
      }
    }

    // Upload image 3
    if (selectedImages.image3) {
      setIsUploadingImages((prev) => ({ ...prev, image3: true }));
      try {
        imageUrls.profileImage3 = await uploadImage(selectedImages.image3);
      } catch (error) {
        toast({
          title: "Image 3 Upload Failed",
          description: "Failed to upload third image.",
          variant: "destructive",
        });
      } finally {
        setIsUploadingImages((prev) => ({ ...prev, image3: false }));
      }
    }

    return imageUrls;
  };

  // Image Upload Component
  const ImageUploadSlot = ({
    imageNumber,
    preview,
    isUploading,
  }: {
    imageNumber: 1 | 2 | 3;
    preview: string;
    isUploading: boolean;
  }) => {
    const fileInputRef =
      imageNumber === 1
        ? fileInputRef1
        : imageNumber === 2
        ? fileInputRef2
        : fileInputRef3;

    return (
      <div className="flex flex-col items-center">
        {/* Image Preview */}
        <div className="relative mb-3">
          {preview ? (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-orange-200">
              <Image
                src={preview || "/placeholder.svg"}
                alt={`Profile preview ${imageNumber}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => handleImageRemove(imageNumber)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
              {imageNumber === 1 && (
                <div className="absolute bottom-0 left-0 bg-orange-600 text-white text-xs px-2 py-1 rounded-tr-md">
                  Primary
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-24 h-24 rounded-lg bg-gray-100 border-2 border-dashed border-orange-200 flex items-center justify-center cursor-pointer hover:border-orange-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              ) : (
                <Plus className="w-6 h-6 text-gray-400" />
              )}
            </div>
          )}
        </div>

        {/* Upload Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageSelect(imageNumber, e)}
          className="hidden"
        />

        {/* Upload Button */}
        {!preview && (
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            size="sm"
            variant="outline"
            className="text-[10px] border-orange-300 text-orange-600 hover:bg-orange-50"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <Upload className="mr-1 h-3 w-3 " />
                Add Photo {imageNumber}
              </>
            )}
          </Button>
        )}

        {/* Image Label */}
        <p className="text-xs text-gray-500 mt-1 text-center">
          {imageNumber === 1 ? "Primary Photo" : `Photo ${imageNumber}`}
        </p>
      </div>
    );
  };

  const handleNextStep = () => {
    if (!validateCurrentStep(currentStep)) {
      setShowValidationPopup(true);
      return;
    }

    const nextTab = tabConfig.find((tab) => tab.step === currentStep + 1);
    if (nextTab) setActiveTab(nextTab.id);
  };

  const handlePreviousStep = () => {
    const prevTab = tabConfig.find((tab) => tab.step === currentStep - 1);
    if (prevTab) setActiveTab(prevTab.id);
  };

  // Updated handleCompleteProfile function
  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    for (let step = 1; step <= 5; step++) {
      if (!validateCurrentStep(step)) {
        hasErrors = true;
        break;
      }
    }

    if (hasErrors) {
      setShowValidationPopup(true);
      return;
    }

    startTransition(async () => {
      try {
        // Upload all selected images
        const imageUrls = await uploadMultipleImages();

        // Create FormData for server action
        const formData = new FormData();

        console.log("=== CLIENT FORM DATA PREPARATION ===");
        console.log("Profile data:", profileData);

        // Add profile relation data
        if (profileRelation) {
          formData.append("profileRelation", profileRelation);
          console.log("Added profileRelation:", profileRelation);
        }
        if (customRelation) {
          formData.append("customRelation", customRelation);
          console.log("Added customRelation:", customRelation);
        }

        // Add all personal info fields including multiple images
        Object.entries(profileData.personalInfo).forEach(([key, value]) => {
          if (key === "profileImage1") {
            const finalImageUrl = imageUrls.profileImage1 || value || "";
            if (finalImageUrl) {
              formData.append(key, finalImageUrl);
              console.log(`Added ${key}:`, finalImageUrl);
            }
          } else if (key === "profileImage2") {
            const finalImageUrl = imageUrls.profileImage2 || value || "";
            if (finalImageUrl) {
              formData.append(key, finalImageUrl);
              console.log(`Added ${key}:`, finalImageUrl);
            }
          } else if (key === "profileImage3") {
            const finalImageUrl = imageUrls.profileImage3 || value || "";
            if (finalImageUrl) {
              formData.append(key, finalImageUrl);
              console.log(`Added ${key}:`, finalImageUrl);
            }
          } else if (value) {
            formData.append(key, String(value));
            console.log(`Added ${key}:`, value);
          }
        });

        // Add all other sections (family details, education/career, lifestyle, genealogy)
        Object.entries(profileData.familyDetails).forEach(([key, value]) => {
          if (value) {
            // Agar value array ya object hai, to stringify karke bhejo
            if (Array.isArray(value) || typeof value === "object") {
              formData.append(key, JSON.stringify(value));
              console.log(`Added ${key}:`, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
              console.log(`Added ${key}:`, value);
            }
          }
        });

        Object.entries(profileData.educationCareer).forEach(([key, value]) => {
          if (value) {
            formData.append(key, String(value));
            console.log(`Added ${key}:`, value);
          }
        });

        Object.entries(profileData.lifestyle).forEach(([key, value]) => {
          if (value) {
            formData.append(key, String(value));
            console.log(`Added ${key}:`, value);
          }
        });

        Object.entries(profileData.genealogy).forEach(([key, value]) => {
          if (value) {
            formData.append(key, String(value));
            console.log(`Added ${key}:`, value);
          }
        });

        // Debug: Log all form data entries
        console.log("=== FINAL FORM DATA ENTRIES ===");
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        let result: { success: boolean; message?: string; data?: ProfileData } =
          {
            success: false,
          };

        if (type === "edit" && profileData.id) {
          toast({
            title: "Updating Profile",
            description: "Please wait while we update your profile...",
          });

          result = await updateProfileById(formData, profileData.id);
          console.log("Update result:", result);

          if (result.success) {
            toast({
              title: "Profile Updated",
              description: "Your profile has been updated successfully!",
            });

            setTimeout(() => {
              router.push(
                `/dashboard/view-profile/${result?.data?.id || profileData.id}`
              );
            }, 1500);
          } else {
            toast({
              title: "Update Failed",
              description: result.message || "Failed to update profile",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Creating Profile",
            description: "Please wait while we create your profile...",
          });

          console.log("=== CALLING CREATE PROFILE SERVER ACTION ===");
          const createResult = await createProfile(
            {
              success: false,
              message: "",
              timestamp: Date.now(),
            },
            formData
          );

          console.log("Create result:", createResult);

          if (createResult.success) {
            toast({
              title: "Profile Created",
              description: "Your profile has been created successfully!",
            });

            if (createResult?.data?.id) {
              setTimeout(() => {
                router.push(`/dashboard/view-profile/${createResult.data.id}`);
              }, 1500);
            }
          } else {
            toast({
              title: "Creation Failed",
              description: createResult.message || "Failed to create profile",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Profile operation error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "personal-info":
        return (
          <PersonalInfoTab
            data={profileData.personalInfo}
            onUpdate={(data) => updateProfileData("personalInfo", data)}
            profileRelation={profileRelation}
            customRelation={customRelation}
            validationErrors={validationErrors}
          />
        );
      case "family-details":
        return (
          <FamilyDetailsTab
            data={profileData.familyDetails}
            onUpdate={(data) => updateProfileData("familyDetails", data)}
          />
        );
      case "education-career":
        return (
          <EducationCareerTab
            data={profileData.educationCareer}
            onUpdate={(data) => updateProfileData("educationCareer", data)}
          />
        );
      case "lifestyle":
        return (
          <LifestyleTab
            data={profileData.lifestyle}
            onUpdate={(data) => updateProfileData("lifestyle", data)}
          />
        );
      case "genealogy":
        return (
          <GenealogyTab
            data={profileData.genealogy}
            onUpdate={(data) => updateProfileData("genealogy", data)}
          />
        );
      default:
        return null;
    }
  };

  // Show popup if it's create mode and popup should be shown
  if (showRelationPopup && type === "create") {
    return (
      <div className="min-h-screen bg-orange-50">
        <ProfileRelationPopup
          isOpen={showRelationPopup}
          onClose={() => setShowRelationPopup(false)}
          onSelect={handleRelationSelect}
        />
      </div>
    );
  }

  const isAnyImageUploading =
    isUploadingImages.image1 ||
    isUploadingImages.image2 ||
    isUploadingImages.image3;

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <Loader />
        </div>
      )}
      <ValidationPopup
        isOpen={showValidationPopup}
        onClose={() => setShowValidationPopup(false)}
        errors={validationErrors}
        currentStep={currentStep}
      />
      <div className="min-h-screen bg-orange-50 mt-6  mr-16">
        <form onSubmit={handleCompleteProfile}>
          <div className="max-w-full mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
              <ProgressBar currentStep={currentStep} />
            </div>
            {/* Show Profile Relation Error */}
            {validationErrors.profileRelation && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">
                  {validationErrors.profileRelation}
                </p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                {/* Multiple Photo Upload Section */}
                <Card className="p-4 mb-4">
                  <h3 className="text-lg font-semibold mb-4 text-center text-orange-800">
                    Profile Photos
                  </h3>

                  {/* Multiple Image Upload Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <ImageUploadSlot
                      imageNumber={1}
                      preview={imagePreviews.preview1}
                      isUploading={isUploadingImages.image1}
                    />
                    <ImageUploadSlot
                      imageNumber={2}
                      preview={imagePreviews.preview2}
                      isUploading={isUploadingImages.image2}
                    />
                    <ImageUploadSlot
                      imageNumber={3}
                      preview={imagePreviews.preview3}
                      isUploading={isUploadingImages.image3}
                    />
                  </div>

                  <p className="text-xs text-gray-500 text-center mb-4">
                    Upload up to 3 photos • Max 5MB each • JPG, PNG
                  </p>

                  {/* Photo Guidelines */}
                  <div className="mt-6 text-center">
                    <h4 className="text-sm font-medium text-orange-700 mb-3">
                      Photo Guidelines
                    </h4>
                    <div className="flex justify-center gap-2">
                      {/* Image 1 - Valid */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                          <Image
                            src="https://img.shaadi.com/imgs/registration/male-closeup-v2.gif"
                            alt="Example 1"
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <Check className="absolute -top-2 -right-2 w-5 h-5 text-green-500 bg-white rounded-full shadow" />
                        <p className="text-xs mt-1">Close Up</p>
                      </div>

                      {/* Image 2 - Valid */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                          <Image
                            src="https://img.shaadi.com/imgs/registration/male-full-view-v2.gif"
                            alt="Example 2"
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <Check className="absolute -top-2 -right-2 w-5 h-5 text-green-500 bg-white rounded-full shadow" />
                        <p className="text-xs mt-1">Full View</p>
                      </div>

                      {/* Image 3 - Invalid */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                          <Image
                            src="https://img.shaadi.com/imgs/registration/male-face-blur-v2.gif"
                            alt="Invalid Example 1"
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <X className="absolute -top-2 -right-2 w-5 h-5 text-red-500 bg-white rounded-full shadow" />
                        <p className="text-xs mt-1">Blur</p>
                      </div>

                      {/* Image 4 - Invalid */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                          <Image
                            src="https://img.shaadi.com/imgs/registration/male-face-group.gif"
                            alt="Invalid Example 2"
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <X className="absolute -top-2 -right-2 w-5 h-5 text-red-500 bg-white rounded-full shadow" />
                        <p className="text-xs mt-1">Group</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <ProfileSidebar
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>

              <div className="lg:col-span-2">
                {/* Motivational Message */}
                {currentTabConfig && (
                  <MotivationalMessage
                    title={currentTabConfig.message.title}
                    subtitle={currentTabConfig.message.subtitle}
                    icon={currentTabConfig.message.icon}
                    currentStep={currentStep}
                  />
                )}

                <Card className="p-6">
                  {renderActiveTab()}
                  {/* </form> */}
                </Card>

                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 mb-10">
                  {/* Navigation Buttons */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* Previous Button */}
                    {currentStep > 1 && (
                      <Button
                        onClick={handlePreviousStep}
                        variant="outline"
                        type="button"
                        className="w-full sm:w-auto border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                      >
                        ← Previous
                      </Button>
                    )}

                    {currentStep < 5 && (
                      <Button
                        onClick={handleNextStep}
                        type="button"
                        className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
                      >
                        Next →
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      type="submit"
                      className={`w-full sm:w-auto ${
                        currentStep === 5
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-orange-600 hover:bg-orange-700"
                      }`}
                      disabled={isPending || isAnyImageUploading}
                    >
                      {isPending || isAnyImageUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isAnyImageUploading
                            ? "Uploading Images..."
                            : type === "edit"
                            ? "Updating..."
                            : "Creating..."}
                        </>
                      ) : type === "edit" ? (
                        "Update Profile"
                      ) : currentStep === 5 ? (
                        "Complete Profile ✨"
                      ) : (
                        "Save & Complete Later"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <Toaster />
      </div>
    </>
  );
}
