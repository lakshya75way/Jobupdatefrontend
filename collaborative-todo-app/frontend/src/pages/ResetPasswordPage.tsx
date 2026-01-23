import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import * as apiService from "../services/api.service";
import { FormField } from "../components/molecules/FormField";
import { Button } from "../components/atoms/Button";
import { Lock } from "lucide-react";


export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    setIsLoading(true);
    setError("");

    const response = await apiService.resetPassword(token, password);
    if (response.success) {
      setIsSuccess(true);
    } else {
      setError(response.message || "Failed to reset password.");
    }
    setIsLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Link</h1>
          <p className="text-gray-400 mb-6">
            The password reset link is invalid or expired.
          </p>
          <Link to="/forgot-password" title="Request new link">
            <Button variant="secondary">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400 text-sm">
            Create a new, strong password for your account.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center">
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-6 text-sm">
              Password reset successfully!
            </div>
            <Button onClick={() => navigate("/login")} fullWidth>
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            <FormField
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <FormField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Button type="submit" fullWidth isLoading={isLoading}>
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
