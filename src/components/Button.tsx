import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[var(--teal)] dark:bg-[var(--turquoise)] text-white hover:bg-[var(--teal-dark)] dark:hover:bg-[var(--turquoise-dark)] active:scale-95 shadow-lg hover:shadow-xl',
    secondary: 'bg-[var(--turquoise)] dark:bg-[var(--teal)] text-white hover:bg-[var(--turquoise-dark)] dark:hover:bg-[var(--teal-dark)] active:scale-95 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-[var(--teal)] dark:border-[var(--turquoise)] text-[var(--teal)] dark:text-[var(--turquoise)] hover:!bg-[var(--teal)] hover:!text-white dark:hover:!bg-[var(--turquoise)] dark:hover:!text-[var(--dark-page)]',
    ghost: 'text-[var(--teal)] dark:text-[var(--turquoise)] hover:bg-[var(--sand)] dark:hover:bg-[var(--dark-muted)]'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
