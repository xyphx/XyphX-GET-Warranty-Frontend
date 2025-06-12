import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: isLogin ? "User" : formData.fullName,
        email: formData.email
      })
    );

    toast({
      title: "Success!",
      description: isLogin ? "Welcome back!" : "Account created successfully!"
    });

    navigate("/dashboard");
  };

  return (
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={e => handleInputChange("fullName", e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={e => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={e => handleInputChange("password", e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={e => handleInputChange("confirmPassword", e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-lg font-semibold hover:bg-white hover:text-gray-900 border hover:border-gray-900 transition-colors">
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
            className="mt-2 px-8 font-semibold hover:bg-transparent hover:border hover:bg-white hover:border-gray-900"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Login;
