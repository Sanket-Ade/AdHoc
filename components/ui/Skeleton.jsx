import React from 'react';
export const Skeleton = ({ className = '' }) => {
    return (<div className={`animate-pulse bg-zinc-200/80 rounded-lg ${className}`}/>);
};
export const ProductionHouseCardSkeleton = () => {
    return (<div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-4 shadow-xs">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-xl shrink-0"/>
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4 rounded"/>
          <Skeleton className="h-3.5 w-1/2 rounded"/>
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded"/>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full"/>
        <Skeleton className="h-6 w-24 rounded-full"/>
        <Skeleton className="h-6 w-16 rounded-full"/>
      </div>
      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded"/>
        <Skeleton className="h-9 w-28 rounded-xl"/>
      </div>
    </div>);
};
