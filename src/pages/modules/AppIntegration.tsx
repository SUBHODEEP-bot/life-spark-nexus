
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  AppWindow, 
  Bell, 
  Plus, 
  Search, 
  Settings, 
  Trash2, 
  Smartphone, 
  ExternalLink, 
  Link2, 
  BellRing,
  Monitor,
  CheckCircle2,
  X,
  RefreshCw
} from "lucide-react";

// Define schema for app integration
const appFormSchema = z.object({
  appName: z.string().min(2, {
    message: "App name must be at least 2 characters.",
  }),
  appUrl: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
});

// Mock data for integrated apps
const mockIntegratedApps = [
  { 
    id: "1", 
    name: "Gmail", 
    icon: "https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_32dp.png", 
    category: "Email",
    connected: true,
    notificationCount: 3
  },
  { 
    id: "2", 
    name: "Slack", 
    icon: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png", 
    category: "Communication",
    connected: true,
    notificationCount: 7
  },
  { 
    id: "3", 
    name: "Google Calendar", 
    icon: "https://www.gstatic.com/images/branding/product/1x/calendar_48dp.png", 
    category: "Productivity",
    connected: true,
    notificationCount: 1
  },
  { 
    id: "4", 
    name: "Trello", 
    icon: "https://d2k1ftgv7pobq7.cloudfront.net/meta/u/res/images/trello-header-logos/76ceb1faa939ede03abacb6efacdde16/trello-logo-blue.svg", 
    category: "Productivity",
    connected: false,
    notificationCount: 0
  },
];

// Mock data for app categories
const appCategories = [
  "Communication", 
  "Productivity", 
  "Social Media", 
  "Email", 
  "Entertainment",
  "Finance",
  "Health & Fitness",
  "Travel",
  "Other"
];

// Mock data for notifications
const mockNotifications = [
  { 
    id: "n1", 
    appId: "1", 
    appName: "Gmail", 
    icon: "https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_32dp.png", 
    message: "3 new emails from work", 
    time: "5 minutes ago" 
  },
  { 
    id: "n2", 
    appId: "2", 
    appName: "Slack", 
    icon: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png", 
    message: "Jane mentioned you in #project-alpha", 
    time: "10 minutes ago" 
  },
  { 
    id: "n3", 
    appId: "2", 
    appName: "Slack", 
    icon: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png", 
    message: "New message from John in DM", 
    time: "15 minutes ago" 
  },
  { 
    id: "n4", 
    appId: "3", 
    appName: "Google Calendar", 
    icon: "https://www.gstatic.com/images/branding/product/1x/calendar_48dp.png", 
    message: "Meeting 'Project Review' starts in 15 minutes", 
    time: "20 minutes ago" 
  },
];

const AppIntegration = () => {
  const [activeTab, setActiveTab] = useState("my-apps");
  const [searchQuery, setSearchQuery] = useState("");
  const [apps, setApps] = useState(mockIntegratedApps);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [uploadingApp, setUploadingApp] = useState(false);
  
  const { toast } = useToast();

  const form = useForm<z.infer<typeof appFormSchema>>({
    resolver: zodResolver(appFormSchema),
    defaultValues: {
      appName: "",
      appUrl: "",
      category: "",
    },
  });

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddApp = (values: z.infer<typeof appFormSchema>) => {
    // Create a new app with the form values
    const newApp = {
      id: `app-${Date.now()}`,
      name: values.appName,
      icon: "https://cdn-icons-png.flaticon.com/512/0/747.png", // Default icon
      category: values.category,
      connected: true,
      notificationCount: 0
    };

    // Add the new app to the state
    setApps([...apps, newApp]);

    // Reset the form
    form.reset();
    
    // Show success toast
    toast({
      title: "App added successfully",
      description: `${values.appName} has been added to your integrations`,
    });
  };

  const handleConnectDevice = () => {
    setUploadingApp(true);
    
    // Simulate device connection process
    setTimeout(() => {
      setUploadingApp(false);
      toast({
        title: "Device connected successfully",
        description: "Your device apps are now available for integration",
      });
    }, 1500);
  };

  const handleRemoveApp = (appId: string) => {
    setApps(apps.filter(app => app.id !== appId));
    setNotifications(notifications.filter(notification => notification.appId !== appId));
    
    toast({
      title: "App removed",
      description: "The app has been removed from your integrations",
    });
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    
    // Update app notification counts
    setApps(apps.map(app => ({
      ...app,
      notificationCount: 0
    })));
    
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared",
    });
  };

  const handleRefreshApps = () => {
    toast({
      title: "Refreshing apps",
      description: "Checking for new apps and updates...",
    });
    
    // Simulate refresh process
    setTimeout(() => {
      toast({
        title: "Apps refreshed",
        description: "Your app list is now up to date",
      });
    }, 1000);
  };

  return (
    <div className="container max-w-5xl mx-auto space-y-8 py-8">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <AppWindow className="h-8 w-8 text-indigo-500" />
          App Integration Hub
        </h1>
        <p className="text-muted-foreground">
          Connect and manage all your applications in one place
        </p>
      </header>

      <Tabs defaultValue="my-apps" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <TabsList className="mb-2 sm:mb-0">
            <TabsTrigger value="my-apps" className="flex items-center gap-1">
              <AppWindow className="h-4 w-4" />
              <span>My Apps</span>
              <Badge className="ml-1 bg-indigo-500">{apps.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
              {notifications.length > 0 && (
                <Badge className="ml-1 bg-red-500">{notifications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="add-app">
              <Plus className="h-4 w-4 mr-1" />
              <span>Add App</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleRefreshApps}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleConnectDevice}
              disabled={uploadingApp}
            >
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Connect Device</span>
              {uploadingApp && <span className="animate-spin ml-1">◌</span>}
            </Button>
          </div>
        </div>
        
        <TabsContent value="my-apps" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <CardTitle>Integrated Applications</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search apps..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <Card key={app.id} className="overflow-hidden border-l-4 shadow-sm hover:shadow transition-all" style={{ borderLeftColor: app.connected ? '#6366f1' : '#d1d5db' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                          <img src={app.icon} alt={app.name} className="h-8 w-8 object-contain" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium flex items-center gap-1">
                            {app.name}
                            {app.connected && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                          </h3>
                          <p className="text-sm text-muted-foreground">{app.category}</p>
                        </div>
                        {app.notificationCount > 0 && (
                          <Badge className="bg-red-500">
                            {app.notificationCount}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 pt-0 flex justify-between border-t bg-slate-50 dark:bg-slate-900">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 text-xs"
                        onClick={() => handleRemoveApp(app.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-8 text-center">
                  <p className="text-muted-foreground">No apps match your search.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>App Categories</CardTitle>
              <CardDescription>Browse your apps by category</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {appCategories.map((category) => {
                const count = apps.filter(app => app.category === category).length;
                return count > 0 ? (
                  <Badge 
                    key={category} 
                    variant="outline" 
                    className="py-1.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setSearchQuery(category)}
                  >
                    {category} ({count})
                  </Badge>
                ) : null;
              })}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-indigo-500" />
                  App Notifications
                </CardTitle>
                {notifications.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearAllNotifications}
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-sm">
                      <img src={notification.icon} alt={notification.appName} className="h-6 w-6 object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">{notification.appName}</h4>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm">{notification.message}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No notifications at the moment.</p>
                  <p className="text-sm text-muted-foreground mt-1">Notifications from your integrated apps will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add-app">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New App</CardTitle>
                <CardDescription>
                  Manually add an app to your integration list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddApp)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="appName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter app name" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of the application you want to add
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="appUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App URL (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormDescription>
                            Website or access URL for the app
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              defaultValue=""
                            >
                              <option value="" disabled>Select a category</option>
                              {appCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormDescription>
                            Select the most appropriate category for this app
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Application
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Connect Device</CardTitle>
                <CardDescription>
                  Add apps directly from your connected devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                  <div className="text-center py-6">
                    <Smartphone className="h-12 w-12 mx-auto text-indigo-500 mb-3" />
                    <h3 className="text-lg font-medium">Connect Your Device</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      Scan for available apps on your device
                    </p>
                    <Button 
                      className="w-full sm:w-auto"
                      onClick={handleConnectDevice}
                      disabled={uploadingApp}
                    >
                      {uploadingApp ? (
                        <>Scanning device... <span className="animate-spin ml-1">◌</span></>
                      ) : (
                        <>Scan for Apps</>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Or Select Device Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start" onClick={handleConnectDevice}>
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={handleConnectDevice}>
                      <Monitor className="h-4 w-4 mr-2" />
                      Desktop
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">Supported Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">iOS</Badge>
                    <Badge variant="secondary">Android</Badge>
                    <Badge variant="secondary">Windows</Badge>
                    <Badge variant="secondary">macOS</Badge>
                    <Badge variant="secondary">Linux</Badge>
                    <Badge variant="secondary">Web</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppIntegration;
