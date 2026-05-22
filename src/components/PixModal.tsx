import React, { useState } from 'react';
import { QrCode, X, CheckCircle2, Copy } from 'lucide-react';
import { formatCurrency } from '../utils';

interface PixModalProps {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PixModal({ amount, isOpen, onClose, onSuccess }: PixModalProps) {
  const [step, setStep] = useState<'qr' | 'success'>('qr');

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setStep('success');
    setTimeout(() => {
      onSuccess();
      setStep('qr'); // Reset for next time
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[400px] p-8 text-center shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {step === 'qr' ? (
          <>
            <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <QrCode className="w-40 h-40 text-slate-900 opacity-20" strokeWidth={1} />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">Pagar {formatCurrency(amount)}</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Escaneie o código acima no app do seu banco para processar a ordem e adicionar os créditos.
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleSimulatePayment}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
              >
                Confirmar Pagamento (Mock)
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 text-slate-400 font-medium text-sm hover:text-slate-600 transition-colors"
              >
                Cancelar Operação
              </button>
            </div>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Pagamento Recebido!</h2>
            <p className="text-slate-600">
              Seus créditos foram adicionados e sua ordem está sendo processada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
