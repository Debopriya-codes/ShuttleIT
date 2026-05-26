import React from 'react';
import styles from './Input.module.css';

const Input = ({
  label,
  placeholder = ' ', // Required for floating label trick
  type = 'text',
  value,
  onChange,
  icon,
  error,
  disabled = false
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {icon && <div className={styles.iconSlot}>{icon}</div>}
        <input
          className={`${styles.input} ${icon ? styles.hasIcon : ''} ${error ? styles.hasError : ''}`}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
        />
        {label && (
          <label className={`${styles.label} ${icon ? styles.hasIcon : ''}`}>
            {label}
          </label>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;
