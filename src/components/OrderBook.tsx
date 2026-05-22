import React, { useMemo } from 'react';
import { OrderBookEntry } from '../types';

interface OrderBookProps {
  probability: number;
}

export function OrderBook({ probability }: OrderBookProps) {
  const { bids, asks } = useMemo(() => {
    const b: OrderBookEntry[] = [];
    const a: OrderBookEntry[] = [];
    
    // Asks (Sellers)
    for (let i = 5; i >= 1; i--) {
      const price = Math.min(0.99, probability + (i * 0.01));
      if (price <= 0.99) a.push({ price: Number(price.toFixed(2)), size: Math.floor(Math.random() * 2000) + 100 });
    }
    
    // Bids (Buyers)
    for (let i = 1; i <= 5; i++) {
        const price = Math.max(0.01, probability - (i * 0.01));
        if (price >= 0.01) b.push({ price: Number(price.toFixed(2)), size: Math.floor(Math.random() * 2000) + 100 });
    }
    
    return { bids: b, asks: a };
  }, [probability]);

  return (
    <div>
      <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
        Livro de Ofertas 
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </h4>
      <div className="space-y-1">
        <div className="grid grid-cols-3 text-[11px] font-bold text-slate-400 mb-2 px-1">
          <span>PREÇO</span>
          <span className="text-center">QTD</span>
          <span className="text-right">TOTAL</span>
        </div>
        
        {/* Asks (Sellers) */}
        <div className="space-y-0.5">
          {asks.map((ask, i) => (
            <div key={`ask-${i}`} className="grid grid-cols-3 text-[11px] py-1 px-1 rounded bg-rose-50 text-rose-700">
              <span className="font-bold">{ask.price.toFixed(2)}</span>
              <span className="text-center">{ask.size.toLocaleString('pt-BR')}</span>
              <span className="text-right">{(ask.size * ask.price).toFixed(1)}</span>
            </div>
          ))}
        </div>
        
        {/* Spread */}
        <div className="py-2 border-y border-slate-100 my-1 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spread: R$ 0,02</span>
        </div>
        
        {/* Bids (Buyers) */}
        <div className="space-y-0.5">
          {bids.map((bid, i) => (
            <div key={`bid-${i}`} className="grid grid-cols-3 text-[11px] py-1 px-1 rounded bg-emerald-50 text-emerald-600">
              <span className="font-bold">{bid.price.toFixed(2)}</span>
              <span className="text-center">{bid.size.toLocaleString('pt-BR')}</span>
              <span className="text-right">{(bid.size * bid.price).toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
