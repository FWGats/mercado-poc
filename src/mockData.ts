import { Market, OrderBookEntry } from './types';

export const mockMarkets: Market[] = [
  {
    id: 'selic-10-copom',
    title: 'Selic em 10% ou menos no próximo Copom?',
    description: 'Este mercado resolve como SIM se o Banco Central anunciar uma taxa Selic meta de 10,00% ou menos no término da próxima reunião do Copom.',
    category: 'Econômico',
    resolutionDate: '2026-06-17',
    volume: 125400,
    probability: 0.33,
    status: 'aberto'
  },
  {
    id: 'ipca-2026',
    title: 'IPCA 2026 acima de 4.5%?',
    description: 'Resolve SIM se o IPCA acumulado de 2026 divulgado pelo IBGE ultrapassar do teto da meta (4,50%).',
    category: 'Econômico',
    resolutionDate: '2027-01-10',
    volume: 85000,
    probability: 0.55,
    status: 'aberto'
  },
  {
    id: 'usd-brl-5',
    title: 'Dólar (USD/BRL) fechará o ano abaixo de R$ 5,00?',
    description: 'Resolve SIM se a cotação oficial do fechamento de venda do Dólar PTAX do último dia útil do ano for inferior a R$ 5,0000.',
    category: 'Câmbio',
    resolutionDate: '2026-12-31',
    volume: 240500,
    probability: 0.15,
    status: 'aberto'
  },
  {
    id: 'btc-600k',
    title: 'Bitcoin acima de R$ 600.000 até Julho?',
    description: 'Resolve SIM se o Bitcoin (BTC/BRL) negociar a R$ 600.000,00 ou mais em qualquer exchange credenciada nacional até 31 de Julho.',
    category: 'Cripto',
    resolutionDate: '2026-07-31',
    volume: 532000,
    probability: 0.72,
    status: 'aberto'
  }
];

export const generateOrderBook = (probability: number): { bids: OrderBookEntry[], asks: OrderBookEntry[] } => {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  
  // Bids are below current probability (Buying SIM for cheaper)
  for (let i = 1; i <= 5; i++) {
    const price = Math.max(0.01, probability - (i * 0.01));
    bids.push({ price: Number(price.toFixed(2)), size: Math.floor(Math.random() * 500) + 50 });
  }
  
  // Asks are above current probability (Selling SIM for higher)
  for (let i = 1; i <= 5; i++) {
    const price = Math.min(0.99, probability + (i * 0.01));
    asks.push({ price: Number(price.toFixed(2)), size: Math.floor(Math.random() * 500) + 50 });
  }
  
  return { bids, asks };
};
