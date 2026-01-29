import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Provider>
  </StrictMode>,
);

// REMOVE INITIAL HTML LOADER AFTER REACT LOADS
const loader = document.getElementById("initial-loader");
if (loader) {
  loader.remove();
}
