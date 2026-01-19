import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { EmailIcon, CloseIcon } from "../icons";
import InputField from "./shared/InputField";
import { motion } from "framer-motion";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  initialEmail = "",
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setIsLoading(false);

    if (error) {
      setMessage({
        type: "error",
        text: "Wystąpił błąd. Spróbuj ponownie lub sprawdź adres email.",
      });
    } else {
      setMessage({
        type: "success",
        text: "Link do resetowania hasła został wysłany na Twój email.",
      });
    }
  };

  return (
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
                className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl 
                p-8 text-left align-middle shadow-2xl transition-all border border-brand-accent-2/50"
              >
                <div className="flex justify-between items-center mb-6">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-light text-brand-neutral-dark"
                  >
                    Reset hasła
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="text-brand-neutral-dark/50 hover:text-brand-neutral-dark transition-colors"
                  >
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <p className="text-sm text-brand-neutral-dark/70 mb-4">
                      Podaj adres email powiązany z Twoim kontem, a wyślemy Ci
                      link do zmiany hasła.
                    </p>
                    <div className="opacity-85">
                      <InputField
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={EmailIcon}
                      />
                    </div>
                  </div>

                  {message && (
                    <div
                      className={`text-center text-sm py-2 rounded-lg border ${
                        message.type === "success"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-brand-warning/10 text-brand-warning border-brand-warning/20"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading || !email}
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl font-medium shadow-lg shadow-brand-primary/30 
                    bg-brand-primary hover:bg-brand-primary/80 text-white transition-colors 
                    disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Wysyłanie..." : "Wyślij link"}
                  </motion.button>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
