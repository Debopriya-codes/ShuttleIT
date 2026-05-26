import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

const Button = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  fullWidth = false,
  icon,
  type = 'button'
}) => {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : ''
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes} 
      onClick={onClick} 
      disabled={disabled || loading}
      type={type}
    >
      {loading ? (
        <Loader2 className={`${styles.icon} animate-pulse`} size={18} />
      ) : icon ? (
        <span className={styles.icon}>{icon}</span>
      ) : null}
      {label}
    </button>
  );
};

export default Button;
