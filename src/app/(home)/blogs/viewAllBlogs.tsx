"use client";

import { useEffect, useState } from "react";
import Loader from "@/src/components/ui/loader"; // ✅ Loader import
interface Author {
  id: string;
  name: string;
  email: string;
}

interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author: Author;
}

export default function ViewAllBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true); // API start
        const res = await fetch("/api/blogs/get-all-blogs"); 
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false); // API end
      }
    };
    fetchBlogs();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  if (loading) {
    // ✅ Loader show
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-800">All Blogs</h1>

      {/* Blog list */}
      <div className="grid gap-6 md:grid-cols-2">
        {blogs.slice(0, visibleCount).map((blog) => (
          <div
            key={blog.id}
            onClick={() => setSelectedBlog(blog)}
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2 capitalize">
              {blog.title}
            </h2>
            <p className="text-gray-600 line-clamp-3">
              {blog.content || blog.summary}
            </p>
            <div className="mt-3 text-sm text-gray-500">
              By {blog.author.name} •{" "}
              {new Date(blog.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < blogs.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
          <div className="bg-white max-w-3xl w-full rounded-xl shadow-lg relative flex flex-col max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10"
            >
              ✕
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 pt-10">
              {selectedBlog.imageUrl && (
                <img
                  src={selectedBlog.imageUrl}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-2xl font-bold mb-2 capitalize">{selectedBlog.title}</h2>
              <div className="text-sm text-gray-500 mb-4">
                By {selectedBlog.author.name} •{" "}
                {new Date(selectedBlog.createdAt).toLocaleDateString()}
              </div>
              <p className="text-gray-700 whitespace-pre-line">
                {selectedBlog.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
