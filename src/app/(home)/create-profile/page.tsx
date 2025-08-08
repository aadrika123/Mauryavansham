"use client";

import { useState, useEffect, useTransition, useRef } from "react";
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
  Camera,
  Crown,
  User,
  Heart,
  Users,
  Check,
  Star,
  Sparkles,
  Target,
  Trophy,
  Zap,
  ArrowLeft,
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
import Link from "next/link";

// Define the nested ProfileData type as per your original structure
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
    profileImage: string;
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
};

// Define a type for the flat data structure that might come from getProfileById
export type FlatProfileData = {
  id: string;
  userId: string;
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
  profileImage: string;
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

// Tab configuration with progress tracking and motivational messages
const tabConfig = [
  {
    id: "personal-info",
    title: "Personal Information",
    step: 1,
    message: {
      title: "Let's start with the basics! ✨",
      subtitle: "Share your personal details to create an amazing first impression",
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
      subtitle: "Your education and career journey matters to potential matches",
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
  currentStep 
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
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Button onClick={onClose} variant="outline" className="flex-1">
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

type CreateProfilePageProps = {
  profile?: ProfileData;
  type?: "create" | "edit";
};

export default function CreateProfilePage({
  profile,
  type = "create",
}: CreateProfilePageProps) {
  const [showRelationPopup, setShowRelationPopup] = useState(type === "create");
  const [profileRelation, setProfileRelation] = useState("");
  const [customRelation, setCustomRelation] = useState("");
  const [activeTab, setActiveTab] = useState("personal-info");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for image upload
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Get current tab configuration
  const currentTabConfig = tabConfig.find(tab => tab.id === activeTab);
  const currentStep = currentTabConfig?.step || 1;

  const [profileData, setProfileData] = useState<ProfileData>(() => {
    if (type === "edit" && profile) {
      // For edit mode, don't show popup and set existing data
      setShowRelationPopup(false);
      setProfileRelation(profile.profileRelation || "myself");
      setCustomRelation(profile.customRelation || "");
      // Set image preview if editing existing profile
      if (profile.personalInfo.profileImage) {
        setImagePreview(profile.personalInfo.profileImage);
      }
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
        profileImage: "",
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

  const handleRelationSelect = (relation: string, customRel?: string) => {
    setProfileRelation(relation);
    setCustomRelation(customRel || "");
    setProfileData((prev) => ({
      ...prev,
      profileRelation: relation,
      customRelation: customRel || "",
    }));
  };

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview("");
    updateProfileData("personalInfo", { profileImage: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload image to server (you'll need to implement this endpoint)
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

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        let imageUrl = profileData.personalInfo.profileImage;

        // Upload new image if selected
        if (selectedImage) {
          setIsUploadingImage(true);
          try {
            imageUrl = await uploadImage(selectedImage);
            updateProfileData("personalInfo", { profileImage: imageUrl });
          } catch (error) {
            toast({
              title: "Image Upload Failed",
              description: "Failed to upload image. Proceeding without image.",
              variant: "destructive",
            });
          } finally {
            setIsUploadingImage(false);
          }
        }

        const data = new FormData();

        // Always include userId if it exists in profileData
        if (profileData.userId) {
          data.append("userId", profileData.userId);
        }

        // Add profile relation data
        if (profileData.profileRelation) {
          data.append("profileRelation", profileData.profileRelation);
        }
        if (profileData.customRelation) {
          data.append("customRelation", profileData.customRelation);
        }

        // Add the image file directly to FormData if selected
        if (selectedImage) {
          data.append("profileImage", selectedImage);
        }

        // Flatten the nested profileData into FormData for the server action
        Object.entries(profileData).forEach(([sectionKey, sectionValue]) => {
          if (typeof sectionValue === "object" && sectionValue !== null) {
            Object.entries(sectionValue).forEach(([key, value]) => {
              // Skip profileImage if we're adding the file directly
              if (key === "profileImage" && selectedImage) {
                return;
              }
              data.append(key, String(value));
            });
          }
        });

        // Update profileImage URL if we uploaded one
        if (imageUrl && imageUrl !== profileData.personalInfo.profileImage) {
          data.set("profileImage", imageUrl);
        }

        let result: { success: boolean; message?: string; data?: ProfileData } =
          {
            success: false,
          };

        if (type === "edit" && profileData.userId) {
          toast({
            title: "Updating Profile",
            description: "Please wait while we update your profile...",
          });

          result = await updateProfileById(data, profileData.userId);
          console.log("Update result:", result);

          if (!result.data) {
            toast({
              title: "Update Failed",
              description: result.message || "Failed to update profile",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Profile Updated",
              description: "Your profile has been updated successfully!",
            });

            // ✅ Navigate after successful update
            setTimeout(() => {
              router.push(`/view-profile/${result?.data?.userId}`);
            }, 1500);
          }
        } else {
          toast({
            title: "Creating Profile",
            description: "Please wait while we create your profile...",
          });

          const formObj: Record<string, any> = {};
          data.forEach((value, key) => {
            formObj[key] = value;
          });

          const formData = new FormData();
          Object.entries(formObj).forEach(([key, value]) => {
            formData.append(key, value);
          });

          // Add image file if selected
          if (selectedImage) {
            formData.append("profileImageFile", selectedImage);
          }

          const result = await createProfile(
            {
              success: false,
              message: "",
              timestamp: Date.now(),
            }, // prevState (can be empty or default)
            formData
          );

          if (!result.success) {
            toast({
              title: "Creation Failed",
              description: result.message || "Failed to create profile",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Profile Created",
              description: "Your profile has been created successfully!",
            });

            // ✅ Navigate after successful creation
            if (result?.data?.userId) {
              setTimeout(() => {
                router.push(`/view-profile/${result?.data?.userId}`);
              }, 1500);
            }
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

  return (
    <div className="min-h-screen bg-orange-50 p-4">
       <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ArrowLeft className="h-4 w-4 text-red-600" />
            <Link
              href="/matrimonial"
              className="text-red-600 hover:underline"
            >
              Matrimonial
            </Link>
            <span>/</span>
            <span >Search Profile Details</span>
          </div>
        </div>
      <div className="max-w-7xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressBar currentStep={currentStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            {/* Photo Upload Section */}
            <Card className="p-4 mb-4">
              <h3 className="text-lg font-semibold mb-4 text-center text-orange-800">
                Profile Photo
              </h3>
              {/* Image Preview */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-orange-200">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={handleImageRemove}
                        className="absolute top-0 right-0  bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transform translate-x-2 -translate-y-2"
                        type="button"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-full bg-gray-100 border-4 border-orange-200 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              {/* Upload Button */}
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {imagePreview ? "Change Photo" : "Upload Photo"}
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Max 5MB • JPG, PNG
                </p>
              </div>
              {/* Suggestions */}
              <div className="mt-6 text-center">
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
                    <p className="text-xs">Close Up</p>
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
                    <p className="text-xs">Full View</p>
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
                    <p className="text-xs">Blur</p>
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
                    <p className="text-xs">Group</p>
                  </div>
                </div>
              </div>
            </Card>

            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="lg:col-span-3">
            {/* Motivational Message */}
            {currentTabConfig && (
              <MotivationalMessage
                title={currentTabConfig.message.title}
                subtitle={currentTabConfig.message.subtitle}
                icon={currentTabConfig.message.icon}
                currentStep={currentStep}
              />
            )}
            
            <Card className="p-6">{renderActiveTab()}</Card>
            
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              {/* Navigation Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                {/* Previous Button */}
                {currentStep > 1 && (
                  <Button
                    onClick={() => {
                      const prevTab = tabConfig.find(tab => tab.step === currentStep - 1);
                      if (prevTab) setActiveTab(prevTab.id);
                    }}
                    variant="outline"
                    className="w-full sm:w-auto border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    ← Previous
                  </Button>
                )}

                {/* Next Button */}
                {currentStep < 5 && (
                  <Button
                    onClick={() => {
                      const nextTab = tabConfig.find(tab => tab.step === currentStep + 1);
                      if (nextTab) setActiveTab(nextTab.id);
                    }}
                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
                  >
                    Next →
                  </Button>
                )}
              </div>

              {/* Complete/Update Profile Button */}
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleCompleteProfile}
                  className={`w-full sm:w-auto ${
                    currentStep === 5 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                  disabled={isPending || isUploadingImage}
                >
                  {isPending || isUploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isUploadingImage
                        ? "Uploading Image..."
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
      <Toaster />
    </div>
  );
}