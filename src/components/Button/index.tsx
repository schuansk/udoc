import { ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';

export function Button({
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={styles.button} {...rest}>
      {children}
    </button>
  );
}
