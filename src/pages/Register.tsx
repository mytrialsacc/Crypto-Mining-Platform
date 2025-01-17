import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Bitcoin, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const signUp = useAuthStore((state) => state.signUp);
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      navigate('/login');
    } catch (error: any) {
      if (error.code === 'user_already_exists') {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('An error occurred during registration. Please try again.');
      }
      console.error('Error signing up:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = password.length >= 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 shadow-lg shadow-yellow-500/20 mb-4 ring-2 ring-yellow-400/20">
            <Bitcoin className="w-full h-full text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Start your mining journey today</p>
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
                  minLength={6}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
              
              {/* Password Strength Indicator */}
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle2 className={`w-4 h-4 ${
                  passwordStrength ? 'text-green-500' : 'text-gray-500'
                }`} />
                <span className={passwordStrength ? 'text-green-500' : 'text-gray-500'}>
                  At least 6 characters
                </span>
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
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </span>
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2 text-black" />}
              </div>
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}