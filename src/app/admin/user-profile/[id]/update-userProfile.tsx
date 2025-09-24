"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/src/components/ui/use-toast";
import { updateUserDtlsById } from "@/src/features/updateUserDtlsById/updateUserDtlsById";
import { Phone } from "lucide-react";
import { Label } from "@/src/components/ui/label";

export default function UserProfilePage({ data }: { data: any }) {
  const router = useRouter();

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    photo: "",
    maritalStatus: "",
    spouseName: "", // 🆕 Added spouse name field
    // religion: "Hindu",
    caste: "",
    motherTongue: "",
    height: "",
    weight: "",
    bloodGroup: "",
    education: "",
    professionGroup: "", // 🆕 Profession group (parent)
    profession: "", // 🆕 Specific profession (child)
    // professionDetails: "", // 🆕 For additional profession details

    city: "",
    state: "",
    country: "India",
    zipCode: "",
    fatherName: "",
    motherName: "",
    // 🆕 Current Address
    // currentAddress: "",
    // currentCity: "",
    // currentState: "",
    // currentCountry: "India",
    // currentZipCode: "",
    siblings: [],
    children: [],
    aboutMe: "",
    facebookLink: "", // 🆕 Added Facebook link field
  });

  useEffect(() => {
    if (data) {
      setFormData((prev: any) => ({
        ...prev,
        ...data,
        country: data.country || "India", // ✅ overwrite fix
        // currentCountry: data.currentCountry || "India", // ✅ overwrite fix
        // religion: data.religion || "Hindu", // ✅ overwrite fix
      }));
    }
  }, [data]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // 👇 Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("image", file);

    try {
      const res = await fetch("/api/upload-userImage", {
        method: "POST",
        body: form,
      });
      const result = await res.json();
      if (result.imageUrl) {
        setFormData((prev: any) => ({ ...prev, photo: result.imageUrl }));
        toast({
          title: "Image Uploaded ✅",
          description: "Profile photo uploaded successfully!",
        });
      } else {
        toast({
          title: "Upload Failed ❌",
          description: result.error || "Error uploading image",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Upload Error ❌",
        description: "Something went wrong while uploading image",
        variant: "destructive",
      });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
    // --- Validation ---
    const errors: string[] = [];

    // if (!formData.name) errors.push("Name is required");
    // if (!formData.email) errors.push("Email is required");
    // if (!formData.phone) errors.push("Phone is required");
    if (!formData.gender) errors.push("Gender is required");
    if (!formData.dateOfBirth) errors.push("Date of Birth is required");
    if (!formData.maritalStatus) errors.push("Marital Status is required");

    // 🆕 Spouse name validation when married
    if (formData.maritalStatus === "Married" && !formData.spouseName) {
      errors.push("Spouse Name is required for married status");
    }

    if (!formData.motherTongue) errors.push("Mother Tongue is required");
    if (!formData.education) errors.push("Education is required");
    if (!formData.professionGroup) errors.push("Profession Group is required");
    if (!formData.profession) errors.push("Profession is required"); // 🆕 Changed validation
    // if (!formData.address) errors.push("Address is required");
    // if (!formData.city) errors.push("City is required");
    // if (!formData.state) errors.push("State is required");
    // if (!formData.zipCode) errors.push("Zip Code is required");
    // if (!formData.fatherName) errors.push("Father's Name is required");
    // if (!formData.motherName) errors.push("Mother's Name is required");

    if (errors.length > 0) {
      setValidationErrors(errors); // 🆕 open popup with errors
      return;
    }

    // --- API call if validation passes ---
    setLoading(true);
    try {
      const result = await updateUserDtlsById(formData, data.id);
      if (result.success) {
        toast({
          title: "Profile Updated ✅",
          description: "Your profile has been updated successfully!",
        });
        router.push(`/admin/overview`);
      } else {
        toast({
          title: "Update Failed ❌",
          description: result.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error ❌",
        description: "Something went wrong while updating profile",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  // ✅ Profile completion calculation (updated)
  const calculateCompletion = (user: any) => {
    let fields = [
      "name",
      "email",
      "phone",
      "gender",
      "dateOfBirth",
      "address",
      "photo",
      "maritalStatus",
      "motherTongue",
      "height",
      "weight",
      "bloodGroup",
      "education",
      "professionGroup", // 🆕 Changed from occupation
      "profession", // 🆕 Added specific profession
      "city",
      "state",
      "country",
      "zipCode",
      "fatherName",
      "aboutMe",
      "facebookLink", // 🆕 Added Facebook link to completion calculation
    ];

    // 🆕 Add spouse name to completion calculation if married
    if (user.maritalStatus === "Married") {
      fields.push("spouseName");
    }

    const filled = fields.filter(
      (f) => user[f] && user[f].toString().trim() !== ""
    ).length;

    return Math.round((filled / fields.length) * 100);
  };

  const completion = calculateCompletion(formData);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white  rounded-xl drop-shadow-[0_4px_10px_rgba(250,204,21,0.5)] mb-10 mt-4">
      <h2 className="text-2xl font-bold text-center mb-4">
        Complete Your Profile
      </h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-2">
          Profile Completion: {completion}%
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${completion}%` }}
          ></div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 p-6 border rounded-lg shadow-sm bg-white"
      >
        {/* Basic Info */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled
            />
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              disabled
            />

            {/* <PhoneField
              value={formData.phone}
              onChange={(val: string) =>
                setFormData({ ...formData, phone: val })
              }
            /> */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="block font-medium mb-2 text-base"
              >
                Phone Number *
              </Label>
              <div className="relative">
                {/* <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> */}
                <PhoneField
                  value={formData.phone}
                  onChange={(val: string) =>
                    setFormData({ ...formData, phone: val })
                  }
                  disabled
                />
              </div>
            </div>

            <SelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
              disabled
            />

            <InputField
              type="date"
              label="Date of Birth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            <InputField
              label="Father's Name"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              // disabled
            />
            <InputField
              label="Mother's Name"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              // disabled
            />

            <SelectField
              label="Marital Status"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              options={["Single", "Married", "Divorced", "Widowed"]}
            />

            {/* 🆕 Spouse Name Field - Only show when married */}
            {formData.maritalStatus === "Married" && (
              <InputField
                label="Spouse Name"
                name="spouseName"
                value={formData.spouseName}
                onChange={handleChange}
                placeholder="Enter spouse's name"
              />
            )}

            {/* <InputField
              label="Religion"
              name="religion"
              value="Hindu"
              disabled
            /> */}
            <InputField
              label="Mother Tongue"
              name="motherTongue"
              value={formData.motherTongue}
              onChange={handleChange}
            />

            <HeightField
              value={formData.height}
              onChange={(val: string) =>
                setFormData({ ...formData, height: val })
              }
            />

            <InputField
              type="number"
              label="Weight (kg)"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
            />

            <SelectField
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
            />

            <SelectField
              label="Education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              options={[
                "High School",
                "Intermediate",
                "Graduate",
                "Post Graduate",
                "PhD",
                "Other",
              ]}
            />
          </div>
        </div>
        {/* About yourself & Facebook Link */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <InputField
              label="About Yourself"
              name="aboutMe"
              value={formData.aboutMe}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const words = e.target.value
                  .trim()
                  .split(/\s+/)
                  .filter((word) => word.length > 0);
                if (words.length <= 200 || e.target.value === "") {
                  setFormData({ ...formData, aboutMe: e.target.value });
                }
              }}
              type="textarea"
              placeholder="Write something about yourself..."
            />
            <p
              className="text-sm text-gray-500 mt-1 flex justify-end"
              suppressHydrationWarning={true}
            >
              {formData.aboutMe
                ? formData.aboutMe
                    .trim()
                    .split(/\s+/)
                    .filter((word: string) => word.length > 0).length
                : 0}{" "}
              / 200 words
            </p>

            <InputField
              label="Facebook Profile Link"
              name="facebookLink"
              value={formData.facebookLink}
              onChange={handleChange}
              placeholder="https://www.facebook.com/yourprofile"
              type="url"
            />
          </div>
        </div>

        {/* 🆕 Profession Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Profession</h2>
          <div className="grid grid-cols-2 gap-4">
            <ProfessionGroupField
              label="Profession Group"
              name="professionGroup"
              value={formData.professionGroup}
              onChange={(e: any) => {
                // Reset specific profession when group changes
                setFormData({
                  ...formData,
                  professionGroup: e.target.value,
                  profession: "",
                });
              }}
            />

            <SpecificProfessionField
              label="Specific Profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              professionGroup={formData.professionGroup}
            />

            {/* Additional details field for profession - full width */}
            {/* <div className="col-span-2">
              <InputField
                label="Profession Details"
                name="professionDetails"
                value={formData.professionDetails}
                onChange={handleChange}
                placeholder="e.g., Company name, specialization, experience, etc."
              />
            </div> */}
          </div>
        </div>

        {/* Siblings */}
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-2">Siblings</h3>
          {formData.siblings.map((sibling: any, idx: number) => {
            // Calculate age based on date of birth
            const calculateAge = (dateOfBirth: string) => {
              if (!dateOfBirth) return 0;
              const today = new Date();
              const birthDate = new Date(dateOfBirth);
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
              ) {
                age--;
              }
              return age;
            };

            const age = calculateAge(sibling.dateOfBirth);
            const showMaritalStatus =
              (sibling.gender === "Sister" && age >= 18) ||
              (sibling.gender === "Brother" && age >= 21);

            return (
              <div key={idx} className="border p-3 rounded mb-3 bg-gray-50">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {/* Name */}
                  <input
                    type="text"
                    placeholder="Name"
                    value={sibling.name}
                    onChange={(e) => {
                      const updated = [...formData.siblings];
                      updated[idx].name = e.target.value;
                      setFormData({ ...formData, siblings: updated });
                    }}
                    className="border p-2 rounded bg-white border-yellow-300 focus:border-red-500"
                  />

                  {/* DOB */}
                  <input
                    type="date"
                    value={sibling.dateOfBirth}
                    onChange={(e) => {
                      const updated = [...formData.siblings];
                      updated[idx].dateOfBirth = e.target.value;
                      // Reset marital status when DOB changes
                      updated[idx].maritalStatus = "";
                      updated[idx].spouseName = "";
                      setFormData({ ...formData, siblings: updated });
                    }}
                    className="border p-2 rounded bg-white border-yellow-300 focus:border-red-500"
                  />

                  {/* Age Display */}
                  <div className="flex items-center px-2">
                    <span className="text-sm text-gray-600">
                      {age > 0 ? `${age} years old` : "Age: --"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Gender (radio buttons) */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Gender:
                    </label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`sibling-gender-${idx}`}
                          value="Brother"
                          checked={sibling.gender === "Brother"}
                          onChange={(e) => {
                            const updated = [...formData.siblings];
                            updated[idx].gender = e.target.value;
                            // Reset marital fields when gender changes
                            updated[idx].maritalStatus = "";
                            updated[idx].spouseName = "";
                            setFormData({ ...formData, siblings: updated });
                          }}
                        />
                        Brother
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`sibling-gender-${idx}`}
                          value="Sister"
                          checked={sibling.gender === "Sister"}
                          onChange={(e) => {
                            const updated = [...formData.siblings];
                            updated[idx].gender = e.target.value;
                            // Reset marital fields when gender changes
                            updated[idx].maritalStatus = "";
                            updated[idx].spouseName = "";
                            setFormData({ ...formData, siblings: updated });
                          }}
                        />
                        Sister
                      </label>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex justify-end items-start">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.siblings.filter(
                          (_: any, i: number) => i !== idx
                        );
                        setFormData({ ...formData, siblings: updated });
                      }}
                      className="bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      X
                    </button>
                  </div>
                </div>

                {/* Conditional Marital Status Fields */}
                {showMaritalStatus && (
                  <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-gray-300">
                    {/* Marital Status */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Marital Status:
                      </label>
                      <select
                        value={sibling.maritalStatus || ""}
                        onChange={(e) => {
                          const updated = [...formData.siblings];
                          updated[idx].maritalStatus = e.target.value;
                          // Reset spouse name when marital status changes
                          if (e.target.value !== "Married") {
                            updated[idx].spouseName = "";
                          }
                          setFormData({ ...formData, siblings: updated });
                        }}
                        className="w-full border rounded p-2 bg-white border-yellow-300 focus:border-red-500"
                      >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    {/* Spouse Name - Only show when married */}
                    {sibling.maritalStatus === "Married" && (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Spouse Name:
                        </label>
                        <input
                          type="text"
                          placeholder="Enter spouse name"
                          value={sibling.spouseName || ""}
                          onChange={(e) => {
                            const updated = [...formData.siblings];
                            updated[idx].spouseName = e.target.value;
                            setFormData({ ...formData, siblings: updated });
                          }}
                          className="w-full border rounded p-2 bg-white border-yellow-300 focus:border-red-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Sibling Button */}
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                siblings: [
                  ...formData.siblings,
                  {
                    name: "",
                    gender: "",
                    dateOfBirth: "",
                    maritalStatus: "",
                    spouseName: "",
                  },
                ],
              })
            }
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition duration-300 ease-in-out"
          >
            Add Sibling
          </button>
        </div>

        {/* Children */}
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-2">Children</h3>
          {formData.children.map((child: any, idx: number) => {
            // Calculate age based on date of birth
            const calculateAge = (dateOfBirth: string) => {
              if (!dateOfBirth) return 0;
              const today = new Date();
              const birthDate = new Date(dateOfBirth);
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
              ) {
                age--;
              }
              return age;
            };

            const age = calculateAge(child.dateOfBirth);
            const showMaritalStatus =
              (child.gender === "Daughter" && age >= 18) ||
              (child.gender === "Son" && age >= 21);

            return (
              <div key={idx} className="border p-3 rounded mb-3 bg-gray-50">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {/* Name */}
                  <input
                    type="text"
                    placeholder="Name"
                    value={child.name}
                    onChange={(e) => {
                      const updated = [...formData.children];
                      updated[idx].name = e.target.value;
                      setFormData({ ...formData, children: updated });
                    }}
                    className="border p-2 rounded bg-white border-yellow-300 focus:border-red-500"
                  />

                  {/* DOB */}
                  <input
                    type="date"
                    value={child.dateOfBirth}
                    onChange={(e) => {
                      const updated = [...formData.children];
                      updated[idx].dateOfBirth = e.target.value;
                      // Reset marital status when DOB changes
                      updated[idx].maritalStatus = "";
                      updated[idx].spouseName = "";
                      setFormData({ ...formData, children: updated });
                    }}
                    className="border p-2 rounded bg-white border-yellow-300 focus:border-red-500"
                  />

                  {/* Age Display */}
                  <div className="flex items-center px-2">
                    <span className="text-sm text-gray-600">
                      {age > 0 ? `${age} years old` : "Age: --"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Gender (radio buttons) */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Gender:
                    </label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`child-gender-${idx}`}
                          value="Son"
                          checked={child.gender === "Son"}
                          onChange={(e) => {
                            const updated = [...formData.children];
                            updated[idx].gender = e.target.value;
                            // Reset marital fields when gender changes
                            updated[idx].maritalStatus = "";
                            updated[idx].spouseName = "";
                            setFormData({ ...formData, children: updated });
                          }}
                        />
                        Son
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`child-gender-${idx}`}
                          value="Daughter"
                          checked={child.gender === "Daughter"}
                          onChange={(e) => {
                            const updated = [...formData.children];
                            updated[idx].gender = e.target.value;
                            // Reset marital fields when gender changes
                            updated[idx].maritalStatus = "";
                            updated[idx].spouseName = "";
                            setFormData({ ...formData, children: updated });
                          }}
                        />
                        Daughter
                      </label>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex justify-end items-start">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.children.filter(
                          (_: any, i: number) => i !== idx
                        );
                        setFormData({ ...formData, children: updated });
                      }}
                      className="bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      X
                    </button>
                  </div>
                </div>

                {/* Conditional Marital Status Fields */}
                {showMaritalStatus && (
                  <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-gray-300">
                    {/* Marital Status */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Marital Status:
                      </label>
                      <select
                        value={child.maritalStatus || ""}
                        onChange={(e) => {
                          const updated = [...formData.children];
                          updated[idx].maritalStatus = e.target.value;
                          // Reset spouse name when marital status changes
                          if (e.target.value !== "Married") {
                            updated[idx].spouseName = "";
                          }
                          setFormData({ ...formData, children: updated });
                        }}
                        className="w-full border rounded p-2 bg-white border-yellow-300 focus:border-red-500"
                      >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    {/* Spouse Name - Only show when married */}
                    {child.maritalStatus === "Married" && (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Spouse Name:
                        </label>
                        <input
                          type="text"
                          placeholder="Enter spouse name"
                          value={child.spouseName || ""}
                          onChange={(e) => {
                            const updated = [...formData.children];
                            updated[idx].spouseName = e.target.value;
                            setFormData({ ...formData, children: updated });
                          }}
                          className="w-full border rounded p-2 bg-white border-yellow-300 focus:border-red-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                children: [
                  ...formData.children,
                  {
                    name: "",
                    gender: "",
                    dateOfBirth: "",
                    maritalStatus: "",
                    spouseName: "",
                  },
                ],
              })
            }
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition duration-300 ease-in-out"
          >
            Add Child
          </button>
        </div>

        {/* File Upload */}
        <div className="border p-4 rounded-md">
          <label className="block font-medium mb-2">Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full border rounded p-2 bg-white border-yellow-300 focus:border-red-500"
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}
          {formData.photo && (
            <img
              src={formData.photo}
              alt="Profile Preview"
              className="mt-3 w-24 h-24 rounded-full object-cover border"
            />
          )}
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>

      {/* 🆕 Validation Modal */}
      {validationErrors.length > 0 && (
        <ValidationModal
          errors={validationErrors}
          onClose={() => setValidationErrors([])}
        />
      )}
    </div>
  );
}

/* 🆕 Modal Component */
function ValidationModal({
  errors,
  onClose,
}: {
  errors: string[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-red-600 mb-4">
          Validation Error 🚫
        </h3>
        <p className="mb-2">The following fields are required:</p>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* 🆕 Profession Group Field Component */
function ProfessionGroupField({
  label,
  name,
  value,
  onChange,
  required = false,
}: any) {
  const professionGroups = [
    "Traditional Professions",
    "Business & Commerce",
    "Technology & Digital",
    "Government & Public Service",
    "Skilled Trades & Services",
    "Creative & Media",
    "Healthcare & Wellness",
    "Agriculture & Allied Fields",
    "Education & Research",
    "Miscellaneous Modern Professions",
  ];

  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded p-2 border-yellow-300 focus:border-red-500"
        required={required}
      >
        <option value="">Select Profession Group</option>
        {professionGroups.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>
    </div>
  );
}

/* 🆕 Specific Profession Field Component */
function SpecificProfessionField({
  label,
  name,
  value,
  onChange,
  professionGroup,
  required = false,
}: any) {
  const professionsByGroup: { [key: string]: string[] } = {
    "Traditional Professions": [
      "Doctor",
      "Engineer",
      "Lawyer",
      "Architect",
      "Chartered Accountant / Company Secretary",
    ],
    "Business & Commerce": [
      "Entrepreneur / Business Owner",
      "Trader / Retailer / Wholesaler",
      "Consultant",
      "Banker / Finance Professional",
      "Real Estate Developer",
      "Stock Broker",
    ],
    "Technology & Digital": [
      "Software Developer / IT Consultant",
      "Data Scientist / Analyst",
      "Cybersecurity Specialist",
      "Web & App Developer",
      "Digital Marketer / SEO Specialist",
      "AI & Robotics Engineer",
    ],
    "Government & Public Service": [
      "Civil Servant (IAS/IPS/IFS, etc.)",
      "Defense Personnel (Army/Navy/Air Force)",
      "Politician / Public Representative",
      "Public Sector Professional",
      "Judiciary / Judge",
    ],
    "Skilled Trades & Services": [
      "Electrician / Plumber / Mechanic",
      "Carpenter / Mason",
      "Tailor / Artisan / Handicraft Worker",
      "Driver / Transporter",
      "Hospitality & Tourism Worker",
    ],
    "Creative & Media": [
      "Artist / Designer",
      "Writer / Author / Poet",
      "Journalist / Editor",
      "Actor / Musician / Filmmaker",
      "Photographer / Videographer",
      "Fashion Designer / Stylist",
    ],
    "Healthcare & Wellness": [
      "Doctor (Specialists: Cardiologist, Surgeon, Dentist, etc.)",
      "Nurse / Paramedic",
      "Physiotherapist",
      "Nutritionist / Dietician",
      "Yoga & Wellness Coach",
      "Psychologist / Counselor",
    ],
    "Agriculture & Allied Fields": [
      "Farmer / Agri-entrepreneur",
      "Horticulturist",
      "Veterinary Doctor",
      "Fisheries & Dairy Expert",
    ],
    "Education & Research": [
      "School Teacher",
      "University Professor",
      "Scientist / Researcher",
      "Education Consultant",
      "Education Coach",
      "Librarian",
    ],
    "Miscellaneous Modern Professions": [
      "Social Media Influencer / Content Creator",
      "Event Manager",
      "Fitness Trainer",
      "NGO Worker / Social Activist",
      "Corporate Professional (HR, Marketing, Operations, etc.)",
    ],
  };

  const availableProfessions = professionGroup
    ? professionsByGroup[professionGroup] || []
    : [];

  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded p-2 border-yellow-300 focus:border-red-500"
        required={required}
        disabled={!professionGroup}
      >
        <option value="">
          {professionGroup
            ? "Select Specific Profession"
            : "First select profession group"}
        </option>
        {availableProfessions.map((profession) => (
          <option key={profession} value={profession}>
            {profession}
          </option>
        ))}
      </select>
    </div>
  );
}

/* 📌 Helper Components */
function InputField({
  label,
  name,
  value,
  onChange,
  disabled = false,
  type = "text",
  placeholder,
  required = false,
}: any) {
  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>

      {type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className="w-full border rounded p-2 border-yellow-300 focus:border-red-500 min-h-[120px] resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className="w-full border rounded p-2 border-yellow-300 focus:border-red-500"
        />
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required,
  disabled,
}: any) {
  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded p-2 border-yellow-300 focus:border-red-500"
        required={required}
        disabled={disabled}
      >
        <option value="">Select</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function PhoneField({
  value,
  onChange,
  required = false,
  disabled = false,
}: {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        <Phone className="h-4 w-4 text-gray-400" />
      </span>
      <input
        type="tel"
        maxLength={10}
        pattern="[0-9]{10}"
        value={value || ""}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "");
          if (val.length <= 10) onChange(val);
        }}
        placeholder="Enter 10 digit phone number"
        required={required}
        disabled={disabled}
        className="w-full focus:ring-0 focus:outline-none border rounded bg-white border-yellow-300 focus:border-red-500 p-2 pl-10"
      />
    </div>
  );
}

function HeightField({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const feet = value?.split("'")[0] || "";
  const inches = value?.split("'")[1]?.replace('"', "") || "";

  return (
    <div>
      <label className="block font-medium mb-2">Height</label>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={feet}
          onChange={(e) => onChange(`${e.target.value}'${inches}"`)}
          className="w-full border rounded p-2 bg-white border-yellow-300 focus:border-red-500"
        >
          <option value="">Feet</option>
          {Array.from({ length: 8 }, (_, i) => i + 4).map((ft) => (
            <option key={ft} value={ft}>
              {ft} ft
            </option>
          ))}
        </select>
        <select
          value={inches}
          onChange={(e) => onChange(`${feet}'${e.target.value}"`)}
          className="w-full border rounded p-2 bg-white border-yellow-300 focus:border-red-500"
        >
          <option value="">Inches</option>
          {Array.from({ length: 12 }, (_, i) => i).map((inch) => (
            <option key={inch} value={inch}>
              {inch} in
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
