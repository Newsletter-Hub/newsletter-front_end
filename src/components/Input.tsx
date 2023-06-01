import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import clsx from 'clsx';

import EyeOffIcon from '@/assets/icons/eyeOffIcon';
import EyeOnIcon from '@/assets/icons/eyeOn';
import Search from '@/assets/icons/search';

interface InputProps {
  placeholder?: string;
  register?: UseFormRegisterReturn;
  isSearch?: boolean;
  isPassword?: boolean;
  variant?: 'outlined' | 'filled';
  error?: boolean;
  errorText?: string;
  customStyles?: string;
  type?: 'input' | 'number';
  maxLength?: number;
  checkNumberOfSymbols?: boolean;
  label?: string;
  wrapperStyles?: string;
  iconStyles?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  disabled?: boolean;
}

const variants = {
  outlined:
    'bg-porcelain outline-none rounded-lg h-9 w-72 pl-2 pr-8 font-body text-sm border border-porcelain',
  filled:
    'border-b-2 outline-none border-grey w-96 text-base pb-2 pl-2 text-lightBlack placeholder:text-dark-grey disabled:text-dark-blue disabled:bg-light-porcelain',
};

const Input = ({
  placeholder,
  register,
  isSearch = false,
  isPassword = false,
  variant = 'outlined',
  error,
  errorText,
  customStyles,
  type = 'input',
  maxLength,
  checkNumberOfSymbols,
  label,
  wrapperStyles,
  iconStyles,
  disabled,
  onChange,
  defaultValue,
}: InputProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const handleShowPassword = () => setIsShowPassword(!isShowPassword);
  const styles = clsx(
    variants[variant],
    error && 'border-red',
    customStyles,
    'font-inter'
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
        <input
          disabled={disabled}
          className={styles}
          placeholder={placeholder}
          {...register}
          type={isPassword ? (isShowPassword ? 'text' : 'password') : type}
          maxLength={maxLength}
          value={value}
          onChange={e => {
            setValue(e.target.value);
            if (onChange) {
              onChange(e);
            }
          }}
        />
        {isSearch && (
          <Search
            className={`absolute right-3 top-1.5 ${iconStyles && iconStyles}`}
          />
        )}
        {checkNumberOfSymbols && maxLength && (
          <span className="absolute text-xs -bottom-6 left-2 text-light-grey font-inter">
            {value.length}/{maxLength}
          </span>
        )}
        {isPassword &&
          (isShowPassword ? (
            <EyeOnIcon
              className="absolute right-3 top-1.5 cursor-pointer"
              onClick={handleShowPassword}
            />
          ) : (
            <EyeOffIcon
              className="absolute right-3 top-1.5 cursor-pointer"
              onClick={handleShowPassword}
            />
          ))}
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

export default Input;
