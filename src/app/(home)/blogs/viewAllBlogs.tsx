'use client';

import { useEffect, useState } from 'react';
import Loader from '@/src/components/ui/loader';
import { useSession } from 'next-auth/react';
import { Button } from '@/src/components/ui/button';
import { Lock, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/components/ui/toastProvider';

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Comment {
  id: string;
  text: string;
  likes: number;
  dislikes: number;
  parentId?: string | null;
  replies?: Comment[];
}

interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author: Author;
  userReaction: {
    isLiked: boolean;
    isDisliked: boolean;
  };
  likesCount: number;
  dislikesCount: number;
  comments?: Comment[];
}

export default function ViewAllBlogs() {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const Router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [commentModal, setCommentModal] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [blogComments, setBlogComments] = useState<{
    [key: string]: Comment[];
  }>({});
  const [newComment, setNewComment] = useState('');
  const [replyBoxes, setReplyBoxes] = useState<{ [key: string]: string }>({}); // commentId → reply text
  const [blogModal, setBlogModal] = useState<Blog | null>(null);

  // Blog image click handler
  const handleImageClick = (blog: Blog) => {
    setBlogModal(blog);
  };

  // 🔹 Fetch blogs and map comments
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blogs/get-all-blogs');
      const data = await res.json();
      setBlogs(data.blogs || []);

      // Map comments to frontend structure
      // Map comments to frontend structure
      const commentsMap: Record<string, Comment[]> = {};
      data.blogs.forEach((b: any) => {
        const mapComment = (c: any): Comment => ({
          id: c.id.toString(),
          text: c.comment || '',
          likes: c.isLiked ? 1 : 0,
          dislikes: c.isDisliked ? 1 : 0,
          parentId: c.parentId,
          replies: (c.replies || []).map(mapComment),
          author: {
            id: c.author?.id || '0',
            name: c.author?.name || 'Unknown', // ✅ Use author from backend
            email: c.author?.email || ''
          }
        });

        commentsMap[b.id] = (b.comments || []).filter((c: any) => c.parentId === null).map(mapComment);
      });
      setBlogComments(commentsMap);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleLoadMore = () => setVisibleCount(prev => prev + 2);

  // 👍 Like Blog
  const handleBlogLike = async (blogId: string) => {
    if (!session?.user) return setShowLoginModal(true);

    try {
      const res = await fetch(`/api/blogs/${blogId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          isLiked: true,
          isDisliked: false
        })
      });

      const data = await res.json();

      // Show toast based on API response
      addToast({
        title: data.success ? 'Success' : 'Oops!',
        description: data.message || (data.success ? 'You liked the blog!' : 'Something went wrong'),
        variant: data.success ? 'success' : 'destructive'
      });

      // Refresh blogs only if success
      if (data.success) fetchBlogs();
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Error',
        description: 'Failed to like the blog',
        variant: 'destructive'
      });
    }
  };

  // 👎 Dislike Blog
  const handleBlogDislike = async (blogId: string) => {
    if (!session?.user) return setShowLoginModal(true);

    try {
      await fetch(`/api/blogs/${blogId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          isLiked: false,
          isDisliked: true
        })
      });
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  // 💬 Add Comment / Reply
  const handleAddComment = async (blogId: string, parentId: string | null = null) => {
    if (!session?.user) return setShowLoginModal(true);

    const text = parentId ? replyBoxes[parentId]?.trim() : newComment.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/blogs/${blogId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          comment: text,
          parentId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to post comment');

      if (parentId) setReplyBoxes(prev => ({ ...prev, [parentId]: '' }));
      else setNewComment('');

      fetchBlogs();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  // 🔁 Recursive render of comments
  const renderComments = (comments: Comment[], blogId: string, level = 0): JSX.Element[] => {
    return comments.map(comment => (
      <div key={comment.id} className={`border rounded-lg p-3 mb-3 bg-gray-50 ${level > 0 ? 'ml-6' : ''}`}>
        <p className="text-gray-800 font-semibold">{comment.author.name}</p>
        <p className="text-gray-800">{comment.text}</p>

        <div className="flex gap-4 text-sm mt-2">
          {level === 0 && (
            <button
              onClick={() =>
                setReplyBoxes(prev => ({
                  ...prev,
                  [comment.id]: prev[comment.id] ? '' : ''
                }))
              }
              className="text-gray-600 hover:underline"
            >
              💬 Reply
            </button>
          )}
        </div>

        {replyBoxes[comment.id] !== undefined && (
          <div className="mt-3">
            <textarea
              value={replyBoxes[comment.id] || ''}
              onChange={e =>
                setReplyBoxes(prev => ({
                  ...prev,
                  [comment.id]: e.target.value
                }))
              }
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              rows={2}
              placeholder="Write a reply..."
            />
            <button
              onClick={() => handleAddComment(blogId, comment.id)}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Reply
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">{renderComments(comment.replies, blogId, level + 1)}</div>
        )}
      </div>
    ));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-800">All Blogs</h1>

      {/* Blog list */}
      <div className="grid gap-6 md:grid-cols-2">
        {blogs.slice(0, visibleCount).map(blog => (
          <div key={blog.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-64 object-contain rounded-lg mb-4 cursor-pointer"
                onClick={() => handleImageClick(blog)}
              />
            )}

            <h2 className="text-xl font-semibold mb-2 capitalize">{blog.title}</h2>
            <p className="text-gray-600 line-clamp-3 mb-2">{blog.summary || blog.content}</p>
            <div className="text-sm text-gray-500 mb-3">
              By {blog.author.name} • {new Date(blog.createdAt).toLocaleDateString()}
            </div>

            <div className="flex justify-between items-center mt-auto border-t pt-3 text-sm">
              <button
                onClick={() => handleBlogLike(blog.id)}
                className={`font-medium hover:underline ${
                  blog.userReaction?.isLiked ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                👍 Like ({blog.likesCount})
              </button>
              <button
                onClick={() => handleBlogDislike(blog.id)}
                className={`font-medium hover:underline ${
                  blog.userReaction?.isDisliked ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                👎 Dislike ({blog.dislikesCount})
              </button>
              <button
                onClick={() => {
                  if (!session?.user) return setShowLoginModal(true);
                  setCommentModal(blog);
                }}
                className="text-gray-600 font-medium hover:underline"
              >
                💬 Comment ({(blogComments[blog.id] || []).length})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < blogs.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount(prev => prev + 2)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Comment Modal */}
      {commentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setCommentModal(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Comments on: {commentModal.title}</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
              {(blogComments[commentModal.id] || []).length === 0 && (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              )}
              {renderComments(blogComments[commentModal.id] || [], commentModal.id)}
            </div>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-300"
              rows={3}
              placeholder="Write your comment (max 400 words)..."
            />
            <button
              onClick={() => handleAddComment(commentModal.id)}
              className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Post Comment
            </button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Login Required
              </h3>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Please login to participate in community discussions and create new topics.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => Router.push('/sign-in')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                <User className="h-4 w-4 mr-2" /> Login
              </Button>
              <Button onClick={() => setShowLoginModal(false)} variant="outline" className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Detail Modal */}
      {blogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setBlogModal(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{blogModal.title}</h2>
            {blogModal.imageUrl && (
              <img
                src={blogModal.imageUrl}
                alt={blogModal.title}
                className="w-full h-80 object-contain rounded-lg mb-4"
              />
            )}
            <p className="text-gray-600 mb-2">Content : {blogModal.content}</p>
            <p className="text-gray-600 mb-4">Summary : {blogModal.summary}</p>
            <div className="text-sm text-gray-500">
              By {blogModal.author.name} • {new Date(blogModal.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
