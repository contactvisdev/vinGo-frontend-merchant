import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetStaffByIdQuery } from "@/store/api/businessStaffApi";
import { setOwnerProfile } from "@/store/ownerProfileSlice";
import { isAuthenticated } from "@/helpers/auth";

export default function StaffProfileRefresher() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state?.ownerProfile?.profile);
  const [triggerGetStaffById] = useLazyGetStaffByIdQuery();

  useEffect(() => {
    if (!isAuthenticated() || !profile?._id) return;

    const role = profile?.role || profile?.roles?.[0]?.role;
    if (role === "owner") return;

    const refreshStaffProfile = async () => {
      try {
        const result = await triggerGetStaffById({ id: profile._id }).unwrap();
        const staffData = result?.data;
        if (staffData) {
          dispatch(
            setOwnerProfile({
              ...result,
              user: {
                ...staffData,
                role: role || "staff",
              },
            })
          );
        }
      } catch (err) {
        console.error("Staff profile refresh failed:", err);
      }
    };

    refreshStaffProfile();
  }, [profile?._id, triggerGetStaffById, dispatch]);

  return null;
}
