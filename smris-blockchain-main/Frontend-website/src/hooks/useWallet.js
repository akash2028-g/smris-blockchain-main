import { useState } from 'react';
import { BrowserProvider } from 'ethers';

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    // 1. Check if MetaMask is installed
    if (!window.ethereum) {
      setError('MetaMask is not installed');
      return null;
    }

    try {
      // 2. Connect using Ethers v6
      const provider = new BrowserProvider(window.ethereum);
      
      // Request access
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setWalletAddress(address);
      return address;
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setError('Failed to connect wallet');
      return null;
    }
  };

  return { walletAddress, error, connectWallet };
};