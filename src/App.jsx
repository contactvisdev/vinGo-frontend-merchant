import { RouterProvider } from "react-router-dom";
import { router } from "@/router/router";
import StaffProfileRefresher from "@/components/StaffProfileRefresher";

export default function App() {
  return (
    <>
      <StaffProfileRefresher />
      <RouterProvider router={router} />
    </>
  );
}