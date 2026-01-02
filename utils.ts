
import { DrinkRecord } from './types';

export const getFormattedDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to parse YYYY-MM-DD string into a local Date object safely
export const parseDateString = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const calculateStats = (records: DrinkRecord[], targetMonth?: number) => {
  const currentYear = 2026;
  const annualRecords = records.filter(r => {
    const d = parseDateString(r.date);
    return d.getFullYear() === currentYear;
  });
  
  const monthlyRecords = targetMonth !== undefined 
    ? annualRecords.filter(r => {
        const d = parseDateString(r.date);
        return d.getMonth() === targetMonth;
      })
    : [];

  return {
    annualCount: annualRecords.length,
    annualCost: annualRecords.reduce((sum, r) => sum + r.price, 0),
    monthlyCount: monthlyRecords.length,
    monthlyCost: monthlyRecords.reduce((sum, r) => sum + r.price, 0)
  };
};

export const getTopFrequency = (records: DrinkRecord[], key: 'shop' | 'item') => {
  const map = new Map<string, number>();
  records.forEach(r => {
    const val = r[key];
    if (val) map.set(val, (map.get(val) || 0) + 1);
  });
  
  let top = "尚無紀錄";
  let max = 0;
  map.forEach((count, name) => {
    if (count > max) {
      max = count;
      top = name;
    }
  });
  return { name: top, count: max };
};
