export type DatabaseProfile = {
  id: number
  name: string | null
  nickName: string | null
  phoneNo: string | null
  email: string | null
  website: string | null
  dob: string | null
  height: string | null
  weight: string | null
  complexion: string | null
  bodyType: string | null
  maritalStatus: string | null
  languagesKnown: string | null
  hobbies: string | null
  aboutMe: string | null
  highestEducation: string | null
  collegeUniversity: string | null
  occupation: string | null
  companyOrganization: string | null
  designation: string | null
  workLocation: string | null
  annualIncome: string | null
  workExperience: string | null
  fatherName: string | null
  fatherOccupation: string | null
  motherName: string | null
  motherOccupation: string | null
  brothers: string | null
  sisters: string | null
  familyIncome: string | null
  gotraDetails: string | null
  ancestralVillage: string | null
  familyHistory: string | null
  communityContributions: string | null
  familyTraditions: string | null
  diet: string | null
  smoking: string | null
  drinking: string | null
  exercise: string | null
  religiousBeliefs: string | null
  musicPreferences: string | null
  moviePreferences: string | null
  readingInterests: string | null
  travelInterests: string | null
  castPreferences: string | null
  createdAt: Date | null
  updatedAt: Date | null
  isPremium: boolean | null
  isVerified: boolean | null
  isActive: boolean | null
  profilePicture: string | null
  
}

// UI Profile type (what your components expect)
export type Profile = {
  id: string
  name: string
  age: number
  dob: string
  height: string
  location: string
  education: string
  occupation: string
  company: string
  gotra: string
  interests: string[]
  isPremium: boolean
  profilePicture: string
  isVerified: boolean
  lastActive: string
  profileImage?: string
  createdAt?: string
  updatedAt?: string
  isActive?: boolean
  isDeleted?: boolean
  
}
export type DetailedProfile = {
  id: string
  name: string
  nickName?: string
  age: number
  dob: string
  height: string
  weight: string
  location: string
  education: string
  occupation: string
  company: string
  designation: string
  workLocation: string
  income: string
  workExperience: string
  gotra: string
  interests: string[]
  isPremium: boolean
  isVerified: boolean
  isActive: boolean
  profileImage?: string
  personalDetails: {
    complexion: string
    bodyType: string
    maritalStatus: string
    languagesKnown: string[]
    diet: string
    smoking: string
    drinking: string
    exercise: string
    religiousBeliefs: string
  }
  familyDetails: {
    fatherName: string
    fatherOccupation: string
    motherName: string
    motherOccupation: string
    brothers: string
    sisters: string
    familyIncome: string
    ancestralVillage: string
    familyHistory: string
    communityContributions: string
    familyTraditions: string
  }
  preferences: {
    musicPreferences: string
    moviePreferences: string
    readingInterests: string
    travelInterests: string
    castPreferences: string
  }
  aboutMe: string
  lastActive: string
  createdAt: string
  updatedAt: string
}