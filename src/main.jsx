import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import ToastContainer from "@/components/ui/Toast/ToastContainer";
import { PrimeReactProvider } from "primereact/api";

// (function () {
//   if (localStorage.getItem("theme") === "dark") {
//     document.documentElement.classList.add("dark");
//   }
// })();

const primeReactConfig = {
  ripple: false,
  cssTransition: true,
  inputStyle: "outlined",
  autoZIndex: true,
  zIndex: {
    modal: 1100,
    overlay: 1000,
    menu: 1000,
    tooltip: 1100,
    toast: 1200,
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <PrimeReactProvider value={primeReactConfig}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </PrimeReactProvider>,
);
