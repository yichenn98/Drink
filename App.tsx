
import React, { useState, useEffect, useMemo } from 'react';
import { DrinkRecord } from './types';
import { calculateStats, getFormattedDate, getTopFrequency, parseDateString } from './utils';
import StatCard from './components/StatCard';
import RecordForm from './components/RecordForm';

const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  )
};

const DEFAULT_SHOPS = ['50嵐', '一沐日', '五桐號', '迷客夏'];

const App: React.FC = () => {
  const [records, setRecords] = useState<DrinkRecord[]>(() => {
    const saved = localStorage.getItem('drink_records_2026');
    return saved ? JSON.parse(saved) : [];
  });

  const [shops, setShops] = useState<string[]>(() => {
    const saved = localStorage.getItem('drink_shops_2026');
    return saved ? JSON.parse(saved) : DEFAULT_SHOPS;
  });

  const [currentViewDate, setCurrentViewDate] = useState(new Date(2026, 0, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(getFormattedDate(new Date()));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [analyticsType, setAnalyticsType] = useState<'shop' | 'item' | null>(null);

  useEffect(() => {
    localStorage.setItem('drink_records_2026', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('drink_shops_2026', JSON.stringify(shops));
  }, [shops]);

  const stats = useMemo(() => calculateStats(records, currentViewDate.getMonth()), [records, currentViewDate]);
  const favoriteShop = useMemo(() => getTopFrequency(records, 'shop'), [records]);
  const favoriteItem = useMemo(() => getTopFrequency(records, 'item'), [records]);

  const allAnalyticsData = useMemo(() => {
    if (!analyticsType) return [];
    const map = new Map<string, number>();
    records.forEach(r => {
      const val = r[analyticsType];
      map.set(val, (map.get(val) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [records, analyticsType]);

  const monthLabel = `${currentViewDate.getFullYear()} / ${String(currentViewDate.getMonth() + 1).padStart(2, '0')}`;
  const firstDayOfMonth = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 0).getDate();

  const prevMonth = () => setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1));

  const addRecord = (newDrink: Omit<DrinkRecord, 'id' | 'date'>) => {
    if (!selectedDate) return;
    const record: DrinkRecord = { ...newDrink, id: crypto.randomUUID(), date: selectedDate };
    
    // Update shop list if new
    if (!shops.includes(newDrink.shop)) {
      setShops(prev => [...prev, newDrink.shop]);
    }
    
    setRecords(prev => [...prev, record]);
    setIsFormOpen(false);
  };

  const removeRecord = (id: string) => setRecords(prev => prev.filter(r => r.id !== id));
  const getRecordsForDate = (dateStr: string) => records.filter(r => r.date === dateStr);

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const dayRecs = getRecordsForDate(dateStr);
    if (dayRecs.length < 2) {
      setIsFormOpen(true);
    }
  };

  const colors = {
    blue: '#DCE4E9',
    purple: '#E7E4ED',
    sage: '#E5E9E4',
    pink: '#EFE8E8',
    dot: '#A8B8A8' // Morandi Sage Dot
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12 space-y-12 pb-32">
      <div className="flex justify-center">
         <div className="bg-stone-600 px-14 py-6 rounded-full shadow-xl border border-stone-500 flex items-center space-x-3 transition-transform hover:scale-105">
           <span className="text-xl font-black text-white tracking-[0.25em]">手搖成癮患者 🥤</span>
         </div>
      </div>

      <div className="space-y-2 px-2">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">2026 Case Report</p>
        <h2 className="text-2xl font-black text-stone-700 tracking-tight">2026 手搖成癮病歷表 📋</h2>
      </div>

      <section className="grid grid-cols-2 gap-6">
        <StatCard label="Monthly Dose" subLabel="當月劑量" value={stats.monthlyCount} unit="杯" bgColor={colors.blue} textColor="text-stone-700" />
        <StatCard label="Monthly Fee" subLabel="當月診療費" value={`$${stats.monthlyCost}`} unit="" bgColor={colors.purple} textColor="text-stone-700" />
        <StatCard label="Annual Dose" subLabel="年度劑量" value={stats.annualCount} unit="杯" bgColor={colors.sage} textColor="text-stone-700" />
        <StatCard label="Annual Fee" subLabel="年度診療費" value={`$${stats.annualCost}`} unit="" bgColor={colors.pink} textColor="text-stone-700" />
      </section>

      <section className="bg-white rounded-[4rem] p-12 card-shadow border border-stone-100">
        <div className="flex justify-between items-center mb-12 px-4">
          <button onClick={prevMonth} className="text-stone-300 hover:text-stone-600 transition-colors"><Icons.ChevronLeft /></button>
          <h3 className="text-2xl font-black text-stone-600 font-mono tracking-tighter">{monthLabel}</h3>
          <button onClick={nextMonth} className="text-stone-300 hover:text-stone-600 transition-colors"><Icons.ChevronRight /></button>
        </div>

        <div className="grid grid-cols-7 gap-y-6 text-center">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="text-[10px] font-black text-stone-400 tracking-[0.2em] pb-3">{d}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dObj = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), day);
            const dStr = getFormattedDate(dObj);
            const dayRecs = getRecordsForDate(dStr);
            const isSelected = selectedDate === dStr;
            const isToday = getFormattedDate(new Date()) === dStr;

            return (
              <button
                key={day}
                onClick={() => handleDateClick(dStr)}
                className={`relative h-20 border border-transparent flex flex-col items-center justify-center transition-all duration-300 ${
                  isSelected ? 'bg-stone-100 rounded-[1.5rem] border-stone-200 z-10 scale-110 shadow-md' : 'hover:bg-stone-50 hover:rounded-[1.5rem]'
                }`}
              >
                <span className={`text-sm font-black ${isSelected ? 'text-stone-800' : isToday ? 'text-rose-400 underline underline-offset-8 decoration-2' : 'text-stone-400'}`}>
                  {day}
                </span>
                <div className="flex space-x-1 mt-2 h-4 items-center">
                  {dayRecs.length >= 1 && <div style={{backgroundColor: colors.dot}} className="w-1.5 h-1.5 rounded-full animate-in zoom-in fade-in"></div>}
                  {dayRecs.length >= 2 && <div style={{backgroundColor: colors.dot}} className="w-1.5 h-1.5 rounded-full animate-in zoom-in fade-in"></div>}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {selectedDate && (
        <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-8">
          <div className="bg-stone-700 p-12 rounded-[3.5rem] card-shadow text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>
             </div>
             <p className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-50 mb-2">Clinical Diagnostic</p>
             <h4 className="text-3xl font-black tracking-tight">
               {new Date(parseDateString(selectedDate)).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' })}
             </h4>
          </div>

          <div className="space-y-6">
            {getRecordsForDate(selectedDate).map((r, i) => (
              <div key={r.id} className="bg-white p-10 rounded-[3rem] card-shadow border border-stone-100 flex justify-between items-center group transition-all hover:bg-stone-50/50">
                <div className="space-y-1.5 flex-1 pr-4">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.25em]">Prescription {i + 1}</p>
                  <h5 className="font-black text-stone-700 text-xl leading-tight">
                    {r.shop} {r.item}
                  </h5>
                  <p className="text-sm text-stone-500 font-bold tracking-wide">
                    甜度：{r.sweetness}；冰塊：{r.ice}
                  </p>
                </div>
                <div className="flex items-center space-x-6">
                   <span className="text-3xl font-black text-stone-700 tracking-tighter">${r.price}</span>
                   <button onClick={(e) => { e.stopPropagation(); removeRecord(r.id); }} className="p-4 text-stone-200 hover:text-rose-400 transition-colors"><Icons.Trash /></button>
                </div>
              </div>
            ))}

            {getRecordsForDate(selectedDate).length < 2 && (
              <button 
                onClick={() => setIsFormOpen(true)}
                className="w-full py-12 border-2 border-dashed border-stone-200 rounded-[3rem] text-stone-400 flex items-center justify-center space-x-4 hover:border-stone-400 hover:text-stone-700 transition-all bg-white/40 backdrop-blur-md group"
              >
                <div className="p-3 rounded-full bg-stone-100 group-hover:bg-stone-200 transition-colors">
                  <Icons.Plus />
                </div>
                <span className="font-black text-sm tracking-[0.3em] uppercase">Add Prescription</span>
              </button>
            )}
          </div>
        </div>
      )}

      <section className="grid grid-cols-2 gap-8 pt-6">
        <button 
          onClick={() => setAnalyticsType('shop')}
          className="bg-white p-10 rounded-[3rem] card-shadow border border-stone-100 space-y-4 text-left transition-all hover:scale-105 hover:bg-stone-50 group active:scale-95"
        >
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Clinic Favorite</p>
          <div>
            <p className="text-xl font-black text-stone-700 truncate">{favoriteShop.name}</p>
            <p className="text-[11px] text-stone-500 font-black mt-2 uppercase tracking-widest">{favoriteShop.count > 0 ? `${favoriteShop.count} VISITS` : 'NO DATA'}</p>
          </div>
        </button>
        <button 
          onClick={() => setAnalyticsType('item')}
          className="bg-white p-10 rounded-[3rem] card-shadow border border-stone-100 space-y-4 text-left transition-all hover:scale-105 hover:bg-stone-50 group active:scale-95"
        >
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Addiction Item</p>
          <div>
            <p className="text-xl font-black text-stone-700 truncate">{favoriteItem.name}</p>
            <p className="text-[11px] text-stone-500 font-black mt-2 uppercase tracking-widest">{favoriteItem.count > 0 ? `${favoriteItem.count} DOSES` : 'NO DATA'}</p>
          </div>
        </button>
      </section>

      {analyticsType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 backdrop-blur-2xl p-8">
          <div className="w-full max-w-lg bg-white rounded-[3.5rem] p-12 card-shadow border border-stone-100 animate-in zoom-in fade-in duration-500 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]">Detailed Analytics</p>
                <h3 className="text-2xl font-black text-stone-700">{analyticsType === 'shop' ? '最愛店家統計' : '最愛飲品統計'}</h3>
              </div>
              <button onClick={() => setAnalyticsType(null)} className="p-3 text-stone-300 hover:text-stone-600 transition-colors">
                <Icons.Close />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {allAnalyticsData.length > 0 ? (
                allAnalyticsData.map((data, idx) => (
                  <div key={data.name} className="flex items-center justify-between p-6 bg-stone-50 rounded-[2rem] border border-stone-100">
                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-black text-stone-300 w-6">#{idx + 1}</span>
                      <span className="font-bold text-stone-600">{data.name}</span>
                    </div>
                    <span className="text-sm font-black text-stone-400 bg-white px-4 py-1.5 rounded-full border border-stone-100">
                      {data.count} {analyticsType === 'shop' ? '次回診' : '杯'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-stone-300 font-bold tracking-widest">NO DATA AVAILABLE</div>
              )}
            </div>
            
            <button 
              onClick={() => setAnalyticsType(null)}
              className="mt-8 w-full py-6 bg-stone-700 text-white rounded-[2rem] font-bold text-xs uppercase tracking-[0.4em] shadow-2xl shadow-stone-200"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/20 backdrop-blur-xl p-8">
          <div className="w-full max-w-lg animate-in zoom-in fade-in duration-500">
            <RecordForm 
              onSave={addRecord} 
              onCancel={() => setIsFormOpen(false)} 
              existingCount={getRecordsForDate(selectedDate || '').length}
              availableShops={shops}
            />
          </div>
        </div>
      )}

      <footer className="pt-12 text-center">
        <p className="text-[10px] text-stone-400 uppercase tracking-[0.6em] font-black">Tea Addiction Clinic &copy; 2026</p>
      </footer>
    </div>
  );
};

export default App;
