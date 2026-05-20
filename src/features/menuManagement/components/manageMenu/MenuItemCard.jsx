import RestaurantItemCard from "./RestaurantItemCard";
import GroceryItemCard from "./GroceryItemCard";
import PharmacyItemCard from "./PharmacyItemCard";
import LiquorItemCard from "./LiquorItemCard";

export default function MenuItemCard(props) {
  const isGrocery = props.item?.categoryName === "Grocery";
  const isPharmacy = props.item?.categoryName === "Pharmacy";
  const isLiquor = props.item?.categoryName === "Liquor";
  if (isGrocery) {
    return <GroceryItemCard {...props} />;
  }
  if (isPharmacy) {
    return <PharmacyItemCard {...props} />;
  }
  if (isLiquor) {
    return <LiquorItemCard {...props} />;
  }
  return <RestaurantItemCard {...props} />;
}

