import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as apiService from "../services/api.service";
import { Button } from "../components/atoms/Button";
import { Users, Loader2, CheckCircle2 } from "lucide-react";


export const BoardAcceptPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "loading" | "prompt" | "success" | "error"
  >("prompt");
  const [error, setError] = useState("");

  const handleAccept = async () => {
    if (!boardId) return;
    setStatus("loading");
    const response = await apiService.acceptInvite(boardId);
    if (response.success) {
      localStorage.setItem("currentBoardId", boardId);
      setStatus("success");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setStatus("error");
      setError(response.message || "Failed to accept invitation.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center">
        {status === "prompt" && (
          <>
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={32} className="text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Join Board?</h1>
            <p className="text-gray-400 mb-8">
              You have been invited to collaborate on this board. Accept to
              start working together.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleAccept} fullWidth>
                Accept Invitation
              </Button>
              <Button variant="ghost" onClick={() => navigate("/")} fullWidth>
                Decline
              </Button>
            </div>
          </>
        )}

        {status === "loading" && (
          <div className="py-8 flex flex-col items-center gap-4">
            <Loader2 size={40} className="text-indigo-500 animate-spin" />
            <p className="text-white">Joining board...</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-8 flex flex-col items-center gap-4">
            <CheckCircle2 size={48} className="text-emerald-500" />
            <h1 className="text-2xl font-bold text-white">Welcome!</h1>
            <p className="text-gray-400">
              Invitation accepted. Redirecting to your new board...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="py-8">
            <h1 className="text-2xl font-bold text-white mb-2">Oops!</h1>
            <p className="text-red-400 mb-6">{error}</p>
            <Button onClick={() => navigate("/")} fullWidth>
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
