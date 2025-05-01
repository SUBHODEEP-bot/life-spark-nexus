
import { useState } from "react";
import { AlertTriangle, PhoneCall, MapPin, Users, Bell, FileText, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const EmergencyAlert = () => {
  const [alerts, setAlerts] = useState<boolean>(true);
  const [locationSharing, setLocationSharing] = useState<boolean>(true);
  const [emergencyContacts, setEmergencyContacts] = useState<boolean>(true);
  
  const { toast } = useToast();

  const handleToggleAlerts = () => {
    setAlerts(!alerts);
    toast({
      title: alerts ? "Alerts Disabled" : "Alerts Enabled",
      description: alerts 
        ? "You will no longer receive emergency alerts" 
        : "You will now receive emergency alerts",
    });
  };

  const handleToggleLocation = () => {
    setLocationSharing(!locationSharing);
    toast({
      title: locationSharing ? "Location Sharing Disabled" : "Location Sharing Enabled",
      description: locationSharing 
        ? "Your location will not be shared in emergencies" 
        : "Your location will be shared in emergencies",
    });
  };

  const handleToggleContacts = () => {
    setEmergencyContacts(!emergencyContacts);
    toast({
      title: emergencyContacts ? "Emergency Contacts Disabled" : "Emergency Contacts Enabled",
      description: emergencyContacts 
        ? "Emergency contacts will not be notified" 
        : "Emergency contacts will be notified in emergencies",
    });
  };

  const handleTestAlert = () => {
    toast({
      title: "Test Alert Sent",
      description: "A test emergency alert has been sent to your devices",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Emergency & Disaster Alert</h1>
        <p className="text-muted-foreground">Critical alerts, emergency checklists, and location sharing</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-orange-400/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-400" /> 
                Emergency Alerts
              </CardTitle>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                Active
              </Badge>
            </div>
            <CardDescription>Receive alerts for emergencies in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Emergency Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive critical emergency alerts</div>
                </div>
                <Switch checked={alerts} onCheckedChange={handleToggleAlerts} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Location Sharing</div>
                  <div className="text-sm text-muted-foreground">Share location during emergencies</div>
                </div>
                <Switch checked={locationSharing} onCheckedChange={handleToggleLocation} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Notify Emergency Contacts</div>
                  <div className="text-sm text-muted-foreground">Alert your emergency contacts</div>
                </div>
                <Switch checked={emergencyContacts} onCheckedChange={handleToggleContacts} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleTestAlert}
            >
              Test Emergency Alert
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Emergency Resources</CardTitle>
            <CardDescription>Quick access to critical information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full flex justify-start gap-3">
              <PhoneCall className="h-4 w-4" />
              Emergency Contact Numbers
            </Button>
            <Button variant="outline" className="w-full flex justify-start gap-3">
              <MapPin className="h-4 w-4" />
              Nearby Shelters
            </Button>
            <Button variant="outline" className="w-full flex justify-start gap-3">
              <FileText className="h-4 w-4" />
              Emergency Checklists
            </Button>
            <Button variant="outline" className="w-full flex justify-start gap-3">
              <Users className="h-4 w-4" />
              Family Safety Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            <div>
              <CardTitle>Weather Alert</CardTitle>
              <CardDescription>Issued: Today at 8:32 AM</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-medium">Severe Thunderstorm Warning</p>
          <p className="text-sm mt-1">The National Weather Service has issued a severe thunderstorm warning for your area. Expect heavy rain, strong winds, and possible flooding.</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" size="sm">Dismiss</Button>
          <Button size="sm">View Details</Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>People to notify during emergencies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
              <div>
                <p className="font-medium">John Smith</p>
                <p className="text-sm text-muted-foreground">Family - (555) 123-4567</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <div className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Friend - (555) 987-6543</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <Button variant="outline" className="w-full">Add Contact</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>Configure your emergency preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full flex justify-start gap-3">
              <Bell className="h-4 w-4" />
              Notification Preferences
            </Button>
            <Button variant="outline" className="w-full flex justify-start gap-3">
              <Shield className="h-4 w-4" />
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full flex justify-start gap-3">
              <MapPin className="h-4 w-4" />
              Location Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyAlert;
