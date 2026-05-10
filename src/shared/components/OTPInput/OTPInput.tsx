"use client";

import { cn } from "@/src/core/lib/utils";
import { useEffect, useRef, useState } from "react";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onChange?: (otp: string) => void;
  error?: string;
  disabled?: boolean;
  isVerifying?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onChange,
  error,
  disabled = false,
  isVerifying = false,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Call onChange callback with current OTP value
    const currentOtpString = newOtp.join("");
    onChange?.(currentOtpString);

    // Move to next input if value is entered
    if (value && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const otpString = newOtp.join("");
    if (otpString.length === length && !otpString.includes("")) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        // Call onChange callback
        const backspaceOtpString = newOtp.join("");
        onChange?.(backspaceOtpString);
      } else if (index > 0) {
        // Move to previous input
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);

    if (/^\d*$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      // Call onChange callback
      const pasteOtpString = newOtp.join("");
      onChange?.(pasteOtpString);

      // Focus on the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, length - 1);
      setActiveIndex(nextIndex);
      inputRefs.current[nextIndex]?.focus();

      // Check if OTP is complete
      const completeOtpString = newOtp.join("");
      if (completeOtpString.length === length && !completeOtpString.includes("")) {
        onComplete(completeOtpString);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(index)}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "transition-all duration-200",
              activeIndex === index
                ? "border-primary bg-primary-soft"
                : "border-border",
              error
                ? "border-error focus:ring-error"
                : "",
              isVerifying
                ? "border-success bg-success-soft"
                : "",
              disabled
                ? "bg-bg-hover cursor-not-allowed opacity-50"
                : "bg-bg-card hover:border-border-strong"
            )}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-error text-center">{error}</p>
      )}
    </div>
  );
};

export default OTPInput;
