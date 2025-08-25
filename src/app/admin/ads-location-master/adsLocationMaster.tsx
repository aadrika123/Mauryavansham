"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
// import { toast } from "@/src/components/ui/use-toast";
import { useToast } from "@/src/hooks/use-toast";

interface Placement {
  id: number;
  pageName: string;
  sectionName: string;
  description: string | null;
}

export default function AdsLocationMasterPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form States
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Placement | null>(null);
  const [form, setForm] = useState({
    id: "",
    pageName: "",
    sectionName: "",
    description: "",
  });

  useEffect(() => {
    fetchPlacements();
  }, []);

  async function fetchPlacements() {
    setLoading(true);
    try {
      const res = await fetch("/api/ad-location-master");
      const data = await res.json();
      setPlacements(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load placements" });
    }
    setLoading(false);
  }

  function openForm(data?: Placement) {
    if (data) {
      setEditData(data);
      setForm({
        id: data.id.toString(),
        pageName: data.pageName,
        sectionName: data.sectionName,
        description: data.description ?? "",
      });
    } else {
      setEditData(null);
      setForm({ id: "", pageName: "", sectionName: "", description: "" });
    }
    setOpen(true);
  }

  async function handleSave() {
    try {
      const payload = {
        id: Number(form.id),
        pageName: form.pageName,
        sectionName: form.sectionName,
        description: form.description,
      };

      const res = await fetch("/api/ad-location-master", {
        method: editData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Failed to save placement",
        });
        return;
      }

      toast({ title: "Success", description: "Placement saved" });
      setOpen(false);
      fetchPlacements();
    } catch (err) {
      toast({ title: "Error", description: "Failed to save placement" });
    }
  }

  async function handleDeactivate(id: number) {
    if (!confirm("Are you sure you want to deactivate this placement?")) return;
    try {
      const res = await fetch(`/api/ad-location-master?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Deactivated", description: "Placement deactivated" });
      fetchPlacements();
    } catch (err) {
      toast({ title: "Error", description: "Failed to deactivate" });
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Ads Location Master</CardTitle>
          <Button onClick={() => openForm()}>+ Add Location</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Ads Serial No.</th>
                  <th className="border p-2">Page Name</th>
                  <th className="border p-2">Section Name</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((p) => (
                  <tr key={p.id}>
                    <td className="border p-2 text-center">{p.id}</td>
                    <td className="border p-2">{p.pageName}</td>
                    <td className="border p-2">{p.sectionName}</td>
                    <td className="border p-2">{p.description}</td>
                    <td className="border p-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openForm(p)}
                      >
                        Edit
                      </Button>
                      {/* <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeactivate(p.id)}
                      >
                        Deactivate
                      </Button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editData ? "Edit Placement" : "Add Placement"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Ads Serial No.</Label>
              <Input
                type="number"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
              />
            </div>
            <div>
              <Label>Page Name</Label>
              <Input
                value={form.pageName}
                onChange={(e) => setForm({ ...form, pageName: e.target.value })}
              />
            </div>
            <div>
              <Label>Section Name</Label>
              <Input
                value={form.sectionName}
                onChange={(e) =>
                  setForm({ ...form, sectionName: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <Button onClick={handleSave}>{editData ? "Update" : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
