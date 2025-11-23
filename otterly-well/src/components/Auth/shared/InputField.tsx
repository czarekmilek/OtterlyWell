import { motion } from "framer-motion";

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ElementType;
}

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
}: InputFieldProps) => (
  <div className="relative group">
    <div
      className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none 
                  text-brand-neutral-dark/50 group-focus-within:text-brand-primary 
                  transition-colors duration-300"
    >
      <Icon className="text-xl" hidden={value} />
    </div>
    <motion.input
      whileFocus={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-white/50 backdrop-blur-lg 
              text-brand-neutral-dark placeholder-brand-neutral-dark/50 shadow-sm ring-1 
              ring-brand-depth focus:ring-2 focus:ring-brand-primary focus:outline-none 
              focus:bg-brand-neutral-light transition-colors duration-300"
    />
  </div>
);

export default InputField;
