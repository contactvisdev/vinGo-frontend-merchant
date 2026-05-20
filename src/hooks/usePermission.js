import { useSelector } from 'react-redux';
import { hasPermission } from '@/helpers/permissions';


const usePermission = () => {
    const profile = useSelector((state) => state?.ownerProfile?.profile);
    const checkPermission = (module, action = 'canView') => {
        return hasPermission(profile, module, action);
    };

    return checkPermission;
};

export default usePermission;
