import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/src/core/lib/utils";

const buttonVariants = cva(
    // Base styles
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                // Primary — brand colour from design system
                primary:
                    "bg-primary text-text-static-white shadow-md shadow-primary/25 hover:bg-primary-hover hover:shadow-primary/40 focus-visible:ring-primary",

                // Default — alias for primary
                default:
                    "bg-primary text-text-inverse shadow-md shadow-primary/25 hover:bg-primary-hover hover:shadow-primary/40 focus-visible:ring-primary",

                // Destructive
                destructive:
                    "bg-error text-text-inverse shadow-md shadow-error/25 hover:bg-error/80 hover:shadow-error/40 focus-visible:ring-error",

                // Outline — ghost-style with border
                outline:
                    "border border-border bg-bg-card text-text-primary shadow-sm hover:bg-bg-hover hover:text-text-primary focus-visible:ring-primary",

                // Secondary — muted background
                secondary:
                    "bg-bg-elevated text-text-primary shadow-sm hover:bg-bg-hover focus-visible:ring-border-strong",

                // Ghost — no background
                ghost:
                    "text-text-secondary hover:bg-bg-hover hover:text-text-primary focus-visible:ring-primary",

                // Semantic variants
                success:
                    "bg-success text-text-inverse shadow-md shadow-success/25 hover:bg-success/90 hover:shadow-success/40 focus-visible:ring-success",
                warning:
                    "bg-warning text-text-inverse shadow-md shadow-warning/25 hover:bg-warning/90 hover:shadow-warning/40 focus-visible:ring-warning",
                info:
                    "bg-info text-text-inverse shadow-md shadow-info/25 hover:bg-info/90 hover:shadow-info/40 focus-visible:ring-info",

                // Link
                link: "text-primary underline-offset-4 hover:underline shadow-none",
            },
            size: {
                default: "h-11 px-5 py-3",
                sm: "h-8 rounded-lg px-3 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                md: "h-12 rounded-xl px-8 text-base",
                icon: "h-9 w-9",
            },
            fullWidth: {
                true: "w-full",
                false: "",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            fullWidth: false,
        },
    }
);

import { Loader2 } from "lucide-react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, asChild = false, isLoading, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {children}
                    </>
                ) : (
                    children
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
