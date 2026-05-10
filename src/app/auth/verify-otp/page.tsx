"use client";

import { Button, InputTextField } from "@/src/design-system";
import { otpSchema, type OtpFormValues } from "@/src/features/auth/validation/otp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useVerifyOtp, useResendOtp } from "@/src/features/auth/hooks/use-auth.hooks";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifyOtpPage() {
  const email = useAuthStore((s) => s.email);
  const status = useAuthStore((s) => s.status);
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);

  const { mutate: verifyOtpMutation, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOtpMutation, isPending: isResending } = useResendOtp();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      email: email || "",
      otp: "",
    },
  });

  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please try again.");
      router.push("/auth/login");
    } else {
      setValue("email", email);
    }
  }, [email, router, setValue]);

  useEffect(() => {
    if (status === "AUTHENTICATED") {
      router.push("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = (data: OtpFormValues) => {
    verifyOtpMutation(data);
  };

  const handleResend = () => {
    if (email) {
      resendOtpMutation({ email });
      setCountdown(60); // 60 seconds cooldown
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Security Verification
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Verify your email
        </h1>
        <p className="text-text-secondary">
          We've sent a 6-digit verification code to <span className="font-semibold text-text-primary">{email}</span>.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputTextField
          label="Verification Code"
          type="text"
          placeholder="Enter 6-digit code"
          register={register}
          name="otp"
          icon={<ShieldCheck />}
          error={errors.otp?.message}
          inputProps={{ maxLength: 6 }}
          required
        />

        <div className="space-y-4">
          <Button
            variant="primary"
            className="w-full"
            size="lg"
            type="submit"
            isLoading={isVerifying}
            disabled={isVerifying}
          >
            Verify Code
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || countdown > 0}
              className="text-sm font-semibold text-primary hover:text-primary-hover disabled:text-text-muted transition-colors"
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : "Didn't receive a code? Resend"}
            </button>
          </div>
        </div>
      </form>

      <p className="text-center text-sm text-text-muted">
        Want to try another email?{" "}
        <button
          onClick={() => router.push("/auth/login")}
          className="font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Go back
        </button>
      </p>
    </div>
  );
}
