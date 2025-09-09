"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Event as BigCalendarEvent,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { useToast } from "@/src/components/ui/toastProvider";
import Loader from "@/src/components/ui/loader";

interface RateData {
  date: string;
  rate?: number;
}

const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const CustomToolbar = ({ label, onNavigate }: any) => (
  <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded shadow-sm">
    <div className="text-lg font-semibold">{label}</div>
    <div className="flex gap-2">
      <button
        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => onNavigate("TODAY")}
      >
        Today
      </button>
      <button
        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => onNavigate("NEXT")}
      >
        Next
      </button>
    </div>
  </div>
);

export default function AdRatePage() {
  const [rates, setRates] = useState<RateData[]>([]);
  const [events, setEvents] = useState<BigCalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRate, setCurrentRate] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  // Fetch rates from API
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/ad-rates");
        const data: RateData[] = await res.json();
        setRates(data);
        setEvents(
          data.map((d) => ({
            start: new Date(d.date),
            end: new Date(d.date),
            title: `₹${d.rate}`,
          }))
        );
        addToast({ title: "Rates fetched successfully!", variant: "success" });
      } catch {
        addToast({ title: "Failed to fetch rates", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const handleSelectSlot = (slotInfo: any) => {
    const dateStr = format(slotInfo.start, "yyyy-MM-dd");
    const existingRate = rates.find((r) => r.date === dateStr)?.rate ?? "";
    setSelectedDay(dateStr);
    setCurrentRate(existingRate);
    setModalOpen(true);
  };

  const handleSaveRate = () => {
    if (!selectedDay) return;
    const updatedRates = rates.filter((r) => r.date !== selectedDay);
    updatedRates.push({
      date: selectedDay,
      rate: currentRate === "" ? undefined : currentRate,
    });

    setRates(updatedRates);
    setEvents(
      updatedRates.map((d) => ({
        start: new Date(d.date),
        end: new Date(d.date),
        title: `₹${d.rate}`,
      }))
    );
    setModalOpen(false);
    setSelectedDay(null);
  };

  const handleSaveAll = async () => {
    if (rates.length === 0) {
      addToast({ title: "No rates to save", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/ad-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rates),
      });

      if (res.ok) {
        addToast({ title: "Rates saved successfully!", variant: "success" });
      } else {
        addToast({ title: "Failed to save rates", variant: "destructive" });
      }
    } catch {
      addToast({ title: "Error saving rates", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader height={600} />}
      <div className="p-6 space-y-4 bg-gray-50 rounded-lg shadow">
        <h1 className="text-2xl font-bold">Rate Fixation Panel</h1>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, backgroundColor: "#f9fafb" }}
          selectable
          onSelectSlot={handleSelectSlot}
          views={["month"]}
          components={{ toolbar: CustomToolbar }}
        />

        <div className="flex justify-end">
          <Button onClick={handleSaveAll}>Save All Rates</Button>
        </div>

        {/* Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Edit Rate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Date</label>
                <Input value={selectedDay || ""} disabled />
              </div>
              <div>
                <label className="block mb-1">Rate (per day)</label>
                <Input
                  type="number"
                  value={currentRate}
                  onChange={(e) => setCurrentRate(Number(e.target.value))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveRate}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
