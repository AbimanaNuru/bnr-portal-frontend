"use client";

import { Button, InputTextField } from "@/src/design-system";
import { loginSchema, type LoginFormValues } from "@/src/features/auth/validation/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Eye, EyeOff, Key } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useLogin } from "@/src/features/auth/hooks/use-auth.hooks";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginMutation, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Log in</h1>
        <p className="text-text-secondary">Welcome back! Please enter your details.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputTextField
          label="Email"
          type="email"
          placeholder="Enter your email"
          register={register}
          name="email"
          icon={<AtSign />}
          error={errors.email?.message}
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

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <input
              type="checkbox"
              id="remember"
              {...register("rememberMe")}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/40 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors cursor-pointer"
            >
              Remember for 30 days
            </label>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            Forgot password
          </Link>
        </div>

        <div className="space-y-4">
          <Button 
            variant="primary" 
            className="w-full" 
            size="lg" 
            type="submit" 
            isLoading={isPending}
            disabled={isPending}
          >
            Sign in
          </Button>

          <Button variant="outline" className="w-full gap-3 text-text-primary" size="lg" type="button">
            Sign up with Google
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-text-secondary">
        Don't have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
