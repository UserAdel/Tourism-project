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
    primary: 'bg-[var(--navy)] dark:bg-[var(--gold)] text-[var(--ivory)] dark:text-[#041B4A] hover:bg-[#031035] dark:hover:bg-[#B8963F] active:scale-95 shadow-lg hover:shadow-xl',
    secondary: 'bg-[var(--turquoise)] dark:bg-[var(--turquoise)] text-white hover:opacity-90 dark:hover:opacity-90 active:scale-95 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-[var(--navy)] dark:border-[var(--gold)] text-[var(--navy)] dark:text-[var(--gold)] hover:bg-[var(--navy)] dark:hover:bg-[var(--gold)] hover:text-[var(--ivory)] dark:hover:text-[#041B4A]',
    ghost: 'text-[var(--navy)] dark:text-[var(--gold)] hover:bg-[var(--sand)] dark:hover:bg-[#0B1E42]'
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
