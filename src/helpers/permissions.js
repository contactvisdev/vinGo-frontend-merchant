export const hasPermission = (profile, module, action = 'canView') => {
    if (!profile) return false;

    if (profile.role === 'owner') {
        return true;
    }

    if (profile.roles && profile.roles.length > 0) {
        const primaryRole = profile.roles[0];
        const permissions = primaryRole.permissions;
        if (permissions && permissions[module] && permissions[module][action]) {
            return true;
        }
    }

    return false;
};
