import { useState, useMemo, useEffect } from "react";
import { Menu, X } from "lucide-react";
import countriesData from "../public/countries.json";

interface EconomicEvent {
  _id: string;
  date: string;
  time: string;
  country: string;
  event: string;
  actual?: string;
  previous?: string;
  consensus?: string;
  forecast?: string;
  impact: "low" | "medium" | "high";
  createdAt?: string;
  updatedAt?: string;
}

export default function TradingChart() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedImpact, setSelectedImpact] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(
    null
  );
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [moreEventsModal, setMoreEventsModal] = useState<{
    date: string;
    events: EconomicEvent[];
  } | null>(null);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [impactDropdownOpen, setImpactDropdownOpen] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const impactOptions = [
    { value: "high", stars: 3 },
    { value: "medium", stars: 2 },
    { value: "low", stars: 1 },
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      console.log(import.meta.env.VITE_API_URL_DEVLOPMENT);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const endDate = new Date(year, month + 1, 0);
      const endDateStr = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(endDate.getDate()).padStart(2, "0")}`;
      let url = `${import.meta.env.VITE_API_URL_DEVLOPMENT}/api/events?startDate=${startDate}&endDate=${endDateStr}`;
      if (selectedCountries.length > 0)
        url += `&country=${selectedCountries.join(",")}`;
      if (selectedImpact !== "all") url += `&impact=${selectedImpact}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.log(e);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [currentDate, selectedCountries, selectedImpact]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((event) => event.date.startsWith(dateStr));
  };
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      0
    );
    const prevMonthDays = prevMonth.getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true });
    }
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({ day, isCurrentMonth: false });
    }
    return days;
  }, [currentDate]);

  // Helper functions for event card backgrounds and patterns
  const getEventBg = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-[#FFF9D6]";
      case "medium":
        return "bg-[#FFE6F0]";
      case "low":
        return "bg-[#F6F7F9]";
      default:
        return "bg-[#F6F7F9]";
    }
  };
  const getEventPattern = (impact: string) => {
    switch (impact) {
      case "high":
        return "repeating-linear-gradient(135deg, #F7E9A6 0 2px, transparent 2px 8px)";
      case "medium":
        return "repeating-linear-gradient(135deg, #F7C6D6 0 2px, transparent 2px 8px)";
      case "low":
        return "repeating-linear-gradient(135deg, #E6F5E6 0 2px, transparent 2px 8px)";
      default:
        return "repeating-linear-gradient(135deg, #E6F5E6 0 2px, transparent 2px 8px)";
    }
  };

  return (
    <div className="bg-[#06050F] text-white min-h-screen px-4 sm:px-6 md:px-[24px]">
      {/* Header */}
      <div className="py-[36px]">
        <div className="flex items-center justify-between mx-auto max-w-8xl">
          <div className="flex items-center gap-4 sm:gap-[40px]">
            <div className="flex items-center gap-2 sm:gap-[8px]">
              <img
                src="/logo/logo/Header/Group.svg"
                alt="logo"
                width={40}
                height={40}
                className="w-[32.746px] h-[32px]"
              />
              <img
                src="/logo/text/Header/Group.svg"
                alt="logo"
                width={100}
                height={100}
                className="w-[167px]"
              />
            </div>
            <div className="flex hidden md:flex items-center gap-2 sm:gap-[16px]">
              <h1 className="text-white font-[600] text-xl sm:text-2xl">
                Economics Calendar
              </h1>
              <span className="bg-[#EDBA001F] text-[#EDBA00] px-2 sm:px-[10px] py-1 sm:py-[6px] rounded-[8px] text-[10px] sm:text-[12px] font-medium flex items-center gap-[4px]">
                EN VIVO
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M14.6667 7.99998C14.6667 4.31808 11.6819 1.33331 8.00004 1.33331C4.31814 1.33331 1.33337 4.31808 1.33337 7.99998C1.33337 11.6819 4.31814 14.6666 8.00004 14.6666C11.6819 14.6666 14.6667 11.6819 14.6667 7.99998Z"
                    fill="#EDBA00"
                  />
                  <path
                    d="M8.00004 4.16669C8.27618 4.16669 8.50004 4.39054 8.50004 4.66669V8.66669C8.50004 8.94283 8.27618 9.16669 8.00004 9.16669C7.7239 9.16669 7.50004 8.94283 7.50004 8.66669V4.66669C7.50004 4.39054 7.7239 4.16669 8.00004 4.16669Z"
                    fill="#06050F"
                  />
                  <path
                    d="M8.00004 11.3334C8.36823 11.3334 8.66671 11.0349 8.66671 10.6667C8.66671 10.2985 8.36823 10 8.00004 10C7.63185 10 7.33337 10.2985 7.33337 10.6667C7.33337 11.0349 7.63185 11.3334 8.00004 11.3334Z"
                    fill="#06050F"
                  />
                </svg>
              </span>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-10 h-10 bg-[#181825] rounded-full flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X size={20} className="text-[#B6B7C9]" />
            ) : (
              <Menu size={20} className="text-[#B6B7C9]" />
            )}
          </button>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-[40px]">
            <div className="flex items-center gap-[40px]">
              <nav className="flex items-center gap-6 font-[500] text-[14px] text-[#B6B7C9]">
                <a href="#" className="transition-colors hover:text-white">
                  Daily Dashboard
                </a>
                <a href="#" className="transition-colors hover:text-white">
                  Portfolios
                </a>
                <a href="#" className="transition-colors hover:text-white">
                  Calendars
                </a>
                <a href="#" className="transition-colors hover:text-white">
                  Academia
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-[12px]">
              {/* Message Icon */}
              <div className="w-10 h-10 bg-[#0F0E17] rounded-full flex items-center justify-center relative">
                {/* <MessageSquare size={20} className="text-[#B6B7C9]" /> */}
                <img
                  src="/icon/Chat-Line.svg"
                  alt="message"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px]"
                />
              </div>

              {/* Message Icon */}
              <div className="w-10 h-10 bg-[#0F0E17] rounded-full flex items-center justify-center relative">
                {/* <MessageSquare size={20} className="text-[#B6B7C9]" /> */}
                <img
                  src="/icon/Inbox-Unread.svg"
                  alt="message"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px]"
                />
              </div>

              {/* Message Icon */}
              <div className="w-10 h-10 bg-[#0F0E17] rounded-full flex items-center justify-center relative">
                {/* <MessageSquare size={20} className="text-[#B6B7C9]" /> */}
                <img
                  src="/icon/Bell-Bing.svg"
                  alt="message"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px]"
                />
              </div>

              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[#8ED6FB]">
                <img
                  src="/img/profile.png"
                  alt="User"
                  width={20}
                  height={20}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-[#181825] rounded-xl p-4">
            <div className="flex items-center gap-2 sm:gap-[16px]">
              <h1 className="text-white font-[600] text-xl sm:text-2xl">
                Economics Calendar
              </h1>
              <span className="bg-[#EDBA001F] text-[#EDBA00] px-2 sm:px-[10px] py-1 sm:py-[6px] rounded-[8px] text-[10px] sm:text-[12px] font-medium flex items-center gap-[4px]">
                EN VIVO
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M14.6667 7.99998C14.6667 4.31808 11.6819 1.33331 8.00004 1.33331C4.31814 1.33331 1.33337 4.31808 1.33337 7.99998C1.33337 11.6819 4.31814 14.6666 8.00004 14.6666C11.6819 14.6666 14.6667 11.6819 14.6667 7.99998Z"
                    fill="#EDBA00"
                  />
                  <path
                    d="M8.00004 4.16669C8.27618 4.16669 8.50004 4.39054 8.50004 4.66669V8.66669C8.50004 8.94283 8.27618 9.16669 8.00004 9.16669C7.7239 9.16669 7.50004 8.94283 7.50004 8.66669V4.66669C7.50004 4.39054 7.7239 4.16669 8.00004 4.16669Z"
                    fill="#06050F"
                  />
                  <path
                    d="M8.00004 11.3334C8.36823 11.3334 8.66671 11.0349 8.66671 10.6667C8.66671 10.2985 8.36823 10 8.00004 10C7.63185 10 7.33337 10.2985 7.33337 10.6667C7.33337 11.0349 7.63185 11.3334 8.00004 11.3334Z"
                    fill="#06050F"
                  />
                </svg>
              </span>
            </div>
            <nav className="flex flex-col mt-6 gap-4 font-[500] text-[14px] text-[#B6B7C9]">
              <a href="#" className="transition-colors hover:text-white">
                Daily Dashboard
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Portfolios
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Calendars
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Academia
              </a>
            </nav>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#21212C]">
              <div className="flex items-center gap-[12px]">
                {/* Message Icon */}
                <div className="w-10 h-10 bg-[#0F0E17] rounded-full flex items-center justify-center relative">
                  {/* <MessageSquare size={20} className="text-[#B6B7C9]" /> */}
                  <img
                    src="/icon/Chat-Line.svg"
                    alt="message"
                    width={20}
                    height={20}
                    className="w-[20px] h-[20px]"
                  />
                </div>

                {/* Message Icon */}
                <div className="w-10 h-10 bg-[#0F0E17] rounded-full flex items-center justify-center relative">
                  {/* <MessageSquare size={20} className="text-[#B6B7C9]" /> */}
                  <img
                    src="/icon/Inbox-Unread.svg"
                    alt="message"
                    width={20}
                    height={20}
                    className="w-[20px] h-[20px]"
                  />
                </div>

                {/* Message Icon */}
                <div className="w-10 h-10 bg-[#0F0E17] rounded-full flex items-center justify-center relative">
                  {/* <MessageSquare size={20} className="text-[#B6B7C9]" /> */}
                  <img
                    src="/icon/Bell-Bing.svg"
                    alt="message"
                    width={20}
                    height={20}
                    className="w-[20px] h-[20px]"
                  />
                </div>

                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[#8ED6FB]">
                  <img
                    src="/img/profile.png"
                    alt="User"
                    width={20}
                    height={20}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calendar Controls + Filters */}
      <div className="py-3 sm:py-4 bg-[#0F0E17]  border border-[#21212C] mt-6 sm:mt-0 sm:rounded-[20px] rounded-xl">
        <div className="flex flex-col items-center justify-between gap-8 px-4 mx-auto sm:flex-row sm:gap-0 max-w-7xl sm:px-6">
          {/* Month Selector */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start w-full gap-4 sm:w-auto sm:gap-[16px] ">
            <div className="flex  items-center  rounded-[32px] border border-[#21212C] bg-[#0F0E17] overflow-hidden">
              <button
                onClick={() => navigateMonth("prev")}
                className="py-[13px] px-[18px] text-gray-400 hover:bg-slate-800 hover:text-white"
              >
                {/* <ChevronLeft size={18} /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    opacity="0.2"
                    d="M16.2708 17.4167C16.2708 17.7044 16.0917 17.9617 15.8218 18.0615C15.552 18.1613 15.2486 18.0826 15.0613 17.8641L9.56132 11.4475C9.34064 11.19 9.34064 10.8101 9.56132 10.5526L15.0613 4.13596C15.2486 3.91752 15.552 3.83876 15.8218 3.93858C16.0917 4.0384 16.2708 4.29567 16.2708 4.58338L16.2708 17.4167Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.3641 17.9387C12.6524 17.6916 12.6858 17.2576 12.4387 16.9693L7.32217 11L12.4387 5.03077C12.6858 4.74249 12.6524 4.30847 12.3641 4.06137C12.0758 3.81426 11.6418 3.84765 11.3947 4.13594L5.89468 10.5526C5.674 10.8101 5.674 11.19 5.89468 11.4474L11.3947 17.8641C11.6418 18.1524 12.0758 18.1858 12.3641 17.9387Z"
                    fill="white"
                  />
                </svg>
              </button>
              <div className="w-px h-[24px] bg-[#21212C]" />
              <button
                onClick={() => navigateMonth("next")}
                className="py-[13px] px-[18px] text-gray-400 hover:bg-slate-800 hover:text-white"
              >
                {/* <ChevronRight size={18} /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    opacity="0.2"
                    d="M5.72919 17.4167C5.72919 17.7044 5.90833 17.9617 6.17816 18.0615C6.44799 18.1613 6.75144 18.0826 6.93868 17.8641L12.4387 11.4475C12.6594 11.19 12.6594 10.8101 12.4387 10.5526L6.93868 4.13596C6.75144 3.91752 6.44799 3.83876 6.17816 3.93858C5.90833 4.0384 5.72919 4.29567 5.72919 4.58338L5.72919 17.4167Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.63591 17.9387C9.34762 17.6916 9.31423 17.2576 9.56134 16.9693L14.6778 11L9.56134 5.03077C9.31424 4.74249 9.34762 4.30847 9.63591 4.06137C9.92419 3.81426 10.3582 3.84765 10.6053 4.13594L16.1053 10.5526C16.326 10.8101 16.326 11.19 16.1053 11.4474L10.6053 17.8641C10.3582 18.1524 9.92419 18.1858 9.63591 17.9387Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
            <button
              className="flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-white font-medium text-base sm:text-lg hover:bg-[#232336] transition relative"
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            >
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d="M7.61084 11.3707L10.6605 14.5156C10.8559 14.717 11.1442 14.717 11.3396 14.5156L17.2334 8.43762C17.6012 8.05837 17.3783 7.33334 16.8939 7.33334H11.6482L7.61084 11.3707Z"
                  fill="white"
                />
                <path
                  opacity="0.5"
                  d="M10.3518 7.33334H5.10609C4.62171 7.33334 4.39878 8.05837 4.76655 8.43762L6.97259 10.7126L10.3518 7.33334Z"
                  fill="white"
                />
              </svg>
              {monthDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-[#181825] border border-[#EDBA00] rounded-xl shadow-lg z-50 p-2 min-w-[200px]">
                  {monthNames.map((month, index) => (
                    <div
                      key={month}
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#232336] rounded-lg"
                      onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(index);
                        setCurrentDate(newDate);
                        setMonthDropdownOpen(false);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={currentDate.getMonth() === index}
                        readOnly
                        className="accent-[#EDBA00]"
                      />
                      <span className="text-white">{month}</span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between w-full gap-3 sm:gap-4 sm:w-auto sm:justify-end">
            {/* Impact Filter */}
            <div className="relative">
              <button
                className={`flex items-center gap-2 bg-[#16151F] rounded-[32px] px-4 sm:px-5 py-2 text-white font-medium text-sm sm:text-base   hover:bg-[#232336] transition outline-none ${
                  impactDropdownOpen ? "ring-2 ring-[#EDBA00]" : ""
                }`}
                onClick={() => setImpactDropdownOpen((v) => !v)}
                type="button"
              >
                <span className="text-[#EDBA00]">
                  {Array.from({
                    length:
                      impactOptions.find((i) => i.value === selectedImpact)
                        ?.stars || 0,
                  }).map((_, i) => (
                    <svg
                      key={i}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#EDBA00"
                      className="inline-block"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M15.4028 13.9728C14.8725 14.0996 14.3191 14.1667 13.75 14.1667C9.83794 14.1667 6.66663 10.9954 6.66663 7.08334C6.66663 6.68044 6.70026 6.28541 6.76488 5.90088C6.73472 5.92989 6.70356 5.9566 6.67075 5.98151C6.4369 6.15903 6.14567 6.22492 5.5632 6.35671L5.03291 6.4767C2.98317 6.94047 1.95831 7.17235 1.71448 7.95645C1.47065 8.74054 2.16933 9.55756 3.56671 11.1916L3.92822 11.6144C4.32531 12.0787 4.52386 12.3109 4.61318 12.5981C4.7025 12.8853 4.67248 13.1951 4.61245 13.8146L4.55779 14.3787C4.34653 16.5588 4.24089 17.6489 4.87925 18.1335C5.5176 18.6181 6.47718 18.1763 8.39634 17.2927L8.89286 17.064C9.43823 16.8129 9.71092 16.6874 9.99996 16.6874C10.289 16.6874 10.5617 16.8129 11.1071 17.064L11.6036 17.2926C13.5227 18.1763 14.4823 18.6181 15.1207 18.1335C15.759 17.6489 15.6534 16.5588 15.4421 14.3787L15.4028 13.9728Z"
                    fill="white"
                  />
                  <path
                    opacity="0.5"
                    d="M7.6276 4.50697L7.35452 4.99685C7.05457 5.53494 6.90459 5.80398 6.67075 5.98149C6.70356 5.95658 6.73473 5.92987 6.76489 5.90087C6.70027 6.2854 6.66663 6.68043 6.66663 7.08333C6.66663 10.9953 9.83794 14.1667 13.75 14.1667C14.3191 14.1667 14.8725 14.0995 15.4028 13.9728L15.3875 13.8146C15.3274 13.1951 15.2974 12.8853 15.3867 12.5981C15.4761 12.3109 15.6746 12.0787 16.0717 11.6143L16.4332 11.1916C17.8306 9.55755 18.5293 8.74052 18.2854 7.95643C18.0416 7.17234 17.0167 6.94045 14.967 6.47668L14.4367 6.3567C13.8543 6.22491 13.563 6.15901 13.3292 5.98149C13.0953 5.80398 12.9454 5.53494 12.6454 4.99685L12.3723 4.50697C11.3168 2.61343 10.789 1.66666 9.99996 1.66666C9.21091 1.66666 8.68314 2.61343 7.6276 4.50697Z"
                    fill="white"
                  />
                </svg>
                Impact
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M7.61084 11.3707L10.6605 14.5156C10.8559 14.717 11.1442 14.717 11.3396 14.5156L17.2334 8.43762C17.6012 8.05837 17.3783 7.33334 16.8939 7.33334H11.6482L7.61084 11.3707Z"
                    fill="white"
                  />
                  <path
                    opacity="0.5"
                    d="M10.3519 7.33334H5.10615C4.62177 7.33334 4.39884 8.05837 4.76661 8.43762L6.97265 10.7126L10.3519 7.33334Z"
                    fill="white"
                  />
                </svg>
              </button>
              {impactDropdownOpen && (
                <div className="absolute left-0 mt-2 bg-[#181825] border border-[#EDBA00] rounded-xl shadow-lg z-50 p-2 min-w-[120px]">
                  {impactOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[#232336] rounded-lg"
                      onClick={() => {
                        setSelectedImpact(opt.value);
                        setImpactDropdownOpen(false);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedImpact === opt.value}
                        readOnly
                        className="accent-[#EDBA00]"
                      />
                      {Array.from({ length: opt.stars }).map((_, i) => (
                        <svg
                          key={i}
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="#EDBA00"
                          className="inline-block"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Country Filter */}
            <div className="relative">
              <button
                className={`flex items-center gap-2 bg-[#16151F] rounded-[32px] px-4 sm:px-5 py-2 text-white font-medium text-sm sm:text-base  hover:bg-[#232336] transition outline-none ${
                  countryModalOpen ? "ring-2 ring-[#EDBA00]" : ""
                }`}
                onClick={() => setCountryModalOpen(true)}
                type="button"
              >
                {selectedCountries.length === 0
                  ? "Country"
                  : selectedCountries.length === 1
                    ? selectedCountries[0]
                    : `${selectedCountries.length} Countries`}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M7.61084 11.3707L10.6605 14.5156C10.8559 14.717 11.1442 14.717 11.3396 14.5156L17.2334 8.43762C17.6012 8.05837 17.3783 7.33334 16.8939 7.33334H11.6482L7.61084 11.3707Z"
                    fill="white"
                  />
                  <path
                    opacity="0.5"
                    d="M10.3519 7.33334H5.10615C4.62177 7.33334 4.39884 8.05837 4.76661 8.43762L6.97265 10.7126L10.3519 7.33334Z"
                    fill="white"
                  />
                </svg>
              </button>
              {countryModalOpen && (
                <CountryModal
                  countries={countriesData}
                  selected={countryFilter}
                  onChange={setCountryFilter}
                  onClose={() => setCountryModalOpen(false)}
                  onSave={() => {
                    setSelectedCountries(countryFilter);
                    setCountryModalOpen(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-2 rounded-[20px] mx-auto max-w-[1400px] bg-[#0F0E17] border border-[#21212C] mt-6 sm:mt-[8px] overflow-x-auto">
        {loading ? (
          <div className="text-center text-[#EDBA00] py-10 text-lg font-bold">
            Loading events...
          </div>
        ) : (
          <div
            className="grid grid-cols-7 gap-px"
            style={{ width: "calc(193px * 7)" }}
          >
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="py-2 sm:py-[12px] px-2 text-start text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wide"
                style={{ width: 193, height: 40 }}
              >
                {day}
              </div>
            ))}
            {/* Calendar Days */}
            {calendarDays.map((dayInfo, index) => {
              if (!dayInfo.isCurrentMonth) {
                return (
                  <div
                    key={index}
                    className="bg-[#0F0E17] border border-[#23222C] rounded-[32px] p-2 relative"
                    style={{
                      width: 193,
                      height: 193,
                      backgroundImage:
                        "repeating-linear-gradient(135deg, #23222C22 0 2px, transparent 2px 8px)",
                    }}
                  >
                    <div className="text-xs font-medium text-gray-600 sm:text-sm">
                      {dayInfo.day}
                    </div>
                  </div>
                );
              }
              const dayEvents = getEventsForDate(dayInfo.day);
              const isToday =
                dayInfo.day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();
              const isSelected = false;
              const hasMoreEvents = dayEvents.length > 2;
              const displayEvents = dayEvents.slice(0, 2);
              const dateStr = `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
              ).padStart(2, "0")}-${String(dayInfo.day).padStart(2, "0")}`;
              return (
                <div
                  key={index}
                  className={`relative bg-[#13121A] border border-[#23222C] rounded-[32px] p-2 flex flex-col ${
                    isToday
                      ? "border-2 border-yellow-400"
                      : isSelected
                        ? "border-2 border-blue-400"
                        : ""
                  }`}
                  style={{ width: 193, minHeight: 193 }}
                >
                  {/* Day number */}
                  <div className="absolute top-2 left-3 text-[10px] sm:text-xs text-white font-semibold">
                    {dayInfo.day}
                  </div>
                  {/* Event count */}
                  {dayEvents.length > 0 && (
                    <div className="absolute top-2 right-3 text-[10px] sm:text-xs text-[#B6B7C9] font-semibold">
                      {String(dayEvents.length).padStart(2, "0")} Events
                    </div>
                  )}
                  {/* Events */}
                  <div className="flex flex-col gap-[5px] mt-4">
                    {displayEvents.map((event) => (
                      <div
                        key={event._id}
                        onClick={() => setSelectedEvent(event)}
                        className={`relative flex items-center rounded-xl px-2 sm:px-3 py-2 h-[64px] ${getEventBg(
                          event.impact
                        )} cursor-pointer`}
                        style={{
                          backgroundImage: getEventPattern(event.impact),
                          minHeight: 64,
                          boxSizing: "border-box",
                          borderRight: "3px solid #C7D1C7",
                        }}
                      >
                        {/* Flag SVG and Diamond/Arrow SVG */}
                        <div className="flex items-center justify-center mr-2 sm:mr-0 min-w-[32px] sm:min-w-[10px]">
                          <span className="text-2xl sm:w-10 sm:h-10">🏳️</span>
                        </div>
                        <div className="bg-[rgba(6,5,15,0.12)] w-px h-[37px] mr-[6px]" />

                        {/* Title and Time */}
                        <div className="flex min-w-0">
                          <span
                            className="text-[13px] sm:text-[11px] text-[#06050F] font-medium leading-tight block max-w-full overflow-hidden text-ellipsis line-clamp-2"
                            style={{
                              lineHeight: "1.2",
                              wordBreak: "normal",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {event.event}
                            <span
                              className="text-[#06050F] text-right [text-shadow:0px_4px_12px_rgba(0,0,0,0.5)] font-manrope text-[10px] not-italic font-extrabold leading-none tracking-[-0.2px] whitespace-nowrap"
                              style={{ marginLeft: 8 }}
                            >
                              {event.time}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                    {hasMoreEvents && (
                      <button
                        className="flex items-center justify-between  text-white  px-3 sm:px-[16px] py-1.5 sm:py-[12px] text-xs sm:text-[14px] font-medium cursor-pointer  w-full rounded-[40px] border border-[#353535] hover:bg-[#181825] transition"
                        onClick={() =>
                          setMoreEventsModal({
                            date: dateStr,
                            events: dayEvents.slice(2),
                          })
                        }
                      >
                        <span>+{dayEvents.length - 2} More Events</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            opacity="0.2"
                            d="M5.20825 15.8334C5.20825 16.0949 5.37111 16.3288 5.61641 16.4195C5.86171 16.5103 6.13757 16.4387 6.30779 16.2401L11.3078 10.4068C11.5084 10.1727 11.5084 9.82733 11.3078 9.59328L6.30779 3.75994C6.13758 3.56136 5.86171 3.48977 5.61641 3.58051C5.37111 3.67125 5.20825 3.90514 5.20825 4.16669L5.20825 15.8334Z"
                            fill="white"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.76001 16.3079C8.49794 16.0832 8.46759 15.6887 8.69222 15.4266L13.3436 10L8.69223 4.57341C8.46759 4.31133 8.49794 3.91677 8.76002 3.69213C9.0221 3.46749 9.41666 3.49784 9.6413 3.75992L14.6413 9.59326C14.8419 9.82731 14.8419 10.1727 14.6413 10.4067L9.64129 16.2401C9.41666 16.5022 9.02209 16.5325 8.76001 16.3079Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      {/* More Events Modal */}
      {moreEventsModal && (
        <MoreEventsModal
          date={moreEventsModal.date}
          events={moreEventsModal.events}
          onClose={() => setMoreEventsModal(null)}
          onEventClick={setSelectedEvent}
        />
      )}
    </div>
  );
}

// Popup Modal for Event Details
const EventModal = ({
  event,
  onClose,
}: {
  event: EconomicEvent;
  onClose: () => void;
}) => {
  // Format date from event.date
  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/5 bg-opacity-60">
      <div className="bg-[#181825] rounded-2xl p-6 w-[550px] relative text-white shadow-2xl">
        {/* Close button */}
        <button
          className="absolute text-gray-400 top-4 right-4 hover:text-white"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        {/* Date */}
        <div className="mb-2 text-xs font-medium text-gray-400">{dateStr}</div>
        {/* Country and flag */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏳️</span>
          <span className="text-base font-semibold">{event.country}</span>
        </div>
        {/* Title and period */}
        <div className="flex items-center gap-2 mb-1">
          <div className="text-lg font-bold leading-tight">{event.event}</div>
        </div>
        {/* Time */}
        <div className="inline-block bg-[#EDBA00] text-black px-3 py-1 rounded-md text-xs font-bold mb-4">
          {event.time}
        </div>
        {/* Data grid */}
        <div className="grid grid-cols-2 mb-4 gap-y-4 gap-x-6">
          <div>
            <div className="text-xs font-medium text-gray-400">Actual</div>
            <div className="mt-1 text-xl font-bold">{event.actual || "--"}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-400">Previous</div>
            <div className="mt-1 text-xl font-bold">
              {event.previous || "--"}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-400">Consensus</div>
            <div className="mt-1 text-xl font-bold">
              {event.consensus || "--"}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-400">Forecast</div>
            <div className="mt-1 text-xl font-bold">
              {event.forecast || "--"}
            </div>
          </div>
        </div>
        {/* Chart and bell row */}
        {/* <div className="flex items-center justify-between mt-4 bg-[#13121A] rounded-xl px-4 py-3">
         
          <div className="flex items-end gap-1">
            <div className="w-2 h-3 bg-[#EDBA00] rounded"></div>
            <div className="w-2 h-5 bg-[#EDBA00] rounded"></div>
            <div className="w-2 h-2 bg-[#EDBA00] rounded"></div>
            <div className="w-2 h-4 bg-[#EDBA00] rounded"></div>
          </div>
          <div>
            <Bell size={22} className="text-[#B6B7C9]" />
          </div>
        </div> */}
      </div>
    </div>
  );
};

// Modal for showing all events for a day
const MoreEventsModal = ({
  date,
  events,
  onClose,
  onEventClick,
}: {
  date: string;
  events: EconomicEvent[];
  onClose: () => void;
  onEventClick: (event: EconomicEvent) => void;
}) => {
  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/5 bg-opacity-60">
      <div className="bg-[#181825] rounded-2xl p-6 w-[500px] max-h-[80vh] overflow-y-auto relative text-white shadow-2xl">
        <button
          className="absolute text-gray-400 top-4 right-4 hover:text-white"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <div className="mb-2 text-xs font-medium text-gray-400">{dateStr}</div>
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <div
              key={event._id}
              onClick={() => {
                onEventClick(event);
                onClose();
              }}
              className={`relative flex items-center rounded-xl px-3 py-3 bg-[#23222C] cursor-pointer hover:bg-[#0F0E17] transition`}
            >
              <span className="mr-3 text-2xl">🏳️</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-base text-[#EDBA00] truncate">
                  {event.event}
                </div>
                <div className="text-xs text-gray-400">{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CountryModal component:
const regionTabs = [
  { label: "All", value: "all" },
  { label: "Major", value: "major" },
  { label: "Africa", value: "Africa" },
  { label: "America", value: "America" },
  { label: "Asia", value: "Asia" },
  { label: "Europe", value: "Europe" },
  { label: "Oceania", value: "Oceania" },
];

const CountryModal = ({
  countries,
  selected,
  onChange,
  onClose,
  onSave,
}: {
  countries: { name: string; code: string; region: string; major: boolean }[];
  selected: string[];
  onChange: (v: string[]) => void;
  onClose: () => void;
  onSave: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("all");
  let filtered = countries;
  if (activeTab === "major") filtered = countries.filter((c) => c.major);
  else if (activeTab !== "all")
    filtered = countries.filter((c) => c.region === activeTab);
  // Split into 5 columns
  const columns = Array.from({ length: 5 }, (_, colIdx) =>
    filtered.filter((_, i) => i % 5 === colIdx)
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/5 bg-opacity-60">
      <div className="bg-[#181825] rounded-2xl p-6 w-[1000px] max-h-[90vh] overflow-y-auto relative text-white shadow-2xl">
        <button
          className="absolute text-gray-400 top-4 right-4 hover:text-white"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <div className="flex gap-2 mt-10 mb-6">
          {regionTabs.map((tab) => (
            <button
              key={tab.value}
              className={`px-4 py-2 rounded-full font-medium ${
                activeTab === tab.value
                  ? "bg-[#EDBA00] text-black"
                  : "bg-[#232336] text-white hover:bg-[#EDBA00] hover:text-black"
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            className="px-4 py-2 rounded-lg bg-[#232336] text-white"
            onClick={onClose}
          >
            Clear
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[#EDBA00] text-black font-bold"
            onClick={onSave}
          >
            Save
          </button>
        </div>
        <div className="flex flex-wrap gap-6">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex-1 min-w-[150px]">
              {col.map((country) => (
                <div
                  key={country.code}
                  className="flex items-center gap-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(country.code)}
                    onChange={(e) => {
                      if (e.target.checked)
                        onChange([...selected, country.code]);
                      else onChange(selected.filter((c) => c !== country.code));
                    }}
                    className="accent-[#EDBA00]"
                  />
                  <span>{country.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
