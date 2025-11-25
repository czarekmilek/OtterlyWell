import { motion } from "framer-motion";
import RegisterForm from "./components/RegisterForm";

export default function Register() {
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
            Stwórz konto
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="text-brand-neutral-dark/70 text-sm"
          >
            i zadbaj o siebie
          </motion.p>
        </div>

        <RegisterForm />

        <div className="mt-8 text-center">
          <a
            href="login"
            className="text-xs text-brand-neutral-dark/50 hover:text-brand-primary transition-colors"
          >
            Masz już konto? Zaloguj się
          </a>
        </div>
      </motion.div>
    </div>
  );
}
