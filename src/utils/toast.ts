import { toast as sonnerToast } from 'sonner';

type ToastOptions = Parameters<typeof sonnerToast>[1];

// Wrapper functions that add data-testid attributes to toasts through class names
// Since we can't directly add data-testid attributes to the toast objects (due to TypeScript constraints),
// we'll use CSS classes that can be targeted in tests
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      ...options,
      className: `${options?.className || ''} toast-type-success`,
    });
  },
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      ...options,
      className: `${options?.className || ''} toast-type-error`,
    });
  },
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      ...options,
      className: `${options?.className || ''} toast-type-info`,
    });
  },
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      ...options,
      className: `${options?.className || ''} toast-type-warning`,
    });
  },
  // Add any other toast methods you need
};

// Export the original toast for cases where you need the original functionality
export const originalToast = sonnerToast; 