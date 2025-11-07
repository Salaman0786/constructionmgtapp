import { toast } from "react-toastify";

export const showSuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    position: "top-right",
  });
};

export const showInfo = (message: string) => {
  toast.info(message, {
    position: "top-right",
  });
};
