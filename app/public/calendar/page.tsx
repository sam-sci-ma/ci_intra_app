"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import EventsCalendarTab from "@/app/components/staff/EventsCalendarTab";
import { LogIn } from "lucide-react";
import Link from "next/link";

/* =====================
   Types
===================== */

type PublicEvent = {
  id?: number;
  title: string;
  date: string;
  time?: string;
  category?: string;
  location?: string;
  organizer?: string;
  startDate?: string;
  endDate?: string;
  eventType?: string;
  created_by?: string;
  owner_name?: string;
};

export default function PublicCalendarPage() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          staff_profiles (
            full_name
          )
        `)
        .order("date", { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedEvents: PublicEvent[] = data.map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
          time: e.time,
          category: e.category,
          location: e.location,
          organizer: e.organizer,
          startDate: e.date,
          endDate: e.date,
          eventType: e.category,
          created_by: e.created_by,
          owner_name: e.staff_profiles?.full_name || (e.created_by ? "Unknown" : "System Admin")
        }));

        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SCI Intranet</h1>
            <p className="text-sm text-gray-600">Public Event Calendar</p>
          </div>
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium"
          >
            <LogIn className="w-4 h-4" />
            Admin Login
          </Link>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading calendar...</p>
            </div>
          </div>
        ) : (
          <EventsCalendarTab
            events={events}
            onAdd={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            showActions={false}
          />
        )}
      </main>
    </div>
  );
}
