import { clsx } from 'clsx';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  weight?: 'base' | 'bold';
}

const variants = {
  primary: 'text-white bg-primary whitespace-nowrap py-10px px-7',
  secondary: 'text-white bg-black whitespace-nowrap py-10px px-7',
};

const weights = {
  base: 'font-normal',
  bold: 'font-bold',
};

const Button = ({
  label,
  variant = 'primary',
  weight = 'base',
}: ButtonProps) => {
  const styles = clsx(variants[variant], weights[weight]);
  return <button className={styles}>{label}</button>;
};

export default Button;
