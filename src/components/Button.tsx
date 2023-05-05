import React from 'react';

import { clsx } from 'clsx';

import GoogleIcon from '@/assets/icons/google';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outlined' | 'outlined-primary';
  weight?: 'base' | 'bold';
  fontSize?: 'base' | 'xs' | 'md' | 'sm';
  size?: 'base' | 'md' | 'full';
  rounded?: 'none' | 'md' | 'xl';
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
  primary: 'text-white bg-primary whitespace-nowrap py-10px px-7',
  secondary: 'text-white bg-black whitespace-nowrap py-10px px-7',
  outlined:
    'border-2 py-5 px-16 rounded-[36px] flex justify-center items-center',
  'outlined-primary':
    'text-primary border-[1.5px] flex justify-center items-center whitespace-nowrap py-3 px-8 rounded-full text-base',
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
  google: '!bg-googleBlack',
  none: '',
};

const heightVariants = {
  sm: 'h-10',
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
    (rounded === 'md' && 'rounded') || (rounded === 'xl' && 'rounded-full'),
    uppercase && 'uppercase',
    bold && 'font-bold',
    sizes[size],
    variant === 'primary' && disabled && '!text-grey !bg-mercury',
    socialMedias[socialMedia],
    customStyles,
    !selected && selected !== undefined && '!bg-mercury !text-grey',
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
