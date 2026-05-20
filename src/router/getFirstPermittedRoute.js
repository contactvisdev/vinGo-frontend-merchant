import { hasPermission } from "@/helpers/permissions";
import { PrivateRoutes } from "./routes";

export function getFirstPermittedRoute(profile) {
  for (const route of PrivateRoutes) {
    if (route.path.includes(":id")) continue;

    const permissionMeta = route.meta?.permission;
    const hasAccess = !permissionMeta || hasPermission(profile, permissionMeta.module, permissionMeta.action);

    if (hasAccess) {
      return route.path;
    }
  }
  return "/dashboard";
}
