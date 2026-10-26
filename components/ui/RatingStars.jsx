import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating, reviewCount, showText = true, size = 'md', className = '', }) => {
    const starSizes = {
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };
    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };
    return (<div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
            const isFilled = starIndex <= Math.round(rating);
            return (<Star key={starIndex} className={`${starSizes[size]} ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 fill-zinc-100'}`}/>);
        })}
      </div>
      {showText && (<span className={`font-semibold text-zinc-900 ${textSizes[size]}`}>
          {rating.toFixed(1)}
          {reviewCount !== undefined && (<span className="font-normal text-zinc-500 ml-1">({reviewCount})</span>)}
        </span>)}
    </div>);
};
