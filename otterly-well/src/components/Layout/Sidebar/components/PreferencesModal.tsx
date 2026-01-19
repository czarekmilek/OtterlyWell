import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { supabase } from "../../../../lib/supabaseClient";
import ForgotPasswordModal from "../../../Auth/ForgotPasswordModal";
import { CloseIcon, LockIcon } from "../../../icons";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreferencesModal({
  isOpen,
  onClose,
}: PreferencesModalProps) {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isForgotOpen, setIsForgotOpen] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchProfile();
    }
  }, [isOpen, user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (data) {
      setUsername(data.username || "");
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: username,
      updated_at: new Date(),
    });

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: "Błąd podczas zapisywania." });
    } else {
      setMessage({ type: "success", text: "Zapisano zmiany." });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-brand-neutral-dark 
                p-6 text-left align-middle shadow-xl transition-all border border-brand-depth"
                >
                  <div className="flex justify-between items-center mb-6">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6 text-brand-neutral-light"
                    >
                      Preferencje
                    </DialogTitle>
                    <button
                      onClick={onClose}
                      className="text-brand-neutral-light/50 hover:text-brand-neutral-light transition-colors cursor-pointer"
                    >
                      <CloseIcon className="" />
                    </button>
                  </div>

                  <form onSubmit={handleSave} className="flex flex-col gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-brand-secondary mb-3 uppercase tracking-wider">
                        Profil
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-brand-neutral-light mb-1">
                            Nazwa użytkownika
                          </label>
                          <input
                            type="text"
                            value={username}
                            disabled={loading}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={
                              loading ? "Ładowanie..." : "Twoja nazwa"
                            }
                            className="w-full px-4 py-2 rounded-xl bg-brand-neutral-light/5 border border-brand-depth 
                            text-brand-neutral-light placeholder-brand-neutral-light/30 focus:outline-none focus:border-brand-primary
                            disabled:opacity-50 disabled:cursor-wait"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-brand-secondary mb-3 uppercase tracking-wider">
                        Bezpieczeństwo
                      </h4>
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-brand-neutral-light/5 border border-brand-depth">
                          <p className="text-sm text-brand-neutral-light mb-3">
                            Zmiana hasła wymaga potwierdzenia mailowego.
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsForgotOpen(true)}
                            className="text-sm text-brand-primary hover:text-brand-primary/80 transition-colors font-medium flex items-center 
                                      cursor-pointer gap-2"
                          >
                            <LockIcon className="scale-95" /> Zresetuj hasło
                          </button>
                        </div>
                      </div>
                    </div>

                    {message && (
                      <div
                        className={`text-center text-sm py-2 rounded-lg border ${
                          message.type === "success"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-brand-warning/10 text-brand-warning border-brand-warning/20"
                        }`}
                      >
                        {message.text}
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-brand-depth">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm text-brand-neutral-light/70 hover:text-brand-neutral-light transition-colors
                        cursor-pointer"
                      >
                        Anuluj
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 rounded-lg text-sm bg-brand-primary text-white font-medium hover:bg-brand-primary/80 transition-colors
                        disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {saving ? "Zapisywanie..." : "Zapisz zmiany"}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        initialEmail={user?.email || ""}
      />
    </>
  );
}
