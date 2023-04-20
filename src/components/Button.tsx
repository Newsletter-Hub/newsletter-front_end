import { clsx } from 'clsx';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  weight?: 'base' | 'bold';
  fontSize?: 'base' | 'small';
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
};

const Button = ({
  label,
  variant = 'primary',
  weight = 'base',
  rounded = false,
  uppercase = false,
  bold = false,
  fontSize = 'base',
}: ButtonProps) => {
  const styles = clsx(
    variants[variant],
    weights[weight],
    fontSizes[fontSize],
    rounded && 'rounded',
    uppercase && 'uppercase',
    bold && 'font-bold'
  );
  return <button className={styles}>{label}</button>;
};

export default Button;
