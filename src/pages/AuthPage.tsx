
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Shield, EyeIcon, EyeOffIcon, Moon, Sun } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  otp: z.string().min(6, "OTP must be at least 6 characters").max(6, "OTP must be 6 characters"),
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
    const success = await login(values.email, values.password);
    if (success) {
      navigate(from);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    const success = await register(values.name, values.email, values.password);
    if (success) {
      setShowOTP(true);
      // Set a 60 seconds timer for OTP resend
      setOtpTimer(60);
    }
  };

  const onOTPSubmit = async (values: OtpFormValues) => {
    const success = await verifyOTP(values.otp);
    if (success) {
      navigate(from);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    
    const success = await resendOTP();
    if (success) {
      // Reset timer after successful resend
      setOtpTimer(60);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-lifemate-dark' : 'bg-lifemate-light'}`}>
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full"
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
              <div className="h-12 w-12 rounded-xl bg-lifemate-purple flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="mt-6 text-3xl font-bold">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-lifemate-purple to-lifemate-purple-dark text-transparent bg-clip-text">
                LifeMate X
              </span>
            </h1>
            <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
              Your all-in-one personal life assistant
            </p>
          </div>

          <div className={`${theme === 'dark' ? 'bg-secondary/60' : 'bg-white/80'} backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-xl`}>
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
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Verify Your Email</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-600'}`}>
                    We've sent a verification code to your email.
                    Please enter it below to complete your registration.
                  </p>
                </div>

                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter 6-digit code"
                              {...field}
                              className="text-center tracking-widest"
                              maxLength={6}
                            />
                          </FormControl>
                          <FormMessage />
                          
                          {/* OTP debugging info for development */}
                          <p className="text-xs text-muted-foreground mt-1">
                            For development: Use any 6-digit code or check console for the generated code
                          </p>
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full bg-lifemate-purple hover:bg-lifemate-purple-dark"
                        disabled={otpForm.formState.isSubmitting}
                      >
                        {otpForm.formState.isSubmitting ? "Verifying..." : "Verify"}
                      </Button>
                    </div>

                    <div className="flex justify-between text-center text-sm pt-2">
                      <Button 
                        variant="link" 
                        onClick={() => setShowOTP(false)}
                        className="text-sm"
                      >
                        Back to {isRegistering ? "registration" : "login"}
                      </Button>

                      <Button 
                        variant="link" 
                        onClick={handleResendOTP}
                        disabled={otpTimer > 0}
                        className="text-sm"
                      >
                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend code"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
              By continuing, you agree to LifeMate X's Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
