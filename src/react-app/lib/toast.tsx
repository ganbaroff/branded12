import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      duration: 4000,
      style: {
        background: '#1a1a1a',
        border: '1px solid #FF4D00',
        color: '#fff',
      },
    });
  },
  
  error: (message: string) => {
    sonnerToast.error(message, {
      duration: 5000,
      style: {
        background: '#1a1a1a',
        border: '1px solid #ef4444',
        color: '#fff',
      },
    });
  },
  
  loading: (message: string) => {
    return sonnerToast.loading(message, {
      style: {
        background: '#1a1a1a',
        border: '1px solid #4b5563',
        color: '#fff',
      },
    });
  },

  dismiss: (id: string | number) => {
    sonnerToast.dismiss(id);
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      style: {
        background: '#1a1a1a',
        border: '1px solid #FF4D00',
        color: '#fff',
      },
    });
  },
};
