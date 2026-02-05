'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/tabs';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Calendar, User, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Achievement {
  id: number;
  name: string;
  fatherName: string;
  motherName: string;
  achievementTitle: string;
  description: string;
  images: string[];
  category:
    | 'Healthcare'
    | 'Sports'
    | 'Technology'
    | 'Education'
    | 'Business'
    | 'Arts'
    | 'Central Government'
    | 'PSU'
    | 'State Government'
    | 'Other';
  otherCategory?: string;
  isVerified: boolean;
  isFeatured: boolean;
  isHallOfFame: boolean;
  year: number;
  location: string;
  keyAchievement: string;
  impact: string;
  achievements: string[];
  status: string;
  createdBy?: string;
  createdAt?: string;
  removedBy?: string | null;
  removedById?: string | null;
  reason?: string | null;
  removedAt?: string | null;
}

export default function AdminAchievementsPage({ achievements }: { achievements: Achievement[] }) {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [disableReason, setDisableReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const activeAchievements = achievements.filter(a => a.status === 'active');
  const removedAchievements = achievements.filter(a => a.status === 'inactive');
  const rejectedAchievements = achievements.filter(a => a.status === 'removed');

  const openModal = (achievement: Achievement) => setSelectedAchievement(achievement);
  const closeModal = () => setSelectedAchievement(null);

  const handleDisableClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowReasonModal(true);
  };

  const handleActivateClick = async (achievement: Achievement) => {
    try {
      setProcessing(true);
      const res = await fetch(`/api/achievements/updateStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: achievement.id,
          status: 'active',
          reason: null
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`"${achievement.name}" has been activated.`);
        window.location.reload();
      } else {
        toast.error(data.message || 'Failed to activate.');
      }
    } catch (err) {
      toast.error('Error activating achievement.');
    } finally {
      setProcessing(false);
    }
  };

  const submitDisable = async () => {
    if (!disableReason.trim()) {
      toast.error('Please provide a reason before disabling.');
      return;
    }

    if (!selectedAchievement) return;

    try {
      setProcessing(true);
      const res = await fetch(`/api/achievements/updateStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAchievement.id,
          status: 'inactive',
          reason: disableReason
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`"${selectedAchievement.name}" has been disabled.`);
        setShowReasonModal(false);
        setDisableReason('');
        window.location.reload();
      } else {
        toast.error(data.message || 'Failed to disable.');
      }
    } catch (err) {
      toast.error('Error disabling achievement.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-6">View Achievements</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Pending</TabsTrigger>
          <TabsTrigger value="removed">Removed</TabsTrigger>
        </TabsList>

        {/* Active Tab */}
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {activeAchievements.map(a => (
              <Card key={a.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Show First Image */}
                  {a.images?.[0] ? (
                    <img src={a.images[0]} alt={a.name} className="w-full h-40 object-cover rounded-md mb-4" />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  <Badge className="mb-2">{a.category === 'Other' ? a.otherCategory || 'Other' : a.category}</Badge>

                  <h3 className="font-bold text-lg text-red-700">{a.name}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Father:</span> {a.fatherName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Mother:</span> {a.motherName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Achievement Title:</span> {a.achievementTitle}
                  </p>

                  <div className="text-sm text-gray-500 mt-3">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Created On:{' '}
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '—'}
                    </p>

                    <p className="flex items-center gap-1">
                      <User className="w-4 h-4" /> Created By: {a.createdBy || '—'}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => openModal(a)}
                      className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>

                    {/* <Button
                      variant="destructive"
                      onClick={() => handleDisableClick(a)}
                      className="flex-1"
                    >
                      Disable
                    </Button> */}

                    {/* <Link href={`/admin/created-achievement/${a.id}/edit`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                        Edit
                      </Button>
                    </Link> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Disabled Tab */}
        <TabsContent value="inactive">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {removedAchievements.map(a => (
              <Card key={a.id} className="hover:shadow-md transition-shadow border-red-200">
                <CardContent className="p-4">
                  {a.images?.[0] ? (
                    <img src={a.images[0]} alt={a.name} className="w-full h-40 object-cover rounded-md mb-4" />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  <Badge className="mb-2 bg-red-100 text-red-700">{a.status.toUpperCase()}</Badge>
                  <h3 className="font-bold text-lg text-red-700">{a.name}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Father:</span> {a.fatherName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Mother:</span> {a.motherName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Achievement Title:</span> {a.achievementTitle}
                  </p>

                  <div className="text-sm text-gray-500 mt-3">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Created On:{' '}
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '—'}
                    </p>

                    <p className="flex items-center gap-1">
                      <User className="w-4 h-4" /> Created By: {a.createdBy || '—'}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => openModal(a)} variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Link href={`/admin/created-achievement-general/${a.id}/edit`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">Edit</Button>
                    </Link>

                    {/* <Button
                      onClick={() => handleActivateClick(a)}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      disabled={processing}
                    >
                      Activate
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="removed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {rejectedAchievements.map(a => (
              <Card key={a.id} className="hover:shadow-md transition-shadow border-red-200">
                <CardContent className="p-4">
                  {a.images?.[0] ? (
                    <img src={a.images[0]} alt={a.name} className="w-full h-40 object-cover rounded-md mb-4" />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  <Badge className="mb-2 bg-red-100 text-red-700">{a.status.toUpperCase()}</Badge>
                  <h3 className="font-bold text-lg text-red-700">{a.name}</h3>
                  <p className="text-sm text-gray-600">{a.achievementTitle}</p>

                  <div className="text-sm text-gray-500 mt-3">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Removed On:{' '}
                      {a.removedAt
                        ? new Date(a.removedAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '—'}
                    </p>
                    <p className="flex items-center gap-1">
                      <User className="w-4 h-4" /> Removed By: {a.removedBy || '—'}
                    </p>
                    <p className="flex items-center gap-1">
                      <User className="w-4 h-4" /> Reason: {a.reason || '—'}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => openModal(a)} variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Link href={`/admin/created-achievement-general/${a.id}/edit`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">Edit</Button>
                    </Link>

                    {/* <Button
                      onClick={() => handleActivateClick(a)}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      disabled={processing}
                    >
                      Activate
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={!!selectedAchievement && !showReasonModal} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-red-700 text-xl font-bold">
              {selectedAchievement?.achievementTitle}
            </DialogTitle>
          </DialogHeader>

          {selectedAchievement && (
            <div>
              {/* Multiple Images */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {selectedAchievement.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${selectedAchievement.name}-${i}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>

              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Name:</span> {selectedAchievement.name}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Father's Name:</span> {selectedAchievement.fatherName}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Mother's Name:</span> {selectedAchievement.motherName}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Category:</span>{' '}
                {selectedAchievement.category === 'Other'
                  ? selectedAchievement.otherCategory
                  : selectedAchievement.category}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Description:</span> {selectedAchievement.description}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Key Achievement:</span> {selectedAchievement.keyAchievement}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Impact:</span> {selectedAchievement.impact}
              </p>

              <div className="flex justify-end mt-6">
                <Button onClick={closeModal} className="bg-red-600 text-white">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reason Dialog */}
      <Dialog open={showReasonModal} onOpenChange={setShowReasonModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-700">Disable Achievement</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-2">
            Please enter a reason for disabling <strong>{selectedAchievement?.achievementTitle}</strong>:
          </p>
          <textarea
            value={disableReason}
            onChange={e => setDisableReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full border rounded-lg p-2 text-sm mb-4 focus:ring-1 focus:ring-red-500 outline-none"
            rows={4}
          />
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowReasonModal(false);
                setSelectedAchievement(null);
                setDisableReason('');
              }}
            >
              Cancel
            </Button>

            <Button onClick={submitDisable} className="bg-red-600 hover:bg-red-700 text-white" disabled={processing}>
              {processing ? 'Processing...' : 'Disable'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
