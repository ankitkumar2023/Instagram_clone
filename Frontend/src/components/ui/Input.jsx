import React from "react";
import { tv } from "tailwind-variants";
import { clsx } from "clsx";

// Define Input Styles
const inputStyles = tv({
  base: "border rounded-md outline-none transition-all w-full",
  variants: {
    size: {
      sm: "p-2 text-sm",
      md: "p-3 text-base",
      lg: "p-4 text-lg",
    },
    error: {
      true: "border-red-500 focus:ring-red-500",
      false: "border-gray-300 focus:ring-blue-500",
    },
  },
  defaultVariants: {
    size: "md",
    error: false,
  },
});

// Input Component
const Input = ({ label, size, error, className, icon: Icon, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
        <input
          className={clsx(
            inputStyles({ size, error }),
            Icon ? "pl-10" : "",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default Input;
