"use client";

import React, { useState } from "react";
import { db, Booking } from "@/db";

interface BookingsViewProps {
  role?: "admin" | "team" | "client";
  activeMember?: string;
  activeClientName?: string;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  role = "admin",
  activeMember = "Kai (Brand Lead)",
  activeClientName = "Tidewater Coffee",
}) => {
  const [, setRefreshKey] = useState(0);
  const allBookings = db.getBookings();

  const bookings = allBookings.filter((b) => {
    if (role === "admin") return true;
    if (role === "team") {
      const memberFirstName = activeMember.split(" ")[0].toLowerCase();
      return b.host.toLowerCase().includes(memberFirstName);
    }
    if (role === "client") {
      return (
        b.company.toLowerCase().includes(activeClientName.toLowerCase()) ||
        b.clientName.toLowerCase().includes(activeClientName.toLowerCase())
      );
    }
    return true;
  });

  const [selectedDate, setSelectedDate] = useState<string>("2026-09-24");
  const [calendarView, setCalendarView] = useState<"month" | "week" | "agenda">("month");
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(8); // September (0-indexed)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Form State for new booking
  const [formClient, setFormClient] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formType, setFormType] = useState("Discovery Call (30 min)");
  const [formDate, setFormDate] = useState("2026-09-25");
  const [formTime, setFormTime] = useState("10:00 AM - 10:30 AM");
  const [formHost, setFormHost] = useState("Paks (Studio Director)");
  const [formNotes, setFormNotes] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentMonthIndex(8);
    setCurrentYear(2026);
    setSelectedDate("2026-09-23");
  };

  const copyBookingLink = (url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClient || !formEmail) return;

    const randomMeetingCode = Math.floor(1000 + Math.random() * 9000);
    const newBooking = db.addBooking({
      clientName: formClient,
      company: formCompany || formClient,
      email: formEmail,
      bookingType: formType,
      date: formDate,
      time: formTime,
      host: formHost,
      meetingUrl: `https://meet.google.com/tvl-disc-${randomMeetingCode}`,
      status: "Confirmed",
      notes: formNotes || "Auto-scheduled via Virtus Cal.com scheduler.",
    });

    setRefreshKey((k) => k + 1);
    setSelectedDate(formDate);
    setIsScheduleModalOpen(false);
    // Reset form
    setFormClient("");
    setFormCompany("");
    setFormEmail("");
    setFormNotes("");
  };

  const handleStatusChange = (bookingId: string, status: Booking["status"]) => {
    db.updateBookingStatus(bookingId, status);
    setRefreshKey((k) => k + 1);
  };

  // Calendar Math: Generate grid days for the displayed month
  // September 2026 starts on Tuesday (day 2) and has 30 days
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = Sunday

  const calendarDays: { dayNumber: number; dateString: string; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  const prevMonthDays = new Date(currentYear, currentMonthIndex, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = currentMonthIndex === 0 ? 12 : currentMonthIndex;
    const y = currentMonthIndex === 0 ? currentYear - 1 : currentYear;
    const dateString = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({ dayNumber: d, dateString, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const m = currentMonthIndex + 1;
    const dateString = `${currentYear}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({ dayNumber: d, dateString, isCurrentMonth: true });
  }

  // Next month leading days to complete grid (multiples of 7)
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const m = currentMonthIndex === 11 ? 1 : currentMonthIndex + 2;
    const y = currentMonthIndex === 11 ? currentYear + 1 : currentYear;
    const dateString = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({ dayNumber: d, dateString, isCurrentMonth: false });
  }

  const selectedDateBookings = bookings.filter((b) => b.date === selectedDate);

  const calLinks = [
    {
      title: "15-Min Quick Alignment",
      slug: "cal.com/thevirtuslabs/quick-sync",
      duration: "15m",
      type: "Phone / Google Meet",
      badge: "Free Discovery",
    },
    {
      title: "30-Min Architecture & Scope",
      slug: "cal.com/thevirtuslabs/discovery",
      duration: "30m",
      type: "Google Meet",
      badge: "Most Popular",
    },
    {
      title: "45-Min Brief & Quotation Walkthrough",
      slug: "cal.com/thevirtuslabs/quote-review",
      duration: "45m",
      type: "Google Meet + Screen",
      badge: "Active Leads",
    },
    {
      title: "60-Min Sprint Kickoff (Clients)",
      slug: "cal.com/thevirtuslabs/kickoff",
      duration: "60m",
      type: "Google Meet Video",
      badge: "Client Onboarding",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header and Scheduling CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
              Operations OS • Calendar & Scheduling Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F1B2A] mt-1 font-mono uppercase">
            Bookings & Calendar
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Cal.com/FullCalendar compatible scheduling engine, live Google Meet sync, and agency availability matrix.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Switcher */}
          <div className="flex items-center rounded border border-gray-300 bg-white p-1 text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => setCalendarView("month")}
              className={`px-3 py-1 rounded transition-colors ${
                calendarView === "month" ? "bg-[#FFE600] text-black" : "text-gray-600 hover:text-black"
              }`}
            >
              Month View
            </button>
            <button
              type="button"
              onClick={() => setCalendarView("week")}
              className={`px-3 py-1 rounded transition-colors ${
                calendarView === "week" ? "bg-[#FFE600] text-black" : "text-gray-600 hover:text-black"
              }`}
            >
              Week View
            </button>
            <button
              type="button"
              onClick={() => setCalendarView("agenda")}
              className={`px-3 py-1 rounded transition-colors ${
                calendarView === "agenda" ? "bg-[#FFE600] text-black" : "text-gray-600 hover:text-black"
              }`}
            >
              Agenda
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center gap-2 border-2 border-black bg-black text-[#FFE600] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#FFE600] hover:text-black transition-colors"
          >
            <span>+ Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Shareable Cal.com Links Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-black text-[#FFE600] text-[0.65rem]">Cal.com</span>
              Shareable Scheduling Links
            </span>
            <span className="text-[0.7rem] text-gray-400 font-mono hidden sm:inline">
              (Auto-syncs with Google Calendar, Zoom & TVL Leads Pipeline)
            </span>
          </div>
          {copiedLink && (
            <span className="font-mono text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-fade-in">
              ✓ Copied to clipboard!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {calLinks.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded p-3 hover:border-black transition-colors flex flex-col justify-between bg-gray-50/50"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[0.65rem] font-mono font-bold uppercase text-gray-500">
                    {item.duration} • {item.type}
                  </span>
                  <span className="text-[0.6rem] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 leading-snug">{item.title}</h4>
                <p className="font-mono text-[0.65rem] text-gray-500 truncate mt-1">{item.slug}</p>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => copyBookingLink(`https://${item.slug}`)}
                  className="flex-1 text-center py-1 rounded bg-white border border-gray-300 font-mono text-[0.65rem] font-bold text-gray-800 hover:border-black transition-colors"
                >
                  Copy Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType(item.title);
                    setIsScheduleModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded bg-black text-[#FFE600] font-mono text-[0.65rem] font-bold hover:bg-[#FFE600] hover:text-black transition-colors"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Calendar App + Day Agenda Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: The Interactive Calendar App (7 cols on lg) */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-lg p-5 shadow-2xs">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black font-mono tracking-tight text-gray-900">
                {months[currentMonthIndex]} {currentYear}
              </h2>
              <button
                type="button"
                onClick={handleToday}
                className="px-2 py-0.5 rounded border border-gray-300 bg-gray-50 font-mono text-[0.7rem] font-bold text-gray-700 hover:bg-gray-100"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 font-mono text-sm font-bold"
                aria-label="Previous month"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 font-mono text-sm font-bold"
                aria-label="Next month"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Calendar 7-Day Matrix */}
          <div className="border border-gray-200 rounded overflow-hidden">
            {/* Weekday Labels */}
            <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200 text-center py-2 font-mono text-[0.7rem] font-bold uppercase text-gray-600">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-200 bg-white">
              {calendarDays.map((cell, idx) => {
                const dateBookings = bookings.filter((b) => b.date === cell.dateString);
                const isSelected = selectedDate === cell.dateString;
                const isToday = cell.dateString === "2026-09-23";

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(cell.dateString)}
                    className={`min-h-[82px] sm:min-h-[96px] p-1.5 flex flex-col justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-amber-50/70 ring-2 ring-[#FFE600] z-10"
                        : cell.isCurrentMonth
                        ? "hover:bg-gray-50"
                        : "bg-gray-50/50 text-gray-400"
                    }`}
                  >
                    {/* Day number & indicators */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center justify-center font-mono text-xs ${
                          isToday
                            ? "h-5 w-5 rounded-full bg-black text-[#FFE600] font-black"
                            : isSelected
                            ? "font-black text-black"
                            : cell.isCurrentMonth
                            ? "font-medium text-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {dateBookings.length > 0 && (
                        <span className="font-mono text-[0.6rem] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                          {dateBookings.length}
                        </span>
                      )}
                    </div>

                    {/* Booked Events Snippet */}
                    <div className="space-y-1 mt-1">
                      {dateBookings.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="px-1.5 py-0.5 rounded text-[0.62rem] font-mono truncate leading-tight bg-[#2E1F27] text-white border-l-2 border-[#FFE600]"
                          title={`${item.time}: ${item.clientName} (${item.bookingType})`}
                        >
                          <span className="font-bold">{item.time.split("-")[0].trim()}</span> {item.clientName.split(" ")[0]}
                        </div>
                      ))}
                      {dateBookings.length > 2 && (
                        <div className="text-[0.6rem] font-mono text-gray-500 font-semibold px-1">
                          +{dateBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Legend & Integration status */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-200 text-xs font-mono text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FFE600] border border-black"></span>
                Selected Date
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Active Bookings
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-black"></span>
                Today
              </span>
            </div>

            <div className="text-[0.7rem] text-gray-400">
              Synced with Google Meet & Cal.com webhook engine
            </div>
          </div>
        </div>

        {/* Right: Selected Date Agenda & Scheduled Calls (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-lg p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div>
                <span className="text-[0.65rem] font-mono font-bold uppercase tracking-wider text-gray-500">
                  Agenda for
                </span>
                <h3 className="font-mono font-black text-lg text-gray-900">
                  {selectedDate}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormDate(selectedDate);
                  setIsScheduleModalOpen(true);
                }}
                className="font-mono text-xs font-bold text-black bg-[#FFE600] px-2.5 py-1 rounded border border-black hover:bg-black hover:text-[#FFE600] transition-colors"
              >
                + Add
              </button>
            </div>

            {/* List of bookings for selected date */}
            {selectedDateBookings.length === 0 ? (
              <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded bg-gray-50/50">
                <span className="text-3xl">🗓</span>
                <p className="font-mono text-xs font-bold text-gray-700 mt-2">
                  No appointments scheduled
                </p>
                <p className="text-[0.7rem] text-gray-500 mt-1 max-w-xs mx-auto">
                  This slot is completely open for client discovery calls or team sprints.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormDate(selectedDate);
                    setIsScheduleModalOpen(true);
                  }}
                  className="mt-3 inline-flex items-center font-mono text-xs font-bold text-black border border-black bg-white px-3 py-1 hover:bg-[#FFE600] transition-colors"
                >
                  Book this date
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateBookings.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:border-black transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[0.65rem] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {item.status}
                        </span>
                        <h4 className="font-bold text-sm text-gray-900 mt-1.5">{item.clientName}</h4>
                        <p className="text-xs text-gray-600 font-medium">{item.company}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-black block">{item.time}</span>
                        <span className="font-mono text-[0.65rem] text-gray-500">{item.host}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-200 text-xs">
                      <p className="text-[0.72rem] text-gray-600 italic">
                        &quot;{item.notes}&quot;
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-200">
                      <a
                        href={item.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#2E1F27] text-white font-mono text-xs font-bold hover:bg-[#FFE600] hover:text-black transition-colors"
                      >
                        <span>📹 Join Meet</span>
                      </a>

                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as Booking["status"])}
                        className="font-mono text-[0.7rem] border border-gray-300 rounded px-2 py-0.5 bg-white font-semibold text-gray-700"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats at bottom of drawer */}
          <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 p-3 rounded">
            <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Monthly Capacity Overview
            </span>
            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="bg-white p-2 rounded border border-gray-200">
                <span className="text-lg font-black text-black">{bookings.length}</span>
                <span className="text-[0.65rem] text-gray-500 block">Total Calls</span>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <span className="text-lg font-black text-emerald-600">
                  {bookings.filter((b) => b.status === "Confirmed").length}
                </span>
                <span className="text-[0.65rem] text-gray-500 block">Confirmed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Upcoming Bookings Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-gray-900">
              Master Appointment Registry
            </h3>
            <p className="text-xs text-gray-500">
              All scheduled strategy calls, design sprints, and client walkthroughs.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded">
            {bookings.length} total events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 font-mono text-[0.7rem] uppercase text-gray-500 bg-gray-50">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Client & Company</th>
                <th className="py-2.5 px-3">Session Type</th>
                <th className="py-2.5 px-3">Lead Host</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Meeting Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {bookings.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono">
                    <span className="font-bold text-gray-900 block">{item.date}</span>
                    <span className="text-[0.68rem] text-gray-500">{item.time}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-gray-900 block">{item.clientName}</span>
                    <span className="text-gray-500 font-mono text-[0.7rem]">{item.company}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-medium text-gray-800">{item.bookingType}</span>
                    <span className="text-[0.65rem] text-gray-400 block truncate max-w-xs">{item.notes}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-700">{item.host}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-mono font-bold ${
                        item.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : item.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={item.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[0.7rem] font-bold text-indigo-600 hover:text-black hover:underline"
                    >
                      <span>Join Call</span>
                      <span>↗</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-lg border-2 border-black bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-[#FFE600] text-black px-2 py-0.5 rounded">
                  CAL.COM SYNC
                </span>
                <h3 className="font-mono font-black text-lg text-black uppercase">
                  Schedule New Meeting
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="font-mono text-sm font-bold text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="e.g. Arthur Pendelton"
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                    Company / Project
                  </label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Tidewater Coffee"
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Client Email *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="arthur@client.com"
                  className="w-full border border-gray-300 rounded p-2 text-xs focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                    Session Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:border-black focus:outline-none"
                  >
                    <option value="15-Min Quick Alignment">15-Min Quick Alignment</option>
                    <option value="Discovery Call (30 min)">Discovery Call (30 min)</option>
                    <option value="Strategy & Scope (45 min)">Strategy & Scope (45 min)</option>
                    <option value="Sprint Kickoff (60 min)">Sprint Kickoff (60 min)</option>
                    <option value="Sprint Demo (30 min)">Sprint Demo (30 min)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                    Host Member
                  </label>
                  <select
                    value={formHost}
                    onChange={(e) => setFormHost(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white focus:border-black focus:outline-none"
                  >
                    <option value="Paks (Studio Director)">Paks (Studio Director)</option>
                    <option value="Kai (Brand Lead)">Kai (Brand Lead)</option>
                    <option value="Ren (Lead Engineer)">Ren (Lead Engineer)</option>
                    <option value="Sora (UX Designer)">Sora (UX Designer)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                    Date (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                    Time Window
                  </label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="10:00 AM - 10:45 AM"
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Notes / Agenda
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Meeting agenda, topics to cover, or client questions..."
                  className="w-full border border-gray-300 rounded p-2 text-xs focus:border-black focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-[#FFE600] border-2 border-black font-bold uppercase tracking-wider hover:bg-[#FFE600] hover:text-black transition-colors"
                >
                  Confirm & Generate Meet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
