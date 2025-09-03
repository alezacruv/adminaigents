import { useState, useEffect } from 'react';
import { Account } from '../types';
import { mockAccounts } from '../data/mockData';

export const useCurrentAccount = () => {
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [accounts] = useState<Account[]>(mockAccounts);

  useEffect(() => {
    const savedAccountId = localStorage.getItem('currentAccountId');
    if (savedAccountId) {
      const account = accounts.find(acc => acc.id === savedAccountId);
      if (account) {
        setCurrentAccount(account);
      }
    }
  }, [accounts]);

  const selectAccount = (account: Account) => {
    setCurrentAccount(account);
    localStorage.setItem('currentAccountId', account.id);
  };

  const clearAccount = () => {
    setCurrentAccount(null);
    localStorage.removeItem('currentAccountId');
  };

  return {
    currentAccount,
    accounts,
    selectAccount,
    clearAccount
  };
};