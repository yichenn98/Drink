
export type IceLevel = '固定' | '微冰' | '去冰' | '溫熱';
export type SweetnessLevel = '固定' | '半糖' | '三分糖' | '二分糖' | '一分糖' | '無糖';

export interface DrinkRecord {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  shop: string;
  item: string;
  ice: IceLevel;
  sweetness: SweetnessLevel;
  price: number;
}
