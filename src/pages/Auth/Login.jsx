import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Shield, AlertCircle, LogIn, CheckCircle } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setShowLoadingModal(true); // Show loading modal immediately

    // Simulate loading for 3 seconds
    setTimeout(() => {
      if (username === "flyweis" && password === "1234") {
        // Save login info in localStorage (as in original)
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", role);

        setIsLoading(false);
        setShowLoadingModal(false); // Hide loading modal
        setShowSuccessModal(true); // Show success modal
        
        // Auto redirect after showing success for 1.5 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError("Invalid credentials. Please try again!");
        setIsLoading(false);
        setShowLoadingModal(false);
      }
    }, 2000); // Changed to 2000ms (2 seconds)
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Shield size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Flyweis Technology</h1>
              <p className="text-blue-200 text-sm">ERP Software</p>
            </div>
          </div>
          
          <div className="space-y-6 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">Streamline Your Business</h3>
              <p className="text-blue-200 text-sm">Manage leads, track opportunities, and grow your revenue with our comprehensive CRM solution.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Analytics</h3>
              <p className="text-blue-200 text-sm">Get instant insights into your sales pipeline with powerful reporting and visualization tools.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
              <p className="text-blue-200 text-sm">Enterprise-grade security ensures your data is protected with industry-leading encryption.</p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-blue-200 text-sm">
          © 2025 Flyweis Technology. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Flyweis Technology</h1>
              <p className="text-gray-600 text-sm">ERP Software</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <Shield size={18} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                  >
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Employee</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Demo Credentials: <span className="font-semibold text-gray-800">flyweis / 1234</span>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Need help? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
          </div>
        </div>
      </div>

      {/* Loading Modal */}
      {showLoadingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full transform scale-95 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <LogIn size={32} className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Authenticating...</h3>
              <p className="text-gray-600">Please wait while we verify your credentials</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full transform scale-95 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle size={48} className="text-green-600 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Login Successful!</h3>
              <p className="text-gray-600">Welcome back to Flyweis Technology ERP Software. Redirecting to your dashboard...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}