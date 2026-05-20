import { useCallback, useMemo } from "react";
import {
  ShoppingBag,
  UtensilsCrossed,
  Users,
  FileText,
  CreditCard,
  Star,
  Settings,
  BarChart3,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import { CustomSwitch } from "@/components/forms/CustomSwitch";
import {
  PERMISSIONS_SCHEMA,
  getDefaultPermissions,
} from "@/helpers/constants/staffConstants";
import { useMenuContext } from "@features/menuManagement/hooks/forms/useMenuContext";

const ICON_MAP = {
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

export default function PermissionsEditor({ value = null, onChange, disabled = false }) {
  const permissions = value || getDefaultPermissions();
  const { itemType } = useMenuContext();
  const isGrocery = itemType?.includes("grocery");
  const getTitle = (section, title) =>
    section === "menu" && isGrocery ? "Product Management" : title;

  const handleToggle = useCallback(
    (section, key, checked) => {
      const next = {
        ...permissions,
        [section]: {
          ...(permissions[section] || {}),
          [key]: checked,
        },
      };
      onChange?.(next);
    },
    [permissions, onChange]
  );

  const handleToggleAll = useCallback(
    (section, keys, checked) => {
      const updated = {};
      keys.forEach(({ key }) => {
        updated[key] = checked;
      });
      const next = {
        ...permissions,
        [section]: {
          ...(permissions[section] || {}),
          ...updated,
        },
      };
      onChange?.(next);
    },
    [permissions, onChange]
  );

  const enabledCount = useMemo(() => {
    let total = 0;
    let enabled = 0;
    PERMISSIONS_SCHEMA.forEach(({ section, keys }) => {
      const sectionPerms = permissions[section] || {};
      keys.forEach(({ key }) => {
        total++;
        if (sectionPerms[key]) enabled++;
      });
    });
    return { total, enabled };
  }, [permissions]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
            <Shield size={18} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Permissions</h3>
            <p className="text-xs text-gray-500">
              Choose what this staff member can access and do.
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {enabledCount.enabled}/{enabledCount.total} enabled
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {PERMISSIONS_SCHEMA.map(({ section, title: rawTitle, icon, keys }) => {
          const title = getTitle(section, rawTitle);
          const sectionPerms = permissions[section] || {};
          const allOn = keys.every(({ key }) => !!sectionPerms[key]);
          const onCount = keys.filter(({ key }) => !!sectionPerms[key]).length;
          const Icon = ICON_MAP[icon];

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
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      allOn ? "bg-primary-100" : "bg-gray-100"
                    }`}>
                      <Icon size={16} className={allOn ? "text-primary-600" : "text-gray-500"} />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 capitalize">{title}</h4>
                    <span className="text-[11px] text-gray-400">{onCount}/{keys.length} active</span>
                  </div>
                </div>
                <div>
                <CustomSwitch
                  name={`perm.${section}.all`}
                  value={allOn}
                  onChange={(e) => handleToggleAll(section, keys, e.value)}
                  disabled={disabled}
                  ignoreLabel
                  ignoreError
                />
                </div>
              </div>
              <div className="px-4 py-2.5 divide-y divide-gray-100">
                {keys.map(({ key, label }) => {
                  const checked = !!sectionPerms[key];
                  return (
                    <div key={key} className="flex items-center justify-between py-2">
                      <div className={`text-sm ${checked ? "text-gray-800" : "text-gray-500"} w-full`}>
                        {label}
                      </div>
                      <div>
                      <CustomSwitch
                        name={`perm.${section}.${key}`}
                        value={checked}
                        onChange={(e) => handleToggle(section, key, e.value)}
                        disabled={disabled}
                        ignoreLabel
                        ignoreError
                        className="w-auto"
                      />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
