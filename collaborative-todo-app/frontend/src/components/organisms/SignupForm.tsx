import { useState } from "react";
import { Link } from "react-router-dom";
import * as authService from "../../services/auth.service";
import { signupSchema } from "../../validation/auth.validation";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";
import { UserPlus, Mail } from "lucide-react";

export const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const validated = signupSchema.parse({ name, email, password });
      await authService.signup(validated);
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "ZodError") {
          const zodError = err as { issues?: Array<{ message: string }> };
          const messages =
            zodError.issues?.map((issue) => issue.message).join(". ") ||
            err.message;
          setError(messages);
        } else {
          setError(err.message);
        }
      } else {
        setError("Signup failed. Please check your information and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-center">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={32} className="text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-gray-400 mb-8">
          We've sent a verification link to{" "}
          <strong className="text-white">{email}</strong>. Please verify your
          account to continue.
        </p>
        <div className="space-y-4">
          <Link to="/login" className="block">
            <Button fullWidth variant="primary">
              Go to Login
            </Button>
          </Link>
          <p className="text-xs text-gray-500">
            Didn't receive the email? Check your spam folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30">
          <UserPlus size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-gray-400">Start collaborating today</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormField
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
        />

        <FormField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 8 chars, 1 uppercase, 1 symbol"
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={loading}
          variant="primary"
          className="mt-6 bg-pink-600 hover:bg-pink-700 shadow-pink-500/30 focus:ring-pink-500"
        >
          Sign Up
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
};
