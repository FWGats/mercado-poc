import React, { useState, useEffect } from 'react';
import { Market, Position, UserProfile, UserContextData } from './types';
import { mockMarkets } from './mockData';

const DEFAULT_PROFILE: UserProfile = {
  name: 'BTG Pactual Client',
  email: '',
  cpf: '',
  chavePix: ''
};

interface StoreState {
  balance: number;
  positions: Position[];
  markets: Market[];
  profile: UserProfile;
}

export function useStore(): UserContextData {
  const [state, setState] = useState<StoreState>(() => {
    const saved = localStorage.getItem('market_prev_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.markets) {
            parsed.markets = mockMarkets;
        }
        if (!parsed.profile) {
            parsed.profile = DEFAULT_PROFILE;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse local storage', e);
      }
    }
    return { balance: 0, positions: [], markets: mockMarkets, profile: DEFAULT_PROFILE };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prevState => {
        const hasOpenMarkets = prevState.markets.some(m => m.status === 'aberto');
        if (!hasOpenMarkets) return prevState;

        const newMarkets = prevState.markets.map(m => {
          if (m.status !== 'aberto') return m;
          
          // Random walk for probability (-0.5% to +0.5%)
          const drift = (Math.random() - 0.5) * 0.01;
          let newProb = m.probability + drift;
          newProb = Math.max(0.01, Math.min(0.99, newProb));
          
          // Small random volume increase
          const newVol = m.volume + Math.floor(Math.random() * 25);
          
          return {
            ...m,
            probability: newProb,
            volume: newVol
          };
        });

        const newState = {
          ...prevState,
          markets: newMarkets
        };
        // Occasionally save to local storage to optimize performance, skipping rapid writes
        if (Math.random() < 0.1) {
           localStorage.setItem('market_prev_state', JSON.stringify(newState));
        }
        return newState;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const saveState = (updater: (prevState: StoreState) => StoreState) => {
    setState(prevState => {
      const newState = updater(prevState);
      localStorage.setItem('market_prev_state', JSON.stringify(newState));
      return newState;
    });
  };

  const addBalance = (amount: number) => {
    saveState(state => ({ ...state, balance: state.balance + amount }));
  };

  const addMarket = (market: Market) => {
    saveState(state => ({
      ...state,
      markets: [...state.markets, market]
    }));
  };

  const resolveMarket = (marketId: string, outcome: 'SIM' | 'NÃO') => {
    saveState(state => {
      let newBalance = state.balance;
      const newPositions = state.positions.filter(pos => {
        if (pos.marketId === marketId) {
          if (pos.type === outcome) {
            newBalance += pos.shares * 1.0;
          }
          return false;
        }
        return true;
      });

      const newMarkets = state.markets.map(m => 
        m.id === marketId ? { ...m, status: 'resolvido' as const, outcome } : m
      );

      return {
        ...state,
        balance: newBalance,
        positions: newPositions,
        markets: newMarkets
      };
    });
  };

  const buyShares = (marketId: string, type: 'SIM' | 'NÃO', shares: number, price: number) => {
    saveState(state => {
      const cost = shares * price;
      if (state.balance < cost - 0.0001) {
        throw new Error('Insufficient balance');
      }

      const existingPositionIndex = state.positions.findIndex(p => p.marketId === marketId && p.type === type);
      const newPositions = [...state.positions];

      if (existingPositionIndex >= 0) {
        const pos = { ...newPositions[existingPositionIndex] };
        const totalCost = pos.shares * pos.averagePrice + cost;
        const newShares = pos.shares + shares;
        pos.shares = newShares;
        pos.averagePrice = totalCost / newShares;
        newPositions[existingPositionIndex] = pos;
      } else {
        newPositions.push({
          marketId,
          type,
          shares,
          averagePrice: price
        });
      }

      return {
        ...state,
        balance: state.balance - cost,
        positions: newPositions
      };
    });
  };

  const sellShares = (marketId: string, type: 'SIM' | 'NÃO', shares: number, price: number) => {
    saveState(state => {
      const existingPositionIndex = state.positions.findIndex(p => p.marketId === marketId && p.type === type);
      if (existingPositionIndex < 0 || state.positions[existingPositionIndex].shares < shares) {
        throw new Error('Insufficient shares to sell');
      }

      const newPositions = [...state.positions];
      const pos = { ...newPositions[existingPositionIndex] };
      
      pos.shares -= shares;
      if (pos.shares === 0) {
        newPositions.splice(existingPositionIndex, 1);
      } else {
        newPositions[existingPositionIndex] = pos;
      }

      return {
        ...state,
        balance: state.balance + (shares * price),
        positions: newPositions
      };
    });
  };

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    saveState(state => ({
      ...state,
      profile: { ...state.profile, ...profileUpdate }
    }));
  };

  return {
    ...state,
    addBalance,
    buyShares,
    sellShares,
    addMarket,
    resolveMarket,
    updateProfile
  };
}
