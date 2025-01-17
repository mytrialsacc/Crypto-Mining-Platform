import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Bitcoin, Feather as Ethereum, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { Plan, usePlanStore } from '../store/planStore';
import { supabase } from '../lib/supabase';

type PaymentMethod = 'card' | 'crypto';
type CryptoType = 'bitcoin' | 'ethereum';

interface CryptoPayment {
  id: string;
  status: 'pending' | 'verified' | 'failed';
  transaction_hash: string;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan as Plan;
  const { purchasePlan } = usePlanStore();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cryptoType, setCryptoType] = useState<CryptoType>('bitcoin');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cryptoPayment, setCryptoPayment] = useState<CryptoPayment | null>(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  useEffect(() => {
    if (!plan) {
      navigate('/vip-plans');
    }
  }, [plan, navigate]);

  useEffect(() => {
    if (paymentMethod === 'card') {
      setMaintenanceMessage('Credit card payments are temporarily under maintenance. Please use cryptocurrency payment method instead.');
    } else {
      setMaintenanceMessage('');
    }
  }, [paymentMethod]);

  const checkPaymentStatus = useCallback(async (paymentId: string) => {
    try {
      const { data, error } = await supabase
        .from('crypto_payments')
        .select('status')
        .eq('id', paymentId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        if (data.status === 'verified') {
          await purchasePlan(plan.id);
          navigate('/dashboard');
        } else if (data.status === 'failed') {
          setVerificationError('Transaction verification failed. Please ensure you entered a valid, recent transaction hash.');
          setCryptoPayment(null);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  }, [plan?.id, navigate, purchasePlan]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let timeout: NodeJS.Timeout | null = null;
    
    if (cryptoPayment?.status === 'pending') {
      // Set a 5-minute timeout for verification
      timeout = setTimeout(async () => {
        try {
          await supabase
            .from('crypto_payments')
            .update({ status: 'failed' })
            .eq('id', cryptoPayment.id);
            
          setVerificationError('Verification timeout. Please try again with a new transaction.');
          setCryptoPayment(null);
        } catch (error) {
          console.error('Error updating payment status:', error);
        }
      }, 5 * 60 * 1000); // 5 minutes

      // Check status every 5 seconds
      interval = setInterval(() => {
        checkPaymentStatus(cryptoPayment.id);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [cryptoPayment?.id, cryptoPayment?.status, checkPaymentStatus]);

  const validateTransactionHash = (hash: string) => {
    if (!hash) {
      throw new Error('Please enter the transaction hash');
    }

    // Basic validation for crypto transaction hash format
    const hashRegex = /^[a-fA-F0-9]{64}$/;
    if (!hashRegex.test(hash)) {
      throw new Error('Invalid transaction hash format. Please enter a valid hash.');
    }
  };

  const checkExistingTransaction = async (hash: string) => {
    const { data, error } = await supabase
      .from('crypto_payments')
      .select('status')
      .eq('transaction_hash', hash)
      .maybeSingle();

    if (error) {
      throw new Error('Failed to verify transaction hash. Please try again.');
    }

    if (data) {
      throw new Error('This transaction hash has already been used. Please enter a different transaction.');
    }
  };

  const handleCryptoPayment = async () => {
    setIsProcessing(true);
    setVerificationError('');
    
    try {
      validateTransactionHash(transactionHash);
      await checkExistingTransaction(transactionHash);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Create a new crypto payment record
      const { data: payment, error: paymentError } = await supabase
        .from('crypto_payments')
        .insert([
          {
            user_id: user.user.id,
            plan_id: plan.id,
            amount: plan.price,
            crypto_type: cryptoType,
            transaction_hash: transactionHash,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (paymentError) {
        if (paymentError.message?.includes('recent_transaction')) {
          throw new Error('Transaction is too old. Please submit a transaction from the last hour.');
        } else {
          console.error('Payment error:', paymentError);
          throw new Error('Failed to process payment. Please try again.');
        }
      }
      
      if (payment) {
        setCryptoPayment(payment);
      }
    } catch (error: any) {
      setVerificationError(error.message || 'Failed to process payment. Please try again.');
      setCryptoPayment(null);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/vip-plans')}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Plans
        </button>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Purchase</h1>
          <div className="text-gray-400 mb-6">
            Purchasing {plan.name} for ${plan.price}
          </div>

          {!paymentMethod ? (
            <div className="space-y-4">
              <button
                onClick={() => setPaymentMethod('card')}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-700 hover:border-indigo-500 bg-gray-800/50 text-white transition-all"
              >
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-indigo-400" />
                  <span>Credit / Debit Card</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button
                onClick={() => setPaymentMethod('crypto')}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-700 hover:border-yellow-500 bg-gray-800/50 text-white transition-all"
              >
                <div className="flex items-center">
                  <Bitcoin className="w-6 h-6 mr-3 text-yellow-500" />
                  <span>Cryptocurrency</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          ) : paymentMethod === 'card' ? (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/50">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-yellow-500 font-medium mb-1">Maintenance Notice</h3>
                    <p className="text-yellow-500/90 text-sm">{maintenanceMessage}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPaymentMethod(null)}
                className="w-full py-3 px-6 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white transition-all"
              >
                Go Back
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setCryptoType('bitcoin')}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                    cryptoType === 'bitcoin'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  <Bitcoin className="w-5 h-5" />
                  <span>Bitcoin</span>
                </button>
                <button
                  onClick={() => setCryptoType('ethereum')}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                    cryptoType === 'ethereum'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  <Ethereum className="w-5 h-5" />
                  <span>Ethereum</span>
                </button>
              </div>

              <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                <div className="text-sm text-gray-400 mb-2">Send exactly</div>
                <div className="text-xl font-mono text-white mb-2">
                  {cryptoType === 'bitcoin' ? '0.00041 BTC' : '0.0082 ETH'}
                </div>
                <div className="font-mono text-gray-400 text-sm break-all">
                  {cryptoType === 'bitcoin'
                    ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
                    : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
                </div>
              </div>

              {verificationError && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{verificationError}</span>
                </div>
              )}

              {cryptoPayment?.status === 'pending' ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-indigo-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying your transaction...</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Verification will timeout in 5 minutes if not completed. Please don't close this window.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Transaction Hash
                    </label>
                    <input
                      type="text"
                      value={transactionHash}
                      onChange={(e) => {
                        setTransactionHash(e.target.value);
                        setVerificationError('');
                      }}
                      placeholder={`Enter your ${cryptoType} transaction hash`}
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 font-mono"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-400">
                      Transaction must be less than 1 hour old
                    </p>
                  </div>
                  <button
                    onClick={handleCryptoPayment}
                    disabled={isProcessing || !transactionHash}
                    className="w-full py-3 px-6 rounded-lg font-medium bg-green-600 hover:bg-green-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Verify Payment'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}