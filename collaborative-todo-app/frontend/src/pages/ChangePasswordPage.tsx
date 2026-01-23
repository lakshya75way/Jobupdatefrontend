import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/auth.service";
import { changePasswordSchema } from "../validation/auth.validation";
import { FormField } from "../components/molecules/FormField";
import { Button } from "../components/atoms/Button";
import { Lock, ArrowLeft } from "lucide-react";

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const validated = changePasswordSchema.parse({
        oldPassword,
        newPassword,
      });
      const response = await authService.changePassword(
        validated.oldPassword,
        validated.newPassword
      );

      if (response.success) {
        setSuccess(true);
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(response.message || "Failed to change password");
      }
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
        setError("Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Password Changed!
          </h1>
          <p className="text-gray-400 mb-6">
            Your password has been updated successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Change Password
          </h1>
          <p className="text-gray-400 text-sm">Update your account password</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password"
          />

          <FormField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 8 chars, 1 uppercase, 1 symbol"
          />

          <FormField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
          />

          <Button type="submit" fullWidth isLoading={loading} className="mt-6">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};
