import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx';

import Search from '@/assets/icons/search';
import EyeIcon from '@/assets/icons/eye';

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
}

const variants = {
  outlined:
    'bg-input-grey border-0 outline-none rounded-lg h-9 w-72 pl-2 pr-8 font-body text-sm',
  filled: 'border-b-2 outline-none border-gull-grey w-96 text-lg pb-3 pl-2',
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
}: InputProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const handleShowPassword = () => setIsShowPassword(!isShowPassword);
  const styles = clsx(variants[variant], error && 'border-red', customStyles);
  return (
    <div className="relative flex">
      {isSearch && <Search className="absolute right-3 top-2.5" />}
      <input
        className={styles}
        placeholder={placeholder}
        {...register}
        type={isPassword ? (isShowPassword ? 'text' : 'password') : type}
      />
      {isPassword && (
        <EyeIcon
          className="absolute right-3 top-2.5 stroke-gull-grey cursor-pointer"
          onClick={handleShowPassword}
        />
      )}
      {error && (
        <p className="absolute text-sm text-red -bottom-5">{errorText}</p>
      )}
    </div>
  );
};

export default Input;
