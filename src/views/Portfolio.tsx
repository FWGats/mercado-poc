import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Position, Market } from '../types';
import { formatCurrency } from '../utils';

interface PortfolioProps {
  balance: number;
  positions: Position[];
  markets: Market[];
}

export function Portfolio({ balance, positions, markets }: PortfolioProps) {
  const positionsValue = positions.reduce((acc, pos) => {
    const market = markets.find(m => m.id === pos.marketId);
    if (!market) return acc;
    const currentPrice = pos.type === 'SIM' ? market.probability : (1 - market.probability);
    return acc + (pos.shares * currentPrice);
  }, 0);

  const totalValue = balance + positionsValue;

  const chartData = useMemo(() => {
    const data = [];
    let val = totalValue > 0 ? totalValue * 0.8 : 1000;
    for (let i = 30; i > 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        value: Number(val.toFixed(2))
      });
      val = val * (1 + (Math.random() - 0.45) * 0.04);
    }
    const today = new Date();
    data.push({
      date: today.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      value: Number(totalValue.toFixed(2))
    });
    return data;
  }, [totalValue]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg text-slate-800">Meu Portfólio</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valor Total</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saldo em Créditos</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(balance)}</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Posições Abertas</p>
          <p className="text-2xl font-bold text-slate-900">{positions.length} Contratos</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8 flex flex-col">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Evolução do Patrimônio (30 Dias)</p>
        <div className="h-48 w-full border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                formatter={(val: number) => [`R$ ${val.toFixed(2)}`, 'Valor Total']}
                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
              />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#059669' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {positions.length === 0 ? (
          <div className="p-10 text-center text-sm font-bold text-slate-400">
            Nenhuma posição em aberto.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mercado</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Posição</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Cotas</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Médio / Atual</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {positions.map((pos, idx) => {
                const market = markets.find(m => m.id === pos.marketId);
                if (!market) return null;
                const currentPrice = pos.type === 'SIM' ? market.probability : (1 - market.probability);
                const currentValue = pos.shares * currentPrice;
                const totalCost = pos.shares * pos.averagePrice;
                const pnl = currentValue - totalCost;

                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-slate-800">
                      {market.title}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        pos.type === 'SIM' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {pos.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-600 text-right">
                      {pos.shares}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2 text-[11px] font-bold">
                        <span className="text-slate-400">{formatCurrency(pos.averagePrice)}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900">{formatCurrency(currentPrice)}</span>
                      </div>
                    </td>
                    <td className={`px-5 py-4 text-sm font-bold text-right ${pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
