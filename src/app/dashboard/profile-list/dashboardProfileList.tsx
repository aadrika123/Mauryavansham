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
  const enrichedProfiles = props?.profileList?.profiles?.map((profile: any) => {
    if (session?.user?.id && profile.userId === session.user.id) {
      return { ...profile, lastActive: "Online now" };
    }
    return profile;
  });

  return (
    <div className="space-y-6 w-[80%] mx-auto mb-10">
      {enrichedProfiles?.map((profile: any) => (
        <Card
          key={profile.id}
          className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl border border-gray-100"
        >
          {/* Header Section */}
          <div className="flex gap-6 p-6">
            <div className="relative">
              <img
                src={profile.profileImage1 || "/placeholder.png"}
                alt={profile.name}
                className="w-32 h-32 rounded-xl object-cover shadow-md"
              />
              {/* {profile.lastActive === "Online now" && (
                <span className="absolute bottom-2 right-2 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <Circle className="relative inline-flex rounded-full h-4 w-4 text-green-500 bg-green-500" />
                </span>
              )} */}
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-gray-800 capitalize flex items-center gap-2">
                  {profile.name}
                  {profile.isVerified && (
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  )}
                  {profile.isPremium && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                  <Badge variant="outline" className="mt-2 capitalize">
                    {profile.profileRelation}
                  </Badge>
                </h3>
                {profile.lastActive && (
                  <div className="flex items-center gap-2 mt-1">
                    {/* Green Dot */}
                    {profile.lastActive === "Online now" && (
                      <span className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                      </span>
                    )}
                    <p className="text-xs text-gray-500">
                      {profile.lastActive}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm">
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
          <CardContent className="flex gap-3 px-6 pb-6">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/view-profile/${profile.id}`)
              }
              className="rounded-lg"
            >
              <Eye className="w-4 h-4 mr-2" /> View
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/edit-profile/${profile.id}`)
              }
              className="rounded-lg"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDeactivateProfileClick(profile.id)}
              disabled={deactivatingProfile === profile.id}
              className="rounded-lg border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <UserX className="w-4 h-4 mr-2" />
              {deactivatingProfile === profile.id
                ? "Deactivating..."
                : "Deactivate"}
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Modal */}
      <DeactivateProfileModal
        open={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}
