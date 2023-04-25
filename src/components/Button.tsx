import React from 'react';
import { clsx } from 'clsx';
import TwitterIcon from '@/assets/icons/twitter';
import FacebookIcon from '@/assets/icons/facebook';
import GoogleIcon from '@/assets/icons/google';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outlined';
  weight?: 'base' | 'bold';
  fontSize?: 'base' | 'xs' | 'md' | 'sm';
  size?: 'base' | 'md' | 'full';
  rounded?: 'none' | 'md' | 'xl';
  uppercase?: boolean;
  bold?: boolean;
  disabled?: boolean;
  socialMedia?: 'twitter' | 'facebook' | 'google' | 'none';
  customStyles?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variants = {
  primary: 'text-white bg-primary whitespace-nowrap py-10px px-7',
  secondary: 'text-white bg-black whitespace-nowrap py-10px px-7',
  outlined: 'border-2 py-5 px-16 rounded-[36px]',
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
  twitter: '!bg-twitterBlue',
  facebook: '!bg-facebookBlue',
  google: '!bg-googleBlack',
  none: '',
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
    customStyles
  );
  const socialIcon =
    socialMedia === 'twitter' ? (
      <TwitterIcon />
    ) : socialMedia === 'facebook' ? (
      <FacebookIcon />
    ) : (
      <GoogleIcon />
    );
  return (
    <button className={styles} disabled={disabled} type={type}>
      {socialMedia !== 'none' ? (
        <span className="flex justify-center items-center gap-3 py-1">
          {socialIcon} {label}
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;
