
import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle2, Lock, ChevronRight, ExternalLink, RefreshCw, Eye, EyeOff, BellRing, KeyRound, FileLock2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PrivacyScore {
  overall: number;
  dataSharing: number;
  passwordSecurity: number;
  appPermissions: number;
  browsing: number;
}

interface AppPrivacyIssue {
  id: string;
  appName: string;
  issueType: "critical" | "warning" | "info";
  description: string;
  recommendedAction: string;
}

interface PrivacyTip {
  id: string;
  title: string;
  description: string;
  category: string;
}

const PrivacyGuardian = () => {
  const [privacyScore] = useState<PrivacyScore>({
    overall: 72,
    dataSharing: 65,
    passwordSecurity: 80,
    appPermissions: 60,
    browsing: 85,
  });

  const [privacyIssues] = useState<AppPrivacyIssue[]>([
    {
      id: "1",
      appName: "Social Media App",
      issueType: "critical",
      description: "Excessive data collection and sharing with third-parties",
      recommendedAction: "Review and limit data permissions",
    },
    {
      id: "2",
      appName: "Weather App",
      issueType: "warning",
      description: "Requesting location access even when not in use",
      recommendedAction: "Set location permission to 'Only While Using'",
    },
    {
      id: "3",
      appName: "Shopping App",
      issueType: "warning",
      description: "Tracking your activity across other apps and websites",
      recommendedAction: "Disable cross-app tracking",
    },
    {
      id: "4",
      appName: "Photo Editing App",
      issueType: "critical",
      description: "Full access to your photo library when limited access would suffice",
      recommendedAction: "Change permission to selected photos only",
    },
    {
      id: "5",
      appName: "Fitness Tracker",
      issueType: "info",
      description: "Sharing health data with partner companies",
      recommendedAction: "Review sharing settings in app privacy options",
    },
  ]);

  const [privacyTips] = useState<PrivacyTip[]>([
    {
      id: "1",
      title: "Use a Password Manager",
      description: "Password managers help you create and store strong, unique passwords for all your accounts.",
      category: "password-security",
    },
    {
      id: "2",
      title: "Enable Two-Factor Authentication",
      description: "Adding a second layer of verification significantly improves your account security.",
      category: "password-security",
    },
    {
      id: "3",
      title: "Review App Permissions Regularly",
      description: "Check which apps have access to your camera, microphone, location, and contacts.",
      category: "app-permissions",
    },
    {
      id: "4",
      title: "Use a VPN for Public Wi-Fi",
      description: "Protect your data when using public networks by encrypting your connection.",
      category: "browsing",
    },
    {
      id: "5",
      title: "Adjust Browser Privacy Settings",
      description: "Configure your browser to block trackers and third-party cookies.",
      category: "browsing",
    },
  ]);

  const getPrivacyScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getPrivacyScoreText = (score: number) => {
    if (score >= 80) return "Good";
    if (score >= 60) return "Needs Improvement";
    return "Poor";
  };

  const getPrivacyScoreProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Shield className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Privacy Guardian</h1>
        <p className="text-muted-foreground">
          Protect your data, detect leaks, and improve your online privacy
        </p>
      </header>

      {/* Privacy Score Overview */}
      <Card className="border-lifemate-purple/30 bg-lifemate-purple/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44">
                <div className="absolute inset-0 rounded-full border-8 border-secondary"></div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-transparent"
                  style={{ 
                    borderTopColor: `hsl(${(privacyScore.overall / 100) * 120}, 100%, 50%)`, 
                    transform: `rotate(${(privacyScore.overall / 100) * 360}deg)`,
                    transition: 'transform 1s ease'
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className={`text-4xl font-bold ${getPrivacyScoreColor(privacyScore.overall)}`}>
                    {privacyScore.overall}
                  </div>
                  <div className="text-sm text-muted-foreground">Privacy Score</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg font-medium">
                  Overall Rating: <span className={getPrivacyScoreColor(privacyScore.overall)}>
                    {getPrivacyScoreText(privacyScore.overall)}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col justify-center space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Data Sharing</span>
                  <span className={`text-sm ${getPrivacyScoreColor(privacyScore.dataSharing)}`}>
                    {privacyScore.dataSharing}%
                  </span>
                </div>
                <Progress 
                  value={privacyScore.dataSharing} 
                  className={`h-2 ${getPrivacyScoreProgressColor(privacyScore.dataSharing)}`} 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Password Security</span>
                  <span className={`text-sm ${getPrivacyScoreColor(privacyScore.passwordSecurity)}`}>
                    {privacyScore.passwordSecurity}%
                  </span>
                </div>
                <Progress 
                  value={privacyScore.passwordSecurity} 
                  className={`h-2 ${getPrivacyScoreProgressColor(privacyScore.passwordSecurity)}`} 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">App Permissions</span>
                  <span className={`text-sm ${getPrivacyScoreColor(privacyScore.appPermissions)}`}>
                    {privacyScore.appPermissions}%
                  </span>
                </div>
                <Progress 
                  value={privacyScore.appPermissions} 
                  className={`h-2 ${getPrivacyScoreProgressColor(privacyScore.appPermissions)}`} 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Browsing Privacy</span>
                  <span className={`text-sm ${getPrivacyScoreColor(privacyScore.browsing)}`}>
                    {privacyScore.browsing}%
                  </span>
                </div>
                <Progress 
                  value={privacyScore.browsing} 
                  className={`h-2 ${getPrivacyScoreProgressColor(privacyScore.browsing)}`} 
                />
              </div>
              
              <div className="pt-2">
                <Button className="w-full sm:w-auto bg-lifemate-purple hover:bg-lifemate-purple-dark">
                  <Shield className="h-4 w-4 mr-2" /> Run Privacy Scan
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="privacy-issues" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="privacy-issues">Privacy Issues</TabsTrigger>
          <TabsTrigger value="privacy-settings">Privacy Settings</TabsTrigger>
          <TabsTrigger value="privacy-tips">Privacy Tips</TabsTrigger>
        </TabsList>

        {/* Privacy Issues Tab */}
        <TabsContent value="privacy-issues">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">App Privacy Issues</h2>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" /> Rescan Apps
              </Button>
            </div>

            <div className="space-y-4">
              {privacyIssues.map((issue) => (
                <Card key={issue.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {getIssueTypeIcon(issue.issueType)}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {issue.appName}
                                </h3>
                                <Badge
                                  className={cn(
                                    issue.issueType === "critical" && "bg-red-500",
                                    issue.issueType === "warning" && "bg-yellow-500",
                                    issue.issueType === "info" && "bg-blue-500"
                                  )}
                                >
                                  {issue.issueType.charAt(0).toUpperCase() + issue.issueType.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {issue.description}
                              </p>
                            </div>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  Fix Issue <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Fix Privacy Issue</DialogTitle>
                                  <DialogDescription>
                                    Follow these steps to address the privacy issue with {issue.appName}.
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <p className="font-semibold">Issue:</p>
                                    <p className="text-muted-foreground">{issue.description}</p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <p className="font-semibold">Recommended Action:</p>
                                    <p className="text-muted-foreground">{issue.recommendedAction}</p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <p className="font-semibold">Steps to Fix:</p>
                                    <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                                      <li>Open your device's Settings app</li>
                                      <li>Navigate to Apps or Application Manager</li>
                                      <li>Find and tap on {issue.appName}</li>
                                      <li>Go to Permissions or Privacy settings</li>
                                      <li>{issue.recommendedAction}</li>
                                    </ol>
                                  </div>
                                </div>

                                <DialogFooter>
                                  <Button variant="outline">
                                    <ExternalLink className="h-4 w-4 mr-2" /> Open App Settings
                                  </Button>
                                  <Button>Verify Fix</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border border-yellow-500/30 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Data Breach Scanner
                </CardTitle>
                <CardDescription>
                  Check if your personal information has been exposed in data breaches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your email address to check if your data has been involved in known security breaches. 
                  We'll scan security breach databases for your information.
                </p>
                
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex h-10 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <Button>Scan Now</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your email is only used for the scan and isn't stored.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Privacy Settings Tab */}
        <TabsContent value="privacy-settings">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-lifemate-purple" /> 
                  Account Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Password Manager Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Securely store and autofill passwords
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Login Alert Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <Switch checked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-Lock App</Label>
                    <p className="text-sm text-muted-foreground">
                      Lock app after 5 minutes of inactivity
                    </p>
                  </div>
                  <Switch checked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-lifemate-purple" /> 
                  Data Collection Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Analytics Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Share anonymous usage data to improve the app
                    </p>
                  </div>
                  <Switch checked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Personalized Advertising</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow targeted ads based on your interests
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Third-Party Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Share data with partner services
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Error Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Send crash reports to improve stability
                    </p>
                  </div>
                  <Switch checked />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileLock2 className="h-5 w-5 text-lifemate-purple" /> 
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You have control over your personal data. You can download all your information
                  or delete your account and all associated data.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button variant="outline">
                    Download My Data
                  </Button>
                  <Button variant="destructive">
                    Delete Account & Data
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground pt-2">
                  Note: Account deletion is permanent and cannot be undone. All your personal data will be permanently removed.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Privacy Tips Tab */}
        <TabsContent value="privacy-tips">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-blue-500/30 bg-blue-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-blue-500" /> 
                    Password Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {privacyTips
                      .filter((tip) => tip.category === "password-security")
                      .map((tip) => (
                        <li key={tip.id} className="flex gap-2">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{tip.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {tip.description}
                            </p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-500/30 bg-purple-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-purple-500" /> 
                    App Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {privacyTips
                      .filter((tip) => tip.category === "app-permissions")
                      .map((tip) => (
                        <li key={tip.id} className="flex gap-2">
                          <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{tip.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {tip.description}
                            </p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-green-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <EyeOff className="h-5 w-5 text-green-500" /> 
                    Safe Browsing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {privacyTips
                      .filter((tip) => tip.category === "browsing")
                      .map((tip) => (
                        <li key={tip.id} className="flex gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{tip.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {tip.description}
                            </p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Privacy Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-secondary/60 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-lifemate-purple" />
                        Use Privacy-Focused Browsers
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Consider using browsers that prioritize your privacy and block trackers by default,
                        such as Firefox with privacy enhancements or Brave.
                      </p>
                    </div>
                    
                    <div className="bg-secondary/60 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-lifemate-purple" />
                        Enable HTTPS Everywhere
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Make sure your connections to websites are encrypted. Most browsers now indicate when
                        a connection isn't secure. Avoid transmitting sensitive information on non-HTTPS sites.
                      </p>
                    </div>
                    
                    <div className="bg-secondary/60 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-lifemate-purple" />
                        Adjust Social Media Privacy
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Review the privacy settings on all your social media accounts. Limit who can see your posts,
                        personal information, and consider what data social platforms are collecting.
                      </p>
                    </div>
                    
                    <div className="bg-secondary/60 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-lifemate-purple" />
                        Regular Security Audits
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Perform periodic security check-ups. Review active sessions, connected apps,
                        and authorized devices for all your important accounts.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">
                  View Full Privacy Guide <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrivacyGuardian;
