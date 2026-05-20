import { useMenuContext } from "../../hooks";
import RestaurantMenuForm from "./RestaurantMenuForm";
import GroceryMenuForm from "./GroceryMenuForm";
import PharmacyMenuForm from "./PharmacyMenuForm";
import LiquorMenuForm from "./LiquorMenuForm";

export default function MenuForm(props) {
  const { itemType } = useMenuContext();
  if (itemType?.includes("grocery")) return <GroceryMenuForm {...props} />;
  if (itemType?.includes("pharmacy")) return <PharmacyMenuForm {...props} />;
  if (itemType?.includes("liquor")) return <LiquorMenuForm {...props} />;
  return <RestaurantMenuForm {...props} />;
}
