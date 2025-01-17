import React from 'react';
import { Link } from 'react-router-dom';
import { Bitcoin, Zap, Shield, Coins, ChevronRight, Crown } from 'lucide-react';
import { PLANS } from '../store/planStore';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bitcoin className="w-8 h-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold text-white">Crypto Miner</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Mine Crypto <span className="text-yellow-500">Effortlessly</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Start mining Bitcoin, Ethereum, and Dogecoin with our cloud mining platform.
            No hardware required, just sign up and start earning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-medium text-lg transition-colors flex items-center justify-center"
            >
              Start Mining Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/vip-plans"
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium text-lg transition-colors flex items-center justify-center"
            >
              View Plans
              <Crown className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Mining</h3>
              <p className="text-gray-400">
                Start mining immediately after signing up. No setup required, no hardware needed.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure Platform</h3>
              <p className="text-gray-400">
                Your investments and earnings are protected with enterprise-grade security.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                <Coins className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multiple Coins</h3>
              <p className="text-gray-400">
                Mine popular cryptocurrencies including Bitcoin, Ethereum, and Dogecoin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Preview Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Choose Your Mining Plan
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select the perfect plan for your mining needs. Upgrade anytime to increase your earnings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PLANS.slice(0, 3).map((plan) => (
              <div
                key={plan.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 transform transition-all hover:scale-[1.02]"
              >
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400"> one-time</span>
                </div>
                <div className="mb-6 text-lg text-green-400 font-mono">
                  ${plan.rate.toFixed(8)}/6h
                </div>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                <Link
                  to="/register"
                  className="block w-full py-2 px-4 rounded-lg text-center bg-yellow-500 hover:bg-yellow-400 text-black font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/vip-plans"
              className="inline-flex items-center text-yellow-500 hover:text-yellow-400 font-medium"
            >
              View All Plans
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Mining?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of users already mining with our platform.
            Start earning cryptocurrency today!
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-medium text-lg transition-colors"
          >
            Create Your Account
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}