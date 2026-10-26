import React from 'react';
export const Card = ({ children, hoverable = false, bordered = true, className = '', ...props }) => {
    return (<div className={`bg-white text-zinc-900 rounded-2xl ${bordered ? 'border border-zinc-200/90' : ''} ${hoverable ? 'shadow-soft hover:shadow-soft-lg hover:border-zinc-300 transition-all duration-200' : 'shadow-soft'} ${className}`} {...props}>
      {children}
    </div>);
};
