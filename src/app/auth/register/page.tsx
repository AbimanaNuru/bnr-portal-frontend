"use client";

import { Button, InputTextField } from "@/src/design-system";
import { useRegister } from "@/src/features/auth/hooks/use-auth.hooks";
import { signupSchema, type SignupFormValues } from "@/src/features/auth/validation/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Building, Eye, EyeOff, Key, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: registerMutation, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      institutionName: "",
      terms: false,
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    registerMutation({
      full_name: data.fullName,
      email: data.email,
      password: data.password,
      institution_name: data.institutionName,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">

        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Create an account
        </h1>
        <p className="text-text-secondary">
          Register as an applicant institution representative.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputTextField
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          register={register}
          name="fullName"
          icon={<User />}
          error={errors.fullName?.message}
          required
        />

        <InputTextField
          label="Email address"
          type="email"
          placeholder="Enter your official email"
          register={register}
          name="email"
          icon={<AtSign />}
          error={errors.email?.message}
          required
        />

        <InputTextField
          label="Institution Name"
          type="text"
          placeholder="Enter your institution name"
          register={register}
          name="institutionName"
          icon={<Building />}
          error={errors.institutionName?.message}
          required
        />

        <div className="relative">
          <InputTextField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            register={register}
            icon={<Key />}
            name="password"
            error={errors.password?.message}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-text-muted hover:text-text-secondary transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <InputTextField
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          register={register}
          icon={<Key />}
          name="confirmPassword"
          error={errors.confirmPassword?.message}
          required
        />

        <div className="flex items-start space-x-2 group cursor-pointer">
          <input
            type="checkbox"
            id="terms"
            {...register("terms")}
            className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/40 cursor-pointer"
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors cursor-pointer"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-xs text-error font-medium">{errors.terms.message}</p>
        )}

        <Button
          variant="primary"
          className="w-full"
          size="lg"
          type="submit"
          isLoading={isPending}
          disabled={isPending}
        >
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
