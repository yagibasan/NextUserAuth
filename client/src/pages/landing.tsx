import { Link } from "wouter";
import { Shield, Lock, Users, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  const features = [
    {
      icon: Lock,
      title: "Secure Authentication",
      description: "Industry-standard security with encrypted passwords and secure session management",
    },
    {
      icon: Mail,
      title: "Email Verification",
      description: "Verify user emails to ensure authentic accounts and reduce spam",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Granular permissions with user and admin roles for better control",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up with your email and create a secure password",
    },
    {
      number: "02",
      title: "Verify Email",
      description: "Confirm your email address to activate your account",
    },
    {
      number: "03",
      title: "Start Managing",
      description: "Access your dashboard and manage your profile",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SecureAuth</span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" data-testid="link-login">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button data-testid="link-signup">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-10" />
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Back4App</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Modern Authentication
            <br />
            <span className="text-primary">Made Simple</span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
            Secure user authentication with email verification, password reset, and role-based access control. Built with best practices for modern web applications.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8" data-testid="button-hero-signup">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 backdrop-blur-sm" 
                data-testid="button-hero-login"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built-in features to handle all your authentication needs with enterprise-grade security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover-elevate">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-6 h-full">
                  <div className="text-5xl font-bold text-primary/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-12 bg-gradient-to-br from-primary/5 to-background">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your account today and experience secure authentication with all the features you need.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8" data-testid="button-cta-signup">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">SecureAuth</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SecureAuth. Built with Back4App.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
