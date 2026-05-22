import React, { useState } from 'react';
import { Market } from '../types';
import { formatCurrency, formatPercentage } from '../utils';

interface DashboardProps {
  onSelectMarket: (marketId: string) => void;
  markets: Market[];
}

const CATEGORIES = ['Todos', 'Econômico', 'Financeiro', 'Cripto', 'Câmbio'];

export function Dashboard({ onSelectMarket, markets }: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const openMarkets = markets.filter(m => m.status === 'aberto');

  const filteredMarkets = activeCategory === 'Todos' 
    ? openMarkets 
    : openMarkets.filter(m => m.category === activeCategory);

  const featuredMarkets = [...openMarkets].sort((a, b) => b.volume - a.volume).slice(0, 2);

  return (
    <div className="p-6">
      {/* Featured Markets */}
      <div className="mb-8">
        <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          Mercados em Destaque
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredMarkets.map(market => (
            <div 
              key={`featured-${market.id}`} 
              onClick={() => onSelectMarket(market.id)}
              className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 cursor-pointer transition-all flex flex-col relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500 rounded-full opacity-10 blur-3xl"></div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded">Em Alta</p>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">Vol: {formatCurrency(market.volume)}</span>
              </div>
              
              <h3 className="font-bold text-white text-base leading-tight mb-5 flex-1 relative z-10">
                {market.title}
              </h3>
              
              <div className="flex gap-2 relative z-10">
                <div className="flex-1 text-center py-2 bg-slate-800 rounded border border-slate-700">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Sim</p>
                  <p className="font-bold text-emerald-400">{formatPercentage(market.probability)}</p>
                </div>
                <div className="flex-1 text-center py-2 bg-slate-800 rounded border border-slate-700">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Não</p>
                  <p className="font-bold text-rose-400">{formatPercentage(1 - market.probability)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-slate-800">Explorar Mercados</h2>
        <span className="px-2 py-1 bg-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase">Finanças / 2026</span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-slate-800 text-white' 
                : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarkets.map(market => (
          <div 
            key={market.id} 
            onClick={() => onSelectMarket(market.id)}
            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 cursor-pointer transition-all flex flex-col"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">{market.category}</p>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">Vol: {formatCurrency(market.volume)}</span>
            </div>
            
            <h3 className="font-semibold text-sm leading-tight mb-4 flex-1">
              {market.title}
            </h3>
            
            <div className="flex gap-2">
              <div className="flex-1 text-center py-2 bg-slate-50 rounded border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Sim</p>
                <p className="font-bold text-emerald-600">{formatPercentage(market.probability)}</p>
              </div>
              <div className="flex-1 text-center py-2 bg-slate-50 rounded border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Não</p>
                <p className="font-bold text-rose-600">{formatPercentage(1 - market.probability)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
