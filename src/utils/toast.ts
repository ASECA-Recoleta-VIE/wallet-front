import toast from 'react-hot-toast';

export const showSuccessToast = (message: string): void => {
  toast.success(message, {
    id: message,
  });
};

export const showErrorToast = (message: string): void => {
  toast.error(message, {
    id: message,
  });
};

export const showLoadingToast = (message: string): string => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string): void => {
  toast.dismiss(toastId);
}; 