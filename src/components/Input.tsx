import Search from '@/assets/icons/search';
import clsx from 'clsx';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps {
  placeholder?: string;
  register?: UseFormRegisterReturn;
  isSearch?: boolean;
  variant?: 'outlined' | 'filled';
  error?: Boolean;
  errorText?: string;
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
  variant = 'outlined',
  error,
  errorText,
}: InputProps) => {
  const styles = clsx(variants[variant], error && 'border-red');
  return (
    <div className="relative flex">
      {isSearch && <Search className="absolute right-3 top-2.5" />}
      <div>
        <input className={styles} placeholder={placeholder} {...register} />
        {error && <p className="absolute text-sm text-red">{errorText}</p>}
      </div>
    </div>
  );
};

export default Input;
