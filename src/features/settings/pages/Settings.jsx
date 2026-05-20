import RestaurantProfile from "../components/RestaurantProfile/RestaurantProfile";
import { TabView, TabPanel } from "primereact/tabview";
import OperatingHours from "../components/OperatingHours/OperatingHours";
// import Wallet from "../components/Wallet/Wallet";
import { useCategory } from "@hooks/api";

export default function Settings() {
  const { categoryConfig } = useCategory();
  const profileLabel = `${categoryConfig?.displayName || "Restaurant"} Profile`;

  return (
    <>
      <div className="p-5 bg-white shadow-md rounded-md">
        <TabView className="custom_tabs">
          <TabPanel header={profileLabel}>
            <RestaurantProfile />
          </TabPanel>
          <TabPanel header="Operating Hours">
            <OperatingHours />
          </TabPanel>
          {/* <TabPanel header="Wallet & Payouts">
            <Wallet />
          </TabPanel> */}
        </TabView>
      </div>
    </>
  );
}
