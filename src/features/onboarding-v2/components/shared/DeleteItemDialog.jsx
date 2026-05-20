import { Dialog } from 'primereact/dialog';
import CustomButton from '@/components/ui/Button/Button';

const DeleteItemDialog = ({ visible, onHide, onConfirm, item }) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Delete Item"
      modal
      className="w-[400px]"
      footer={
        <div className="flex gap-3 justify-end mt-2">
          <CustomButton
            variant="primary"
            label="Cancel"
            className="bg-gray-400! w-[120px]!"
            onClick={onHide}
          />
          <CustomButton
            variant="primary"
            label="Delete"
            className="bg-red-600! w-[120px]!"
            onClick={onConfirm}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-gray-700">
          Are you sure you want to delete this item?
        </p>
        {item && (
          <p className="text-sm text-gray-500">
            <strong>Item:</strong> {item.name}
          </p>
        )}
        <p className="text-sm text-red-600">
          This action cannot be undone.
        </p>
      </div>
    </Dialog>
  );
};

export default DeleteItemDialog;
