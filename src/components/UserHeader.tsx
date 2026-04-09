import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

export const UserHeader = () => {
  const { user, signOut } = useAuth();
  if (!user) return null;

  const name = user.user_metadata?.full_name || user.email || "사용자";
  const avatar = user.user_metadata?.avatar_url;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={name} className="w-9 h-9 rounded-full" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            {name[0]}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-foreground leading-tight">{name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <button
        onClick={signOut}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
      >
        <LogOut className="w-3.5 h-3.5" />
        로그아웃
      </button>
    </div>
  );
};
