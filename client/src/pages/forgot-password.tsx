import { Link } from "wouter";
import { Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordResetRequestSchema, type PasswordResetRequest } from "@shared/schema";

interface ForgotPasswordProps {
  onResetRequest: (data: PasswordResetRequest) => Promise<void>;
  isLoading?: boolean;
  emailSent?: boolean;
}

export default function ForgotPassword({ onResetRequest, isLoading = false, emailSent = false }: ForgotPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetRequest>({
    resolver: zodResolver(passwordResetRequestSchema),
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-lg p-8 md:p-12">
        {emailSent ? (
          <div className="text-center">
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mx-auto mb-6">
              <Mail className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Check Your Email</h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We've sent password reset instructions to your email address. 
              Please check your inbox and follow the link to reset your password.
            </p>
            <Link href="/login">
              <Button className="h-12 px-8" data-testid="button-back-to-login">
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-4">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
              <p className="text-muted-foreground text-center">
                Enter your email address and we'll send you instructions to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit(onResetRequest)} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="h-12 mt-2"
                  data-testid="input-email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1" data-testid="error-email">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 mt-8"
                disabled={isLoading}
                data-testid="button-reset-password"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-back-to-login">
                ← Back to login
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
