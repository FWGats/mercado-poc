import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (profile: Partial<UserProfile>) => void;
}

export function Profile({ profile, onUpdate }: ProfileProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [cpf, setCpf] = useState(profile.cpf);
  const [chavePix, setChavePix] = useState(profile.chavePix);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ name, email, cpf, chavePix });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 animate-in fade-in duration-300 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-bold text-2xl text-slate-800">Perfil do Investidor</h2>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-3xl font-bold uppercase shrink-0">
              {name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Status da Conta</p>
              <p className="font-medium text-slate-800">Verificado com Sucesso</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-2 tracking-wider uppercase">Nome Completo</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                placeholder="Ex: João da Silva"
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-2 tracking-wider uppercase">E-mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                placeholder="joao@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 tracking-wider uppercase">CPF</label>
              <input 
                type="text" 
                value={cpf} 
                onChange={e => setCpf(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 tracking-wider uppercase">Chave Pix Preferencial</label>
              <input 
                type="text" 
                value={chavePix} 
                onChange={e => setChavePix(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 w-full sm:w-auto text-center sm:text-left">
              {saved && <span className="text-emerald-600 font-medium">Alterações salvas com sucesso!</span>}
            </p>
            <button 
              type="submit" 
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
