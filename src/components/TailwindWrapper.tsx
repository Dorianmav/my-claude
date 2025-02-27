import React from "react";

interface TailwindWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const TailwindWrapper: React.FC<TailwindWrapperProps> = ({ children, className }) => (
  <div className={className}>{children}</div>
);
