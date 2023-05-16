import React from 'react';

import { clsx } from 'clsx';

import GoogleIcon from '@/assets/icons/google';

interface ButtonProps {
  label: string | JSX.Element;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outlined'
    | 'outlined-primary'
    | 'outlined-secondary'
    | 'porcelain';
  weight?: 'base' | 'bold';
  fontSize?: 'base' | 'xs' | 'md' | 'sm';
  size?: 'base' | 'md' | 'full';
  rounded?: 'none' | 'md' | 'lg' | 'xl';
  uppercase?: boolean;
  bold?: boolean;
  disabled?: boolean;
  socialMedia?: 'google' | 'none';
  customStyles?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
  height?: 'sm' | 'base';
}

const variants = {
  primary:
    'text-white bg-primary whitespace-nowrap py-10px px-7 flex justify-center items-center',
  secondary: 'text-white bg-black whitespace-nowrap py-10px px-7',
  outlined:
    'border-[1.5px] border-lightBlack py-5 px-16 rounded-[36px] flex justify-center items-center text-lightBlack',
  'outlined-primary':
    'text-primary border-[1.5px] flex justify-center items-center whitespace-nowrap py-3 px-8 rounded-full text-base',
  'outlined-secondary':
    'border-[1.5px] flex justify-center items-center px-3 rounded-full text-dark-grey border-light-grey',
  porcelain: 'bg-porcelain flex justify-center items-center text-lightBlack',
};

const weights = {
  base: 'font-normal',
  bold: 'font-bold',
};

const fontSizes = {
  base: 'text-lg',
  xs: 'text-2xs',
  md: 'text-base',
  sm: 'text-sm',
};

const sizes = {
  base: 'w-fit',
  md: 'w-80',
  full: 'w-full',
};

const socialMedias = {
  google: '!bg-lightBlack',
  none: '',
};

const heightVariants = {
  sm: 'h-10 !py-2 !px-4',
  base: 'h-12',
};

const Button = ({
  label,
  variant = 'primary',
  weight = 'base',
  rounded = 'none',
  uppercase = false,
  bold = false,
  fontSize = 'base',
  size = 'base',
  disabled,
  socialMedia = 'none',
  customStyles,
  type,
  selected,
  onClick,
  height = 'base',
}: ButtonProps) => {
  const styles = clsx(
    variants[variant],
    weights[weight],
    fontSizes[fontSize],
    (rounded === 'md' && 'rounded') ||
      (rounded === 'xl' && 'rounded-full') ||
      (rounded === 'lg' && `rounded-${rounded}`),
    uppercase && 'uppercase',
    bold && 'font-bold',
    sizes[size],
    variant === 'primary' && disabled && '!text-white !bg-light-grey',
    socialMedias[socialMedia],
    customStyles,
    !selected &&
      selected !== undefined &&
      '!bg-light-porcelain !text-dark-grey',
    '!font-inter',
    heightVariants[height]
  );
  return (
    <button
      className={styles}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {socialMedia !== 'none' ? (
        <span className="flex justify-center items-center gap-3 py-1">
          <GoogleIcon /> {label}
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;
