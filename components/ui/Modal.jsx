'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
export const Modal = ({ isOpen, onClose, title, description, children, maxWidth = 'lg', }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const maxWidthStyles = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl',
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" onClick={onClose}/>

      {/* Modal Dialog Box */}
      <div className={`relative w-full ${maxWidthStyles[maxWidth]} bg-white text-zinc-900 rounded-2xl shadow-xl border border-zinc-200 z-10 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
        {(title || description) && (<div className="px-6 pt-6 pb-4 border-b border-zinc-100 flex items-start justify-between">
            <div>
              {title && <h3 className="text-lg font-bold text-zinc-900">{title}</h3>}
              {description && (<p className="text-xs text-zinc-500 mt-1">{description}</p>)}
            </div>
            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer" aria-label="Close modal">
              <X className="w-5 h-5"/>
            </button>
          </div>)}

        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>);
};
