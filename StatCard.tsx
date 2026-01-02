
import React from 'react';

interface StatCardProps {
  label: string;
  subLabel: string;
  value: string | number;
  unit: string;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, subLabel, value, unit, bgColor, textColor }) => {
  return (
    <div style={{ backgroundColor: bgColor }} className="p-8 rounded-[2.5rem] card-shadow flex flex-col justify-between aspect-[1.1/1] transition-all hover:scale-[1.05] hover:shadow-lg group">
      <div>
        <p className="text-[10px] font-black tracking-[0.25em] opacity-40 uppercase mb-1">{label}</p>
        <p className="text-base font-bold text-stone-600 opacity-90">{subLabel}</p>
      </div>
      <div className="flex items-baseline space-x-2 mt-auto">
        <span className={`text-4xl font-black tracking-tighter ${textColor}`}>{value}</span>
        <span className={`text-sm opacity-60 font-black ${textColor}`}>{unit}</span>
      </div>
    </div>
  );
};

export default StatCard;
