"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { toast } from "@/src/components/ui/use-toast";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
    motherName: "",
    photo: "",
    currentAddress: "",
    currentCity: "",
    currentState: "",
    currentCountry: "India",
    currentZipCode: "",
    sameAsPermanent: false,
    declaration: false,
    facebookLink: "",
  });

  const passwordRules = [
    {
      label: "At least 6 characters",
      test: (pwd: string) => pwd.length >= 6,
    },
    {
      label: "One uppercase letter (A–Z)",
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      label: "One lowercase letter (a–z)",
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    {
      label: "One number (0–9)",
      test: (pwd: string) => /[0-9]/.test(pwd),
    },
    {
      label: "One special character (@ # $ % ^ & *)",
      test: (pwd: string) => /[@#$%^&*!]/.test(pwd),
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const capitalizeFirst = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

    if (name === "name" || name === "fatherName" || name === "motherName") {
      const onlyAlphabets = value.replace(/[^A-Za-z\s]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: onlyAlphabets ? capitalizeFirst(onlyAlphabets) : "",
      }));
    } else if (name === "city") {
      const cleanCity = value.replace(/[^A-Za-z0-9\s]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: cleanCity ? capitalizeFirst(cleanCity) : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (error) setError("");
  };

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
        setFormData((prev) => ({ ...prev, photo: result.imageUrl }));
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.photo) {
      setError("Profile photo is required");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    if (formData.city.trim() === "") {
      setError("City is required");
      return false;
    }
    if (formData.state.trim() === "") {
      setError("State is required");
      return false;
    }
    if (formData.fatherName.trim() === "") {
      setError("Father's Name is required");
      return false;
    }
    if (formData.motherName.trim() === "") {
      setError("Mother's Name is required");
      return false;
    }
    if (formData.gender.trim() === "" || formData.gender === "Select Gender") {
      setError("Gender is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");
    setEmailSent(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || null,
          password: formData.password,
          fatherName: formData.fatherName.trim(),
          motherName: formData.motherName.trim(),
          facebookLink: formData.facebookLink.trim() || null,
          gender: formData.gender,
          photo: formData.photo || "",
          address: formData.address,
          city: formData.city.trim(),
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          currentAddress: formData.currentAddress,
          currentCity: formData.currentCity,
          currentState: formData.currentState,
          currentCountry: formData.currentCountry,
          currentZipCode: formData.currentZipCode,
        }),
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setEmailSent(data.emailSent);
      if (data.emailSent) {
        setSuccess(
          "Account created successfully! Welcome email sent to your inbox. Signing you in..."
        );
      } else {
        setSuccess(
          "Account created successfully! (Note: Welcome email could not be sent) Signing you in..."
        );
      }

      const signInResult = await signIn("credentials", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(
          "Account created but sign-in failed. Please try signing in manually."
        );
        router.push("/sign-in");
      } else {
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <AlertDescription className="text-green-700">
                {success}
              </AlertDescription>
              {emailSent === false && (
                <AlertDescription className="text-amber-600 text-sm mt-1">
                  ⚠️ Welcome email could not be delivered. Please check your
                  email settings or contact support if needed.
                </AlertDescription>
              )}
            </div>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="block font-medium mb-2 text-base">
            Full Name *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleInputChange}
              className="pl-10 bg-white border-yellow-300 focus:border-red-500 text-base "
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="block font-medium mb-2 text-base">
            Email Address *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 " />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 bg-white border-yellow-300 focus:border-red-500 text-base "
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="block font-medium mb-2 text-base">
            Phone Number *
          </Label>
          <div className="relative">
            <PhoneField
              value={formData.phone}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  phone: val,
                }))
              }
              required
            />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <SelectField
            label="Gender *"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            options={["Male", "Female", "Other"]}
          />
        </div>

        {/* Father's Name Field */}
        <div className="space-y-2">
          <Label
            htmlFor="fatherName"
            className="block font-medium mb-2 text-base"
          >
            Father's Name *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="fatherName"
              name="fatherName"
              type="text"
              placeholder="Enter father's name"
              value={formData.fatherName}
              onChange={handleInputChange}
              className="pl-10 bg-white border-yellow-300 focus:border-red-500 text-base"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="motherName"
            className="block font-medium mb-2 text-base"
          >
            Mother's Name *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="motherName"
              name="motherName"
              type="text"
              placeholder="Enter mother's name"
              value={formData.motherName}
              onChange={handleInputChange}
              className="pl-10 bg-white border-yellow-300 focus:border-red-500 text-base"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Photo Upload & Facebook Link Section */}
        <div className="space-y-2">
          <label className="block font-medium text-base">
            Profile Photo *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            required
            className="w-full border rounded p-2 bg-white border-yellow-300 focus:border-red-500 text-sm"
            disabled={uploading || isLoading}
          />
          {uploading && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading...
            </p>
          )}
          {formData.photo && (
            <div className="flex items-center gap-2">
              <img
                src={formData.photo}
                alt="Preview"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <span className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Uploaded
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="facebookLink"
            className="block font-medium mb-2 text-base"
          >
            Facebook Profile Link (Optional)
          </Label>
          <Input
            id="facebookLink"
            name="facebookLink"
            type="url"
            placeholder="https://facebook.com/yourprofile"
            value={formData.facebookLink}
            onChange={handleInputChange}
            className="bg-white border-yellow-300 focus:border-red-500 text-base"
            disabled={isLoading}
          />
        </div>

        {/* Permanent Address Section */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="font-semibold text-lg mb-4 text-gray-800 flex items-center gap-2">
            🏠 Permanent Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="col-span-1 md:col-span-2"
              placeholder="Enter your permanent address"
              required
            />
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              placeholder="Enter your city"
            />
            <SelectField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
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
              label="Pin Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              required
              placeholder="Enter your pin code"
            />
          </div>
        </div>

        {/* Current Address Section */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-lg text-gray-600 italic">
              <input
                type="checkbox"
                checked={formData.sameAsPermanent || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    setFormData((prev: any) => ({
                      ...prev,
                      sameAsPermanent: true,
                      currentAddress: prev.address,
                      currentCity: prev.city,
                      currentState: prev.state,
                      currentCountry: prev.country,
                      currentZipCode: prev.zipCode,
                    }));
                  } else {
                    setFormData((prev: any) => ({
                      ...prev,
                      sameAsPermanent: false,
                      currentAddress: "",
                      currentCity: "",
                      currentState: "",
                      currentCountry: "India",
                      currentZipCode: "",
                    }));
                  }
                }}
                className="rounded w-4 h-4 border-gray-300 text-red-600 focus:ring-red-500"
              />
              Current Address Same as Permanent
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Address"
              name="currentAddress"
              value={formData.currentAddress}
              onChange={handleInputChange}
              disabled={formData.sameAsPermanent}
              className="col-span-1 md:col-span-2"
            />
            <InputField
              label="City"
              name="currentCity"
              value={formData.currentCity}
              onChange={handleInputChange}
              disabled={formData.sameAsPermanent}
            />
            <SelectField
              label="State"
              name="currentState"
              value={formData.currentState}
              onChange={handleInputChange}
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
              disabled={formData.sameAsPermanent}
            />
            <SelectField
              label="Country"
              name="currentCountry"
              value={formData.currentCountry}
              onChange={handleInputChange}
              options={[
                "India",
                "United States",
                "Canada",
                "United Kingdom",
                "Australia",
                "Germany",
                "France",
                "Singapore",
                "UAE",
                "Nepal",
                "Sri Lanka",
                "Bangladesh",
                "Other",
              ]}
              disabled={formData.sameAsPermanent}
            />
            <InputField
              label={
                formData.currentCountry === "India" ? "Pin Code" : "Zip Code"
              }
              name="currentZipCode"
              value={formData.currentZipCode}
              onChange={handleInputChange}
              disabled={formData.sameAsPermanent}
              required={formData.currentCountry === "India"}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="block font-medium mb-2 text-base"
          >
            Password *
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password, ex. Abc@123"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 pr-10 bg-white border-yellow-300 focus:border-red-500"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {passwordRules.map((rule, i) => {
              const passed = rule.test(formData.password);
              return (
                <p
                  key={i}
                  className={`text-xs flex items-center gap-2 ${
                    passed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {rule.label}
                </p>
              );
            })}
            <p className="text-xs text-gray-600">
              Example: <span className="font-mono">Password@123</span>
            </p>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="block font-medium mb-2 text-base"
          >
            Confirm Password *
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pl-10 bg-white border-yellow-300 focus:border-red-500 text-base"
              disabled={isLoading}
              required
            />
          </div>
        </div>
      </div>

      {/* Declaration Checkbox */}
      <div className="mt-4 flex items-start gap-2">
        <input
          type="checkbox"
          id="declaration"
          checked={formData.declaration || false}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              declaration: e.target.checked,
            }))
          }
          className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
        />
        <label
          htmlFor="declaration"
          className="text-xs sm:text-xs text-gray-700 leading-relaxed"
        >
          I hereby declare that I belong to the{" "}
          <span className="font-semibold">
            Kushwaha / Koiri / Maurya / Sakhya / Sainy
          </span>{" "}
          community and agree to abide by the{" "}
          <a href="/terms" className="text-red-600 underline">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-red-600 underline">
            Privacy Policy
          </a>{" "}
          of <span className="font-semibold">Mauryavansham.com</span>. I
          understand that my registration shall be subject to verification and
          approval by{" "}
          <span className="font-semibold">three (3) Admin Members</span>, and
          access to the Portal will be granted only after such approval. I also
          acknowledge that any misrepresentation of my community identity may
          result in{" "}
          <span className="font-semibold text-red-600">
            permanent suspension
          </span>{" "}
          of my account.
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3"
        disabled={isLoading || !formData.declaration || uploading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading Photo...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}

function PhoneField({
  value,
  onChange,
  required = false,
}: {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
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
        className="w-full focus:ring-0 focus:outline-none border rounded bg-white border-yellow-300 focus:border-red-500 p-2 pl-10"
      />
    </div>
  );
}

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
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
}: any) {
  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded p-2 border-yellow-300 focus:border-red-500"
        disabled={disabled}
        required={required}
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
