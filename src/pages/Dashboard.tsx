import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMiningStore } from '../store/miningStore';
import { usePlanStore } from '../store/planStore';
import { 
  Bitcoin, 
  Feather as Ethereum, 
  Dog, 
  Play, 
  Pause, 
  LogOut, 
  Clock, 
  Crown, 
  Wallet,
  ChevronRight,
  Zap,
  TrendingUp,
  Layers
} from 'lucide-react';

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const { currentPlan } = usePlanStore();
  const { activeMining, totalEarnings, currentRate, startMining, stopMining, fetchTotalEarnings } = useMiningStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCoin, setSelectedCoin] = useState<'bitcoin' | 'ethereum' | 'dogecoin'>('bitcoin');
  const [miningProgress, setMiningProgress] = useState(0);

  useEffect(() => {
    fetchTotalEarnings();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [fetchTotalEarnings]);

  useEffect(() => {
    if (activeMining) {
      const interval = setInterval(() => {
        setMiningProgress((prev) => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [activeMining]);

  const handleSignOut = async () => {
    try {
      if (activeMining) {
        await stopMining();
      }
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleStartMining = async () => {
    try {
      await startMining(selectedCoin);
    } catch (error) {
      console.error('Error starting mining:', error);
    }
  };

  const handleStopMining = async () => {
    try {
      await stopMining();
    } catch (error) {
      console.error('Error stopping mining:', error);
    }
  };

  const COINS = [
    { id: 'bitcoin', name: 'Bitcoin', icon: Bitcoin, color: 'yellow' },
    { id: 'ethereum', name: 'Ethereum', icon: Ethereum, color: 'blue' },
    { id: 'dogecoin', name: 'Dogecoin', icon: Dog, color: 'yellow' }
  ];

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="bg-black/20 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200" />
                <div className="relative flex items-center space-x-2 bg-black rounded-lg px-3 py-2">
                  <Bitcoin className="w-6 h-6 text-yellow-500" />
                  <span className="text-lg font-bold bg-gradient-to-r from-yellow-500 to-purple-500 text-transparent bg-clip-text">
                    Crypto Miner
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                to="/withdraw"
                className="group relative px-4 py-2 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center space-x-2 text-white">
                  <Wallet className="w-5 h-5" />
                  <span>Withdraw</span>
                </div>
              </Link>

              <Link
                to="/vip-plans"
                className="group relative px-4 py-2 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center space-x-2 text-black">
                  <Crown className="w-5 h-5" />
                  <span>VIP Plans</span>
                </div>
              </Link>

              <div className="text-right">
                <div className="text-sm text-gray-400">{formatDate(currentTime)}</div>
                <div className="font-mono text-white">{formatTime(currentTime)}</div>
              </div>

              <button
                onClick={handleSignOut}
                className="group relative px-4 py-2 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 group-hover:from-red-600/30 group-hover:to-pink-600/30 transition-all" />
                <div className="relative flex items-center space-x-2 text-gray-300 group-hover:text-white">
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Stats Overview */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Plan */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-200" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Current Plan</p>
                    <h3 className="text-xl font-bold text-white">{currentPlan?.name}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Mining Rate */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-200" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Mining Rate</p>
                    <h3 className="text-xl font-bold text-white font-mono">
                      ${currentRate.toFixed(8)}/6h
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-200" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Earnings</p>
                    <h3 className="text-xl font-bold text-white font-mono">
                      ${totalEarnings.toFixed(8)}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mining Control */}
          <div className="col-span-12 lg:col-span-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-200" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Mining Control</h2>
                </div>

                {/* Coin Selection */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {COINS.map((coin) => {
                    const Icon = coin.icon;
                    const isSelected = selectedCoin === coin.id;
                    const isDisabled = !!activeMining;

                    return (
                      <button
                        key={coin.id}
                        onClick={() => !isDisabled && setSelectedCoin(coin.id)}
                        disabled={isDisabled}
                        className={`
                          relative group overflow-hidden rounded-xl transition-all duration-300
                          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}
                        `}
                      >
                        <div className={`
                          absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-300
                          ${isSelected 
                            ? 'from-blue-600 to-purple-600 opacity-100' 
                            : 'from-gray-700 to-gray-800 group-hover:opacity-75'
                          }
                        `} />
                        <div className="relative p-6 flex flex-col items-center">
                          <Icon className={`w-12 h-12 mb-4 ${
                            coin.color === 'yellow' ? 'text-yellow-500' : 'text-blue-500'
                          }`} />
                          <span className="text-lg font-medium text-white">
                            {coin.name}
                          </span>
                        </div>
                        {isSelected && !isDisabled && (
                          <div className="absolute inset-0 border-2 border-blue-500 rounded-xl animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Mining Status */}
                {activeMining && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-medium">Mining Progress</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-500 text-sm">Active</span>
                      </div>
                    </div>
                    <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-in-out"
                        style={{ width: `${miningProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Mining Control Button */}
                {activeMining ? (
                  <button
                    onClick={handleStopMining}
                    className="relative w-full group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200" />
                    <div className="relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl transition-all group-hover:from-red-500 group-hover:to-pink-500">
                      <Pause className="w-6 h-6 text-white mr-3" />
                      <span className="text-white font-medium text-lg">Stop Mining</span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={handleStartMining}
                    className="relative w-full group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200" />
                    <div className="relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-all group-hover:from-blue-500 group-hover:to-purple-500">
                      <Play className="w-6 h-6 text-white mr-3" />
                      <span className="text-white font-medium text-lg">Start Mining</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mining Stats */}
          <div className="col-span-12 lg:col-span-4">
            <div className="relative group h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-200" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 h-full">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Mining Stats</h2>
                </div>

                <div className="space-y-6">
                  {/* Active Session */}
                  {activeMining && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-gray-400 text-sm mb-2">Active Session</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {selectedCoin === 'bitcoin' && <Bitcoin className="w-6 h-6 text-yellow-500" />}
                          {selectedCoin === 'ethereum' && <Ethereum className="w-6 h-6 text-blue-500" />}
                          {selectedCoin === 'dogecoin' && <Dog className="w-6 h-6 text-yellow-500" />}
                          <span className="text-white capitalize">{selectedCoin}</span>
                        </div>
                        <div className="text-green-500 text-sm bg-green-500/10 px-3 py-1 rounded-full">
                          Mining
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Withdraw Button */}
                  <Link
                    to="/withdraw"
                    className="relative block w-full group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200" />
                    <div className="relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl transition-all group-hover:from-green-500 group-hover:to-emerald-500">
                      <span className="text-white font-medium text-lg">Withdraw Earnings</span>
                      <ChevronRight className="w-6 h-6 text-white ml-2" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}