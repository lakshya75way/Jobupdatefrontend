import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import * as apiService from "../services/api.service";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "../components/atoms/Button";


export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verify = async () => {
      const response = await apiService.verifyEmail(token);
      if (response.success) {
        setStatus("success");
        setMessage(response.message || "Email verified successfully!");
      } else {
        setStatus("error");
        setMessage(response.message || "Verification failed.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-indigo-500 animate-spin" />
            <h1 className="text-2xl font-bold text-white">
              Verifying Email...
            </h1>
            <p className="text-gray-400">
              Please wait while we confirm your address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 size={48} className="text-emerald-500" />
            <h1 className="text-2xl font-bold text-white">Verified!</h1>
            <p className="text-gray-400">{message}</p>
            <Button onClick={() => navigate("/login")} className="mt-4 w-full">
              Go to Login
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle size={48} className="text-red-500" />
            <h1 className="text-2xl font-bold text-white">
              Verification Failed
            </h1>
            <p className="text-gray-400">{message}</p>
            <Link
              to="/signup"
              className="mt-4 text-indigo-400 hover:text-indigo-300"
            >
              Back to Signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
