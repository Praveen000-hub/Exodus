import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 btn-press btn-ripple gpu-accelerated",
  {
    variants: {
      variant: {
        default: "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 active:bg-orange-700 active:translate-y-0",
        destructive: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 active:bg-red-700 active:translate-y-0",
        outline: "border border-orange-500 bg-background text-orange-500 hover:bg-orange-50 hover:shadow-md hover:-translate-y-0.5 active:bg-orange-100 active:translate-y-0",
        secondary: "bg-orange-50 text-orange-600 hover:bg-orange-100 hover:shadow-md hover:-translate-y-0.5 active:bg-orange-200 active:translate-y-0",
        ghost: "text-orange-500 hover:bg-orange-50 hover:shadow-sm hover:-translate-y-0.5 active:bg-orange-100 active:translate-y-0",
        link: "text-orange-500 underline-offset-4 hover:underline hover:text-orange-600",
        success: "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 active:bg-green-700 active:translate-y-0",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-lg hover:-translate-y-0.5 active:bg-yellow-700 active:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base font-semibold",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
      animation: {
        none: "",
        pulse: "pulse-glow",
        bounce: "hover-bounce",
        float: "animate-float",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, loading = false, success = false, error = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const getButtonContent = () => {
      if (loading) {
        return (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            Loading...
          </>
        );
      }
      
      if (success) {
        return (
          <>
            <div className="w-4 h-4 mr-2 success-flash">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            Success!
          </>
        );
      }
      
      if (error) {
        return (
          <>
            <div className="w-4 h-4 mr-2 error-flash">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            Error
          </>
        );
      }
      
      return children;
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {getButtonContent()}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };