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
