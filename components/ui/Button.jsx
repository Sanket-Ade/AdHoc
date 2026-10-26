import React from 'react';
import { Loader2 } from 'lucide-react';
export const Button = ({ children, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, className = '', disabled, ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';
    const sizeStyles = {
        sm: 'text-xs px-3 py-1.5 gap-1.5',
        md: 'text-sm px-4 py-2.5 gap-2',
        lg: 'text-base px-6 py-3.5 gap-2.5',
    };
    const variantStyles = {
        primary: 'bg-yellow-300 hover:bg-yellow-400 text-zinc-950 font-semibold shadow-xs border border-yellow-400/80',
        secondary: 'bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 shadow-xs hover:border-zinc-300',
        outline: 'bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300',
        ghost: 'bg-transparent hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900',
        soft: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border border-yellow-200/80',
        danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200',
    };
    return (<button className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? (<Loader2 className="w-4 h-4 animate-spin text-current"/>) : (leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>)}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>);
};
