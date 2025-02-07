import { useEffect } from 'react';
import './toast.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warn';
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, type = 'error', onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
};

export default Toast; 