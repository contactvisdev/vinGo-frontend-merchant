import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trash, Users } from "lucide-react";
import IconButton from "@/components/ui/Button/IconButton";
import { Table } from "@/components/ui/Table";
import CustomButton from "@/components/ui/Button/Button";
import { DeleteStaffConfirm } from "@features/businessStaff/components";
import { STAFF_TABLE_COLUMNS } from "@/helpers/constants/staffConstants";
import usePermission from "@/hooks/usePermission";
import { useStaffList, useStaffDelete } from "../hooks";
import PencilIcon from "@/assets/icons/pencil.svg";
import EyeIcon from "@/assets/icons/eye.svg";
import SkeletonImage from "@/components/ui/SkeletonImage";

export default function StaffList() {
  const navigate = useNavigate();

  const {
    staffList,
    pagination,
    loading,
    hasPagination,
  } = useStaffList();

  const { deleteStaff, deleteLoading, setDeleteStaff, handleDeleteConfirm } =
    useStaffDelete();

  const hasPermission = usePermission();
  const canViewDetails = hasPermission("staff", "canViewDetails");
  const canCreateStaff = hasPermission("staff", "canCreate");
  const canEditStaff = hasPermission("staff", "canEdit");
  const canDeleteStaff = hasPermission("staff", "canDelete");

  const renderRow = useCallback(
    (staff, index) => {
      const roles = staff.roles || [];
      const roleStr = roles.map((r) => r.role || r).join(", ") || "—";

      return (
        <tr key={staff._id || index} className="border-b border-gray-200">
          <td className="p-2 sm:p-3 font-medium">{staff.name || "—"}</td>
          <td className="p-2 sm:p-3 text-gray-600">{staff.email || "—"}</td>
          <td className="p-2 sm:p-3 text-gray-600">{staff.phone || "—"}</td>
          <td className="p-2 sm:p-3">{roleStr}</td>
          <td className="p-2 sm:p-3">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(`/staff/${staff._id}`)} className="cursor-pointer mr-1">
                <SkeletonImage src={EyeIcon} className="w-5 h-5" alt="Eye Icon" />
              </button>
              <button onClick={() => navigate(`/staff/${staff._id}/edit`)} className="cursor-pointer">
                <SkeletonImage src={PencilIcon} className="w-4 h-4" alt="Pencil Icon" />
              </button>
              <IconButton
                icon={Trash}
                onClick={() => setDeleteStaff(staff)}
                ariaLabel="Delete"
                variant="danger"
                className="cursor-pointer hover:bg-red-50 text-red-500"
                disabled={!canDeleteStaff}
              />
            </div>
          </td>
        </tr>
      );
    },
    [navigate, setDeleteStaff, canDeleteStaff],
  );

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-md p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="text-xl font-semibold">Staff Management</div>
          <div className="flex items-center gap-3 flex-1 min-w-55" />
          <CustomButton
            label="Add Staff"
            aria-disabled={!canCreateStaff}
            onClick={() => navigate("/staff/new")}
            disabled={loading || !canCreateStaff}
          />
        </div>

      <Table
        columns={STAFF_TABLE_COLUMNS}
        data={staffList}
        loading={loading}
        skeletonRows={5}
        emptyMessage="No staff members found"
        emptyIcon={Users}
        className="h-full"
        pagination={
          hasPagination
            ? {
                currentPage: pagination.currentPage || 1,
                totalPages: pagination.totalPages || 1,
                totalItems: pagination.totalItems || 0,
                limit: pagination.limit || 10,
              }
            : null
        }
        renderRow={renderRow}
      />

      {deleteStaff && (
        <DeleteStaffConfirm
          staffName={deleteStaff.name || "this staff member"}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteStaff(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
