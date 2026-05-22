import React, { useState } from 'react';
import { Market } from './types';
import { useStore } from './store';
import { PixModal } from './components/PixModal';
import { Dashboard } from './views/Dashboard';
import { MarketDetail } from './views/MarketDetail';
import { Portfolio } from './views/Portfolio';
import { Admin } from './views/Admin';
import { Profile } from './views/Profile';
import { formatCurrency } from './utils';
import { LayoutDashboard, Briefcase, Shield, User } from 'lucide-react';

type ViewState = 
  | { name: 'home' }
  | { name: 'market', marketId: string }
  | { name: 'portfolio' }
  | { name: 'admin' }
  | { name: 'profile' };

export default function App() {
  const store = useStore();
  const [view, setView] = useState<ViewState>({ name: 'home' });
  const [pixModalState, setPixModalState] = useState<{ isOpen: boolean, amount: number, pendingTrade?: () => void }>({ isOpen: false, amount: 0 });

  const handleDepositClick = () => {
    setPixModalState({ isOpen: true, amount: 100 });
  };

  const handleTrade = (market: Market, type: 'SIM' | 'NÃO', shares: number, price: number) => {
    const cost = shares * price;
    if (store.balance >= cost) {
      store.buyShares(market.id, type, shares, price);
      alert(`Compra de ${shares} cotas ${type} realizada com sucesso!`);
    } else {
      const deficit = cost - store.balance;
      setPixModalState({
        isOpen: true,
        amount: deficit,
        pendingTrade: () => {
          store.buyShares(market.id, type, shares, price);
          alert(`Pagamento Pix processado e Compra de ${shares} cotas ${type} realizada com sucesso!`);
        }
      });
    }
  };

  const handlePixSuccess = () => {
    store.addBalance(pixModalState.amount);
    if (pixModalState.pendingTrade) {
      pixModalState.pendingTrade();
    }
    setPixModalState({ isOpen: false, amount: 0 });
  };

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-slate-900 flex-col border-r border-slate-200 shrink-0 z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => setView({ name: 'home' })}>
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold text-white uppercase tracking-widest">M</div>
            <h1 className="text-xl font-bold text-white tracking-tight">MERCADO 26</h1>
          </div>
          <nav className="space-y-1">
            <button 
              onClick={() => setView({ name: 'home' })}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${view.name === 'home' || view.name === 'market' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium">Mercados</span>
            </button>
            <button 
              onClick={() => setView({ name: 'portfolio' })}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${view.name === 'portfolio' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-sm font-medium">Portfólio</span>
            </button>
            <button 
              onClick={() => setView({ name: 'admin' })}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${view.name === 'admin' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Administração</span>
            </button>
            <button 
              onClick={() => setView({ name: 'profile' })}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${view.name === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Perfil</span>
            </button>
          </nav>
        </div>
        <div className="mt-auto p-6">
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-bold">Saldo Disponível</p>
            <p className="text-xl font-bold text-white">{formatCurrency(store.balance)}</p>
            <button 
              onClick={handleDepositClick}
              className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded uppercase tracking-widest transition-colors"
            >
              Depositar via Pix
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-8 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold text-white uppercase tracking-widest text-xs" onClick={() => setView({ name: 'home' })}>M</div>
            <span className="hidden sm:inline text-sm font-medium text-slate-500 italic">Ambiente de Simulação Econômica</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="md:hidden flex items-center bg-slate-100 rounded-full py-1 px-3 cursor-pointer" onClick={handleDepositClick}>
              <span className="text-xs font-bold text-slate-900 mr-2">{formatCurrency(store.balance)}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Pix</span>
            </div>
            <div className="flex flex-col text-right hidden lg:flex">
              <span className="text-xs font-semibold text-slate-900">{store.profile.name}</span>
              <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">Verificado</span>
            </div>
            <button 
              onClick={() => setView({ name: 'profile' })}
              className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden text-slate-500 hover:text-slate-800 hover:bg-slate-300 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Workspace Grid / Content Area */}
        <main className="flex-1 overflow-y-auto w-full pb-20 md:pb-0">
          {view.name === 'home' && (
            <Dashboard onSelectMarket={(id) => setView({ name: 'market', marketId: id })} markets={store.markets} />
          )}
          
          {view.name === 'market' && (
            <MarketDetail 
              marketId={view.marketId} 
              onBack={() => setView({ name: 'home' })} 
              onTrade={handleTrade}
              balance={store.balance}
              markets={store.markets}
            />
          )}
          
          {view.name === 'portfolio' && (
            <Portfolio 
              balance={store.balance} 
              positions={store.positions} 
              markets={store.markets}
            />
          )}

          {view.name === 'admin' && (
            <Admin 
              markets={store.markets} 
              onAddMarket={store.addMarket} 
              onResolveMarket={store.resolveMarket} 
            />
          )}

          {view.name === 'profile' && (
            <Profile 
              profile={store.profile} 
              onUpdate={store.updateProfile} 
            />
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around items-center min-h-[4rem] py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] px-2 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
          <button onClick={() => setView({ name: 'home' })} className={`flex flex-col items-center justify-center w-full h-full ${view.name === 'home' || view.name === 'market' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <LayoutDashboard className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Mercados</span>
          </button>
          <button onClick={() => setView({ name: 'portfolio' })} className={`flex flex-col items-center justify-center w-full h-full ${view.name === 'portfolio' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <Briefcase className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Portfólio</span>
          </button>
          <button onClick={() => setView({ name: 'admin' })} className={`flex flex-col items-center justify-center w-full h-full ${view.name === 'admin' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <Shield className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Admin</span>
          </button>
          <button onClick={() => setView({ name: 'profile' })} className={`flex flex-col items-center justify-center w-full h-full ${view.name === 'profile' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Perfil</span>
          </button>
        </nav>
      </div>

      <PixModal 
        isOpen={pixModalState.isOpen} 
        amount={pixModalState.amount} 
        onClose={() => setPixModalState({ isOpen: false, amount: 0 })} 
        onSuccess={handlePixSuccess} 
      />
    </div>
  );
}

