import React, { useState } from 'react';
import { Market, Category } from '../types';
import { formatCurrency, formatPercentage } from '../utils';

interface AdminProps {
  markets: Market[];
  onAddMarket: (market: Market) => void;
  onResolveMarket: (marketId: string, outcome: 'SIM' | 'NÃO') => void;
}

export function Admin({ markets, onAddMarket, onResolveMarket }: AdminProps) {
  const totalVolume = markets.reduce((acc, m) => acc + m.volume, 0);
  const activeMarkets = markets.filter(m => m.status === 'aberto').length;
  const mockLiquidity = totalVolume * 0.15;
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Market State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Econômico');
  const [resolutionDate, setResolutionDate] = useState('');
  const [probability, setProbability] = useState('50');

  const handleAddMarket = (e: React.FormEvent) => {
    e.preventDefault();
    const newMarket: Market = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      category,
      resolutionDate,
      volume: 0,
      probability: parseInt(probability) / 100,
      status: 'aberto'
    };
    onAddMarket(newMarket);
    setShowAddForm(false);
    setTitle('');
    setDescription('');
    setResolutionDate('');
    setProbability('50');
  };

  return (
    <div className="p-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg text-slate-800">Painel Administrativo</h2>
        <span className="px-2 py-1 bg-rose-100 rounded text-[10px] font-bold text-rose-700 uppercase tracking-wider">Acesso Restrito</span>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Volume Total Negociado</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalVolume)}</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Liquidez do Sistema</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(mockLiquidity)}</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mercados Ativos</p>
          <p className="text-2xl font-bold text-slate-900">{activeMarkets}</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Taxas Coletadas (Est.)</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalVolume * 0.02)}</p>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8">
          <h3 className="font-bold mb-4">Adicionar Novo Mercado</h3>
          <form onSubmit={handleAddMarket} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">Título</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">Descrição</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" rows={2}></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Econômico</option>
                <option>Financeiro</option>
                <option>Cripto</option>
                <option>Câmbio</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">Retorno Inicial (Aposta %)</label>
              <input type="number" required min="1" max="99" value={probability} onChange={e => setProbability(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">Data Estimada Ref.</label>
              <input type="date" required value={resolutionDate} onChange={e => setResolutionDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 font-bold text-sm text-slate-500 hover:text-slate-800">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">Criar Mercado</button>
            </div>
          </form>
        </div>
      )}

      {/* Market Management */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Gestão de Mercados</h3>
          <button onClick={() => setShowAddForm(true)} className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest">
            + Novo Mercado
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Mercado</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Volume</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Prob. Atual</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {markets.map((market) => (
              <tr key={market.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 text-sm font-bold text-slate-800 truncate max-w-xs" title={market.title}>
                  {market.title}
                </td>
                <td className="px-5 py-4">
                  {market.status === 'aberto' ? (
                     <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-blue-100 text-blue-700">Aberto</span>
                  ) : (
                     <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-slate-200 text-slate-700">Resolvido: {market.outcome}</span>
                  )}
                </td>
                <td className="px-5 py-4 text-sm font-bold text-slate-600 text-right">
                  {formatCurrency(market.volume)}
                </td>
                <td className="px-5 py-4 text-sm font-bold text-emerald-600 text-right">
                  {formatPercentage(market.probability)}
                </td>
                <td className="px-5 py-4 text-right flex justify-end gap-2">
                  {market.status === 'aberto' ? (
                    <>
                      <button onClick={() => onResolveMarket(market.id, 'SIM')} className="text-[10px] font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-1 rounded transition-colors uppercase tracking-wide hover:bg-emerald-100">
                        SIM
                      </button>
                      <button onClick={() => onResolveMarket(market.id, 'NÃO')} className="text-[10px] font-bold text-rose-600 border border-rose-200 bg-rose-50 px-2 py-1 rounded transition-colors uppercase tracking-wide hover:bg-rose-100">
                        NÃO
                      </button>
                    </>
                  ) : (
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Resolvido</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
