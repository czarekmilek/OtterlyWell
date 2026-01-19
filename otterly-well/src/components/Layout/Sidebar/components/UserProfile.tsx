import type { User } from "@supabase/supabase-js";
import { LogoutIcon } from "../../../icons";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

import { useAuth } from "../../../../context/AuthContext";

interface UserProfileProps {
  user: User | null;
}

const UserProfile = ({ user }: UserProfileProps) => {
  const { signOut } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      if (!user) return;
      setLoading(true);

      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (data?.username) {
          setUsername(data.username);
        }
        setLoading(false);
      }
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [user]);

  if (!user) return null;

  const displayName = loading ? "Ładowanie..." : username || user.email;
  const userInitial = (displayName || "?").charAt(0).toUpperCase();

  return (
    <div className="mt-auto border-t border-brand-depth bg-brand-neutral-light p-2">
      <div className="flex items-center gap-x-3 rounded-md bg-brand-secondary/40 p-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent-1 text-brand-neutral-light font-semibold">
          {loading ? <span className="animate-pulse">?</span> : userInitial}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium text-brand-neutral-dark">
            {displayName}
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
