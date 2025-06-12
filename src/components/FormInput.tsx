import React, { useState, useEffect } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showError?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  showError = false,
  onValidationChange,
  required,
  type = 'text',
  className = '',
  ...props
}) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (showError && required && !props.value) {
      setIsValid(false);
      setErrorMessage(`${label} is required`);
    } else if (showError && type === 'email' && props.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(props.value as string)) {
        setIsValid(false);
        setErrorMessage('Please enter a valid email address');
      } else {
        setIsValid(true);
        setErrorMessage('');
      }
    } else if (showError && type === 'number' && props.value) {
      const num = Number(props.value);
      if (isNaN(num) || num < 0.01) {
        setIsValid(false);
        setErrorMessage('Please enter a valid amount');
      } else {
        setIsValid(true);
        setErrorMessage('');
      }
    } else {
      setIsValid(true);
      setErrorMessage('');
    }
  }, [showError, props.value, label, required, type]);

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  return (
    <div className="mb-4">
      <label htmlFor={props.id} className="block text-gray-700 mb-1 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          !isValid ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...Object.fromEntries(Object.entries(props).filter(([key]) => key !== 'min'))}
      />
      {showError && (error || !isValid) && (
        <p className="mt-1 text-sm text-red-500">{error || errorMessage}</p>
      )}
    </div>
  );
};

export default FormInput; 