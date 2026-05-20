import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Briefcase,
  Check,
  X,
  Shield,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  FileText,
  CreditCard,
  Star,
  Settings,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";
import CustomButton from "@/components/ui/Button/Button";
import BaseCard from "@/components/ui/Card/Card";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import {
  PERMISSIONS_SCHEMA,
  getDefaultPermissions,
} from "@/helpers/constants/staffConstants";
import { useStaffView } from "../hooks";
import { useMenuContext } from "@features/menuManagement/hooks/forms/useMenuContext";

const VIEW_ICON_MAP = {
  ShoppingBag,
  UtensilsCrossed,
  Users,
  FileText,
  CreditCard,
  Star,
  Settings,
  BarChart3,
  LayoutDashboard,
};

const STAFF_PLACEHOLDER = {
  name: "Staff Member Name",
  email: "email@example.com",
  phone: "+1 234 567 8900",
  isActive: true,
  profilePic: "",
  roles: [{ role: "admin", merchantIds: ["m1"], permissions: getDefaultPermissions() }],
};

export default function ViewStaff() {
  const { id, navigate, staff, loading, getMerchantLabel } = useStaffView();
  const { itemType } = useMenuContext();
  const isGrocery = itemType?.includes("grocery");
  const getSectionTitle = (section, title) =>
    section === "menu" && isGrocery ? "Product Management" : title;

  if (!loading && !staff) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-gray-500 mb-4">Staff member not found.</p>
        <CustomButton
          label="Back to Staff"
          variant="gray"
          onClick={() => navigate("/staff")}
        />
      </div>
    );
  }

  const staffData = loading ? STAFF_PLACEHOLDER : staff;
  const roles = staffData.roles || [];
  const first = roles[0];
  const permissions = first?.permissions || getDefaultPermissions();

  return (
    <AutoSkeleton loading={loading} config={{ animation: "shimmer" }}>
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate("/staff")}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft size={18} />
            Back to Staff
          </button>
          <CustomButton
            label="Edit"
            variant="primary"
            onClick={() => navigate(`/staff/${id}/edit`)}
          />
        </div>

        <div className="space-y-6">
          <BaseCard>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailRow icon={User} label="Name" value={staffData.name || "—"} />
              <DetailRow icon={Mail} label="Email" value={staffData.email || "—"} />
              <DetailRow icon={Phone} label="Phone" value={staffData.phone || "—"} />
              <DetailRow
                icon={Briefcase}
                label="Status"
                value={
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      staffData.isActive !== false
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {staffData.isActive !== false ? "Active" : "Inactive"}
                  </span>
                }
              />
              {staffData.profilePic && (
                <div className="sm:col-span-2">
                  <p className="text-gray-500 text-sm mb-2">Profile picture</p>
                  <img
                    src={staffData.profilePic}
                    alt={staffData.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
              {staffData.createdAt && (
                <div className="sm:col-span-2 text-sm text-gray-500">
                  Created {new Date(staffData.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </BaseCard>

          <BaseCard>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Role & merchants
            </h2>
            <div className="space-y-4">
              <DetailRow
                icon={Briefcase}
                label="Role"
                value={first?.role || "—"}
              />
              {first?.merchantIds?.length > 0 && (
                <div>
                  <p className="text-gray-500 text-sm mb-2">Assigned merchants</p>
                  <div className="flex flex-wrap gap-2">
                    {first.merchantIds.map((mid) => (
                      <span
                        key={mid}
                        className="inline-flex px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-sm"
                      >
                        {getMerchantLabel(mid)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </BaseCard>

          {!loading && staffData.idVerification &&
            (staffData.idVerification.front || staffData.idVerification.back) && (
              <BaseCard>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  ID Verification
                </h2>
                <div className="flex gap-4">
                  {staffData.idVerification.front && (
                    <a
                      href={staffData.idVerification.front}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline text-sm"
                    >
                      View front
                    </a>
                  )}
                  {staffData.idVerification.back && (
                    <a
                      href={staffData.idVerification.back}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline text-sm"
                    >
                      View back
                    </a>
                  )}
                </div>
              </BaseCard>
            )}

          <BaseCard>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Shield size={18} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Permissions
                  </h2>
                  <p className="text-xs text-gray-500">
                    What this staff member can access and do.
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {PERMISSIONS_SCHEMA.reduce((acc, { section, keys }) => {
                  const sp = permissions[section] || {};
                  return acc + keys.filter(({ key }) => !!sp[key]).length;
                }, 0)}
                /
                {PERMISSIONS_SCHEMA.reduce(
                  (acc, { keys }) => acc + keys.length,
                  0,
                )}{" "}
                enabled
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {PERMISSIONS_SCHEMA.map(({ section, title: rawTitle, icon, keys }) => {
                const title = getSectionTitle(section, rawTitle);
                const sectionPerms = permissions[section] || {};
                const allOn = keys.every(({ key }) => !!sectionPerms[key]);
                const onCount = keys.filter(
                  ({ key }) => !!sectionPerms[key],
                ).length;
                const Icon = VIEW_ICON_MAP[icon];

                return (
                  <div
                    key={section}
                    className={`rounded-xl border transition-colors ${
                      allOn
                        ? "border-primary-200 bg-primary-50/40"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2.5">
                        {Icon && (
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              allOn ? "bg-primary-100" : "bg-gray-100"
                            }`}
                          >
                            <Icon
                              size={16}
                              className={
                                allOn ? "text-primary-600" : "text-gray-500"
                              }
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 capitalize">
                            {title}
                          </h4>
                          <span className="text-[11px] text-gray-400">
                            {onCount}/{keys.length} active
                          </span>
                        </div>
                      </div>
                      {allOn ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full">
                          <Check size={12} />
                          All
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                          Partial
                        </span>
                      )}
                    </div>
                    <div className="px-4 py-2.5 divide-y divide-gray-100">
                      {keys.map(({ key, label }) => {
                        const enabled = !!sectionPerms[key];
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between gap-4 py-2"
                          >
                            <span
                              className={`text-sm ${enabled ? "text-gray-800" : "text-gray-500"}`}
                            >
                              {label}
                            </span>
                            {enabled ? (
                              <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                <Check size={14} />
                                Yes
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-gray-400 text-xs">
                                <X size={14} />
                                No
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </BaseCard>
        </div>
      </div>
    </AutoSkeleton>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="text-primary mt-0.5 shrink-0" />
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <div className="font-medium text-gray-900 wrap-anywhere">{value}</div>
      </div>
    </div>
  );
}
