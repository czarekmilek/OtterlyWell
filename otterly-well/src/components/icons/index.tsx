import React from "react";

interface IconProps {
  className?: string;
}

export const CalorieIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>
    local_fire_department
  </span>
);

export const WorkoutIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>fitness_center</span>
);

export const FinanceIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>payments</span>
);

export const TaskIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>task_alt</span>
);

export const DashboardIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>dashboard</span>
);

export const MenuIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>menu</span>
);

export const QrCodeIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>qr_code_scanner</span>
);

export const DeleteIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>clear</span>
);

export const WarningIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>warning</span>
);

export const EmailIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>mail</span>
);

export const LockIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>lock</span>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>arrow_forward</span>
);

export const LoadingIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>
    progress_activity
  </span>
);

export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>settings</span>
);

export const LogoutIcon: React.FC<IconProps> = ({ className }) => (
  <span className={`material-symbols-sharp ${className}`}>logout</span>
);
