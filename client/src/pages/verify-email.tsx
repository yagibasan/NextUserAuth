import { Link } from "wouter";
import { Shield, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

interface VerifyEmailProps {
  email?: string;
  onResendVerification?: () => Promise<void>;
  isLoading?: boolean;
  verified?: boolean;
}

export default function VerifyEmail({ 
  email, 
  onResendVerification, 
  isLoading = false,
  verified = false 
}: VerifyEmailProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-lg p-8 md:p-12 text-center">
        {verified ? (
          <>
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mx-auto mb-6">
              <CheckCircle2 className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Email Verified!</h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Your email has been successfully verified. You can now access all features of your account.
            </p>
            <Link href="/dashboard">
              <Button className="h-12 px-8" data-testid="button-go-to-dashboard">
                Go to Dashboard
              </Button>
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mx-auto mb-6">
              <Mail className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Verify Your Email</h1>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We've sent a verification email to:
            </p>
            <p className="text-lg font-medium mb-8">{email || 'your email address'}</p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Please check your inbox and click the verification link to activate your account.
            </p>

            {onResendVerification && (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="h-12 px-8"
                  onClick={onResendVerification}
                  disabled={isLoading}
                  data-testid="button-resend-verification"
                >
                  {isLoading ? "Sending..." : "Resend Verification Email"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or click above to resend.
                </p>
              </div>
            )}

            <div className="mt-8">
              <Link href="/login">
                <a className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-back-to-login">
                  ← Back to login
                </a>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
