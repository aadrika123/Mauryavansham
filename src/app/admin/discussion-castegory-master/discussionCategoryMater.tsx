"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Plus, Edit, Trash2, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
  status: "active" | "inactive";
  discussionCount?: number;
}

export default function CategoryMaster() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/discussions/category");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        alert(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/discussions/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setCategories([data.data, ...categories]);
        setNewCategoryName("");
      } else {
        alert(data.message || "Failed to add category");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/discussions/category/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setCategories(categories.filter((cat) => cat.id !== id));
      } else {
        alert(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/discussions/category/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });
      const data = await res.json();

      if (data.success) {
        setCategories(categories.map((cat) => (cat.id === editingCategory.id ? data.data : cat)));
        setModalOpen(false);
        setEditingCategory(null);
      } else {
        alert(data.message || "Failed to update category");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-b from-yellow-50 to-orange-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">
          Category Master
        </h1>

        {/* Add Form */}
        <Card className="mb-8 bg-yellow-50 border-yellow-200 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Add New Category</h2>
            <div className="flex gap-3 flex-wrap">
              <Input
                placeholder="Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button
                onClick={handleAddCategory}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? "Adding..." : <><Plus className="h-4 w-4" /> Add</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
          <CardContent className="p-6">
            {loading && (
              <div className="text-center py-4 text-red-600 font-semibold">Loading...</div>
            )}
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="bg-orange-100 text-red-700">
                  <th className="py-2 px-4 rounded-tl-lg">#</th>
                  <th className="py-2 px-4">Category Name</th>
                  <th className="py-2 px-4">Status</th>
                  {/* <th className="py-2 px-4">Discussions</th> */}
                  <th className="py-2 px-4 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className="even:bg-yellow-50 odd:bg-yellow-100 hover:bg-yellow-200 transition-colors"
                  >
                    <td className="py-2 px-4">{idx + 1}</td>
                    <td className="py-2 px-4 font-medium">{cat.name}</td>
                    <td className="py-2 px-4">
                      <Badge
                        className={`${
                          cat.status === "active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {cat.status}
                      </Badge>
                    </td>
                    {/* <td className="py-2 px-4">{cat.discussionCount || 0}</td> */}
                    <td className="py-2 px-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => openEditModal(cat)}
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </Button>
                      {/* <Button
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-1"
                        onClick={() => handleDeleteCategory(cat.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button> */}
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No categories found. Add a new category above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      {modalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-red-600">Edit Category</h2>
            <Input
              value={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, name: e.target.value })
              }
              placeholder="Category Name"
              className="mb-4"
              disabled={loading}
            />
            <div className="flex items-center gap-4 mb-4">
              <span>Status:</span>
              <Button
                size="sm"
                variant={editingCategory.status === "active" ? "default" : "outline"}
                onClick={() =>
                  setEditingCategory({
                    ...editingCategory,
                    status: "active",
                  })
                }
                disabled={loading}
              >
                Active
              </Button>
              <Button
                size="sm"
                variant={editingCategory.status === "inactive" ? "default" : "outline"}
                onClick={() =>
                  setEditingCategory({
                    ...editingCategory,
                    status: "inactive",
                  })
                }
                disabled={loading}
              >
                Inactive
              </Button>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setModalOpen(false)}
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateCategory}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
