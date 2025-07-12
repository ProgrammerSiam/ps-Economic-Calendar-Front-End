import React, { useState, useRef, useEffect } from "react";
import countriesData from "../../../public/countries.json";

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-[#232336] rounded-lg mb-4"></div>
    <div className="h-10 bg-[#232336] rounded-lg mb-4"></div>
    <div className="h-10 bg-[#232336] rounded-lg mb-4"></div>
    <div className="h-10 bg-[#232336] rounded-lg mb-4"></div>
    <div className="h-10 bg-[#232336] rounded-lg mb-4"></div>
    <div className="h-10 bg-[#232336] rounded-lg mb-4"></div>
    <div className="h-10 bg-[#232336] rounded-lg mb-4"></div>
    <div className="h-10 bg-[#232336] rounded-lg mb-4"></div>
    <div className="h-10 bg-[#232336] rounded-lg mb-4"></div>
    <div className="h-10 bg-[#232336] rounded-lg mb-4"></div>
  </div>
);

// Toast component
const Toast = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="fixed z-50 transform -translate-x-1/2 top-6 left-1/2">
    <div className="bg-[#EDBA00] text-black font-semibold px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-black hover:text-gray-700 focus:outline-none"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  </div>
);

export default function Page() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    country: "",
    event: "",
    actual: "",
    previous: "",
    consensus: "",
    forecast: "",
    impact: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [countryDropdown, setCountryDropdown] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const countryInputRef = useRef(null);
  const [showToast, setShowToast] = useState(false);

  const filteredCountries = countryQuery
    ? countriesData.filter((c) =>
        c.name.toLowerCase().includes(countryQuery.toLowerCase())
      )
    : countriesData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountrySelect = (country: string) => {
    setForm({ ...form, country });
    setCountryDropdown(false);
    setCountryQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL_DEVLOPMENT + "/api/events",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      console.log("API response:", data);
      setMessage("Event submitted successfully!");
      setForm({
        date: "",
        time: "",
        country: "",
        event: "",
        actual: "",
        previous: "",
        consensus: "",
        forecast: "",
        impact: "",
      });
    } catch (err) {
      setMessage("Error submitting event.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message === "Event submitted successfully!") {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-[#06050F] flex items-center justify-center px-4 py-20">
      {showToast && (
        <Toast
          message={message}
          onClose={() => {
            setShowToast(false);
            setMessage("");
          }}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-[#181825] border border-[#21212C] rounded-2xl p-8 shadow-xl text-white"
      >
        <h2 className="mb-6 text-2xl font-bold text-center">
          Add Economic Event
        </h2>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="bg-[#0F0E17] border border-[#23222C] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#EDBA00] w-full transition-all duration-200"
                required
              />
            </div>
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="bg-[#0F0E17] border border-[#23222C] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#EDBA00] w-full transition-all duration-200"
                required
              />
            </div>
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Country
              </label>
              <input
                type="text"
                name="country"
                placeholder="Select a country"
                autoComplete="off"
                value={countryQuery || form.country}
                ref={countryInputRef}
                onFocus={() => setCountryDropdown(true)}
                onChange={(e) => {
                  setCountryQuery(e.target.value);
                  setForm({ ...form, country: "" });
                  setCountryDropdown(true);
                }}
                className="bg-[#0F0E17] border w-full border-[#23222C] rounded-lg px-4 py-2 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-[#EDBA00] transition-all duration-200"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-4 top-11 -translate-y-1/2 text-[#EDBA00] pointer-events-auto cursor-pointer transition hover:scale-110 flex items-center justify-center h-6 w-6"
                onClick={() => setCountryDropdown((v) => !v)}
                style={{ background: "none", border: "none", padding: 0 }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="#EDBA00"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {countryDropdown && (
                <div className="absolute z-10 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-[#181825] border border-[#23222C] rounded-lg shadow-xl">
                  {filteredCountries.length === 0 && (
                    <div className="px-4 py-2 text-gray-400">
                      No countries found
                    </div>
                  )}
                  {filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      className={`px-4 py-2 cursor-pointer hover:bg-[#232336] transition-colors duration-200 ${
                        form.country === country.name
                          ? "bg-[#232336] text-[#EDBA00]"
                          : "text-white"
                      }`}
                      onClick={() => handleCountrySelect(country.name)}
                    >
                      {country.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Event
              </label>
              <input
                type="text"
                name="event"
                placeholder="Enter event name"
                value={form.event}
                onChange={handleChange}
                className="bg-[#0F0E17] border border-[#23222C] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#EDBA00] w-full transition-all duration-200"
                required
              />
            </div>
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Actual
              </label>
              <input
                type="text"
                name="actual"
                placeholder="Enter actual value"
                value={form.actual}
                onChange={handleChange}
                className="bg-[#0F0E17] border border-[#23222C] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#EDBA00] w-full transition-all duration-200"
              />
            </div>
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Previous
              </label>
              <input
                type="text"
                name="previous"
                placeholder="Enter previous value"
                value={form.previous}
                onChange={handleChange}
                className="bg-[#0F0E17] border border-[#23222C] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#EDBA00] w-full transition-all duration-200"
              />
            </div>
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Consensus
              </label>
              <input
                type="text"
                name="consensus"
                placeholder="Enter consensus value"
                value={form.consensus}
                onChange={handleChange}
                className="bg-[#0F0E17] border border-[#23222C] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#EDBA00] w-full transition-all duration-200"
              />
            </div>
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Forecast
              </label>
              <input
                type="text"
                name="forecast"
                placeholder="Enter forecast value"
                value={form.forecast}
                onChange={handleChange}
                className="bg-[#0F0E17] border border-[#23222C] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#EDBA00] w-full transition-all duration-200"
              />
            </div>
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-400">
                Impact
              </label>
              <select
                name="impact"
                value={form.impact}
                onChange={handleChange}
                className="bg-[#0F0E17] border border-[#23222C] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#EDBA00] w-full transition-all duration-200"
                required
              >
                <option value="">Select Impact Level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-[#EDBA00] text-black font-bold py-2 rounded-lg hover:bg-[#FFD700] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-3 -ml-1 text-black animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </div>
          ) : (
            "Submit Event"
          )}
        </button>
        {message && message.includes("Error") && (
          <div className="mt-4 text-sm font-medium text-center text-red-500">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
