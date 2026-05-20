import { CustomPassword } from "@/components/forms/CustomPassword";
import CustomButton from "@/components/ui/Button/Button";

export default function Security() {
  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold">Change Password</h1>
      <div className="grid mt-4 grid-cols-12">
        <div className="col-span-5">
          <CustomPassword label="Current Password" />
          <CustomPassword label="New Password" />
          <CustomPassword label="Confirm New Password" />
        </div>
      </div>
      <CustomButton variant="primary" label="Update Password" fullWidth={false} />
    </div>
  );
}

