import { motion } from "framer-motion";
import LoginForm from "./components/LoginForm";

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans text-brand-neutral-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden
                  border bg-white/40 border-brand-accent-2/50 p-8 md:py-12"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-3xl font-light text-brand-neutral-dark mb-2 tracking-tight"
          >
            Witaj z powrotem
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="text-brand-neutral-dark/70 text-sm"
          >
            Świat poczeka, teraz czas na oddech
          </motion.p>
        </div>

        <LoginForm />

        <div className="mt-8 text-center">
          <a
            href="register"
            className="text-xs text-brand-neutral-dark/50 hover:text-brand-primary transition-colors"
          >
            Zarejestruj się
          </a>
        </div>
      </motion.div>
    </div>
  );
}
