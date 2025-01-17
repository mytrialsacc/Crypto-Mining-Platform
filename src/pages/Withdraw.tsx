import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bitcoin, Feather as Ethereum, Dog, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useMiningStore } from '../store/miningStore';

type CryptoType = 'bitcoin' | 'ethereum' | 'dogecoin';

interface WalletAddress {
  address: string;
  crypto_type: CryptoType;
}

export default function Withdraw() {
  const navigate = useNavigate();
  const { totalEarnings } = useMiningStore();
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('bitcoin');
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedWallets, setSavedWallets] = useState<WalletAddress[]>([]);

  // Minimum withdrawal amount is now $10
  const MIN_WITHDRAWAL = 10;

  // Minimum withdrawal amounts for each crypto
  const minWithdrawals = {
    bitcoin: 0.0001,
    ethereum: 0.001,
    dogecoin: 10
  };

  // Fetch saved wallet addresses
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
          navigate('/login');
          return;
        }

        const { data: wallets, error: walletsError } = await supabase
          .from('user_wallets')
          .select('*')
          .eq('user_id', user.user.id);

        if (walletsError) {
          console.error('Error fetching wallets:', walletsError);
          return;
        }

        if (wallets) {
          setSavedWallets(wallets);
        }
      } catch (error) {
        console.error('Error in fetchWallets:', error);
      }
    };

    fetchWallets();
  }, [navigate]);

  const validateWalletAddress = (address: string, type: CryptoType) => {
    const patterns = {
      bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/,
      ethereum: /^0x[a-fA-F0-9]{40}$/,
      dogecoin: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/
    };

    if (!address) {
      throw new Error('Please enter a wallet address');
    }

    if (!patterns[type].test(address)) {
      throw new Error(`Invalid ${type} wallet address format`);
    }
  };

  const handleWithdraw = async () => {
    setError('');
    setIsProcessing(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        navigate('/login');
        return;
      }

      // Validate amount
      const withdrawalAmount = parseFloat(amount);
      if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (withdrawalAmount < MIN_WITHDRAWAL) {
        throw new Error(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`);
      }

      if (withdrawalAmount > totalEarnings) {
        throw new Error('Insufficient balance');
      }

      if (withdrawalAmount < minWithdrawals[selectedCrypto]) {
        throw new Error(`Minimum withdrawal amount for ${selectedCrypto} is ${minWithdrawals[selectedCrypto]} ${selectedCrypto}`);
      }

      // Validate wallet address
      validateWalletAddress(walletAddress, selectedCrypto);

      // Create withdrawal request
      const { error: withdrawalError } = await supabase
        .from('withdrawals')
        .insert([
          {
            user_id: user.user.id,
            amount: withdrawalAmount,
            crypto_type: selectedCrypto,
            wallet_address: walletAddress,
            status: 'pending'
          }
        ]);

      if (withdrawalError) {
        if (withdrawalError.message?.includes('withdrawals_amount_check')) {
          throw new Error(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`);
        }
        throw new Error(withdrawalError.message || 'Failed to process withdrawal');
      }

      // Save wallet address if it's new
      const existingWallet = savedWallets.find(
        w => w.address === walletAddress && w.crypto_type === selectedCrypto
      );

      if (!existingWallet) {
        const { error: walletError } = await supabase
          .from('user_wallets')
          .insert([
            {
              user_id: user.user.id,
              address: walletAddress,
              crypto_type: selectedCrypto
            }
          ]);

        if (walletError) {
          console.error('Error saving wallet:', walletError);
        }
      }

      // Navigate back to dashboard
      navigate('/dashboard', { 
        state: { 
          withdrawalSuccess: true,
          message: 'Withdrawal request submitted successfully' 
        }
      });
    } catch (error: any) {
      setError(error.message || 'Failed to process withdrawal');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setError(''); // Clear error when user starts typing
  };

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setWalletAddress(value);
    setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
          <div className="text-gray-400 mb-6">
            Available Balance: ${totalEarnings.toFixed(8)}
          </div>

          <div className="space-y-6">
            {/* Crypto Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Cryptocurrency
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['bitcoin', 'ethereum', 'dogecoin'] as const).map((crypto) => (
                  <button
                    key={crypto}
                    onClick={() => {
                      setSelectedCrypto(crypto);
                      setError('');
                    }}
                    className={`p-4 rounded-lg border ${
                      selectedCrypto === crypto
                        ? 'bg-gray-700 border-yellow-500'
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    } flex flex-col items-center transition-all`}
                  >
                    {crypto === 'bitcoin' && <Bitcoin className="w-6 h-6 text-yellow-500 mb-2" />}
                    {crypto === 'ethereum' && <Ethereum className="w-6 h-6 text-blue-500 mb-2" />}
                    {crypto === 'dogecoin' && <Dog className="w-6 h-6 text-yellow-400 mb-2" />}
                    <span className="text-sm text-white capitalize">{crypto}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Amount to Withdraw
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder={`Min: $${MIN_WITHDRAWAL}`}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                  step="0.00000001"
                  min={MIN_WITHDRAWAL}
                  max={totalEarnings}
                />
                <p className="mt-1 text-sm text-gray-400">
                  Minimum withdrawal amount: ${MIN_WITHDRAWAL}
                </p>
              </div>
            </div>

            {/* Wallet Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={handleWalletChange}
                placeholder={`Enter your ${selectedCrypto} wallet address`}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 font-mono"
              />
              {savedWallets.length > 0 && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Saved Wallets
                  </label>
                  <select
                    onChange={handleWalletChange}
                    value={walletAddress}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  >
                    <option value="">Select a saved wallet</option>
                    {savedWallets
                      .filter(w => w.crypto_type === selectedCrypto)
                      .map((wallet, index) => (
                        <option key={index} value={wallet.address}>
                          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleWithdraw}
              disabled={isProcessing || !amount || !walletAddress}
              className="w-full py-3 px-6 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-400 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Withdraw Funds'}
            </button>

            <p className="text-sm text-gray-400">
              Note: Withdrawals are typically processed within 24 hours. You will receive an email notification once your withdrawal is complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}