import React from 'react';
export const Input = React.forwardRef(({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const autoId = React.useId();
    const generatedId = id || autoId;
    return (<div className="w-full flex flex-col gap-1.5 text-left">
        {label && (<label htmlFor={generatedId} className="text-xs font-semibold text-zinc-700 tracking-wide">
            {label}
          </label>)}
        <div className="relative flex items-center">
          {leftIcon && (<div className="absolute left-3.5 text-zinc-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>)}
          <input id={generatedId} ref={ref} className={`w-full bg-white text-zinc-900 placeholder-zinc-400 text-sm rounded-xl border transition-all duration-200 outline-none
              ${leftIcon ? 'pl-10' : 'pl-3.5'}
              ${rightIcon ? 'pr-10' : 'pr-3.5'}
              py-2.5
              ${error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
            : 'border-zinc-200 hover:border-zinc-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200'}
              ${className}
            `} {...props}/>
          {rightIcon && (<div className="absolute right-3.5 text-zinc-400 flex items-center">
              {rightIcon}
            </div>)}
        </div>
        {error && <p className="text-xs text-rose-600">{error}</p>}
        {helperText && !error && <p className="text-xs text-zinc-500">{helperText}</p>}
      </div>);
});
Input.displayName = 'Input';
