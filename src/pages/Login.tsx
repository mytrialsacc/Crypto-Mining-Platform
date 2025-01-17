import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Bitcoin, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useAuthStore((state) => state.signIn);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error: any) {
      if (error.message) {
        setError(error.message);
      } else {
        setError('Invalid email or password');
      }
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 shadow-lg shadow-yellow-500/20 mb-4 ring-2 ring-yellow-400/20">
            <Bitcoin className="w-full h-full text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to continue mining</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 md:p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 focus:border-blue-500 text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your email"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-gray-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 focus:border-blue-500 text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200" />
              <div className={`relative flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl transition-all ${
                isLoading ? 'opacity-90' : 'hover:from-yellow-400 hover:to-yellow-300'
              }`}>
                <span className="text-black font-semibold">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </span>
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2 text-black" />}
              </div>
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}