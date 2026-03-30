import { useState } from "react";
import { CalendarDays, Download, Star, Flame, Sun, Sparkles } from "lucide-react";
import "./Holidays.css";

const holidays = [
  { month: "Jan", day: "26", dayName: "Sunday",    name: "Republic Day",            type: "National",  icon: <Star size={16} /> },
  { month: "Mar", day: "4", dayName: "Wednesday",    name: "Holi",                    type: "National",  icon: <Sparkles size={16} /> },
  { month: "Mar", day: "21", dayName: "Saturday",    name: "Id-ul-Fitr",              type: "National",  icon: <Star size={16} /> },
  { month: "Mar", day: "26", dayName: "Thursday",    name: "Ram Navami",              type: "Regional",  icon: <Sun size={16} /> },
  { month: "Mar", day: "31", dayName: "Tuesday",  name: "Mahavir Jayanti",         type: "National",  icon: <Star size={16} /> },
  { month: "Apr", day: "03", dayName: "Friday",    name: "Good Friday",             type: "National",  icon: <Star size={16} /> },
{ month: "May", day: "1", dayName: "Friday",    name: "Buddha Purnima",          type: "National",  icon: <Sparkles size={16} /> },
  { month: "May", day: "27", dayName: "Wednesday",  name: "Id-ul-Zuha (Bakrid)",     type: "National",  icon: <Star size={16} /> },
  { month: "Jun", day: "26", dayName: "Friday",  name: "Muharram",     type: "National",  icon: <Star size={16} /> },
  { month: "Aug", day: "15", dayName: "Saturday",    name: "Independence Day",        type: "National",  icon: <Star size={16} /> },
  { month: "Aug", day: "26", dayName: "Wednesday",  name: "Milad-ul-nabi",               type: "Regional",  icon: <Star size={16} /> },
  { month: "Sep", day: "04", dayName: "Friday", name: "Janmashtami",             type: "Regional",  icon: <Sparkles size={16} /> },
  { month: "Oct", day: "02", dayName: "Friday",  name: "Gandhi Jayanti", type: "National", icon: <Flame size={16} /> },
  { month: "Oct", day: "20", dayName: "Tuesday",    name: "Dussehra",           type: "National",  icon: <Star size={16} /> },
  { month: "Nov", day: "08", dayName: "Sunday",    name: "Diwali",                  type: "National",  icon: <Sparkles size={16} /> },
  { month: "Nov", day: "24", dayName: "Tuesday", name: "Guru Nanak Jayanti",      type: "National",  icon: <Star size={16} /> },
  { month: "Dec", day: "25", dayName: "Friday",  name: "Christmas",               type: "National",  icon: <Star size={16} /> },
];

const academicDates = [
  { range: "Jan 7",           label: "Even Semester(2026) Begins" },
  { range: "Jan 16",          label: "Last date of registration with late fee" },
  { range: "Feb 6",          label: "Notification of list of registered students" },
  { range: "Feb 20",          label: "Notification of shortage of attendance by Deptts." },

  { range: "Feb 23 – Feb 28",  label: "Mid-Semester Exams (Even)" },
  { range: "Mar 27 – Mar 28",  label: "LALKAAR(Annual Sports Meet)" },
  { range: "Apr 10 – Apr 12",  label: "NIMBUS(Annual Techfest)" },
  { range: "Apr 27 – May 12",  label: "End-Semester Exams (Even)" },
   { range: "May 15",  label: "End Semester Evaluation of UG Projects" },
  { range: "May 21 – Jul 19",  label: "Summer Vacations" },
];

const badgeClass = {
  National: "badge badge-national",
  Regional: "badge badge-regional",
  Academic: "badge badge-academic",
};

export default function Holidays() {
  const [activeTab, setActiveTab] = useState("holidays");

  return (
    <div className="holidays-page">

      {/* Hero */}
      <div className="holidays-hero">
        <div className="holidays-hero-inner">
          <div className="holidays-hero-icon">
            <CalendarDays size={32} />
          </div>
          <div>
            <h1>Holidays &amp; Academic Calendar</h1>
            <p>NITH Academic Year 2025–26</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="holidays-content">

        {/* Tabs */}
        <div className="holidays-tabs">
          <button
            className={`tab-btn ${activeTab === "holidays" ? "active" : ""}`}
            onClick={() => setActiveTab("holidays")}
          >
            <CalendarDays size={15} /> Holidays
          </button>
          <button
            className={`tab-btn ${activeTab === "academic" ? "active" : ""}`}
            onClick={() => setActiveTab("academic")}
          >
            <CalendarDays size={15} /> Academic Calendar
          </button>
        </div>

        {/* Holidays List */}
        {activeTab === "holidays" && (
          <div className="holiday-list">
            {holidays.map((h, i) => (
              <div key={i} className="holiday-card">
                <div className="holiday-date-badge">
                  <span className="h-month">{h.month}</span>
                  <span className="h-day">{h.day}</span>
                </div>
                <div className="holiday-info">
                  <span className="holiday-icon">{h.icon}</span>
                  <div>
                    <p className="holiday-name">{h.name}</p>
                    <p className="holiday-day-label">{h.dayName}</p>
                  </div>
                </div>
                <span className={badgeClass[h.type]}>{h.type}</span>
              </div>
            ))}
          </div>
        )}

        {/* Academic Calendar */}
        {activeTab === "academic" && (
          <>
            <div className="academic-table-card">
              <div className="academic-table-header">
                <CalendarDays size={20} />
                <h2>Key Academic Dates</h2>
              </div>
              {academicDates.map((item, i) => (
                <div key={i} className="academic-row">
                  <span className="academic-range">{item.range}</span>
                  <span className="academic-label">{item.label}</span>
                  <span className={badgeClass["Academic"]}>Academic</span>
                </div>
              ))}
            </div>

            {/* PDF Download */}
            <div className="pdf-card">
              <div className="pdf-icon-wrap">
                <Download size={32} />
              </div>
              <h3>Academic Calendar PDF</h3>
              <p>
                Download the complete NITH Academic Calendar 2025–26 with all
                important dates, exam schedules, and holiday lists.
              </p>
              <a
                href="/academic-calendar-2025-26.pdf"
                download
                className="pdf-download-btn"
              >
                <Download size={18} />
                Download Academic Calendar
              </a>
              <span className="pdf-note">PDF • NITH Official</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
