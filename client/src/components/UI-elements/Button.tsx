import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'success' | 'danger';
}

const Button = ({ children, variant = 'default', className, ...props }: ButtonProps) => {
  const baseStyle = 'px-6  py-3 rounded-xl font-medium transition-colors duration-200 backdrop-blur-md border border-white/20';
  const variants = {
    default: 'bg-white/10 hover:bg-white/20 text-white ',
    success: 'bg-green-600 hover:bg-green-500 text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
  };

  return (
    <button {...props} className={clsx(baseStyle, variants[variant], className)}>
      {children}
    </button>
  );
};

export default Button;