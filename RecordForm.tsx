
import React, { useState } from 'react';
import { DrinkRecord, IceLevel, SweetnessLevel } from '../types';
import { ICE_LEVELS, SWEETNESS_LEVELS } from '../constants';

interface RecordFormProps {
  onSave: (record: Omit<DrinkRecord, 'id' | 'date'>) => void;
  onCancel: () => void;
  existingCount: number;
  availableShops: string[];
}

const RecordForm: React.FC<RecordFormProps> = ({ onSave, onCancel, existingCount, availableShops }) => {
  const [shop, setShop] = useState('');
  const [item, setItem] = useState('');
  const [ice, setIce] = useState<IceLevel>('微冰');
  const [sweetness, setSweetness] = useState<SweetnessLevel>('三分糖');
  const [priceStr, setPriceStr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop || !item) return;

    if (existingCount === 0 && sweetness !== '無糖') {
      alert('別再喝了！！減肥減肥減肥！！！😤');
    }

    onSave({ 
      shop, 
      item, 
      ice, 
      sweetness, 
      price: Number(priceStr) || 0 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 bg-white p-12 rounded-[3.5rem] card-shadow border border-stone-100 overflow-hidden max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between">
         <h3 className="text-stone-500 font-bold tracking-[0.25em] text-[11px] uppercase">Store / 店名</h3>
         {existingCount > 0 && <span className="text-[10px] bg-stone-200 text-stone-600 px-4 py-1.5 rounded-full font-bold tracking-widest uppercase">Dose 2 🩵</span>}
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <input
            list="shop-options"
            type="text"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            className="w-full bg-stone-50/80 p-6 rounded-2xl outline-none text-stone-700 placeholder:text-stone-300 border border-transparent focus:border-stone-200 transition-all text-lg"
            placeholder="點選或輸入店名..."
          />
          <datalist id="shop-options">
            {availableShops.map(s => (
              <option key={s} value={s} />
            ))}
          </datalist>
          {/* Show all available shops as quick-select buttons */}
          <div className="mt-4 flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
            {availableShops.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setShop(s)}
                className={`px-5 py-2 text-[10px] rounded-full border transition-all font-bold tracking-wider ${
                  shop === s 
                  ? 'bg-stone-500 text-white border-stone-500 shadow-sm' 
                  : 'bg-stone-50 text-stone-400 border-stone-100 hover:border-stone-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <h3 className="text-stone-500 font-bold tracking-[0.25em] text-[11px] uppercase">Item / 品項</h3>
      <input
        type="text"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        className="w-full bg-stone-50/80 p-6 rounded-2xl outline-none text-stone-700 placeholder:text-stone-300 border border-transparent focus:border-stone-200 transition-all text-lg"
        placeholder="藥方品項..."
      />

      <div className="space-y-5">
        <h3 className="text-stone-500 font-bold tracking-[0.25em] text-[11px] uppercase">Sugar / 甜度</h3>
        <div className="flex flex-wrap gap-4">
          {SWEETNESS_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSweetness(level)}
              className={`px-8 py-3 text-xs rounded-full border transition-all font-bold tracking-[0.1em] ${
                sweetness === level 
                ? 'bg-stone-600 text-white border-stone-600 shadow-md' 
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-stone-500 font-bold tracking-[0.25em] text-[11px] uppercase">Ice / 冰量</h3>
        <div className="flex flex-wrap gap-4">
          {ICE_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setIce(level)}
              className={`px-8 py-3 text-xs rounded-full border transition-all font-bold tracking-[0.1em] ${
                ice === level 
                ? 'bg-stone-600 text-white border-stone-600 shadow-md' 
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-stone-100/50 p-10 rounded-[3rem] flex justify-between items-center mt-6">
        <div>
           <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] mb-1">Medical Fee</p>
           <p className="text-base font-bold text-stone-600">診察費</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-stone-400 font-black text-2xl">$</span>
          <input
            type="number"
            value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)}
            className="w-28 bg-transparent text-right text-5xl font-black text-stone-700 outline-none placeholder:text-stone-200"
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4 pt-8">
        <button
          type="submit"
          className="w-full py-8 px-8 bg-stone-700 text-white rounded-[2.2rem] font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-stone-200 hover:bg-stone-800 transition-all active:scale-95 leading-none"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-5 text-stone-400 font-bold text-xs uppercase tracking-[0.4em] hover:text-stone-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RecordForm;
