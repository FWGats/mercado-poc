import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { Market } from '../types';
import { OrderBook } from '../components/OrderBook';
import { formatCurrency, formatPercentage } from '../utils';

interface MarketDetailProps {
  marketId: string;
  onBack: () => void;
  onTrade: (market: Market, type: 'SIM' | 'NÃO', shares: number, price: number) => void;
  balance: number;
  markets: Market[];
}

export function MarketDetail({ marketId, onBack, onTrade, balance, markets }: MarketDetailProps) {
  const market = markets.find(m => m.id === marketId);
  const [tradeType, setTradeType] = useState<'SIM' | 'NÃO'>('SIM');
  const [amountStr, setAmountStr] = useState<string>('100');
  
  if (!market) return null;

  const sharesX = parseInt(amountStr) || 0;
  const currentPrice = tradeType === 'SIM' ? market.probability : (1 - market.probability);
  const totalCost = sharesX * currentPrice;

  const handleTrade = () => {
    if (sharesX > 0 && market.status === 'aberto') {
      onTrade(market, tradeType, sharesX, currentPrice);
    }
  };

  const chartData = useMemo(() => {
    const data = [];
    let p = market.probability;
    for (let i = 24; i >= 0; i--) {
      data.push({ time: `${i}h`, price: Number(p.toFixed(2)) });
      p = Math.max(0.01, Math.min(0.99, p + (Math.random() - 0.5) * 0.1));
    }
    return data.reverse();
  }, [market.probability]);

  return (
    <div className="p-6 h-full flex flex-col gap-6 max-w-5xl mx-auto w-full animate-in fade-in duration-300">
      <button 
        onClick={onBack}
        className="self-start flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-6">
        {/* Title Section */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Vencimento: {new Date(market.resolutionDate).toLocaleDateString('pt-BR')}</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">CVM Autorizado</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{market.title}</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Probabilidade Implícita</p>
            <p className="text-4xl font-black text-emerald-600">{formatPercentage(market.probability)}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-40 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 1]} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                formatter={(val: number) => [`R$ ${val.toFixed(2)}`, 'Preço SIM']}
              />
              <Area type="step" dataKey="price" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 2-Column Split: Book + Trade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <OrderBook probability={market.probability} />

          {/* Trade Panel */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col">
            <div className="flex gap-1 mb-6">
              <button
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tradeType === 'SIM' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setTradeType('SIM')}
              >
                SIM
              </button>
              <button
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tradeType === 'NÃO' ? 'bg-rose-600 text-white shadow-md shadow-rose-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setTradeType('NÃO')}
              >
                NÃO
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Quantidade de Contratos</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium uppercase">Un</span>
                </div>
              </div>
              <div className="flex justify-between items-center px-1 font-medium">
                <span className="text-xs text-slate-500">Preço Unitário (Mkt)</span>
                <span className="text-sm text-slate-900 font-bold tracking-tight underline decoration-emerald-500 line-under">
                  {formatCurrency(currentPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center px-1 pt-2 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-900">Total a Pagar</span>
                <span className="text-lg font-black text-emerald-600">{formatCurrency(totalCost)}</span>
              </div>
            </div>

            <button
              onClick={handleTrade}
              disabled={sharesX <= 0 || market.status !== 'aberto'}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>
                {market.status !== 'aberto' 
                  ? 'Mercado Resolvido' 
                  : balance < totalCost ? `Comprar via Pix` : `Confirmar Ordem`}
              </span>
              {market.status === 'aberto' && (
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              )}
            </button>

            {balance < totalCost && (
              <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
                Ao confirmar, você autoriza o débito via Pix e a execução imediata no Livro de Ofertas.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
