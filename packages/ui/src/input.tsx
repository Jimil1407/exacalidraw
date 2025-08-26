"use client";

import { useState } from "react";

interface InputProps {
  id?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showPasswordToggle?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Input({
  id,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
  showPasswordToggle = false,
  size = "md",
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  const baseClasses = "w-full bg-white border-2 text-gray-900 placeholder:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-offset-gray-900";
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-3 sm:px-4 py-2.5 sm:py-3 text-base",
    lg: "px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg"
  };
  
  const stateClasses = error 
    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
    : isFocused 
    ? "border-blue-500 focus:border-blue-500 focus:ring-blue-500" 
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400";

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "";

  const classes = `${baseClasses} ${sizeClasses[size]} ${stateClasses} ${disabledClasses} ${className}`;

  const labelSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className="space-y-3">
      {label && (
        <label htmlFor={id} className={`block text-gray-700 dark:text-gray-300 font-medium ${labelSizeClasses[size]}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          disabled={disabled}
          className={classes}
        />
        
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded ${
              size === "lg" ? "w-6 h-6" : size === "sm" ? "w-4 h-4" : "w-5 h-5"
            }`}
          >
            {showPassword ? (
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className={`text-red-500 dark:text-red-400 flex items-center gap-2 ${size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"}`}>
          <svg className={`${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
