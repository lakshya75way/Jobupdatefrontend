import { LogOut, Settings } from "lucide-react";
import { Button } from "../atoms/Button";
import * as authService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  userName?: string;
}

export const UserMenu = ({ userName }: UserMenuProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
      <div className="flex flex-col text-right hidden sm:block">
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          Logged in as
        </span>
        <span className="text-sm font-medium text-white">{userName}</span>
      </div>

      <div className="w-px h-8 bg-white/10 hidden sm:block" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/change-password")}
        className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
        title="Change Password"
      >
        <Settings size={18} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        title="Logout"
      >
        <LogOut size={18} />
      </Button>
    </div>
  );
};
