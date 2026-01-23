import { useState } from "react";
import { Link } from "react-router-dom";
import * as apiService from "../services/api.service";
import { forgotPasswordSchema } from "../validation/auth.validation";
import { FormField } from "../components/molecules/FormField";
import { Button } from "../components/atoms/Button";
import { KeyRound, ArrowLeft } from "lucide-react";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const validated = forgotPasswordSchema.parse({ email });
      const response = await apiService.forgotPassword(validated.email);
      if (response.success) {
        setIsSent(true);
      } else {
        setError(response.message || "Something went wrong.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid email address");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound size={32} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-400 text-sm">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {isSent ? (
          <div className="text-center">
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-6 text-sm">
              We've sent a password reset link to <strong>{email}</strong>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
            >
              <ArrowLeft size={16} />
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            <FormField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <Button type="submit" fullWidth isLoading={isLoading}>
              Send Reset Link
            </Button>
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
