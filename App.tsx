
import React, { useState, useMemo } from 'react';
import { DollarSign, Clock, Train, Printer, Calculator, RefreshCw, Calendar } from 'lucide-react';
import { DayOfWeek, PayrollState } from './types';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SWIPE_RATE = 3;

const INITIAL_STATE: PayrollState = {
  children: {
    tyler: {
      name: 'Tyler',
      rate: 25,
      hours: {
        Monday: 8.5,
        Tuesday: 8.5,
        Wednesday: 8.5,
        Thursday: 8.5,
        Friday: 3.25,
      }
    },
    elle: {
      name: 'Elle',
      rate: 5,
      hours: {
        Monday: 2,
        Tuesday: 2,
        Wednesday: 2,
        Thursday: 2,
        Friday: 2,
      }
    }
  },
  subwaySwipes: 0
};

export default function App() {
  const [state, setState] = useState<PayrollState>(INITIAL_STATE);

  const totals = useMemo(() => {
    const tylerTotalHours = Object.values(state.children.tyler.hours).reduce((a: number, b: number) => a + b, 0);
    const elleTotalHours = Object.values(state.children.elle.hours).reduce((a: number, b: number) => a + b, 0);
    
    const tylerSubtotal = tylerTotalHours * state.children.tyler.rate;
    const elleSubtotal = elleTotalHours * state.children.elle.rate;
    const subwayCost = state.subwaySwipes * SWIPE_RATE;
    
    const grandTotal = tylerSubtotal + elleSubtotal + subwayCost;

    return {
      tylerTotalHours,
      elleTotalHours,
      tylerSubtotal,
      elleSubtotal,
      subwayCost,
      grandTotal
    };
  }, [state]);

  const updateRate = (childKey: 'tyler' | 'elle', val: string) => {
    const rate = val === '' ? 0 : parseFloat(val);
    setState(prev => ({
      ...prev,
      children: {
        ...prev.children,
        [childKey]: { ...prev.children[childKey], rate }
      }
    }));
  };

  const updateHours = (childKey: 'tyler' | 'elle', day: DayOfWeek, val: string) => {
    const hours = val === '' ? 0 : parseFloat(val);
    setState(prev => ({
      ...prev,
      children: {
        ...prev.children,
        [childKey]: {
          ...prev.children[childKey],
          hours: { ...prev.children[childKey].hours, [day]: hours }
        }
      }
    }));
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default values?')) {
      setState(INITIAL_STATE);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Helper to handle display value for numeric inputs (show empty instead of 0)
  const getDisplayValue = (val: number) => (val === 0 ? '' : val.toString());

  return (
    <div className="min-h-screen bg-slate-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="text-indigo-600 w-6 h-6 sm:w-8 sm:h-8" />
              NannyPay Pro
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Weekly Payroll Calculator</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button 
              onClick={handleReset}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 sm:border-none"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 h-4" />
              Reset
            </button>
            <button 
              onClick={() => window.print()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 h-4" />
              Print
            </button>
          </div>
        </header>

        {/* Configuration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Tyler Config */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-all group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-indigo-50 p-1.5 sm:p-2 rounded-lg text-indigo-600">
                  <DollarSign className="w-4 h-4 sm:w-5 h-5" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-800">Tyler's Rate</h2>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Child A</span>
            </div>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
              <span className="text-slate-400 font-medium mr-2">$</span>
              <input
                type="number"
                value={getDisplayValue(state.children.tyler.rate)}
                onChange={(e) => updateRate('tyler', e.target.value)}
                className="bg-transparent border-none outline-none w-full text-lg font-semibold text-slate-900"
                placeholder="0"
              />
              <span className="text-slate-400 text-xs sm:text-sm">/ hr</span>
            </div>
          </div>

          {/* Elle Config */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-200 transition-all group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-emerald-50 p-1.5 sm:p-2 rounded-lg text-emerald-600">
                  <DollarSign className="w-4 h-4 sm:w-5 h-5" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-800">Elle's Rate</h2>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Child B</span>
            </div>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
              <span className="text-slate-400 font-medium mr-2">$</span>
              <input
                type="number"
                value={getDisplayValue(state.children.elle.rate)}
                onChange={(e) => updateRate('elle', e.target.value)}
                className="bg-transparent border-none outline-none w-full text-lg font-semibold text-slate-900"
                placeholder="0"
              />
              <span className="text-slate-400 text-xs sm:text-sm">/ hr</span>
            </div>
          </div>
        </div>

        {/* Hours Log - Desktop Table / Mobile Cards */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 h-5 text-indigo-500" />
              <h2 className="text-base sm:text-lg font-semibold text-slate-800">Weekly Hours Log</h2>
            </div>
            <div className="hidden sm:block text-xs font-medium text-slate-400">Total Hours: {totals.tylerTotalHours + totals.elleTotalHours}</div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Day</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tyler (hrs)</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Elle (hrs)</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Daily Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DAYS.map((day) => {
                  const dayTyler = state.children.tyler.hours[day];
                  const dayElle = state.children.elle.hours[day];
                  const dayTotal = (dayTyler * state.children.tyler.rate) + (dayElle * state.children.elle.rate);

                  return (
                    <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-700">{day}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          step="0.25"
                          value={getDisplayValue(dayTyler)}
                          onChange={(e) => updateHours('tyler', day, e.target.value)}
                          className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          step="0.25"
                          value={getDisplayValue(dayElle)}
                          onChange={(e) => updateHours('elle', day, e.target.value)}
                          className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                        />
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-900">
                        ${formatCurrency(dayTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {DAYS.map((day) => {
              const dayTyler = state.children.tyler.hours[day];
              const dayElle = state.children.elle.hours[day];
              const dayTotal = (dayTyler * state.children.tyler.rate) + (dayElle * state.children.elle.rate);

              return (
                <div key={day} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-800">{day}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">${formatCurrency(dayTotal)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Tyler Hours</label>
                      <input
                        type="number"
                        step="0.25"
                        value={getDisplayValue(dayTyler)}
                        onChange={(e) => updateHours('tyler', day, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-center font-semibold"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Elle Hours</label>
                      <input
                        type="number"
                        step="0.25"
                        value={getDisplayValue(dayElle)}
                        onChange={(e) => updateHours('elle', day, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-center font-semibold"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Footer (Desktop/Summary) */}
          <div className="bg-slate-50/80 px-4 py-4 sm:px-6 sm:py-5 border-t border-slate-200">
             <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Tyler Total</span>
                    <span className="text-sm sm:text-base font-bold text-indigo-600">{totals.tylerTotalHours} hrs</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Elle Total</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-600">{totals.elleTotalHours} hrs</span>
                  </div>
                </div>
                <div className="text-right">
                   <span className="text-[10px] text-slate-400 uppercase font-bold block">Labor Subtotal</span>
                   <span className="text-base sm:text-xl font-black text-slate-900">
                     ${formatCurrency(totals.tylerSubtotal + totals.elleSubtotal)}
                   </span>
                </div>
             </div>
          </div>
        </div>

        {/* Expenses & Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pb-8">
          {/* Subway Swipes */}
          <div className="md:col-span-1 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-50 p-1.5 sm:p-2 rounded-lg text-amber-600">
                <Train className="w-4 h-4 sm:w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-800">Transportation</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">Reimbursed at ${SWIPE_RATE} / swipe.</p>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
              <input
                type="number"
                value={getDisplayValue(state.subwaySwipes)}
                onChange={(e) => setState(prev => ({ ...prev, subwaySwipes: e.target.value === '' ? 0 : parseInt(e.target.value) }))}
                className="bg-transparent border-none outline-none w-full text-lg font-semibold text-slate-900"
                placeholder="0"
              />
              <span className="text-slate-400 text-xs sm:text-sm">swipes</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs sm:text-sm text-slate-500 font-medium">Extra Pay</span>
              <span className="text-base sm:text-lg font-bold text-amber-600">+ ${totals.subwayCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Grand Total Summary */}
          <div className="md:col-span-2 bg-indigo-600 p-6 sm:p-8 rounded-3xl shadow-xl shadow-indigo-100 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-4 sm:space-y-5">
              <div className="flex justify-between items-center text-indigo-100/80">
                <span className="text-xs sm:text-sm font-medium">Payroll Summary</span>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Confirmed</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
                  <p className="text-indigo-100 text-[10px] sm:text-xs mb-0.5 uppercase tracking-wide">Tyler Pay</p>
                  <p className="text-base sm:text-xl font-bold">${formatCurrency(totals.tylerSubtotal)}</p>
                </div>
                <div className="bg-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
                  <p className="text-indigo-100 text-[10px] sm:text-xs mb-0.5 uppercase tracking-wide">Elle Pay</p>
                  <p className="text-base sm:text-xl font-bold">${formatCurrency(totals.elleSubtotal)}</p>
                </div>
              </div>

              <div className="pt-2 sm:pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-indigo-100 text-[10px] sm:text-xs uppercase tracking-wider font-bold mb-1">Weekly Grand Total</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none">${formatCurrency(totals.grandTotal)}</span>
                  </div>
                </div>
                <div className="text-right sm:text-right hidden sm:block">
                  <p className="text-indigo-100/70 text-xs">Generated for current week</p>
                  <p className="text-indigo-50 font-bold text-lg">NannyPay Pro</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pb-8 text-slate-400 text-[10px] sm:text-xs print:hidden">
          <p>© {new Date().getFullYear()} NannyPay Pro. Fast, Modern Payroll Management.</p>
        </footer>
      </div>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:bg-white { background-color: white !important; }
          body { background-color: white; }
          table { border: 1px solid #e2e8f0; border-collapse: collapse; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; }
        }
        /* Mobile-friendly inputs */
        input[type="number"] {
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  );
}
