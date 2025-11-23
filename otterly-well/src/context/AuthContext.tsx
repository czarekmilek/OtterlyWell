import { createContext, useContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  user: User | null;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
