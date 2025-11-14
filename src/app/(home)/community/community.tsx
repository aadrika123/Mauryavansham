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
  Reply,
  ThumbsUp,
  Send,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loader from "@/src/components/ui/loader";

interface Ad {
  id: number;
  title: string;
  bannerImageUrl: string;
  link?: string;
  views: number;
  placementId: number;
  adUrl: string;
}

interface Reply {
  id: number;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  parentId?: number;
  replies: Reply[];
  userName: string;
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
  userName: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  user?: User;
}

const ForumAdSlider: React.FC<{ ads: Ad[] }> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [ads.length]);

  useEffect(() => {
    if (ads[currentIndex]) {
      fetch(`/api/ad-placements/${ads[currentIndex].id}`, { method: "POST" });
    }
  }, [currentIndex, ads]);

  if (ads.length === 0) {
    return (
      <div className="relative w-full h-44 sm:h-60 md:h-72 lg:h-[350px]">
        <div className="bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-50 border-4 border-dashed border-amber-300 rounded-2xl shadow-lg w-full h-full flex items-center justify-center text-center p-6 relative overflow-hidden">
          <Sparkles className="absolute top-6 left-6 h-7 w-7 text-amber-500 animate-pulse" />
          <Star className="absolute top-6 right-6 h-7 w-7 text-amber-500 animate-bounce" />
          <Star className="absolute bottom-8 left-10 h-6 w-6 text-amber-400 animate-ping" />

          <div className="max-w-lg">
            <h3 className="text-2xl md:text-3xl font-extrabold text-amber-800 mb-2 drop-shadow-sm">
              Book Your Ad (5)
            </h3>
            <p className="text-sm sm:text-base text-amber-700 mb-3">
              Recommended size:{" "}
              <span className="font-semibold">1200×350 px</span>
            </p>
            <p className="text-xs sm:text-sm text-amber-600">
              Go to your dashboard to create and manage ads.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-amber-300/50">
        <div className="relative p-4 sm:p-6 text-center h-44 sm:h-60 md:h-72 lg:h-[350px]">
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              className={`absolute inset-0  transition-opacity duration-1000 ${
                index === currentIndex
                  ? "opacity-100 z-10"
                  : "opacity-0 pointer-events-none z-0"
              }`}
            >
              <a
                href={ad.adUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full h-full"
              >
                <img
                  src={ad.bannerImageUrl}
                  alt={`Ad ${index + 1}`}
                  className="mx-auto rounded-xl shadow-lg w-full h-full object-fill"
                />
              </a>
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl pointer-events-none z-20"></div>

          {ads.length > 1 && (
            <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-30">
              {currentIndex + 1} / {ads.length}
            </div>
          )}

          {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-amber-600/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md opacity-0 group-hover:opacity-100 transition duration-500 z-30">
            Sponsored Ad
          </div> */}

          {ads.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-30 opacity-0 group-hover:opacity-100 transition duration-300">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-amber-600 scale-125"
                      : "bg-amber-400/50 hover:bg-amber-400/75"
                  }`}
                  aria-label={`Go to ad ${index + 1}`}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function ReplyComponent({
  reply,
  user,
  onReply,
  onLike,
  depth = 0,
}: {
  reply: Reply;
  user?: User;
  onReply: (parentId: number, content: string) => void;
  onLike: (replyId: number) => void;
  depth?: number;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(depth < 2);

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    onReply(reply.id, replyContent);
    setReplyContent("");
    setShowReplyForm(false);
    setShowReplies(true);
  };

  const handleMentionUser = (userName: string) => {
    setReplyContent((prev) => prev + `@${userName} `);
  };

  return (
    <div
      className={`${depth > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}`}
    >
      <div className="bg-white rounded-lg p-3 mb-2 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {reply?.userName ? reply.userName.charAt(0).toUpperCase() : "?"}
            </div>
            <span className="font-semibold text-red-600 text-sm cursor-pointer hover:underline">
              {reply.authorName}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(reply.createdAt).toLocaleString("en-GB")}
          </span>
        </div>

        <div className="mb-3">
          <p className="text-gray-700 text-sm leading-relaxed">
            {reply.content}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <button
            onClick={() => onLike(reply.id)}
            className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${
              reply.isLiked ? "text-blue-600" : ""
            }`}
          >
            <ThumbsUp
              className={`h-3 w-3 ${reply.isLiked ? "fill-current" : ""}`}
            />
            <span>{reply.likeCount > 0 ? reply.likeCount : "Like"}</span>
          </button>

          {user && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 hover:text-red-600 transition-colors"
            >
              <Reply className="h-3 w-3" />
              <span>Reply</span>
            </button>
          )}

          <button
            onClick={() => handleMentionUser(reply.authorName)}
            className="hover:text-red-600 transition-colors"
          >
            @{reply.authorName}
          </button>

          {reply.replies && reply.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="hover:text-red-600 transition-colors font-medium"
            >
              {showReplies ? "Hide" : "Show"} {reply.replies.length}{" "}
              {reply.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>

        {showReplyForm && user && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="flex-1">
                <textarea
                  rows={2}
                  placeholder={`Reply to ${reply.authorName}...`}
                  className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim()}
                    className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs rounded-md hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showReplies &&
        reply.replies &&
        reply.replies.length > 0 &&
        depth < 3 && (
          <div className="space-y-2">
            {reply.replies.map((nestedReply) => (
              <ReplyComponent
                key={nestedReply.id}
                reply={nestedReply}
                user={user}
                onReply={onReply}
                onLike={onLike}
                depth={depth + 1}
              />
            ))}
          </div>
        )}

      {reply.replies && reply.replies.length > 0 && depth >= 3 && (
        <div className="ml-6 mt-2">
          <button className="text-xs text-blue-600 hover:underline">
            View {reply.replies.length} more{" "}
            {reply.replies.length === 1 ? "reply" : "replies"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CommunityForumPage({ user }: Props) {
  const Router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(!user);

  // If user is not logged in, show only the login requirement screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Card className="bg-white shadow-2xl border-4 border-yellow-300">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Lock className="h-20 w-20 text-red-600 mx-auto mb-4" />
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              </div>

              <h2 className="text-3xl font-bold text-red-700 mb-4">
                Community Forum
              </h2>

              <p className="text-gray-600 mb-6 text-lg">
                Please login to access our supportive Maurya community forum and
                participate in discussions.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => Router.push("/sign-in")}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-6 text-lg"
                >
                  <User className="h-5 w-5 mr-2" />
                  Login to Continue
                </Button>

                <Button
                  onClick={() => Router.push("/")}
                  variant="outline"
                  className="w-full py-6 text-lg border-2 border-gray-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Home
                </Button>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                <p className="text-sm text-gray-600">
                  <strong className="text-red-600">Why login?</strong>
                  <br />
                  Access exclusive discussions, connect with community members,
                  and share your experiences.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Rest of the component code for logged-in users...
  const [selectedCategory, setSelectedCategory] = useState("All Discussions");
  const [searchQuery, setSearchQuery] = useState("");
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [allDiscussions, setAllDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categories, setCategories] = useState([] as any[]);
  const [apiLoading, setApiLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(4);
  const ITEMS_PER_LOAD = 2;
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "Business Help",
    location: "",
  });
  const [adPlacements, setAdPlacements] = useState<Ad[]>([]);
  const [openDiscussionId, setOpenDiscussionId] = useState<number | null>(null);
  const [discussionReplies, setDiscussionReplies] = useState<Reply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<Discussion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeReason, setCloseReason] = useState("");
  const [discussionToClose, setDiscussionToClose] = useState<number | null>(
    null
  );

  const forumAds = adPlacements.filter((ad) => ad.placementId === 5);

  const openModal = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDiscussion(null);
    setIsModalOpen(false);
  };

  const closeRepliesModal = () => {
    setOpenDiscussionId(null);
    setDiscussionReplies([]);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_LOAD);
  };

  useEffect(() => {
    fetch("/api/ad-placements/approved")
      .then((res) => res.json())
      .then((data: Ad[]) => {
        setAdPlacements(data);
      })
      .catch(() => console.error("Failed to load ad placements"));
  }, []);

  useEffect(() => {
    loadDiscussions();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    setDisplayCount(4);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/discussions/category");
        const data = await res.json();
        if (data.success) {
          const allCategories = [
            { id: 0, name: "All Discussions", count: 0 },
            { id: -1, name: "My Discussions", count: 0 },
            ...data.data.map((cat: any) => ({ ...cat, count: 0 })),
          ];
          setCategories(allCategories);
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
      const allDiscussionsData: Discussion[] = data.data || [];

      const notCompleted = allDiscussionsData.filter((d) => !d.isCompleted);
      const myDiscussions = allDiscussionsData.filter(
        (d) => String(d.authorId) === String(user?.id)
      );

      let filteredDiscussions =
        selectedCategory === "All Discussions"
          ? notCompleted
          : selectedCategory === "My Discussions"
          ? myDiscussions
          : notCompleted.filter((d) => d.category === selectedCategory);

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filteredDiscussions = filteredDiscussions.filter(
          (d) =>
            d.title?.toLowerCase().includes(q) ||
            d.content?.toLowerCase().includes(q) ||
            d.authorName?.toLowerCase().includes(q)
        );
      }

      setAllDiscussions(filteredDiscussions);
      setDiscussions(filteredDiscussions.slice(0, displayCount));

      const counts: Record<string, number> = {
        "All Discussions": notCompleted.length,
        "My Discussions": myDiscussions.length,
      };

      notCompleted.forEach((d) => {
        if (d.category) counts[d.category] = (counts[d.category] || 0) + 1;
      });

      const updatedCategories = (fetchedCategories || categories).map(
        (cat) => ({
          ...cat,
          count: counts[cat.name] || 0,
        })
      );

      setCategories(updatedCategories);
    } catch (error) {
      console.error("Failed to load discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDiscussions(allDiscussions.slice(0, displayCount));
  }, [displayCount, allDiscussions]);

  const handleStartDiscussion = () => {
    setShowCreateModal(true);
  };

  const handleCreateDiscussion = async () => {
    if (!user || !newDiscussion.title || !newDiscussion.content) return;
    setApiLoading(true);

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
        setDisplayCount(4);
        loadDiscussions();
      }
    } catch (error) {
      console.error("Failed to create discussion:", error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleLikeDiscussion = async (discussionId: number) => {
    try {
      const response = await fetch(`/api/discussions/${discussionId}/likes`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to like");
      await loadDiscussions();
    } catch (error) {
      console.error("Failed to like discussion:", error);
    }
  };

  const fetchReplies = async (discussionId: number) => {
    setRepliesLoading(true);
    try {
      const res = await fetch(`/api/discussions/${discussionId}/replies`);
      const data = await res.json();

      const replies = data.data || [];
      const repliesMap = new Map();
      const rootReplies: Reply[] = [];

      replies.forEach((reply: any) => {
        repliesMap.set(reply.id, {
          ...reply,
          replies: [],
        });
      });

      replies.forEach((reply: any) => {
        if (reply.parentId) {
          const parent = repliesMap.get(reply.parentId);
          if (parent) {
            parent.replies.push(repliesMap.get(reply.id));
          }
        } else {
          rootReplies.push(repliesMap.get(reply.id));
        }
      });

      setDiscussionReplies(rootReplies);
    } catch (error) {
      console.error("Failed to load replies:", error);
    } finally {
      setRepliesLoading(false);
    }
  };

  const handleViewReplies = (discussionId: number) => {
    setOpenDiscussionId(discussionId);
    fetchReplies(discussionId);
  };

  const handlePostReply = async (parentId?: number, content?: string) => {
    const replyContent = content || newReplyContent;
    if (!replyContent.trim() || !openDiscussionId) return;

    try {
      const res = await fetch(`/api/discussions/${openDiscussionId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discussionId: openDiscussionId,
          content: replyContent,
          parentId: parentId || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        fetchReplies(openDiscussionId);
        if (!parentId) {
          setNewReplyContent("");
        }
      } else {
        console.error("Failed to post reply:", data.message);
      }
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
  };

  const handleLikeReply = async (replyId: number) => {
    try {
      const response = await fetch(
        `/api/discussions/replies/${replyId}/likes`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        if (openDiscussionId) {
          fetchReplies(openDiscussionId);
        }
      }
    } catch (error) {
      console.error("Failed to like reply:", error);
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

  const handleConfirmCloseDiscussion = async () => {
    if (!discussionToClose || !closeReason.trim()) return;

    try {
      const res = await fetch(`/api/discussions/${discussionToClose}/close`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason: closeReason }),
      });

      if (res.ok) {
        setShowCloseModal(false);
        setCloseReason("");
        setDiscussionToClose(null);
        loadDiscussions();
      } else {
        console.error("Failed to close discussion");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReopenDiscussion = async (discussionId: number) => {
    try {
      const res = await fetch(`/api/discussions/${discussionId}/reopen`, {
        method: "PATCH",
      });

      if (res.ok) {
        loadDiscussions();
      } else {
        console.error("Failed to reopen discussion");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {apiLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <Loader />
        </div>
      )}

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
                    .filter(
                      (cat) =>
                        cat.name !== "All Discussions" &&
                        cat.name !== "My Discussions"
                    )
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

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Community Forum</span>
        </div>
      </div>

      <div className="container mx-auto text-center">
        <Crown className="h-16 sm:h-20 w-16 sm:w-20 text-yellow-500 mx-auto" />
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg"></div>
          <h1 className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-red-700 mb-4">
            Community Forum
          </h1>
        </div>
        <p className="text-base sm:text-lg text-red-600 max-w-3xl mx-auto leading-relaxed mb-4 px-2">
          Connect, share, and help each other in our supportive Maurya community
        </p>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="order-2 lg:order-1 lg:col-span-1 space-y-6">
            <Card className="bg-yellow-50 border-yellow-200">
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

          <div className="order-1 lg:order-2 lg:col-span-3">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-red-500 w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading discussions...</p>
                </div>
              ) : discussions.length === 0 ? (
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
                    className="bg-yellow-50 border-yellow-200 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h2
                            className="text-xl font-semibold text-red-700 mb-2 hover:text-red-800 cursor-pointer"
                            onClick={() => openModal(discussion)}
                          >
                            {discussion.title}
                          </h2>
                          <p className="text-base mb-1">
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

                            {discussion.authorId === user?.id &&
                              !discussion.isCompleted &&
                              selectedCategory == "My Discussions" && (
                                <button
                                  onClick={() => {
                                    setDiscussionToClose(discussion.id);
                                    setShowCloseModal(true);
                                  }}
                                  className="ml-4 px-2 py-1 bg-orange-500 text-white rounded hover:bg-red-600 text-sm"
                                >
                                  Close Discussion
                                </button>
                              )}

                            {discussion.authorId === user?.id &&
                              discussion.isCompleted && (
                                <div className="ml-4 flex items-center gap-2">
                                  <span className="px-2 py-1 bg-red-500 text-white rounded text-sm">
                                    Closed
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleReopenDiscussion(discussion.id)
                                    }
                                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                  >
                                    Reopen
                                  </button>
                                </div>
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

            {allDiscussions.length > displayCount && (
              <div className="text-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent px-6 sm:px-8"
                >
                  Load More Discussions ({displayCount} of{" "}
                  {allDiscussions.length})
                </Button>
              </div>
            )}

            {allDiscussions.length > 0 &&
              displayCount >= allDiscussions.length &&
              allDiscussions.length > 4 && (
                <div className="text-center mt-4">
                  <p className="text-gray-600 text-sm">
                    Showing all {allDiscussions.length} discussions
                  </p>
                </div>
              )}
            <div className="mt-10 sm:mt-12">
              <div className="w-full max-w-6xl mx-auto px-2 sm:px-6">
                <ForumAdSlider ads={forumAds} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {openDiscussionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-red-700">
                  Discussion Replies
                </h3>
                <button
                  onClick={closeRepliesModal}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {repliesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading replies...</p>
                </div>
              ) : (
                <>
                  {user && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <textarea
                            rows={3}
                            placeholder="Write a reply..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                            value={newReplyContent}
                            onChange={(e) => setNewReplyContent(e.target.value)}
                          />
                          <div className="flex justify-end mt-2">
                            <Button
                              onClick={() => handlePostReply()}
                              disabled={!newReplyContent.trim()}
                              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Post Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {discussionReplies.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No replies yet. Be the first to reply!
                        </p>
                      </div>
                    ) : (
                      discussionReplies.map((reply) => (
                        <ReplyComponent
                          key={reply.id}
                          reply={reply}
                          user={user}
                          onReply={handlePostReply}
                          onLike={handleLikeReply}
                          depth={0}
                        />
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedDiscussion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-yellow-50 border-yellow-200 border-4 rounded-lg w-11/12 max-w-2xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
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

      {showCloseModal && discussionToClose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700">
                Close Discussion
              </h3>
              <button
                onClick={() => {
                  setShowCloseModal(false);
                  setCloseReason("");
                  setDiscussionToClose(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-3">
              Please provide a reason for closing this discussion.
            </p>

            <textarea
              value={closeReason}
              onChange={(e) => setCloseReason(e.target.value)}
              rows={4}
              placeholder="Enter reason for closing..."
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCloseModal(false);
                  setCloseReason("");
                  setDiscussionToClose(null);
                }}
              >
                Cancel
              </Button>

              <Button
                disabled={!closeReason.trim()}
                onClick={() => handleConfirmCloseDiscussion()}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                Confirm Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
