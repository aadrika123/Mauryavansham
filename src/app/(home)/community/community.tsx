"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  ArrowLeft,
  Crown,
  Plus,
  MessageCircle,
  Heart,
  Search,
  Star,
  Sparkles,
  X,
  User,
  Lock,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Ad {
  id: number;
  title: string;
  bannerImageUrl: string;
  link?: string;
  views: number;
  placementId: number;
}

interface Discussion {
  id: number;
  title: string;
  content: string;
  author: string;
  location: string;
  timeAgo: string;
  replies: number;
  likes: number;
  category: string;
  createdAt: string;
  isLiked?: boolean;
  likeCount: number;
  authorName: string;
  replyCount: number;
  authorId: string;
  isCompleted: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  user?: User;
}

export default function CommunityForumPage({ user }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All Discussions");
  const [searchQuery, setSearchQuery] = useState("");
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const Router = useRouter();
  const [categories, setCategories] = useState([] as any[]);
  // Create Discussion Form State
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "Business Help",
    location: "",
  });

  const [adPlacements, setAdPlacements] = useState<Ad[]>([]);
  // Add to your CommunityForumPage component state
  const [openDiscussionId, setOpenDiscussionId] = useState<number | null>(null);
  const [discussionReplies, setDiscussionReplies] = useState<any[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<Discussion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDiscussion(null);
    setIsModalOpen(false);
  };

  // Close modal
  const closeRepliesModal = () => {
    setOpenDiscussionId(null);
    setDiscussionReplies([]);
  };

  // Load ad placements
  useEffect(() => {
    fetch("/api/ad-placements/approved")
      .then((res) => res.json())
      .then((data: Ad[]) => {
        setAdPlacements(data);
      })
      .catch(() => console.error("Failed to load ad placements"));
  }, []);

  // Load discussions and categories
  useEffect(() => {
    loadDiscussions();
  }, [selectedCategory, searchQuery]);

  // After fetching categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/discussions/category");
        const data = await res.json();
        if (data.success) {
          const allCategories = [
            { id: 0, name: "All Discussions", count: 0 },
            { id: -1, name: "My Discussions", count: 0 }, // <-- New special category
            ...data.data.map((cat: any) => ({ ...cat, count: 0 })),
          ];
          setCategories(allCategories);

          // Load discussions with updated categories
          loadDiscussions(allCategories);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const loadDiscussions = async (fetchedCategories?: any[]) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/discussions?${params}`);
      const data = await response.json();
      const allDiscussions: Discussion[] = data.data || data || [];

      // Filter discussions for display
      let filteredDiscussions: Discussion[];
      if (selectedCategory === "All Discussions") {
        filteredDiscussions = allDiscussions.filter((d) => !d.isCompleted);
      } else if (selectedCategory === "My Discussions") {
        filteredDiscussions = allDiscussions.filter(
          (d) => String(d.authorId) === String(user?.id)
        );
      } else {
        filteredDiscussions = allDiscussions.filter(
          (d) => d.category === selectedCategory && !d.isCompleted
        );
      }

      setDiscussions(filteredDiscussions);

      // Update category counts
      const counts: Record<string, number> = {
        "All Discussions": allDiscussions.filter((d) => !d.isCompleted).length,
        "My Discussions": allDiscussions.filter(
          (d) => String(d.authorId) === String(user?.id)
        ).length,
      };

      // Only count incomplete discussions for other categories
      allDiscussions.forEach((d) => {
        if (!d.isCompleted && d.category) {
          counts[d.category] = (counts[d.category] || 0) + 1;
        }
      });

      const catsToUse = fetchedCategories || categories;
      const updatedCategories = catsToUse.map((cat) => ({
        ...cat,
        count: counts[cat.name] || 0,
      }));

      setCategories(updatedCategories);
    } catch (error) {
      console.error("Failed to load discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDiscussion = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowCreateModal(true);
    }
  };

  const handleCreateDiscussion = async () => {
    if (!user || !newDiscussion.title || !newDiscussion.content) return;

    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDiscussion),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewDiscussion({
          title: "",
          content: "",
          category: "Business Help",
          location: "",
        });
        loadDiscussions(); // Reload discussions
      }
    } catch (error) {
      console.error("Failed to create discussion:", error);
    }
  };

  const handleLikeDiscussion = async (discussionId: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await fetch(`/api/discussions/${discussionId}/likes`, {
        method: "POST",
      });

      if (response.ok) {
        // Backend ab hamesha JSON return karega (success + liked)
        const data = await response.json();
        console.log("Like response:", data);

        // ✅ Reload discussions to get updated likes count from DB
        loadDiscussions();
      }
    } catch (error) {
      console.error("Failed to like discussion:", error);
    }
  };
  const handleCloseDiscussion = async (discussionId: number) => {
    try {
      const res = await fetch(`/api/discussions/${discussionId}/close`, {
        method: "PATCH",
      });

      if (res.ok) {
        loadDiscussions(); // reload discussions
      } else {
        console.error("Failed to close discussion");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to open discussion modal and load replies
  // Fetch replies
  const fetchReplies = async (discussionId: number) => {
    setRepliesLoading(true);
    try {
      const res = await fetch(`/api/discussions/${discussionId}/replies`);
      const data = await res.json();
      setDiscussionReplies(data.data || []);
    } catch (error) {
      console.error("Failed to load replies:", error);
    } finally {
      setRepliesLoading(false);
    }
  };

  // Open modal
  const handleViewReplies = (discussionId: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setOpenDiscussionId(discussionId);
    fetchReplies(discussionId);
  };

  // Post a reply
  const handlePostReply = async () => {
    if (!newReplyContent.trim() || !openDiscussionId) return;

    try {
      const res = await fetch(`/api/discussions/${openDiscussionId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discussionId: openDiscussionId, // optional, server already has [id]
          content: newReplyContent,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // latest reply show kare
        setDiscussionReplies((prev) => [data.data, ...prev]);
        setNewReplyContent("");
      } else {
        console.error("Failed to post reply:", data.message);
      }
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Business Help": "bg-blue-100 text-blue-800 border-blue-200",
      "Community Connect": "bg-green-100 text-green-800 border-green-200",
      "Culture & Traditions": "bg-purple-100 text-purple-800 border-purple-200",
      Education: "bg-orange-100 text-orange-800 border-orange-200",
      "Matrimonial Advice": "bg-pink-100 text-pink-800 border-pink-200",
      "Health & Wellness": "bg-teal-100 text-teal-800 border-teal-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const ad = adPlacements.find((ad) => ad.placementId === 5);

  useEffect(() => {
    if (ad) {
      fetch(`/api/ad-placements/${ad.id}`, { method: "POST" });
    }
  }, [ad]);

  console.log(selectedCategory, "categories");
  return (
    <div className="px-12 min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Login Required
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Please login to participate in community discussions and create
              new topics.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => Router.push("/sign-in")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button
                onClick={() => setShowLoginModal(false)}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Discussion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700">
                Start New Discussion
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discussion Title
                </label>
                <Input
                  placeholder="Enter discussion title..."
                  value={newDiscussion.title}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      title: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newDiscussion.category}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {categories
                    .filter((cat) => cat.name !== "All Discussions") // skip the special category
                    .map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  placeholder="Enter location..."
                  value={newDiscussion.location}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      location: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  placeholder="Write your discussion content..."
                  value={newDiscussion.content}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      content: e.target.value,
                    })
                  }
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleCreateDiscussion}
                disabled={!newDiscussion.title || !newDiscussion.content}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                Create Discussion
              </Button>
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Community Forum</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="container mx-auto px-4 py-8 text-center">
        <Crown className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg transform"></div>
          <h1 className="relative text-3xl md:text-4xl font-bold text-red-700">
            Community Forum
          </h1>
        </div>
        <p className="text-lg text-red-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Connect, share, and help each other in our supportive Maurya community
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* New Discussion Button */}
            <Card className="mb-6 bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3 text-red-700">
                  <Plus className="h-4 w-4" />
                  <span className="font-semibold">New Discussion</span>
                </div>
                <Button
                  onClick={handleStartDiscussion}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                >
                  Start Discussion
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h3 className="font-bold text-red-700 mb-4">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.name
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                          : "text-red-700 hover:bg-orange-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                        <span className="text-xs opacity-75">
                          ({category.count})
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-red-500"
                />
              </div>
            </div>

            {/* Discussion Threads */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading discussions...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {discussions.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No discussions found
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery || selectedCategory !== "All Discussions"
                        ? "Try adjusting your search or category filter"
                        : "Be the first to start a discussion!"}
                    </p>
                  </div>
                ) : (
                  discussions.map((discussion) => (
                    <Card
                      key={discussion.id}
                      className="bg-yellow-50 border-yellow-200 hover:shadow-md transition-shadow hover:shadow-yellow-200"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* <Link
                              href={`/community/discussions/${discussion.id}`}
                              className="text-xl font-semibold text-red-700 mb-2 hover:text-red-800 cursor-pointer block"
                            >
                              {discussion.title}
                            </Link> */}
                            <h2
                              className="text-xl font-semibold text-red-700 mb-2 hover:text-red-800 cursor-pointer"
                              onClick={() => openModal(discussion)}
                            >
                              {discussion.title}
                            </h2>
                            <p className="text-base  mb-1">
                              <span className="text-red-500">
                                {discussion.authorName} {""}
                              </span>
                              <span className="text-gray-600"> • </span>
                              <span className="text-gray-600">
                                {discussion.location}{" "}
                              </span>
                              <span className="text-gray-600">•</span>
                              <span className="text-gray-600">
                                {new Date(discussion.createdAt)
                                  .toLocaleDateString("en-GB")
                                  .replaceAll("/", "-")}
                              </span>
                            </p>
                            <p className="text-gray-600 text-base mb-3 line-clamp-2">
                              {discussion.content}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <span className="font-medium text-red-600">
                                {discussion.author}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <button
                                onClick={() => handleViewReplies(discussion.id)}
                                className="flex items-center gap-1 hover:text-red-600 cursor-pointer"
                              >
                                <MessageCircle className="h-4 w-4" />
                                <span>{discussion.replyCount} replies</span>
                              </button>

                              <button
                                onClick={() =>
                                  handleLikeDiscussion(discussion.id)
                                }
                                className={`flex items-center gap-1 hover:text-red-600 ${
                                  discussion.isLiked ? "text-red-600" : ""
                                }`}
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    discussion.isLiked ? "fill-current" : ""
                                  }`}
                                />
                                <span>{discussion.likeCount} likes</span>
                              </button>

                              {/* <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                              </div> */}
                              {discussion.authorId === user?.id &&
                                !discussion.isCompleted &&
                                selectedCategory == "My Discussions" && (
                                  <button
                                    onClick={() =>
                                      handleCloseDiscussion(discussion.id)
                                    }
                                    className="ml-4 px-2 py-1 bg-orange-500 text-white rounded hover:bg-red-600 text-sm"
                                  >
                                    Close Discussion
                                  </button>
                                )}
                              {discussion.authorId === user?.id &&
                                discussion.isCompleted && (
                                  <span className="ml-4 px-2 py-1 bg-red-500 text-white rounded text-sm">
                                    Closed
                                  </span>
                                )}
                            </div>
                          </div>
                          <Badge
                            className={`${getCategoryColor(
                              discussion.category
                            )} ml-4`}
                          >
                            {discussion.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Load More Button */}
            {discussions.length > 0 && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent px-8"
                >
                  Load More Discussions
                </Button>
              </div>
            )}

            {/* Ad Banner */}
            <div className="mt-12">
              <div className="container mx-auto px-8 py-2 w-5/6">
                <div className="relative">
                  {ad ? (
                    <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                      <div className="relative p-8 text-center">
                        <Image
                          src={ad.bannerImageUrl}
                          alt={ad.title}
                          width={400}
                          height={500}
                          className="mx-auto rounded-xl shadow-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="mx-auto relative"
                      style={{ width: 900, height: 300 }}
                    >
                      <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 w-full h-full">
                        <div className="relative p-8 w-full h-full">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                          <div className="text-center relative z-10 flex flex-col justify-center items-center h-full">
                            <div className="relative border-2 border-dashed border-amber-400 rounded-lg p-8 bg-gradient-to-br from-amber-50 to-yellow-100">
                              <h3 className="text-xl md:text-3xl font-bold text-amber-800 mb-4">
                                Book Your Ad (5) <br />
                                <p>
                                  Please select image size of (900x300 pixels)
                                </p>
                              </h3>
                              <div className="space-y-4 relative">
                                <div className="absolute top-4 left-4">
                                  <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
                                </div>
                                <div className="absolute top-4 right-4">
                                  <Star className="h-8 w-8 text-amber-500 animate-pulse" />
                                </div>
                                <p className="text-sm text-amber-600 mt-2">
                                  Go to your dashboard to create and manage ads.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
                          <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Discussion Replies Modal */}
      {openDiscussionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-700">
                Discussion Replies
              </h3>
              <button
                onClick={closeRepliesModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Loading Spinner */}
            {repliesLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading replies...</p>
              </div>
            ) : (
              <>
                {/* Replies List */}
                <div className="space-y-4 mb-2">
                  {discussionReplies.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No replies yet
                    </p>
                  ) : (
                    <>
                      {(showAllReplies
                        ? discussionReplies
                        : discussionReplies.slice(0, 3)
                      ).map((reply, idx) => (
                        <div
                          key={reply.id}
                          className={`p-3 rounded-md border ${
                            idx === 0
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-red-600">
                              {reply.userName || reply.authorName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(reply.createdAt)
                                .toLocaleString("en-GB")
                                .replaceAll("/", "-")}
                            </span>
                          </div>
                          <p className="text-gray-700">{reply.content}</p>
                        </div>
                      ))}

                      {/* Show info & toggle button if more than 3 replies */}
                      {discussionReplies.length > 3 && (
                        <div className="text-center mt-2">
                          {!showAllReplies ? (
                            <>
                              <p className="text-sm text-gray-500">
                                Showing latest 3 replies of{" "}
                                {discussionReplies.length} total.
                              </p>
                              <button
                                onClick={() => setShowAllReplies(true)}
                                className="text-sm text-blue-600 hover:underline mt-1"
                              >
                                Show all
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setShowAllReplies(false)}
                              className="text-sm text-blue-600 hover:underline mt-1"
                            >
                              show less
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Add Reply Form */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Add a Reply
                  </h4>
                  <textarea
                    rows={3}
                    placeholder="Write your reply..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={newReplyContent}
                    onChange={(e) => setNewReplyContent(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={handlePostReply}
                      disabled={!newReplyContent.trim()}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                    >
                      Post Reply
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {isModalOpen && selectedDiscussion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-yellow-50 border-yellow-200 border-4  rounded-lg w-11/12 max-w-2xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedDiscussion.title}
            </h2>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Author:</span>{" "}
              {selectedDiscussion.authorName}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Location:</span>{" "}
              {selectedDiscussion.location}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(selectedDiscussion.createdAt).toLocaleString("en-GB")}
            </p>

            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Content:</span>{" "}
              {selectedDiscussion.content}
            </p>

            <div className="flex gap-4 text-sm text-gray-600">
              <span>{selectedDiscussion.replyCount} replies</span>
              <span>{selectedDiscussion.likeCount} likes</span>
              <span
                className={`px-2 py-1 rounded ${
                  selectedDiscussion.isCompleted
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {selectedDiscussion.isCompleted ? "Closed" : "Active"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
