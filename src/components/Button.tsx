import { clsx } from 'clsx';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  weight?: 'base' | 'bold';
  fontSize?: 'base' | 'small' | 'md';
  size?: 'base' | 'md' | 'full';
  rounded?: boolean;
  uppercase?: boolean;
  bold?: boolean;
}

const variants = {
  primary: 'text-white bg-primary whitespace-nowrap py-10px px-7',
  secondary: 'text-white bg-black whitespace-nowrap py-10px px-7',
};

const weights = {
  base: 'font-normal',
  bold: 'font-bold',
};

const fontSizes = {
  base: 'text-lg',
  small: 'text-2xs',
  md: 'text-base',
};

const sizes = {
  base: 'w-fit',
  md: 'w-80',
  full: 'w-full',
};

const Button = ({
  label,
  variant = 'primary',
  weight = 'base',
  rounded = false,
  uppercase = false,
  bold = false,
  fontSize = 'base',
  size = 'base',
}: ButtonProps) => {
  const styles = clsx(
    variants[variant],
    weights[weight],
    fontSizes[fontSize],
    rounded && 'rounded',
    uppercase && 'uppercase',
    bold && 'font-bold',
    sizes[size]
  );
  return <button className={styles}>{label}</button>;
};

export default Button;
