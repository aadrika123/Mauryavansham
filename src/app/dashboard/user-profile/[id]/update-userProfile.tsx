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
    // religion: "Hindu",
    caste: "",
    motherTongue: "",
    height: "",
    weight: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    // 🆕 Occupation-specific fields
    jobType: "", // Job → Government / Non-Government
    govSector: "", // Central / State / UT
    department: "",
    postingLocation: "",
    designation: "",
    company: "",
    businessDetails: "",

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
    if (!formData.motherTongue) errors.push("Mother Tongue is required");
    if (!formData.education) errors.push("Education is required");
    if (!formData.occupation) errors.push("Occupation is required");
    // if (!formData.address) errors.push("Address is required");
    // if (!formData.city) errors.push("City is required");
    // if (!formData.state) errors.push("State is required");
    // if (!formData.zipCode) errors.push("Zip Code is required");
    // if (!formData.fatherName) errors.push("Father's Name is required");
    // if (!formData.motherName) errors.push("Mother's Name is required");

    // Occupation-specific validation
    if (formData.occupation === "Job") {
      if (!formData.jobType) errors.push("Job Type is required");

      if (formData.jobType === "Government") {
        if (!formData.govSector) errors.push("Gov Sector is required");
        if (!formData.department) errors.push("Department is required");
        if (!formData.postingLocation)
          errors.push("Posting Location is required");
        if (!formData.designation) errors.push("Designation is required");
      } else if (formData.jobType === "Non-Government") {
        if (!formData.company) errors.push("Company is required");
        if (!formData.designation) errors.push("Designation is required");
      }
    }

    if (formData.occupation === "Business") {
      if (!formData.businessDetails)
        errors.push("Business Details are required");
    }

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
        router.push(`/dashboard`);
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

  // ✅ Profile completion calculation (fixed)
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
      "occupation",
      "city",
      "state",
      "country",
      "zipCode",
      "fatherName",
      "aboutMe",
    ];

    // Occupation-based fields
    if (user.occupation === "Job") {
      fields.push("jobType");

      if (user.jobType === "Government") {
        fields.push(
          "govSector",
          "department",
          "postingLocation",
          "designation"
        );
      } else if (user.jobType === "Non-Government") {
        fields.push("company", "designation");
      }
    }

    if (user.occupation === "Business") {
      fields.push("businessDetails");
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
        {/* About yourself */}
        <div>
          <InputField
            label="About Yourself"
            name="aboutMe"
            value={formData.aboutMe}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (e.target.value.length <= 200) {
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
            {(formData.aboutMe || "").length} / 200 characters
          </p>
        </div>

        {/* Occupation */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Occupation</h2>
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              options={["Job", "Business"]}
            />

            {formData.occupation === "Job" && (
              <>
                <SelectField
                  label="Job Type"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  options={["Government", "Non-Government"]}
                />

                {formData.jobType === "Government" && (
                  <>
                    <SelectField
                      label="Gov Sector"
                      name="govSector"
                      value={formData.govSector}
                      onChange={handleChange}
                      options={["Central", "State", "UT"]}
                    />
                    <InputField
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Posting Location"
                      name="postingLocation"
                      value={formData.postingLocation}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                    />
                  </>
                )}

                {formData.jobType === "Non-Government" && (
                  <>
                    <InputField
                      label="Company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                    />
                  </>
                )}
              </>
            )}

            {formData.occupation === "Business" && (
              <InputField
                label="Business Details"
                name="businessDetails"
                value={formData.businessDetails}
                onChange={handleChange}
              />
            )}
          </div>
        </div>
        {/* Siblings */}
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-2">Siblings</h3>
          {formData.siblings.map((sibling: any, idx: number) => (
            <div key={idx} className="flex items-center gap-4 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={sibling.name}
                onChange={(e) => {
                  const updated = [...formData.siblings];
                  updated[idx].name = e.target.value;
                  setFormData({ ...formData, siblings: updated });
                }}
                className="border p-2 rounded flex-1 bg-white border-yellow-300 focus:border-red-500"
              />
              <select
                value={sibling.gender}
                onChange={(e) => {
                  const updated = [...formData.siblings];
                  updated[idx].gender = e.target.value;
                  setFormData({ ...formData, siblings: updated });
                }}
                className="border p-2 rounded bg-white border-yellow-300 focus:border-red-500"
              >
                <option value="">Gender</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
              </select>
              <input
                type="date"
                value={sibling.dateOfBirth}
                onChange={(e) => {
                  const updated = [...formData.siblings];
                  updated[idx].dateOfBirth = e.target.value;
                  setFormData({ ...formData, siblings: updated });
                }}
                className="border p-2 rounded bg-white border-yellow-300 focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = formData.siblings.filter(
                    (_: any, i: number) => i !== idx
                  );
                  setFormData({ ...formData, siblings: updated });
                }}
                className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                siblings: [
                  ...formData.siblings,
                  { name: "", gender: "", dateOfBirth: "", maritalStatus: "" },
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
          {formData.children.map((child: any, idx: number) => (
            <div key={idx} className="flex items-center gap-4 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={child.name}
                onChange={(e) => {
                  const updated = [...formData.children];
                  updated[idx].name = e.target.value;
                  setFormData({ ...formData, children: updated });
                }}
                className="border p-2 rounded flex-1 bg-white border-yellow-300 focus:border-red-500"
              />
              <select
                value={child.gender}
                onChange={(e) => {
                  const updated = [...formData.children];
                  updated[idx].gender = e.target.value;
                  setFormData({ ...formData, children: updated });
                }}
                className="border p-2 rounded bg-white border-yellow-300 focus:border-red-500"
              >
                <option value="">Gender</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
              </select>
              <input
                type="date"
                value={child.dateOfBirth}
                onChange={(e) => {
                  const updated = [...formData.children];
                  updated[idx].dateOfBirth = e.target.value;
                  setFormData({ ...formData, children: updated });
                }}
                className="border p-2 rounded bg-white border-yellow-300 focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = formData.children.filter(
                    (_: any, i: number) => i !== idx
                  );
                  setFormData({ ...formData, children: updated });
                }}
                className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
              >
                X
              </button>
            </div>
          ))}
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
                    studyingOrWorking: "",
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
