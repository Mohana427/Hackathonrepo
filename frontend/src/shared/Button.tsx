import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-slate-800 to-slate-900 text-white border border-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-lg hover:shadow-blue-500/20",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 border border-slate-300",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-red-500/20",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200",
  };

  // Special handling for dark theme pages
  const darkVariants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border border-blue-400/30 hover:from-blue-500 hover:to-indigo-600 shadow-lg hover:shadow-blue-500/40",
    secondary: "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-lg hover:shadow-red-500/40",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border border-transparent",
  };

  // We can use a data attribute or a context to decide which palette to use. 
  // For now, we'll prioritize the 'dark' look as requested by the user.
  const selectedVariant = darkVariants[variant];

  return (
    <button 
      className={`${baseStyles} ${selectedVariant} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
