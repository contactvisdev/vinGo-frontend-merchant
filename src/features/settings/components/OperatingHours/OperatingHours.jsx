import { useState, useEffect, useRef } from "react";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import BusinessHoursSchedule from "@/features/onboarding-v2/components/shared/BusinessHoursSchedule";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "@/store/api/userProfileApi";
import { useSelector } from "react-redux";
import CustomButton from "@/components/ui/Button/Button";

const initialHoursState = [
  { day: "Monday", open: null, close: null, enabled: false, formErrors: {} },
  { day: "Tuesday", open: null, close: null, enabled: false, formErrors: {} },
  { day: "Wednesday", open: null, close: null, enabled: false, formErrors: {} },
  { day: "Thursday", open: null, close: null, enabled: false, formErrors: {} },
  { day: "Friday", open: null, close: null, enabled: false, formErrors: {} },
  { day: "Saturday", open: null, close: null, enabled: false, formErrors: {} },
  { day: "Sunday", open: null, close: null, enabled: false, formErrors: {} },
];

export default function OperatingHours({ onScheduleChange, setscheduleErr }) {
  const businessProfile = useSelector((state) => state.businessProfile.profile);
  const ownerProfile = useSelector((state) => state.ownerProfile.profile);
  useGetUserProfileQuery(undefined, { skip: !!businessProfile?._id || !!ownerProfile?._id });
  const [updateUserProfile, { isLoading: saving }] = useUpdateUserProfileMutation();
  const [hours, setHours] = useState(initialHoursState);
  const [isEdit, setIsEdit] = useState(false);
  const savedHoursRef = useRef(initialHoursState);

  useEffect(() => {
    const apiHours = businessProfile?.business?.hours || [];
    if (!apiHours.length) return;

    const updatedHours = initialHoursState.map((dayItem) => {
      const apiDay = apiHours.find(
        (h) => h.day.toLowerCase() === dayItem.day.toLowerCase()
      );

      if (!apiDay) return dayItem;
      return {
        ...dayItem,
        open: apiDay.open || null,
        close: apiDay.close || null,
        enabled: apiDay.enabled ?? true,
      };
    });

    setHours(updatedHours);
    savedHoursRef.current = updatedHours;
  }, [businessProfile?.business?.hours]);

  /* ------------------ HELPER ------------------ */
  const timeStringToDate = (time) => {
    if (!time) return null;

    const [timePart, meridian] = time.split(" ");
    let [h, m] = timePart.split(":").map(Number);

    if (meridian === "PM" && h !== 12) h += 12;
    if (meridian === "AM" && h === 12) h = 0;

    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };
  const formatTime = (dateOrString) => {
    if (!dateOrString) return null;

    let date =
      dateOrString instanceof Date
        ? dateOrString
        : timeStringToDate(dateOrString);

    let h = date.getHours();
    const m = date.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  /* ------------------ SAVE ------------------ */
  const onSubmit = async () => {
    try {
      const payload = {
        business: {
          hours: hours.map((h) => ({
            day: h.day,
            open: h.open ? formatTime(h.open) : null,
            close: h.close ? formatTime(h.close) : null,
            enabled: h.enabled,
          })),
        },
      };

      await updateUserProfile({ id: businessProfile._id, data: payload }).unwrap();
      savedHoursRef.current = hours;
      setIsEdit(false);
    } catch(err) {
      if(import.meta.env.DEV){
        console.log("Something went wrong. Please try again. in operating hours", err);
      }
    }
  };

  const handleCancel = () => {
    setHours(savedHoursRef.current);
    setIsEdit(false);
  };

  return (
    <div className="w-full">
      <BusinessHoursSchedule
        initialHours={hours}
        onScheduleChange={(data) => {
          setHours(data);
        }}
        setscheduleErr={setscheduleErr}
        disabled={!isEdit}
      />
      <div className="mt-8 flex gap-4 justify-end">
        {!isEdit && (
          <CustomButton label="Edit" onClick={() => setIsEdit(true)} />
        )}
        {isEdit && (
          <>
            <CustomButton
              label="Save"
              onClick={onSubmit}
              loading={saving}
              disabled={saving}
            />
            <CustomButton
              label="Cancel"
              className="bg-white! text-neutral-600! border border-neutral-600!"
              onClick={handleCancel}
              disabled={saving}
            />
          </>
        )}
      </div>
    </div>
  );
}
