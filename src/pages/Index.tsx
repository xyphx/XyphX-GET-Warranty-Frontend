
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const features = [
    "Track your Warranties",
    "Manage Pollution Checkups", 
    "Never Miss an Insurance Renewal",
    "Subscription & Bill Tracking"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive"
      });
      return;
    }

    // Simulate authentication
    localStorage.setItem('user', JSON.stringify({
      name: isLogin ? 'User' : formData.fullName,
      email: formData.email
    }));
    
    toast({
      title: "Success!",
      description: isLogin ? "Welcome back!" : "Account created successfully!"
    });
    
    navigate('/dashboard');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - About Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/20 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-bold mb-8 leading-tight text-primary-foreground">
            GET-Warranty
          </h1>
          <p className="text-2xl mb-12 opacity-90 font-light text-primary-foreground/90">
            Your premium solution for managing warranties, renewals, and subscriptions
          </p>
          
          <div className="space-y-6 mb-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center space-x-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-3 h-3 bg-muted rounded-full shadow-lg"></div>
                <span className="text-xl font-medium text-primary-foreground">{feature}</span>
              </div>
            ))}
          </div>
          
          <p className="text-xl opacity-80 font-light text-primary-foreground/80">
            Built with 💜 by <span className="font-bold text-muted">XyphX</span>
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-md glass-effect border-0 premium-shadow bg-card/80 backdrop-blur-lg">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              {isLogin ? "Sign in to your premium account" : "Join the GET-Warranty premium experience"}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold text-foreground">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required={!isLogin}
                    className="bg-background/80 backdrop-blur-sm border-2 border-border h-12 text-base"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="bg-background/80 backdrop-blur-sm border-2 border-border h-12 text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="bg-background/80 backdrop-blur-sm border-2 border-border h-12 text-base"
                />
              </div>
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required={!isLogin}
                    className="bg-background/80 backdrop-blur-sm border-2 border-border h-12 text-base"
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full gradient-primary text-primary-foreground h-12 text-lg font-semibold hover-lift"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="mt-2 text-primary hover:text-primary/80 font-semibold"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
