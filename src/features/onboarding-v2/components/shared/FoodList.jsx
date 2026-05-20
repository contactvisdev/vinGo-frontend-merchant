import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/ui/Button/Button";

export default function FoodList({ menuData }) {
  const navigate = useNavigate();

  const foodItems = menuData?.list?.length
    ? menuData.list.map((item, index) => ({
        id: index + 1,
        name: item.name,
        description: item.description,
        category: item.catalogName,
        price: `$${item.basePrice.toFixed(2)}`,
      }))
    : [];

  return (
    <>
      {/* Header */}
      <div>
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700 pb-2 border-b border-gray-200">
          <div className="col-span-4">Food & Beverages</div>
          <div className="col-span-3 text-center">Category</div>
          <div className="col-span-2 text-right">Price</div>
        </div>
      </div>

      {/* Food Items */}
      <div>
        {foodItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 py-2 border-b border-gray-100"
          >
            <div className="col-span-4">{item.name}</div>
            <div className="col-span-3 text-center">{item.category}</div>
            <div className="col-span-2 text-right">{item.price}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {foodItems.length >= 5 && (
        <div className="mt-6 text-center">
          <CustomButton
            variant="line"
            label={`View All ${foodItems.length} Products`}
            onClick={() => navigate("/view-items")}
            fullWidth={false}
            className="border-none! text-primary-600! hover:text-primary-700!"
          />
        </div>
      )}
    </>
  );
}
