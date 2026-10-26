import React from 'react';
import { Button } from './Button';
export const EmptyState = ({ icon: Icon, title, description, actionText, onAction, className = '', }) => {
    return (<div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-zinc-200 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-yellow-100/80 border border-yellow-300 text-yellow-950 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6"/>
      </div>
      <h3 className="text-sm font-bold text-zinc-900 mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (<Button variant="primary" size="sm" onClick={onAction} className="text-xs">
          {actionText}
        </Button>)}
    </div>);
};
