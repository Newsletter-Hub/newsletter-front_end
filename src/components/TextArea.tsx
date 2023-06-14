import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import clsx from 'clsx';

interface TextAreaProps {
  placeholder?: string;
  register?: UseFormRegisterReturn;
  variant?: 'outlined' | 'filled';
  error?: boolean;
  errorText?: string;
  customStyles?: string;
  maxLength?: number;
  checkNumberOfSymbols?: boolean;
  label?: string;
  wrapperStyles?: string;
  iconStyles?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  defaultValue?: string;
  disabled?: boolean;
}

const variants = {
  outlined:
    'bg-porcelain border-0 outline-none rounded-lg h-9 w-72 pl-2 pr-8 font-body text-sm',
  filled:
    'border-b-2 outline-none border-grey w-96 text-base pb-2 pl-2 text-lightBlack placeholder:text-dark-grey disabled:text-dark-blue disabled:bg-light-porcelain',
};

const TextArea = ({
  placeholder,
  register,
  variant = 'outlined',
  error,
  errorText,
  customStyles,
  maxLength,
  checkNumberOfSymbols,
  label,
  wrapperStyles,
  disabled,
  onChange,
  defaultValue,
}: TextAreaProps) => {
  const styles = clsx(
    variants[variant],
    error && 'border-red',
    customStyles,
    'font-inter resize-none'
  );
  const wrapperFormattedStyles = clsx(wrapperStyles, 'flex flex-col');
  const [value, setValue] = useState(defaultValue || '');
  return (
    <div className={wrapperFormattedStyles}>
      {label && (
        <p className="font-inter font-semibold text-lightBlack text-xs mb-2 pl-2">
          {label}
        </p>
      )}
      <div className="relative flex">
        <textarea
          disabled={disabled}
          className={styles}
          placeholder={placeholder}
          {...register}
          maxLength={maxLength}
          value={value}
          onChange={e => {
            setValue(e.target.value);
            if (onChange) {
              onChange(e);
            }
          }}
        />
        {checkNumberOfSymbols && maxLength && (
          <span className="absolute text-xs -bottom-6 right-2 text-light-grey font-inter">
            {value.length}/{maxLength}
          </span>
        )}
        {error && (
          <p
            className={`absolute text-sm text-red ${
              checkNumberOfSymbols && maxLength ? '-bottom-10' : '-bottom-5'
            }`}
          >
            {errorText}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextArea;
