import { memo, useState, useRef, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";
import { Calendar } from "primereact/calendar";
import { CustomSwitch } from "@/components/forms/CustomSwitch";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const DAY_INITIALS = ["M", "T", "W", "T", "F", "S", "S"];

const createDefaultHours = () =>
  DAYS.map((day) => ({
    day,
    open: null,
    close: null,
    formErrors: { open: "", close: "", general: "" },
  }));

function formatTime(date) {
  if (!date) return "";
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function parseTime(timeStr) {
  if (!timeStr) return null;
  const str = timeStr.trim();

  // Match formats: "9:00 AM", "9:00AM", "9:00am", "9am", "9 am", "9:00", "09:00"
  const match = str.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)?$/i);
  if (!match) return null;

  let h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  const meridian = match[3] ? match[3].toUpperCase() : null;

  if (m < 0 || m > 59) return null;

  if (meridian) {
    if (h < 1 || h > 12) return null;
    if (meridian === "PM" && h !== 12) h += 12;
    if (meridian === "AM" && h === 12) h = 0;
  } else {
    if (h < 0 || h > 23) return null;
  }

  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

const TimePickerField = memo(function TimePickerField({
  value,
  placeholder,
  enabled,
  isActive,
  onClockClick,
  onTimeChange,
  pickerRef,
  error,
}) {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      onTimeChange(null);
      return;
    }
    const parsed = parseTime(trimmed);
    if (parsed && !isNaN(parsed.getTime())) {
      onTimeChange(parsed);
    } else {
      setInputValue(value || "");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <div className="flex-1 min-w-[200px] relative">
      <div className="relative" ref={pickerRef}>
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full 2xl:h-[50px] lg:h-[45px] h-[45px] px-4 py-3 border 2xl:text-base lg:text-sm text-xs border-gray-300 rounded-[13px] bg-white ${
            enabled ? "cursor-text" : "disbaled"
          }`}
          disabled={!enabled}
        />
        <Clock
          className={`absolute right-4 top-1/2 -translate-y-1/2 ${
            enabled
              ? "text-primary cursor-pointer"
              : "text-gray-300 cursor-not-allowed"
          }`}
          onClick={onClockClick}
        />
        {isActive && enabled && (
          <div className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg">
            <Calendar
              inline
              timeOnly
              hourFormat="12"
              value={parseTime(value)}
              onChange={(e) => onTimeChange(e.value)}
            />
          </div>
        )}
      </div>
      {error && (
        <div className="absolute text-red-500 2xl:text-xs lg:text-[10px] text-[8px] mt-1">
          {error}
        </div>
      )}
    </div>
  );
});

const DayRow = memo(function DayRow({
  item,
  index,
  activePicker,
  pickerRefs,
  onTimeChange,
  onSwitchChange,
  onClockClick,
  disabled,
}) {
  const isEnabled = item.enabled && !disabled;
  return (
    <div>
      {item.formErrors.general && (
        <p className="text-sm text-red-500"> {item.formErrors.general}</p>
      )}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="flex items-center justify-between">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold shrink-0 ${
              item.enabled
                ? "bg-primary text-white"
                : "bg-white border-2 border-gray-300 text-black"
            }`}
          >
            {DAY_INITIALS[index]}
          </div>
          <div className="hide-toggle">
            <CustomSwitch
              value={item.enabled}
              onChange={({ value }) => onSwitchChange(index, value)}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-start w-full">
          <TimePickerField
            value={item.open}
            placeholder="Open time"
            enabled={isEnabled}
            isActive={activePicker === `${index}-open`}
            onClockClick={() => onClockClick(`${index}-open`, item.day)}
            onTimeChange={(val) => onTimeChange(index, "open", val)}
            pickerRef={(el) => (pickerRefs.current[`${index}-open`] = el)}
            error={item.formErrors?.open}
          />
          <TimePickerField
            value={item.close}
            placeholder="Close time"
            enabled={isEnabled}
            isActive={activePicker === `${index}-close`}
            onClockClick={() => onClockClick(`${index}-close`, item.day)}
            onTimeChange={(val) => onTimeChange(index, "close", val)}
            pickerRef={(el) => (pickerRefs.current[`${index}-close`] = el)}
            error={item.formErrors?.close}
          />
        </div>

        <div className="progressbar ">
          <CustomSwitch
            value={item.enabled}
            onChange={({ value }) => onSwitchChange(index, value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
});

const BusinessHoursSchedule = memo(function BusinessHoursSchedule({
  initialHours,
  onScheduleChange,
  setscheduleErr,
  disabled,
}) {
  const [hours, setHours] = useState(createDefaultHours);
  const [activePicker, setActivePicker] = useState(null);
  const pickerRefs = useRef({});
  const pendingNotify = useRef(false);

  useEffect(() => {
    if (!Array.isArray(initialHours) || !initialHours.length) return;
    const initialMap = Object.fromEntries(initialHours.map((h) => [h.day, h]));
    setHours((prev) => prev.map((d) => (initialMap[d.day] ? { ...d, ...initialMap[d.day] } : d)));
  }, [initialHours]);

  useEffect(() => {
    if (pendingNotify.current) {
      onScheduleChange?.(hours);
      pendingNotify.current = false;
    }
  }, [hours, onScheduleChange]);

  useEffect(() => {
    const closeOnOutside = (e) => {
      if (!activePicker) return;
      const clickedInside = Object.values(pickerRefs.current).some(
        (ref) => ref && ref.contains(e.target),
      );
      if (!clickedInside) setActivePicker(null);
    };

    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [activePicker]);

  const handleTimeChange = useCallback(
    (index, type, value) => {
      setscheduleErr?.(null);
      pendingNotify.current = true;

      setHours((prev) => {
        const updated = [...prev];
        const formattedValue = value ? formatTime(value) : null;
        updated[index] = {
          ...updated[index],
          [type]: formattedValue,
        };

        const openTime = updated[index].open;
        const closeTime = updated[index].close;
        let closeError = "";

        if (openTime && closeTime) {
          const openDate = parseTime(openTime);
          const closeDate = parseTime(closeTime);
          if (openDate && closeDate && closeDate.getTime() <= openDate.getTime()) {
            closeError = `Close time must be after open time for ${updated[index].day}.`;
          }
        }

        updated[index].formErrors = {
          ...updated[index].formErrors,
          close: closeError,
          general: openTime ? "" : updated[index].formErrors.general,
        };

        return updated;
      });
    },
    [setscheduleErr],
  );

  const handleSwitchChange = useCallback((index, value) => {
    pendingNotify.current = true;

    setHours((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], enabled: value };
      return updated;
    });
  }, []);

  const handleClockClick = useCallback((id, day) => {
    const dayItem = hours.find((d) => d.day === day);
    if (!dayItem?.enabled) return;
    setActivePicker((current) => (current === id ? null : id));
  }, [hours]);

  return (
    <div className="mx-auto bg-white rounded-3xl">
      <div className="space-y-6">
        {hours.map((item, index) => (
          <DayRow
            key={item.day}
            item={item}
            index={index}
            activePicker={activePicker}
            pickerRefs={pickerRefs}
            onTimeChange={handleTimeChange}
            onSwitchChange={handleSwitchChange}
            onClockClick={handleClockClick}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
});

export default BusinessHoursSchedule;
