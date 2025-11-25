import { useState, type FormEvent } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Transition } from "@headlessui/react";
import { EmailIcon, LockIcon, ArrowRightIcon } from "../../../icons";
import InputField from "../../shared/InputField";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Hasła nie są identyczne.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.code === "weak_password") {
        setErrorMessage("Hasło powinno zawierać co najmniej 6 znaków.");
      } else {
        setErrorMessage("Wystąpił błąd. Spróbuj ponownie.");
      }
      setIsLoading(false);
    } else {
      setSuccessMessage("Rejestracja udana! Zaloguj się po przekierowaniu.");
      setIsLoading(false);
      setTimeout(() => navigate("/login"), 3333);
    }
  };

  const isDisabled = isLoading || !email || !password || !confirmPassword;

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="space-y-4">
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={EmailIcon}
        />
        <InputField
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={LockIcon}
        />
        <InputField
          type="password"
          placeholder="Potwierdź hasło"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={LockIcon}
        />
      </div>

      <Transition
        show={!!errorMessage}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="text-center text-brand-warning text-sm bg-brand-warning/10 py-2 rounded-lg 
                        border border-brand-warning/20"
        >
          {errorMessage}
        </div>
      </Transition>

      <Transition
        show={!!successMessage}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="text-center text-brand-success text-sm bg-brand-success/10 py-2 rounded-lg 
                        border border-brand-success/20"
        >
          {successMessage}
        </div>
      </Transition>

      <motion.button
        whileHover={isDisabled ? undefined : { scale: 1.02, y: -2 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        disabled={isDisabled}
        type="submit"
        className="w-full py-3.5 px-4 gap-2 flex items-center justify-center rounded-xl font-medium shadow-lg shadow-brand-primary/30 
                  bg-brand-primary hover:bg-brand-primary/80 hover:cursor-pointer text-white transition-colors duration-250 
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-brand-primary"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          <>
            <span>Zarejestruj się</span>
            <ArrowRightIcon className="text-lg" />
          </>
        )}
      </motion.button>
    </form>
  );
};

export default RegisterForm;
