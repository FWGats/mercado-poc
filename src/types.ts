export type Category = 'Econômico' | 'Financeiro' | 'Cripto' | 'Câmbio';

export interface Market {
  id: string;
  title: string;
  description: string;
  category: Category;
  resolutionDate: string;
  volume: number;
  probability: number; // 0.01 to 0.99
  status: 'aberto' | 'resolvido';
  outcome?: 'SIM' | 'NÃO';
}

export interface OrderBookEntry {
  price: number;
  size: number;
}

export interface Position {
  marketId: string;
  type: 'SIM' | 'NÃO';
  shares: number;
  averagePrice: number;
}

export interface UserProfile {
  name: string;
  email: string;
  cpf: string;
  chavePix: string;
}

export interface UserContextData {
  balance: number;
  positions: Position[];
  markets: Market[];
  profile: UserProfile;
  addBalance: (amount: number) => void;
  buyShares: (marketId: string, type: 'SIM' | 'NÃO', shares: number, price: number) => void;
  sellShares: (marketId: string, type: 'SIM' | 'NÃO', shares: number, price: number) => void;
  addMarket: (market: Market) => void;
  resolveMarket: (marketId: string, outcome: 'SIM' | 'NÃO') => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}
