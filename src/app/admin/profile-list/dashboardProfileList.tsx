"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react"; // ✅ added
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Eye,
  Edit,
  UserX,
  Crown,
  ShieldCheck,
  MapPin,
  GraduationCap,
  Briefcase,
  Circle,
} from "lucide-react";

// ✅ Deactivate Modal
const DeactivateProfileModal = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string, review: string) => void;
}) => {
  const [reason, setReason] = useState("");
  const [review, setReview] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Deactivate Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Reason
            </label>
            <Select onValueChange={(val) => setReason(val)}>
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="married">I found my match</SelectItem>
                <SelectItem value="not_interested">
                  Not interested anymore
                </SelectItem>
                <SelectItem value="privacy">Privacy concerns</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Your Review
            </label>
            <Textarea
              placeholder="Share your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-lg">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm(reason, review);
              onClose();
            }}
            disabled={!reason}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:opacity-90"
          >
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ✅ Main Component
export default function DashboardProfileList(props: any) {
  const router = useRouter();
  const { data: session } = useSession(); // ✅ added
  const [deactivatingProfile, setDeactivatingProfile] = useState<string | null>(
    null
  );
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  console.log(props?.user);
  const handleDeactivateProfileClick = (profileId: string) => {
    setSelectedProfileId(profileId);
    setShowDeactivateModal(true);
  };

  const handleConfirmDeactivate = async (reason: string, review: string) => {
    if (!selectedProfileId) return;

    try {
      setDeactivatingProfile(selectedProfileId);

      const formData = new FormData();
      formData.append("isDeleted", "true");
      formData.append("isActive", "false");
      formData.append("deactivateReason", reason);
      formData.append("deactivateReview", review);

      const res = await props.updateProfileById(formData, selectedProfileId);

      if (res.success) {
        alert("Profile deactivated successfully!");
        if (props.onProfileUpdated) props.onProfileUpdated();
      } else {
        alert(res.message || "Failed to deactivate profile.");
      }
    } catch (error) {
      console.error("Error deactivating profile:", error);
      alert("Failed to deactivate profile. Please try again.");
    } finally {
      setDeactivatingProfile(null);
    }
  };

  // ✅ enrich profiles to mark logged-in user's profiles as online
  const enrichedProfiles = props?.profileList?.profiles
    ?.filter((profile: any) => profile.userId === session?.user?.id) // ✅ only current user's profiles
    .map((profile: any) => {
      return { ...profile, lastActive: "Online now" };
    });

  return (
    <div className="space-y-6 w-full sm:w-[90%] lg:w-[80%] mx-auto mb-10">
      {enrichedProfiles?.map((profile: any) => (
        <Card
          key={profile.id}
          className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl border border-gray-100"
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row gap-6 p-6">
            {/* Profile Image */}
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={profile.profileImage1 || "/placeholder.png"}
                alt={profile.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover shadow-md"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize flex items-center gap-2">
                  {profile.name}
                  {profile.isVerified && (
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  )}
                  {profile.isPremium && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                  <Badge
                    variant="outline"
                    className="capitalize text-xs sm:text-sm"
                  >
                    {profile.profileRelation}
                  </Badge>
                </h3>

                {profile.lastActive && (
                  <div className="flex items-center gap-2 mt-2 sm:mt-1">
                    {profile.lastActive === "Online now" && (
                      <span className="relative flex h-3 w-3 sm:h-4 sm:w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-green-500"></span>
                      </span>
                    )}
                    <p className="text-xs text-gray-500">
                      {profile.lastActive}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm mt-1">
                {profile.age} yrs • {profile.height}
              </p>
              <p className="flex items-center text-sm text-gray-700 mt-1">
                <MapPin className="w-4 h-4 mr-1" /> {profile.location}
              </p>
              <p className="flex items-center text-sm text-gray-700 mt-1">
                <GraduationCap className="w-4 h-4 mr-1" /> {profile.education}
              </p>
              <p className="flex items-center text-sm text-gray-700 mt-1">
                <Briefcase className="w-4 h-4 mr-1" /> {profile.occupation} @{" "}
                {profile.company}
              </p>
              {profile.gotra && (
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Gotra:</span> {profile.gotra}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <CardContent className="flex flex-wrap gap-3 px-6 pb-6">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/admin/view-profile/${profile.id}`)
              }
              className="rounded-lg flex-1 sm:flex-none"
            >
              <Eye className="w-4 h-4 mr-2" /> View
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/admin/edit-profile/${profile.id}`)
              }
              className="rounded-lg flex-1 sm:flex-none"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDeactivateProfileClick(profile.id)}
              disabled={deactivatingProfile === profile.id}
              className="rounded-lg border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 flex-1 sm:flex-none"
            >
              <UserX className="w-4 h-4 mr-2" />
              {deactivatingProfile === profile.id
                ? "Deactivating..."
                : "Deactivate"}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/admin/profile-interests/${profile.id}`)
              }
              className="rounded-lg border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 flex-1 sm:flex-none"
            >
              View Interests
            </Button>
          </CardContent>
        </Card>
      ))}

      {enrichedProfiles.length === 0 && (
        <p className="text-center text-gray-600">No profiles found.</p>
      )}

      {/* Modal */}
      <DeactivateProfileModal
        open={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}
