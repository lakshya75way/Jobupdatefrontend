import { Wifi, WifiOff } from "lucide-react";

interface StatusIndicatorProps {
  isOnline: boolean;
}

export const StatusIndicator = ({ isOnline }: StatusIndicatorProps) => {
  return (
    <div
      className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border
      ${
        isOnline
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
      }
    `}
    >
      <span className={`relative flex h-2.5 w-2.5`}>
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOnline ? "bg-emerald-400" : "bg-amber-400"
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isOnline ? "bg-emerald-500" : "bg-amber-500"
          }`}
        ></span>
      </span>

      {isOnline ? (
        <>
          <Wifi size={14} />
          <span>Online - Syncing</span>
        </>
      ) : (
        <>
          <WifiOff size={14} />
          <span>Offline - Saved Locally</span>
        </>
      )}
    </div>
  );
};
