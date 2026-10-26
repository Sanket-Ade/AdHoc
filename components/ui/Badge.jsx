import React from 'react';
import { CheckCircle2, Star, Clock, AlertCircle } from 'lucide-react';
export const Badge = ({ children, variant = 'pastelYellow', size = 'md', icon, className = '', }) => {
    const sizeStyles = {
        sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
        md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    };
    const variantStyles = {
        yellow: 'bg-yellow-200/90 text-yellow-950 border border-yellow-300 font-semibold',
        pastelYellow: 'bg-yellow-50 text-amber-900 border border-yellow-200/90 font-medium',
        // Fallback aliases for smooth compatibility
        blue: 'bg-yellow-200/90 text-yellow-950 border border-yellow-300 font-semibold',
        lightBlue: 'bg-yellow-50 text-amber-900 border border-yellow-200/90 font-medium',
        verified: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium',
        warning: 'bg-amber-50 text-amber-800 border border-amber-200/80 font-medium',
        gray: 'bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium',
        danger: 'bg-rose-50 text-rose-700 border border-rose-200/80 font-medium',
    };
    return (<span className={`inline-flex items-center rounded-full transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>);
};
export const EnquiryStatusBadge = ({ status, className = '', }) => {
    switch (status) {
        case 'pending':
            return (<Badge variant="warning" icon={<Clock className="w-3 h-3 text-amber-600"/>} className={className}>
          Pending Review
        </Badge>);
        case 'under_review':
            return (<Badge variant="pastelYellow" icon={<Clock className="w-3 h-3 text-amber-700"/>} className={className}>
          Under Review
        </Badge>);
        case 'quoted':
            return (<Badge variant="yellow" icon={<Star className="w-3 h-3 text-amber-700"/>} className={className}>
          Quote Received
        </Badge>);
        case 'in_progress':
            return (<Badge variant="verified" icon={<CheckCircle2 className="w-3 h-3"/>} className={className}>
          In Production
        </Badge>);
        case 'completed':
            return (<Badge variant="success" icon={<CheckCircle2 className="w-3 h-3"/>} className={className}>
          Completed
        </Badge>);
        case 'declined':
            return (<Badge variant="danger" icon={<AlertCircle className="w-3 h-3"/>} className={className}>
          Declined
        </Badge>);
        default:
            return <Badge variant="gray">{status}</Badge>;
    }
};
