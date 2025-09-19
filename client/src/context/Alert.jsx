import { createContext, useContext } from "react";
import Swal from "sweetalert2";

// Opret Context
const AlertContext = createContext();

// Custom Hook for at bruge AlertContext
export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const showAlert = (options) => {
    Swal.fire(options);
  };

  const showSuccess = (title, text) => {
    Swal.fire({
      title: title || "Success!",
      text: text,
      icon: "success",
      confirmButtonText: "OK",

      timerProgressBar: true,
      customClass: {
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
        title: "custom-title",
        content: "custom-content",
      },
    });
  };

  const showError = (title, text) => {
    Swal.fire({
      title: title || "Fejl!",
      text: text,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
        title: "custom-title",
        content: "custom-content",
      },
    });
  };

  const showConfirmation = (title, text, onConfirm, onCancel, htmlContent) => {
    Swal.fire({
      title: title || "Er du sikker?",
      text: text || "Du kan ikke fortryde denne handling!",
      html: htmlContent,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ja, fortsæt",
      cancelButtonText: "Annuller",
      customClass: {
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
        title: "custom-title",
        content: "custom-content",
        htmlContent: "custom-content-html",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm?.();
      }
    });
  };

  return (
    <AlertContext.Provider
      value={{ showAlert, showSuccess, showError, showConfirmation }}>
      {children}
    </AlertContext.Provider>
  );
};
