import { toast } from 'react-toastify';
import styles from './styles.module.scss';

interface ToastProps {
  type: 'success' | 'info' | 'error' | 'warning';
  message: string;
}

export const toastStyle: React.CSSProperties = {
  backgroundColor: '#202124',
};

export default function Toast({ type, message }: ToastProps) {
  return toast[type](
    <div className={styles.Container}>
      <div>{message}</div>
    </div>,
  );
}
