import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import { AppWrapper } from "./components/common/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { initConfig } from "./config";

async function bootstrap() {
  await initConfig();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <AppWrapper>
            <App />
            {/* Toast */}
          </AppWrapper>
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
}

bootstrap();
