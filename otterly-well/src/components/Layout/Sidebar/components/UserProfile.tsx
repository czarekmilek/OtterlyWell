import type { User } from "@supabase/supabase-js";
import { LogoutIcon } from "../../../icons";

import { useAuth } from "../../../../context/AuthContext";

interface UserProfileProps {
  user: User | null;
}

const UserProfile = ({ user }: UserProfileProps) => {
  const { signOut } = useAuth();
  if (!user) return null;

  const userEmail = user.email;
  const userInitial = (userEmail || "?").charAt(0).toUpperCase();

  return (
    <div className="mt-auto border-t border-brand-depth bg-brand-neutral-light p-2">
      <div className="flex items-center gap-x-3 rounded-md bg-brand-secondary/40 p-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent-1 text-brand-neutral-light font-semibold">
          {userInitial}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium text-brand-neutral-dark">
            {userEmail}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-x-1">
          <button
            type="button"
            className="flex items-center justify-center rounded-md p-1 text-brand-neutral-dark 
                    hover:bg-brand-neutral-dark/10 cursor-pointer transition-colors"
            title="Wyloguj"
            onClick={signOut}
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
