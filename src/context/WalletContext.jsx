import { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const WalletContext = createContext();

export default function WalletProvider({ children }) {
  const [balance, setBalance] = useState(9000); // Starting balance
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const processPayment = async (amount) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (balance < amount) {
      throw new Error('Insufficient funds');
    }

    const transaction = {
      id: uuidv4(),
      amount: -amount,
      type: 'PAYMENT',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    };

    setBalance(prev => prev - amount);
    setTransactions(prev => [transaction, ...prev]);
    setLoading(false);

    return transaction;
  };

  const addFunds = async (amount) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const transaction = {
      id: uuidv4(),
      amount: amount,
      type: 'DEPOSIT',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    };

    setBalance(prev => prev + amount);
    setTransactions(prev => [transaction, ...prev]);
    setLoading(false);

    return transaction;
  };

  return (
    <WalletContext.Provider value={{
      balance,
      transactions,
      loading,
      processPayment,
      addFunds
    }}>
      {children}
    </WalletContext.Provider>
  );
}
