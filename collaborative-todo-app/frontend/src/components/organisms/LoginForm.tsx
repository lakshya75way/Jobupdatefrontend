import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authService from "../../services/auth.service";
import { loginSchema } from "../../validation/auth.validation";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";
import { Wifi } from "lucide-react";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const validated = loginSchema.parse({ email, password });
      await authService.login(validated);
      navigate("/");
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
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
          <Wifi size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">Login to your collaboration space</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <div className="relative">
          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <div className="flex justify-end mt-[-10px] mb-4">
            <Link
              to="/forgot-password"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={loading}
          className="mt-6"
        >
          Login
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};
