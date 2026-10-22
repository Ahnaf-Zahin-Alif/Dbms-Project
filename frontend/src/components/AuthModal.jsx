import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (authMode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
      setUsername("");
      setPassword("");
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.username) {
        setError(err.response.data.username[0]);
      } else {
        setError("Authentication failed. Please check credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      {/* Page 7 Modal Container */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#EBECEF] p-8 text-gray-900 shadow-2xl border border-gray-300">
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title Banner */}
        <div className="mx-auto mb-8 w-fit rounded-xl border border-gray-300 bg-white px-8 py-3 text-center shadow-md">
          <h2 className="text-xl font-bold tracking-wider text-gray-800 uppercase font-serif">
            {authMode === "login" ? "Login to Cinefilm" : "Register to Cinefilm"}
          </h2>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username / Contact :
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-md border border-gray-400 bg-white px-4 py-2.5 text-gray-900 shadow-inner focus:border-gray-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password :
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-md border border-gray-400 bg-white px-4 py-2.5 text-gray-900 shadow-inner focus:border-gray-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <span className="text-xs text-blue-800 hover:underline cursor-pointer">
              Forgot Pass
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#546574] py-3 text-center font-bold tracking-widest text-white shadow-md hover:bg-[#3E4C59] transition disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : authMode === "login" ? "LOGIN" : "REGISTER"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {authMode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className="font-bold text-[#9C7A14] hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="font-bold text-[#9C7A14] hover:underline"
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
