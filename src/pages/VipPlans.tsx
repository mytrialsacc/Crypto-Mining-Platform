import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check } from 'lucide-react';
import { PLANS, usePlanStore } from '../store/planStore';

export default function VipPlans() {
  const navigate = useNavigate();
  const { currentPlan } = usePlanStore();

  const handleUpgrade = (plan: typeof PLANS[0]) => {
    if (plan.price > 0) {
      navigate('/payment', { state: { plan } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">VIP Mining Plans</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upgrade your mining experience with our VIP plans. Higher rates, better rewards, and exclusive benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLANS.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id;
            const isFreePlan = plan.id === 'free';

            return (
              <div
                key={plan.id}
                className={`relative bg-gray-800/50 backdrop-blur-sm rounded-xl border ${
                  isCurrentPlan ? 'border-yellow-500/50' : 'border-gray-700'
                } p-6 flex flex-col transform transition-all hover:scale-[1.02] ${
                  isCurrentPlan ? 'shadow-lg shadow-yellow-500/10' : ''
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400"> one-time</span>
                </div>
                <div className="mb-6 text-lg text-green-400 font-mono">
                  ${plan.rate.toFixed(8)}/6h
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-2" />
                    {plan.description}
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-2" />
                    24/7 Mining Access
                  </li>
                  {!isFreePlan && (
                    <li className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-green-400 mr-2" />
                      Priority Support
                    </li>
                  )}
                </ul>
                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                    isCurrentPlan
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-400 text-black'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : isFreePlan ? 'Default Plan' : 'Upgrade Now'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}