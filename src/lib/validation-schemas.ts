// src/lib/yup-validation-schemas.ts
import * as yup from 'yup'

// Personal Info validation schema
export const personalInfoSchema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  nickName: yup.string().required("Nick name is required"),
  phoneNo: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[\d\s-()]+$/, "Invalid phone number format"),
  email: yup.string().required("Email is required").email("Invalid email format"),
  dob: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  height: yup.string().required("Height is required"),
  maritalStatus: yup.string().required("Marital status is required"),
  weight: yup.string().optional(),
  complexion: yup.string().optional(),
  bodyType: yup.string().optional(),
  languagesKnown: yup.string().optional(),
  hobbies: yup.string().optional(),
  aboutMe: yup.string().optional(),
  profileImage1: yup.string().optional(),
  profileImage2: yup.string().optional(),
  profileImage3: yup.string().optional(),
  facebook: yup.string().optional(),
  instagram: yup.string().optional(),
  linkedin: yup.string().optional(),
})

// Family Details validation schema
export const familyDetailsSchema = yup.object({
  fatherName: yup.string().optional(),
  fatherOccupation: yup.string().optional(),
  motherName: yup.string().optional(),
  motherOccupation: yup.string().optional(),
  brothers: yup.string().optional(),
  sisters: yup.string().optional(),
  marriedSiblings: yup.string().optional(),
  familyType: yup.string().optional(),
  familyValues: yup.string().optional(),
  familyIncome: yup.string().optional(),
  familyLocation: yup.string().optional(),
})

// Education Career validation schema
export const educationCareerSchema = yup.object({
  highestEducation: yup.string().optional(),
  collegeUniversity: yup.string().optional(),
  occupation: yup.string().optional(),
  companyOrganization: yup.string().optional(),
  designation: yup.string().optional(),
  workLocation: yup.string().optional(),
  annualIncome: yup.string().optional(),
  workExperience: yup.string().optional(),
  website: yup.string().optional(),
})

// Lifestyle validation schema
export const lifestyleSchema = yup.object({
  diet: yup.string().optional(),
  smoking: yup.string().optional(),
  drinking: yup.string().optional(),
  exercise: yup.string().optional(),
  religiousBeliefs: yup.string().optional(),
  musicPreferences: yup.string().optional(),
  moviePreferences: yup.string().optional(),
  readingInterests: yup.string().optional(),
  travelInterests: yup.string().optional(),
  castPreferences: yup.string().optional(),
})

// Genealogy validation schema
export const genealogySchema = yup.object({
  gotraDetails: yup.string().optional(),
  ancestralVillage: yup.string().optional(),
  familyHistory: yup.string().optional(),
  communityContributions: yup.string().optional(),
  familyTraditions: yup.string().optional(),
})

// Complete profile validation schema
export const completeProfileSchema = yup.object({
  personalInfo: personalInfoSchema,
  familyDetails: familyDetailsSchema,
  educationCareer: educationCareerSchema,
  lifestyle: lifestyleSchema,
  genealogy: genealogySchema,
})

export type PersonalInfoFormData = yup.InferType<typeof personalInfoSchema>
export type CompleteProfileFormData = yup.InferType<typeof completeProfileSchema>
