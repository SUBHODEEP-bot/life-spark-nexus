
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Shield, EyeIcon, EyeOffIcon, Moon, Sun, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Login Form Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration Form Schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// OTP Verification Schema
const otpSchema = z.object({
  otp: z.string().length(6, "Verification code must be 6 digits"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, verifyOTP, resendOTP, theme, toggleTheme } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [authError, setAuthError] = useState("");
  const otpInputRef = useRef<HTMLInputElement>(null);
  
  const from = (location.state as { from?: string })?.from || "/dashboard";

  // OTP resend timer
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  // Focus OTP input when showing the verification form
  useEffect(() => {
    if (showOTP && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [showOTP]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setAuthError("");
    const response = await login(values.email, values.password);
    
    if (response.success) {
      toast({
        title: "Login successful",
        description: "Welcome back to LifeMate X!",
      });
      navigate(from);
    } else {
      // Check if user needs to verify email
      if (response.message.includes("not verified")) {
        setShowOTP(true);
        setOtpTimer(60);
        toast({
          title: "Email verification required",
          description: "Please verify your email to continue",
        });
      } else {
        // Display error message
        setAuthError(response.message);
        toast({
          title: "Login failed",
          description: response.message,
          variant: "destructive",
        });
      }
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setAuthError("");
    const response = await register(values.name, values.email, values.password);
    
    if (response.success) {
      setShowOTP(true);
      // Set a 60 seconds timer for OTP resend
      setOtpTimer(60);
      // Show debug info in console
      console.log("[Development] Check console for OTP code");
      
      toast({
        title: "Registration initiated",
        description: "Please verify your email to complete registration",
      });
    } else {
      setAuthError(response.message);
      
      toast({
        title: "Registration failed",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  const onOTPSubmit = async (values: OtpFormValues) => {
    setAuthError("");
    const response = await verifyOTP(values.otp);
    
    if (response.success) {
      toast({
        title: "Verification successful",
        description: "Your account has been verified successfully!",
      });
      navigate(from);
    } else {
      setAuthError(response.message);
      toast({
        title: "Verification failed",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0 || isResending) return;
    
    setIsResending(true);
    try {
      const success = await resendOTP();
      if (success) {
        // Reset timer after successful resend
        setOtpTimer(60);
        toast({
          title: "Verification code resent",
          description: "Please check your email for the new code",
        });
      } else {
        toast({
          title: "Failed to resend code",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={`auth-container ${theme}`}>
      <div className="absolute top-4 right-4 flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full bg-secondary/40 backdrop-blur-sm border-border/30"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-2xl bg-lifemate-purple flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mt-6 text-4xl font-bold">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-lifemate-purple to-lifemate-purple-dark text-transparent bg-clip-text">
                LifeMate X
              </span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Your all-in-one personal life assistant
            </p>
          </div>

          <div className={`auth-card ${theme}`}>
            {authError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive">
                {authError}
              </div>
            )}
            
            {!showOTP ? (
              <Tabs defaultValue="login" onValueChange={(value) => setIsRegistering(value === "register")}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOffIcon className="h-4 w-4" />
                                  ) : (
                                    <EyeIcon className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          className="w-full bg-lifemate-purple hover:bg-lifemate-purple-dark"
                          disabled={loginForm.formState.isSubmitting}
                        >
                          {loginForm.formState.isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOffIcon className="h-4 w-4" />
                                  ) : (
                                    <EyeIcon className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOffIcon className="h-4 w-4" />
                                  ) : (
                                    <EyeIcon className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          className="w-full bg-lifemate-purple hover:bg-lifemate-purple-dark"
                          disabled={registerForm.formState.isSubmitting}
                        >
                          {registerForm.formState.isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold">Verify Your Email</h3>
                  <p className="text-muted-foreground mt-2">
                    We've sent a verification code to your email.
                    Please enter it below to complete your registration.
                  </p>
                </div>

                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-6">
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="flex justify-center">
                            <InputOTP maxLength={6} {...field}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                          <FormMessage className="text-center" />
                          
                          {/* Debug info */}
                          <div className="bg-secondary/50 rounded-md p-3 mt-4 border border-border/30">
                            <p className="text-xs text-muted-foreground">
                              <strong>Development Note:</strong> For testing, check the generated OTP code in the browser console logs.
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div>
                      <Button 
                        type="submit" 
                        className="w-full bg-lifemate-purple hover:bg-lifemate-purple-dark"
                        disabled={otpForm.formState.isSubmitting}
                      >
                        {otpForm.formState.isSubmitting ? "Verifying..." : "Verify Code"}
                      </Button>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => setShowOTP(false)}
                        className="text-sm"
                      >
                        Back to {isRegistering ? "registration" : "login"}
                      </Button>

                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={handleResendOTP}
                        disabled={otpTimer > 0 || isResending}
                        className="text-sm flex items-center gap-1"
                      >
                        {isResending ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                            Sending...
                          </>
                        ) : otpTimer > 0 ? (
                          `Resend in ${otpTimer}s`
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Resend code
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to LifeMate X's Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
