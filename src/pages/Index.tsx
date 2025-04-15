
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, ChevronRight, CheckCircle2 } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const features = [
    "AI Daily Planner & Task Management",
    "Personal Health & Wellness Assistant",
    "Complete YOUR YOGA Module with Pose Detection",
    "Smart Email & News Digest with Voice Summary",
    "Finance Tracker with Budget Suggestions",
    "AI Chat Companion for Mental Wellbeing",
    "Family Sync System with Location Sharing",
    "Privacy Guardian & Data Protection",
    "20+ Integrated Life Management Tools"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 bg-secondary/80 backdrop-blur-sm">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-lifemate-purple flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-lifemate-purple to-lifemate-purple-dark text-transparent bg-clip-text">
              LifeMate X
            </span>
          </div>
          <Button onClick={handleGetStarted}>Get Started</Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-lifemate-purple to-lifemate-purple-dark text-transparent bg-clip-text">
                    All-In-One Daily Life
                  </span>{" "}
                  <br />
                  Assistant App
                </h1>
                <p className="text-lg text-muted-foreground">
                  LifeMate X combines 20 powerful modules to streamline your daily life,
                  health, finances, and more - all powered by AI to adapt to your unique needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={handleGetStarted} className="bg-lifemate-purple hover:bg-lifemate-purple-dark text-white">
                    Get Started <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-lifemate-purple/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-lifemate-purple-dark/20 rounded-full blur-3xl"></div>
                <div className="relative bg-secondary/40 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden shadow-2xl">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                      alt="LifeMate X App Interface" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-lifemate-dark to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-secondary/80 backdrop-blur-sm rounded-lg p-4 border border-border/40 shadow-lg">
                      <h3 className="text-xl font-semibold mb-2">Personal Dashboard</h3>
                      <p className="text-sm text-muted-foreground">
                        Stay organized with your personalized AI-powered dashboard
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                LifeMate X brings together everything you need to manage your daily life
                in one beautiful, intelligent application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4">
                  <CheckCircle2 className="h-5 w-5 text-lifemate-purple shrink-0 mt-1" />
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your daily life?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of users who are already experiencing the power of
              LifeMate X to organize, optimize, and enhance their daily routines.
            </p>
            <Button size="lg" onClick={handleGetStarted} className="bg-lifemate-purple hover:bg-lifemate-purple-dark text-white">
              Get Started Today
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-secondary/80 backdrop-blur-sm border-t border-border/40 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-lifemate-purple flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-lifemate-purple to-lifemate-purple-dark text-transparent bg-clip-text">
                LifeMate X
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LifeMate X. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
