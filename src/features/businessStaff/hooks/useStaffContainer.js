import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetAllStaffQuery,
  useGetStaffByIdQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "@/store/api/businessStaffApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { useDebounce, useAuthApi } from "@/hooks";
import {
  DEFAULT_STAFF_SEARCH_DEBOUNCE_DELAY,
  getDefaultPermissions,
} from "@/helpers/constants/staffConstants";
import { number } from "@/helpers/regex";

export const useStaffList = () => {
  const merchantId = useSelector(
    (state) => state.businessProfile?.profile?._id,
  );

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(
    search,
    DEFAULT_STAFF_SEARCH_DEBOUNCE_DELAY,
  );

  const { data, isLoading } = useGetAllStaffQuery(merchantId, {
    skip: !merchantId,
  });

  const staffRaw = useMemo(() => {
    const d = data?.data;
    return Array.isArray(d) ? d : (d?.list ?? []);
  }, [data]);

  const pagination = data?.data?.pagination || {};

  const staffList = useMemo(() => {
    const searchQuery = debouncedSearch?.trim() || "";
    // Only filter when search length is at least 3 characters
    if (searchQuery.length < 3) return staffRaw;
    
    const q = searchQuery.toLowerCase();
    return staffRaw.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.phone || "").toLowerCase().includes(q),
    );
  }, [staffRaw, debouncedSearch]);

  const handleSearchChange = (e) => setSearch(e.value || "");

  const hasPagination = pagination?.totalPages > 1;

  return {
    staffList,
    pagination,
    loading: isLoading,
    search,
    hasPagination,
    handleSearchChange,
  };
};

export const useStaffDelete = () => {
  const [deleteStaff, setDeleteStaff] = useState(null);
  const [deleteStaffMutation, { isLoading: deleteLoading }] =
    useDeleteStaffMutation();

  const handleDeleteConfirm = async () => {
    if (!deleteStaff?._id) return;
    try {
      await deleteStaffMutation(deleteStaff._id).unwrap();
      setDeleteStaff(null);
    } catch(error) {
      if(import.meta.env.DEV){
        console.log("Error deleting staff", error);
      }
    }
  };

  return {
    deleteStaff,
    deleteLoading,
    setDeleteStaff,
    handleDeleteConfirm,
  };
};

export const useStaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const ownerProfile = useSelector((state) => state?.ownerProfile?.profile);
  const businessProfile = useSelector(
    (state) => state?.businessProfile?.profile,
  );
  const ownerId = ownerProfile?._id;
  const defaultMerchantId =
    businessProfile?.merchant?._id || businessProfile?._id;
  const businessCategoryId = businessProfile?.categoryId;

  const { data: staffData, isLoading: fetchLoading } = useGetStaffByIdQuery(
    { id },
    { skip: !isEdit || !id },
  );

  const [createStaffMutation, { isLoading: createLoading }] =
    useCreateStaffMutation();
  const [updateStaffMutation, { isLoading: updateLoading }] =
    useUpdateStaffMutation();
  const [uploadFileMutation] = useUploadFileMutation();

  const { getMerchantsByOwner } = useAuthApi();
  const [merchantOptions, setMerchantOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [formInitialized, setFormInitialized] = useState(!isEdit);

  const [form, setForm] = useState(() => ({
    name: "",
    email: "",
    phone: "",
    profilePic: "",
    isActive: true,
    roles: [
      {
        role: "STAFF",
        merchantIds: defaultMerchantId ? [defaultMerchantId] : [],
        permissions: getDefaultPermissions(),
      },
    ],
  }));

  useEffect(() => {
    if (!isEdit && defaultMerchantId) {
      setForm((prev) => {
        if (prev.roles[0]?.merchantIds?.includes(defaultMerchantId))
          return prev;
        return {
          ...prev,
          roles: [{ ...prev.roles[0], merchantIds: [defaultMerchantId] }],
        };
      });
    }
  }, [isEdit, defaultMerchantId]);

  useEffect(() => {
    if (!isEdit || !staffData?.data) return;
    const d = staffData.data;
    const first = d.roles?.[0];
    setForm({
      name: d.name || "",
      email: d.email || "",
      phone: d.phone || "",
      profilePic: d.profilePic || "",
      isActive: d.isActive !== false,
      roles: [
        {
          role: first?.role || "STAFF",
          merchantIds: first?.merchantIds || [],
          permissions: first?.permissions || getDefaultPermissions(),
        },
      ],
    });
    setFormInitialized(true);
  }, [isEdit, staffData]);

  useEffect(() => {
    if (!ownerId) return;
    getMerchantsByOwner(ownerId, businessCategoryId, (res) => {
      const list = res?.data?.list || res?.data || [];
      const all = Array.isArray(list) ? list : [];
      setMerchantOptions(all.filter((m) => m.isDocumentVerified));
    });
  }, [ownerId, getMerchantsByOwner, businessCategoryId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.name]: e.value }));
    setErrors((prev) => ({ ...prev, [e.name]: undefined }));
  };

  const setPermissions = (next) => {
    setForm((prev) => ({
      ...prev,
      roles: [{ ...prev.roles[0], permissions: next }],
    }));
  };

  const toggleMerchant = (mid) => {
    setForm((prev) => {
      const ids = prev.roles[0]?.merchantIds || [];
      const next = ids.includes(mid) ? ids.filter((x) => x !== mid) : [...ids, mid];
      return { ...prev, roles: [{ ...prev.roles[0], merchantIds: next }] };
    });
  };

  const setRole = (e) => {
    setForm((prev) => ({
      ...prev,
      roles: [{ ...prev.roles[0], role: e.value }],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Name is required";
    else if (/\d/.test(form.name)) e.name = "Name must not contain numbers";
    if (!form.email?.trim()) e.email = "Email is required";
    if (!form.phone?.trim()) e.phone = "Phone is required";
    if (!(form.roles?.[0]?.merchantIds?.length)) e.merchantIds = "Select at least one merchant";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      ownerId,
      profilePic: form.profilePic || undefined,
      roles: [{
        role: form.roles[0].role,
        merchantIds: form.roles[0].merchantIds,
        permissions: form.roles[0].permissions || getDefaultPermissions(),
      }],
    };
    if (isEdit && typeof form.isActive === "boolean") payload.isActive = form.isActive;
    return payload;
  };

  const handleSubmit = async (ev) => {
    ev?.preventDefault();
    if (!validate()) return;
    if (!ownerId) {
      setErrors((p) => ({ ...p, _: "Owner profile not loaded. Please refresh." }));
      return;
    }
    const payload = buildPayload();
    if (isEdit) {
      await updateStaffMutation({ id, data: payload }).unwrap();
    } else {
      await createStaffMutation(payload).unwrap();
    }
    navigate("/staff");
  };

  const handleUploadProfilePic = async (file) => {
    try {
      const result = await uploadFileMutation(file).unwrap();
      const url = result?.data?.url ?? (typeof result?.data === "string" ? result.data : null);
      if (url) handleChange({ name: "profilePic", value: url });
    } catch (error) {
      if (import.meta.env.DEV) console.log("Error uploading image", error);
    }
  };

  const loading = createLoading || updateLoading;
  const loadFetch = isEdit && (fetchLoading || !formInitialized);

  return {
    isEdit,
    navigate,
    merchantOptions,
    loadFetch,
    errors,
    form,
    loading,
    handleChange,
    setPermissions,
    toggleMerchant,
    setRole,
    handleSubmit,
    handleUploadProfilePic,
  };
};

export const useStaffView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: staffData, isLoading: loading } = useGetStaffByIdQuery(
    { id },
    { skip: !id },
  );

  const staff = staffData?.data || null;

  const { getMerchantsByOwner } = useAuthApi();
  const [merchantMap, setMerchantMap] = useState({});

  useEffect(() => {
    if (!staff?.ownerId) return;
    getMerchantsByOwner(staff.ownerId, null, (mRes) => {
      const list = mRes?.data?.list || mRes?.data || [];
      const arr = Array.isArray(list) ? list : [];
      const map = {};
      arr.forEach((m) => {
        const mid = m._id || m.id;
        map[mid] = m.businessName || m.business?.businessName || m.name || mid;
      });
      setMerchantMap(map);
    });
  }, [staff?.ownerId, getMerchantsByOwner]);

  const getMerchantLabel = (mid) => merchantMap[mid] || mid;

  return {
    id,
    navigate,
    staff,
    loading,
    getMerchantLabel,
  };
};
