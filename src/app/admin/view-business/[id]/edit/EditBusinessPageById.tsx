"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Upload, Plus, Trash2 } from "lucide-react";
import Loader from "@/src/components/ui/loader";
import { useToast } from "@/src/components/ui/toastProvider";
import { useRouter } from "next/navigation";

const premiumFeatures: Record<
  string,
  { product: number; office: number; notifications: string[] }
> = {
  Platinum: {
    product: 3,
    office: 2,
    notifications: ["WhatsApp", "Email", "In-App", "SMS"],
  },
  Gold: { product: 2, office: 2, notifications: ["Email", "In-App", "SMS"] },
  Silver: { product: 2, office: 1, notifications: ["Email", "In-App"] },
  General: { product: 1, office: 1, notifications: ["Email"] },
};

interface EditBusinessFormProps {
  id: string;
}

export default function EditBusinessForm({ id }: EditBusinessFormProps) {
  const [loading, setLoading] = useState({
    upload: false,
    submit: false,
    fetch: true,
  }); // Added fetch loading state
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    businessCategory: "",
    businessDescription: "",
    partners: [{ name: "" }],
    categories: [{ main: "", sub: "" }],
    registeredAddress: {
      office: "",
      branch: "",
      location: "",
      branchOffices: [] as {
        address: string;
        city: string;
        state: string;
        pincode: string;
      }[],
    },
    cin: "",
    gst: "",
    udyam: "",
    photos: {
      product: [] as { file: File; preview: string; url: string }[],
      office: [] as { file: File; preview: string; url: string }[],
    },
    premiumCategory: "General",
    dateOfestablishment: "",
  });

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading((prev) => ({ ...prev, fetch: true }));
        const res = await fetch(`/api/businesses/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch business data");
        }

        const businessData = await res.json();
        console.log("Business Data:", businessData);

        // Pre-populate form with fetched data
        setFormData({
          organizationName: businessData.data.organizationName || "",
          organizationType: businessData.data.organizationType || "",
          businessCategory: businessData.data.businessCategory || "",
          businessDescription: businessData.data.businessDescription || "",
          partners:
            businessData.data.partners?.length > 0
              ? businessData.data.partners
              : [{ name: "" }],
          categories:
            businessData.data.categories?.length > 0
              ? businessData.data.categories
              : [{ main: "", sub: "" }],
          registeredAddress: {
            office: businessData.data.registeredAddress?.office || "",
            branch: businessData.data.registeredAddress?.branch || "",
            location: businessData.data.registeredAddress?.location || "",
            branchOffices:
              businessData.data.registeredAddress?.branchOffices || [],
          },
          cin: businessData.data.cin || "",
          gst: businessData.data.gst || "",
          udyam: businessData.data.udyam || "",
          photos: {
            product:
              businessData.data.photos?.product?.map((url: string) => ({
                file: null,
                preview: url,
                url: url,
              })) || [],
            office:
              businessData.data.photos?.office?.map((url: string) => ({
                file: null,
                preview: url,
                url: url,
              })) || [],
          },
          premiumCategory: businessData.data.premiumCategory || "General",
          dateOfestablishment: businessData.data.dateOfestablishment || "",
        });
      } catch (error) {
        console.error("Error fetching business data:", error);
        addToast({
          title: "Error",
          description: "Failed to load business data",
          variant: "destructive",
        });
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };

    if (id) {
      fetchBusinessData();
    }
  }, [id, addToast]);

  const organizationTypes = [
    "Proprietorship",
    "Partnership",
    "Limited Liability Partnership (LLP)",
    "Private Limited",
    "Private Limited (One Person)",
    "Public Limited",
  ];

  const businessCategories = [
    "Dealer/Distributor",
    "Manufacturing",
    "Retail",
    "Service",
  ];

  const mainCategories = [
    "Agriculture",
    "Apparel & Fashion",
    "Chemicals",
    "Construction & Real Estate",
    "Consulting",
    "Education",
    "Electronics & Electrical",
    "Gifts & Crafts",
    "Health & Beauty",
    "Home Supplies",
    "Hospital & Medical",
    "Industrial Supplies",
    "IT/ITES",
    "Machinery",
    "Minerals & Metals",
    "Packaging & Paper",
    "Pipes, Tubes & Fittings",
    "Others",
  ];

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNestedInputChange = (parent: any, field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
    setErrors((prev) => ({ ...prev, [`${parent}.${field}`]: "" }));
  };

  type FormDataType = typeof formData;
  const handleArrayInputChange = <
    K extends keyof FormDataType,
    I extends number,
    F extends string
  >(
    arrayName: K,
    index: I,
    field: F,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: (prev[arrayName] as any[]).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));

    setErrors((prev) => ({
      ...prev,
      [`${arrayName}.${index}.${field}`]: "",
    }));
  };

  const addArrayItem = (arrayName: ArrayKeys, template: any) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template],
    }));
  };

  type ArrayKeys = "partners" | "categories";

  const removeArrayItem = (arrayName: ArrayKeys, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    setLoading((prev) => ({ ...prev, upload: true }));

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();
      return result.imageUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  const handleFileUpload = async (
    type: "product" | "office",
    files: FileList | null
  ) => {
    if (!files) return;
    const maxAllowed = premiumFeatures[formData.premiumCategory][type];
    const newFiles = Array.from(files).slice(0, maxAllowed);

    const previews = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      url: "",
    }));
    setFormData((prev) => ({
      ...prev,
      photos: {
        ...prev.photos,
        [type]: [...prev.photos[type], ...previews].slice(0, maxAllowed),
      },
    }));

    setLoading((prev) => ({ ...prev, upload: true }));

    try {
      for (const file of newFiles) {
        try {
          const url = await uploadImage(file);
          setFormData((prev) => ({
            ...prev,
            photos: {
              ...prev.photos,
              [type]: prev.photos[type].map((p) =>
                p.file === file ? { ...p, url } : p
              ),
            },
          }));
        } catch (e) {
          console.error(e);
          addToast({
            title: "Upload Failed",
            description: `${file.name} could not be uploaded.`,
            variant: "destructive",
          });
        }
      }

      addToast({
        title: "Upload Success",
        description: `${newFiles.length} image(s) uploaded successfully.`,
        variant: "success",
      });
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  const removePhoto = (type: "product" | "office", index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: {
        ...prev.photos,
        [type]: prev.photos[type].filter((_, i) => i !== index),
      },
    }));
  };

   const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.organizationName.trim())
      newErrors.organizationName = "Organization Name is required";
    if (!formData.organizationType.trim())
      newErrors.organizationType = "Organization Type is required";

    if (
      formData.organizationType.includes("Partnership") ||
      formData.organizationType.includes("Limited") ||
      formData.organizationType.includes("Public")
    ) {
      formData.partners.forEach((p, idx) => {
        if (!p.name.trim())
          newErrors[`partners.${idx}.name`] =
            "Partner/Director name is required";
      });
    }

    // CIN validation - mandatory for LLP and company types
    if (
      [
        "Limited Liability Partnership (LLP)",
        "Private Limited",
        "Private Limited (One Person)",
        "Public Limited",
      ].includes(formData.organizationType)
    ) {
      if (!formData.cin || !formData.cin.trim()) {
        newErrors.cin = "CIN is mandatory for this organization type";
      }
    }

    // GST validation - mandatory for all organization types
    if (!formData.gst || !formData.gst.trim()) {
      newErrors.gst = "GST number is mandatory for all organizations";
    }

    if (
      formData.registeredAddress.branchOffices &&
      formData.registeredAddress.branchOffices.length > 0
    ) {
      formData.registeredAddress.branchOffices.forEach((branch, idx) => {
        if (!branch.address.trim()) {
          newErrors[`branchOffice.${idx}.address`] =
            "Branch office address is required";
        }
        if (!branch.city.trim()) {
          newErrors[`branchOffice.${idx}.city`] = "City is required";
        }
        if (!branch.state.trim()) {
          newErrors[`branchOffice.${idx}.state`] = "State is required";
        }
        if (!branch.pincode.trim()) {
          newErrors[`branchOffice.${idx}.pincode`] = "Pin code is required";
        } else if (!/^\d{6}$/.test(branch.pincode)) {
          newErrors[`branchOffice.${idx}.pincode`] =
            "Pin code must be 6 digits";
        }
      });
    }

    if (!formData.businessCategory.trim())
      newErrors.businessCategory = "Business Category is required";
    if (!formData.businessDescription.trim())
      newErrors.businessDescription = "Business Description is required";

    formData.categories.forEach((c, idx) => {
      if (!c.main.trim())
        newErrors[`categories.${idx}.main`] = "Main Category required";
      if (!c.sub.trim())
        newErrors[`categories.${idx}.sub`] = "Sub Category required";
    });

    if (!formData.registeredAddress.office.trim())
      newErrors["registeredAddress.office"] = "Registered Address is required";

    if (!formData.premiumCategory.trim())
      newErrors.premiumCategory = "Select Premium Category";

    if (formData.photos.product.length === 0)
      newErrors.photosProduct = "Upload at least one Product Photo";
    if (formData.photos.office.length === 0)
      newErrors.photosOffice = "Upload at least one Office Photo";

    if (
      formData.dateOfestablishment === "" ||
      formData.dateOfestablishment === null
    )
      newErrors.dateOfestablishment = "Date of Establishment is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading((prev) => ({ ...prev, submit: true }));
      const finalData = {
        ...formData,
        photos: {
          product: formData.photos.product.map((p) => p.url),
          office: formData.photos.office.map((p) => p.url),
        },
      };

      const res = await fetch(`/api/businesses/${id}`, {
        method: "PATCH", // ✅ PUT ki jagah PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        addToast({
          title: "Success",
          description: "Business updated successfully!",
          variant: "success",
        });
        router.push("/admin/view-business");
      } else {
        const error = await res.json();
        addToast({
          title: "Failed",
          description: error?.message || "Failed to update business",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const showPartners =
    formData.organizationType.includes("Partnership") ||
    formData.organizationType.includes("Limited") ||
    formData.organizationType.includes("Public");

  // Premium Category Popup
  const PremiumPopup = () => {
    if (!showPopup) return null;

    const { product, office, notifications } =
      premiumFeatures[formData.premiumCategory];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6 relative">
          <h2 className="text-xl font-bold mb-4 text-center text-red-700">
            Premium Category: {formData.premiumCategory}
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Product Photos allowed:</strong> {product}
            </p>
            <p>
              <strong>Office Photos allowed:</strong> {office}
            </p>
            <p>
              <strong>Notifications included:</strong>{" "}
              {notifications.join(", ")}
            </p>
          </div>
          <div className="text-center mt-6">
            <Button
              onClick={() => setShowPopup(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
            >
              OK
            </Button>
          </div>
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  if (loading.fetch) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {(loading.upload || loading.submit) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <Loader />
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 min-h-screen">
        <PremiumPopup />

        <Card className="shadow-lg border border-yellow-200">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-red-700 mb-6 text-center">
              Add your Business House/Company
            </h1>
            <div className="space-y-6">
              {/* Organization Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  1) Name of Organization *
                </label>
                <input
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) =>
                    handleInputChange("organizationName", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                {errors.organizationName && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.organizationName}
                  </p>
                )}
              </div>

              {/* Organization Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  2) Type of Organization *
                </label>
                <select
                  value={formData.organizationType}
                  onChange={(e) =>
                    handleInputChange("organizationType", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select organization type</option>
                  {organizationTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {index + 1}) {type}
                    </option>
                  ))}
                </select>
                {errors.organizationType && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.organizationType}
                  </p>
                )}
              </div>

              {/* Partners/Directors */}
              {showPartners && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Partners/Directors Names *
                  </label>
                  {formData.partners.map((p, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "partners",
                            idx,
                            "name",
                            e.target.value
                          )
                        }
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      {formData.partners.length > 1 && (
                        <Button
                          onClick={() => removeArrayItem("partners", idx)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                      {errors[`partners.${idx}.name`] && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors[`partners.${idx}.name`]}
                        </p>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={() => addArrayItem("partners", { name: "" })}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    <Plus size={16} className="mr-1" /> Add Partner/Director
                  </Button>
                </div>
              )}

              {/* Business Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  3) Type of Business *
                </label>
                <select
                  value={formData.businessCategory}
                  onChange={(e) =>
                    handleInputChange("businessCategory", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select business category</option>
                  {businessCategories.map((c, idx) => (
                    <option key={idx} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.businessCategory && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.businessCategory}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  4) Date Of Establishment *
                </label>
                <input
                  type="date"
                  value={formData.dateOfestablishment}
                  onChange={(e) =>
                    handleInputChange("dateOfestablishment", e.target.value)
                  }
                  max={new Date().toISOString().split("T")[0]} // future date disable
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                {errors.dateOfestablishment && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.dateOfestablishment}
                  </p>
                )}
              </div>

              {/* Business Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  5) Describe your business *
                </label>
                <textarea
                  value={formData.businessDescription}
                  onChange={(e) =>
                    handleInputChange("businessDescription", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-32"
                  maxLength={2400}
                />
                {errors.businessDescription && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.businessDescription}
                  </p>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {formData.businessDescription.length}/2400 characters
                </div>
              </div>

              {/* Business Categories & Products */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  6) Business Categories & Products/Services *
                </label>
                {formData.categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Main Category
                        </label>
                        <select
                          value={cat.main}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "categories",
                              idx,
                              "main",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="">Select main category</option>
                          {mainCategories.map((m, i) => (
                            <option key={i} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                        {errors[`categories.${idx}.main`] && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors[`categories.${idx}.main`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Sub Category/Product
                        </label>
                        <input
                          type="text"
                          value={cat.sub}
                          onChange={(e) =>
                            handleArrayInputChange(
                              "categories",
                              idx,
                              "sub",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="e.g., LED Bulbs, Surgical Masks"
                        />
                        {errors[`categories.${idx}.sub`] && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors[`categories.${idx}.sub`]}
                          </p>
                        )}
                      </div>
                    </div>
                    {formData.categories.length > 1 && (
                      <Button
                        onClick={() => removeArrayItem("categories", idx)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs mt-2"
                      >
                        <Trash2 size={14} className="mr-1" /> Remove Category
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() =>
                    addArrayItem("categories", { main: "", sub: "" })
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Plus size={16} className="mr-1" /> Add Category
                </Button>
              </div>

              {/* Registered Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  7) Registered Address *
                </label>
                <textarea
                  value={formData.registeredAddress.office}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "registeredAddress",
                      "office",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-24"
                  placeholder="Enter complete office address..."
                />
                {errors["registeredAddress.office"] && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors["registeredAddress.office"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  8) Corporate/Branch Office Address (Optional, multiple
                  allowed)
                </label>
                {formData.registeredAddress.branchOffices?.map(
                  (branch, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
                    >
                      <div className="grid grid-cols-1 gap-4">
                        {/* Address */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Branch Office Address *
                          </label>
                          <textarea
                            value={branch.address}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                registeredAddress: {
                                  ...prev.registeredAddress,
                                  branchOffices:
                                    prev.registeredAddress.branchOffices.map(
                                      (b, i) =>
                                        i === idx
                                          ? { ...b, address: e.target.value }
                                          : b
                                    ),
                                },
                              }))
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-20"
                            placeholder="Enter complete branch office address"
                            required
                          />
                          {errors[`branchOffice.${idx}.address`] && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors[`branchOffice.${idx}.address`]}
                            </p>
                          )}
                        </div>

                        {/* City, State, Pin code in a row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              City *
                            </label>
                            <input
                              type="text"
                              value={branch.city}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  registeredAddress: {
                                    ...prev.registeredAddress,
                                    branchOffices:
                                      prev.registeredAddress.branchOffices.map(
                                        (b, i) =>
                                          i === idx
                                            ? { ...b, city: e.target.value }
                                            : b
                                      ),
                                  },
                                }))
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              placeholder="Enter city"
                              required
                            />
                            {errors[`branchOffice.${idx}.city`] && (
                              <p className="text-red-600 text-xs mt-1">
                                {errors[`branchOffice.${idx}.city`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              State *
                            </label>
                            <select
                              value={branch.state}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  registeredAddress: {
                                    ...prev.registeredAddress,
                                    branchOffices:
                                      prev.registeredAddress.branchOffices.map(
                                        (b, i) =>
                                          i === idx
                                            ? { ...b, state: e.target.value }
                                            : b
                                      ),
                                  },
                                }))
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                              <option value="">Select State</option>
                              {[
                                "Andhra Pradesh",
                                "Arunachal Pradesh",
                                "Assam",
                                "Bihar",
                                "Chhattisgarh",
                                "Goa",
                                "Gujarat",
                                "Haryana",
                                "Himachal Pradesh",
                                "Jharkhand",
                                "Karnataka",
                                "Kerala",
                                "Madhya Pradesh",
                                "Maharashtra",
                                "Manipur",
                                "Meghalaya",
                                "Mizoram",
                                "Nagaland",
                                "Odisha",
                                "Punjab",
                                "Rajasthan",
                                "Sikkim",
                                "Tamil Nadu",
                                "Telangana",
                                "Tripura",
                                "Uttar Pradesh",
                                "Uttarakhand",
                                "West Bengal",
                              ].map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                            {errors[`branchOffice.${idx}.state`] && (
                              <p className="text-red-600 text-xs mt-1">
                                {errors[`branchOffice.${idx}.state`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Pin Code *
                            </label>
                            <input
                              type="number"
                              value={branch.pincode}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value === "" ||
                                  (/^\d+$/.test(value) && value.length <= 6)
                                ) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    registeredAddress: {
                                      ...prev.registeredAddress,
                                      branchOffices:
                                        prev.registeredAddress.branchOffices.map(
                                          (b, i) =>
                                            i === idx
                                              ? { ...b, pincode: value }
                                              : b
                                        ),
                                    },
                                  }));
                                }
                              }}
                              onKeyDown={(e) => {
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  ![
                                    "Backspace",
                                    "Delete",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                  ].includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              placeholder="Enter 6-digit pin code"
                              maxLength={6}
                              min="0"
                              max="999999"
                              required
                            />
                            {errors[`branchOffice.${idx}.pincode`] && (
                              <p className="text-red-600 text-xs mt-1">
                                {errors[`branchOffice.${idx}.pincode`]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            registeredAddress: {
                              ...prev.registeredAddress,
                              branchOffices:
                                prev.registeredAddress.branchOffices.filter(
                                  (_, i) => i !== idx
                                ),
                            },
                          }))
                        }
                        className="bg-red-600 hover:bg-red-700 text-white text-sm mt-3"
                      >
                        <Trash2 size={14} className="mr-1" /> Remove Branch
                        Office
                      </Button>
                    </div>
                  )
                )}

                <Button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      registeredAddress: {
                        ...prev.registeredAddress,
                        branchOffices: [
                          ...(prev.registeredAddress.branchOffices || []),
                          { address: "", city: "", state: "", pincode: "" },
                        ],
                      },
                    }))
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Plus size={16} className="mr-1" /> Add Branch Office
                </Button>
              </div>

              {/* GST - Mandatory for all organizations */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GST Number *
                </label>
                <input
                  type="text"
                  value={formData.gst || ""}
                  onChange={(e) => handleInputChange("gst", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter GST Number"
                />
                {errors.gst && (
                  <p className="text-red-600 text-xs mt-1">{errors.gst}</p>
                )}
              </div>

              {/* CIN and Udyam for specific organization types */}
              {[
                "Limited Liability Partnership (LLP)",
                "Private Limited",
                "Private Limited (One Person)",
                "Public Limited",
              ].includes(formData.organizationType) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CIN *
                    </label>
                    <input
                      type="text"
                      value={formData.cin || ""}
                      onChange={(e) => handleInputChange("cin", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter CIN"
                    />
                    {errors.cin && (
                      <p className="text-red-600 text-xs mt-1">{errors.cin}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Udyam (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.udyam || ""}
                      onChange={(e) =>
                        handleInputChange("udyam", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter Udyam No."
                    />
                  </div>
                </div>
              )}

              {/* Udyam for other organization types (optional) */}
              {![
                "Limited Liability Partnership (LLP)",
                "Private Limited",
                "Private Limited (One Person)",
                "Public Limited",
              ].includes(formData.organizationType) &&
                formData.organizationType && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Udyam (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.udyam || ""}
                      onChange={(e) =>
                        handleInputChange("udyam", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter Udyam No."
                    />
                  </div>
                )}

              {/* Premium Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Premium Category *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(premiumFeatures).map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 border p-2 rounded cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="premiumCategory"
                        value={category}
                        checked={formData.premiumCategory === category}
                        onChange={(e) => {
                          handleInputChange("premiumCategory", e.target.value);
                          setShowPopup(true);
                        }}
                      />
                      {category}
                    </label>
                  ))}
                </div>
                {errors.premiumCategory && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.premiumCategory}
                  </p>
                )}
              </div>

              {/* Photos Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  9) Add Photos *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Photos */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Product Photos (Max:{" "}
                      {premiumFeatures[formData.premiumCategory].product})
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="product-photos"
                      onChange={(e) =>
                        handleFileUpload("product", e.target.files)
                      }
                    />
                    <Button
                      onClick={() =>
                        document.getElementById("product-photos")?.click()
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      disabled={loading.upload || loading.submit}
                    >
                      {loading.upload ? "Uploading..." : "Upload"}
                    </Button>

                    {errors.photosProduct && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.photosProduct}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {formData.photos.product.map((p, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={p.preview}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <Button
                            size="sm"
                            className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => removePhoto("product", idx)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Office Photos */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Office Photos (Max:{" "}
                      {premiumFeatures[formData.premiumCategory].office})
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="office-photos"
                      onChange={(e) =>
                        handleFileUpload("office", e.target.files)
                      }
                    />
                    <Button
                      onClick={() =>
                        document.getElementById("office-photos")?.click()
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      disabled={loading.upload || loading.submit}
                    >
                      {loading.upload ? "Uploading..." : "Upload"}
                    </Button>

                    {errors.photosOffice && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.photosOffice}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {formData.photos.office.map((p, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={p.preview}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <Button
                            size="sm"
                            className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => removePhoto("office", idx)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={loading.submit || loading.upload}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                >
                  {loading.submit ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
