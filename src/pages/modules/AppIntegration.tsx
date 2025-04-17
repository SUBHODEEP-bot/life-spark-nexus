
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  UserCog, Mail, Calendar, MessageSquare, Cloud, Link2, Settings, 
  Check, Timer, RefreshCw, External, Shield, Database, PlusCircle,
  ChevronRight, Lock, ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock data for integrations
const mockIntegrations = [
  { 
    id: "gmail", 
    name: "Gmail", 
    icon: "https://cdn.pixabay.com/photo/2021/05/22/11/38/gmail-6273731_1280.png", 
    status: "connected", 
    lastSync: "10 minutes ago",
    type: "email"
  },
  { 
    id: "outlook", 
    name: "Outlook", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/768px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png", 
    status: "disconnected", 
    lastSync: null,
    type: "email"
  },
  { 
    id: "google-calendar", 
    name: "Google Calendar", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/768px-Google_Calendar_icon_%282020%29.svg.png", 
    status: "connected", 
    lastSync: "5 minutes ago",
    type: "calendar"
  },
  { 
    id: "whatsapp", 
    name: "WhatsApp", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/767px-WhatsApp.svg.png", 
    status: "connected", 
    lastSync: "2 hours ago",
    type: "messaging"
  },
  { 
    id: "slack", 
    name: "Slack", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/768px-Slack_icon_2019.svg.png", 
    status: "disconnected", 
    lastSync: null,
    type: "messaging"
  },
  { 
    id: "dropbox", 
    name: "Dropbox", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Dropbox_logo_%282013-2020%29.svg/768px-Dropbox_logo_%282013-2020%29.svg.png", 
    status: "connected", 
    lastSync: "1 day ago",
    type: "storage"
  },
  { 
    id: "google-drive", 
    name: "Google Drive", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/768px-Google_Drive_icon_%282020%29.svg.png", 
    status: "connected", 
    lastSync: "30 minutes ago",
    type: "storage"
  },
  { 
    id: "spotify", 
    name: "Spotify", 
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/768px-Spotify_logo_without_text.svg.png", 
    status: "connected", 
    lastSync: "3 hours ago",
    type: "entertainment"
  }
];

// Data sync status
const syncStatus = {
  emails: 85,
  calendar: 100,
  messages: 70,
  files: 60
};

const AppIntegration = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const { toast } = useToast();

  const handleConnect = (id: string) => {
    setIntegrations(
      integrations.map(integration =>
        integration.id === id
          ? { ...integration, status: "connected", lastSync: "Just now" }
          : integration
      )
    );

    toast({
      title: "Connection successful",
      description: `${integrations.find(i => i.id === id)?.name} has been connected to your account`,
    });
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(
      integrations.map(integration =>
        integration.id === id
          ? { ...integration, status: "disconnected", lastSync: null }
          : integration
      )
    );

    toast({
      title: "Disconnected",
      description: `${integrations.find(i => i.id === id)?.name} has been disconnected from your account`,
    });
  };

  const handleSync = (id: string) => {
    toast({
      title: "Syncing...",
      description: `Syncing data with ${integrations.find(i => i.id === id)?.name}`,
    });

    // Simulate sync completion after a delay
    setTimeout(() => {
      setIntegrations(
        integrations.map(integration =>
          integration.id === id
            ? { ...integration, lastSync: "Just now" }
            : integration
        )
      );

      toast({
        title: "Sync completed",
        description: `Successfully synced data with ${integrations.find(i => i.id === id)?.name}`,
      });
    }, 2000);
  };

  // Filter integrations based on active tab
  const filteredIntegrations = activeTab === "all" 
    ? integrations 
    : integrations.filter(integration => integration.type === activeTab);

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">App Integration Panel</h1>
        <p className="text-muted-foreground">
          Connect with Gmail, Calendar, WhatsApp and other essential services
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-violet-500/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected Apps</p>
                <h3 className="text-3xl font-bold">{integrations.filter(i => i.status === "connected").length}</h3>
              </div>
              <div className="p-3 bg-violet-500/10 rounded-full">
                <UserCog className="h-8 w-8 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Email Sync</p>
                <h3 className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{syncStatus.emails}%</span>
                </h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Calendar Sync</p>
                <h3 className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{syncStatus.calendar}%</span>
                </h3>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Synced</p>
                <h3 className="text-xl font-bold">5m ago</h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Timer className="h-8 w-8 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="all">All Apps</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>
          
          <Button className="bg-violet-600 hover:bg-violet-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Integration
          </Button>
        </div>
        
        <TabsContent value={activeTab} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Link2 className="h-5 w-5 text-violet-500" />
                {activeTab === "all" ? "All Integrations" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Integrations`}
              </CardTitle>
              <CardDescription>
                Manage your connected apps and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredIntegrations.map((integration) => (
                  <div 
                    key={integration.id} 
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      integration.status === "connected" 
                        ? "bg-secondary/40" 
                        : "bg-secondary/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-md">
                        <AvatarImage src={integration.icon} alt={integration.name} />
                        <AvatarFallback className="rounded-md bg-violet-100 text-violet-800">{integration.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {integration.status === "connected" ? (
                            <>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Connected
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Last synced: {integration.lastSync}
                              </span>
                            </>
                          ) : (
                            <Badge variant="outline" className="bg-secondary text-muted-foreground">
                              Not Connected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.status === "connected" ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSync(integration.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Sync
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm"
                          className="bg-violet-600 hover:bg-violet-700"
                          onClick={() => handleConnect(integration.id)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredIntegrations.length === 0 && (
                  <div className="bg-secondary/40 rounded-lg border border-border/40 p-6 text-center">
                    <p className="text-muted-foreground">No {activeTab} integrations found</p>
                  </div>
                )}

                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Browse More Integrations
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-violet-500" />
                  Data Sync Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 items-center">
                    <p className="text-sm font-medium">Emails</p>
                    <span className="text-xs text-muted-foreground">{syncStatus.emails}%</span>
                  </div>
                  <Progress value={syncStatus.emails} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1 items-center">
                    <p className="text-sm font-medium">Calendar</p>
                    <span className="text-xs text-muted-foreground">{syncStatus.calendar}%</span>
                  </div>
                  <Progress value={syncStatus.calendar} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1 items-center">
                    <p className="text-sm font-medium">Messages</p>
                    <span className="text-xs text-muted-foreground">{syncStatus.messages}%</span>
                  </div>
                  <Progress value={syncStatus.messages} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1 items-center">
                    <p className="text-sm font-medium">Files</p>
                    <span className="text-xs text-muted-foreground">{syncStatus.files}%</span>
                  </div>
                  <Progress value={syncStatus.files} className="h-2" />
                </div>

                <Button variant="outline" className="w-full" onClick={() => {
                  toast({
                    title: "Syncing all data",
                    description: "This may take a few minutes to complete"
                  });
                }}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync All Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-violet-500" />
                  Integration Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto Sync</p>
                    <p className="text-xs text-muted-foreground">Automatically sync data at regular intervals</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Notification on Sync Complete</p>
                    <p className="text-xs text-muted-foreground">Get notified when sync is complete</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sync on WiFi Only</p>
                    <p className="text-xs text-muted-foreground">Only sync when connected to WiFi</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Background Sync</p>
                    <p className="text-xs text-muted-foreground">Allow sync when app is in background</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-violet-500" />
                Privacy & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-violet-500/5 border border-violet-500/20 p-4 rounded-lg">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-violet-500" />
                    Data Access
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Control which apps have access to your personal data. You can revoke access at any time.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <p className="text-sm">Email Access</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">2 apps</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <p className="text-sm">Calendar Access</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">1 app</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-yellow-500" />
                      <p className="text-sm">Messages Access</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">1 app</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-blue-500" />
                      <p className="text-sm">Storage Access</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">2 apps</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    Privacy Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppIntegration;
