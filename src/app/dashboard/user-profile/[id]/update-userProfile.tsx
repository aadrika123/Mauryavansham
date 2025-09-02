"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/src/components/ui/use-toast";
import { updateUserDtlsById } from "@/src/features/updateUserDtlsById/updateUserDtlsById";

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
    religion: "Hindu",
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
  });

  useEffect(() => {
    if (data) {
      setFormData((prev: any) => ({
        ...prev,
        ...data,
        country: data.country || "India", // ✅ overwrite fix
        religion: data.religion || "Hindu", // ✅ overwrite fix
      }));
    }
  }, [data]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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

    // --- Validation ---
    const errors: string[] = [];

    if (!formData.name) errors.push("Name is required");
    if (!formData.email) errors.push("Email is required");
    if (!formData.phone) errors.push("Phone is required");
    if (!formData.gender) errors.push("Gender is required");
    if (!formData.dateOfBirth) errors.push("Date of Birth is required");
    if (!formData.maritalStatus) errors.push("Marital Status is required");
    if (!formData.motherTongue) errors.push("Mother Tongue is required");
    if (!formData.education) errors.push("Education is required");
    if (!formData.occupation) errors.push("Occupation is required");

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
      toast({
        title: "Validation Error ❌",
        description: errors.join(", "),
        variant: "destructive",
      });
      return; // 🚫 stop submit if errors
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
        setTimeout(() => router.push(`/dashboard`), 1500);
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
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

      <form onSubmit={handleSubmit} className="space-y-6 border p-4 rounded-md">
        <div className="grid grid-cols-2 gap-4">
          {/* Basic Fields */}
          <InputField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <InputField
            label="Email"
            name="email"
            value={formData.email}
            disabled
          />

          <PhoneField
            value={formData.phone}
            onChange={(val: string) => setFormData({ ...formData, phone: val })}
          />

          <SelectField
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
          />
          <InputField
            type="date"
            label="Date of Birth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <InputField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
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
            value={formData.religion}
            onChange={handleChange}
          /> */}
          <InputField label="Religion" name="religion" value="Hindu" disabled />
          {/* <InputField
            label="Caste"
            name="caste"
            value={formData.caste}
            onChange={handleChange}
          /> */}
          <InputField
            label="Mother Tongue"
            name="motherTongue"
            value={formData.motherTongue}
            onChange={handleChange}
          />

          {/* ✅ Height & Weight */}
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

          {/* ✅ Dropdowns */}
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
          {/* Occupation Section */}
          <SelectField
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            options={["Job", "Business"]}
          />

          {/* If Occupation = Job */}
          {formData.occupation === "Job" && (
            <>
              <SelectField
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                options={["Government", "Non-Government"]}
              />

              {/* Government Fields */}
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

              {/* Non-Government Fields */}
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

          {/* If Occupation = Business */}
          {formData.occupation === "Business" && (
            <InputField
              label="Business Details"
              name="businessDetails"
              value={formData.businessDetails}
              onChange={handleChange}
            />
          )}

          {/* <InputField
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
          <InputField
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          /> */}
          {/* <SelectField
            label="Income"
            name="income"
            value={formData.income}
            onChange={handleChange}
            options={[
              "₹0 - ₹2 Lakh",
              "₹2 - ₹5 Lakh",
              "₹5 - ₹10 Lakh",
              "₹10 - ₹20 Lakh",
              "₹20 - ₹50 Lakh",
              "₹50 Lakh+",
            ]}
          /> */}

          {/* <SelectField
            label="Diet"
            name="diet"
            value={formData.diet}
            onChange={handleChange}
            options={["Veg", "Non-Veg", "Vegan"]}
          />
          <SelectField
            label="Smoking"
            name="smoking"
            value={formData.smoking}
            onChange={handleChange}
            options={["Yes", "No"]}
          />
          <SelectField
            label="Drinking"
            name="drinking"
            value={formData.drinking}
            onChange={handleChange}
            options={["Yes", "No"]}
          />
          <InputField
            label="Hobbies"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
          /> */}

          {/* ✅ Location */}
          <InputField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <SelectField
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            options={[
              "Bihar",
              "Uttar Pradesh",
              "Delhi",
              "Maharashtra",
              "West Bengal",
              "Madhya Pradesh",
              "Rajasthan",
              "Karnataka",
              "Tamil Nadu",
              "Kerala",
              "Punjab",
              "Haryana",
              "Gujarat",
              "Jharkhand",
              "Odisha",
              "Assam",
            ]}
          />
          <InputField label="Country" name="country" value="India" disabled />
          <InputField
            label="Zip Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block font-medium">Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full border rounded p-2"
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          {formData.photo && (
            <img
              src={formData.photo}
              alt="Profile Preview"
              className="mt-2 w-24 h-24 rounded-full object-cover border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
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
}: any) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full border rounded p-2"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded p-2"
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
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block font-medium">Phone</label>
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
        className="w-full border rounded p-2"
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
      <label className="block font-medium">Height</label>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={feet}
          onChange={(e) => onChange(`${e.target.value}'${inches}"`)}
          className="w-full border rounded p-2"
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
          className="w-full border rounded p-2"
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
