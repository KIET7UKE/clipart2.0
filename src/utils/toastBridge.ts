type ToastType = 'success' | 'error' | 'info';

type ToastFunction = (message: string, type?: ToastType) => void;

let toastRef: ToastFunction = () => {
  console.warn('Toast called before ToastProvider initialized');
};

export const setToastRef = (ref: ToastFunction) => {
  toastRef = ref;
};

export const showToast = (message: string, type: ToastType = 'success') => {
  toastRef(message, type);
};
