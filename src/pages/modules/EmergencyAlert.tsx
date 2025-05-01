
import { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Shield, Phone, Bell, CheckCircle2, Clock, User, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Alert {
  id: string;
  type: "weather" | "safety" | "health" | "local";
  title: string;
  location: string;
  description: string;
  severity: "high" | "medium" | "low";
  time: string;
  active: boolean;
}

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  notifyOnEmergency: boolean;
  shareLocationWith: boolean;
}

const EmergencyAlert = () => {
  const [activeTab, setActiveTab] = useState("alerts");
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "weather",
      title: "Flash Flood Warning",
      location: "Downtown Area",
      description: "Heavy rainfall may cause flash flooding in low-lying areas. Stay alert and avoid flood-prone areas.",
      severity: "medium",
      time: "2 hours ago",
      active: true
    },
    {
      id: "2",
      type: "safety",
      title: "Power Outage",
      location: "North District",
      description: "Power company reports outage affecting North District. Crews working to restore power. Estimated repair time: 2 hours.",
      severity: "low",
      time: "5 hours ago",
      active: true
    },
    {
      id: "3",
      type: "health",
      title: "Air Quality Alert",
      location: "City-wide",
      description: "Air quality index has reached unhealthy levels. Sensitive individuals should limit outdoor activities.",
      severity: "high",
      time: "1 day ago",
      active: true
    }
  ]);
  
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Jane Smith",
      relationship: "Family",
      phone: "+1 (555) 123-4567",
      email: "jane.smith@example.com",
      notifyOnEmergency: true,
      shareLocationWith: true
    },
    {
      id: "2",
      name: "John Johnson",
      relationship: "Friend",
      phone: "+1 (555) 987-6543",
      email: "john.j@example.com",
      notifyOnEmergency: true,
      shareLocationWith: false
    },
    {
      id: "3",
      name: "Sarah Williams",
      relationship: "Work",
      phone: "+1 (555) 456-7890",
      email: "s.williams@example.com",
      notifyOnEmergency: false,
      shareLocationWith: false
    }
  ]);
  
  const [prepProgress, setPrepProgress] = useState(65);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showAddContactDialog, setShowAddContactDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [currentLocation, setCurrentLocation] = useState("Current Location: Unknown");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate getting location
    setTimeout(() => {
      setCurrentLocation("Current Location: 123 Main St, Anytown, USA");
    }, 1500);
  }, []);

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active: false } : alert
    ));
    
    toast({
      title: "Alert Dismissed",
      description: "The alert has been dismissed from your feed",
    });
  };

  const handleToggleContact = (id: string, field: 'notifyOnEmergency' | 'shareLocationWith') => {
    setEmergencyContacts(contacts => 
      contacts.map(contact => 
        contact.id === id 
          ? { ...contact, [field]: !contact[field] } 
          : contact
      )
    );
    
    toast({
      title: "Contact Updated",
      description: `Contact preferences have been updated`,
    });
  };

  const handleTriggerEmergency = () => {
    setShowEmergencyDialog(true);
  };

  const handleSendEmergencyAlert = () => {
    const notifiedContacts = emergencyContacts.filter(c => c.notifyOnEmergency).length;
    
    toast({
      title: "Emergency Alert Sent",
      description: `Alert sent to ${notifiedContacts} emergency contacts`,
      variant: "destructive",
    });
    
    setShowEmergencyDialog(false);
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactDialog(true);
  };

  const handleAddContact = () => {
    const newContact: Contact = {
      id: `new-${Date.now()}`,
      name: "New Contact",
      relationship: "Family",
      phone: "+1 (555) 000-0000",
      email: "new.contact@example.com",
      notifyOnEmergency: true,
      shareLocationWith: true
    };
    
    setEmergencyContacts([...emergencyContacts, newContact]);
    
    toast({
      title: "Contact Added",
      description: "New emergency contact has been added",
    });
    
    setShowAddContactDialog(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Emergency & Disaster Alert</h1>
          <p className="text-muted-foreground">Critical alerts, emergency checklists & GPS location sharing</p>
        </div>
        
        <Button 
          variant="destructive" 
          className="flex items-center gap-2" 
          onClick={handleTriggerEmergency}
        >
          <AlertTriangle className="h-4 w-4" /> Trigger Emergency Alert
        </Button>
      </div>
      
      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg flex items-center gap-4">
        <div className="bg-red-500/20 p-2 rounded-full">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-500">Active Weather Alert</h3>
          <p className="text-sm">Flash Flood Warning in effect until 8:00 PM today</p>
        </div>
        <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500" onClick={() => {
          toast({
            title: "More Info",
            description: "Detailed flood warning information displayed",
          });
        }}>
          More Info
        </Button>
      </div>

      <Tabs defaultValue="alerts" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-4 gap-2">
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Emergency Contacts
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Preparedness
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Location Sharing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts" className="space-y-4">
          {alerts.filter(alert => alert.active).length > 0 ? (
            alerts.filter(alert => alert.active).map(alert => (
              <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {alert.title}
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {alert.location}
                      </CardDescription>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {alert.time}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{alert.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDismissAlert(alert.id)}
                  >
                    Dismiss
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Alert Details",
                        description: `Viewing detailed information for ${alert.title}`,
                      });
                    }}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-secondary rounded-full mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-medium">No Active Alerts</h3>
              <p className="text-muted-foreground">You're all clear! No emergency alerts at this time.</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>Manage your alert preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Weather Alerts</h3>
                  <p className="text-sm text-muted-foreground">Storms, floods, extreme temperatures</p>
                </div>
                <div className="flex items-center h-6 w-12 rounded-full bg-lifemate-purple cursor-pointer" onClick={() => {
                  toast({
                    title: "Weather Alerts",
                    description: "Weather alerts have been disabled",
                  });
                }}>
                  <div className="h-5 w-5 rounded-full bg-white ml-auto mr-0.5"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Safety Alerts</h3>
                  <p className="text-sm text-muted-foreground">Crime, traffic incidents, power outages</p>
                </div>
                <div className="flex items-center h-6 w-12 rounded-full bg-lifemate-purple cursor-pointer" onClick={() => {
                  toast({
                    title: "Safety Alerts",
                    description: "Safety alerts have been disabled",
                  });
                }}>
                  <div className="h-5 w-5 rounded-full bg-white ml-auto mr-0.5"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Health Alerts</h3>
                  <p className="text-sm text-muted-foreground">Air quality, disease outbreaks, health advisories</p>
                </div>
                <div className="flex items-center h-6 w-12 rounded-full bg-lifemate-purple cursor-pointer" onClick={() => {
                  toast({
                    title: "Health Alerts",
                    description: "Health alerts have been disabled",
                  });
                }}>
                  <div className="h-5 w-5 rounded-full bg-white ml-auto mr-0.5"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Location Radius</h3>
                  <p className="text-sm text-muted-foreground">Receive alerts within this distance</p>
                </div>
                <Button variant="outline" onClick={() => {
                  toast({
                    title: "Location Radius",
                    description: "Location radius has been set to 10 miles",
                  });
                }}>10 miles</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4">
          <div className="grid gap-4">
            {emergencyContacts.map(contact => (
              <Card key={contact.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{contact.name}</CardTitle>
                    <Badge>{contact.relationship}</Badge>
                  </div>
                  <CardDescription>{contact.phone}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Notify on emergency</span>
                      <div 
                        className={`h-6 w-12 rounded-full ${contact.notifyOnEmergency ? 'bg-lifemate-purple' : 'bg-secondary'} cursor-pointer flex items-center`}
                        onClick={() => handleToggleContact(contact.id, 'notifyOnEmergency')}
                      >
                        <div className={`h-5 w-5 rounded-full bg-white transition-all ${contact.notifyOnEmergency ? 'ml-auto mr-0.5' : 'ml-0.5'}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Share location</span>
                      <div 
                        className={`h-6 w-12 rounded-full ${contact.shareLocationWith ? 'bg-lifemate-purple' : 'bg-secondary'} cursor-pointer flex items-center`}
                        onClick={() => handleToggleContact(contact.id, 'shareLocationWith')}
                      >
                        <div className={`h-5 w-5 rounded-full bg-white transition-all ${contact.shareLocationWith ? 'ml-auto mr-0.5' : 'ml-0.5'}`}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => handleViewContact(contact)}>
                    Manage Contact
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Button className="w-full" onClick={() => setShowAddContactDialog(true)}>
            <User className="h-4 w-4 mr-2" /> Add Emergency Contact
          </Button>
        </TabsContent>
        
        <TabsContent value="checklist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Preparedness</CardTitle>
              <CardDescription>Your readiness for emergency situations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Overall Preparedness</h3>
                  <span>{prepProgress}%</span>
                </div>
                <Progress value={prepProgress} className="h-2" />
              </div>
              
              <div className="space-y-2 mt-4">
                <h3 className="font-medium">Emergency Kit Checklist</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded border flex items-center justify-center bg-lifemate-purple">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span>Water (one gallon per person per day)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded border flex items-center justify-center bg-lifemate-purple">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span>Non-perishable food (3-day supply)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded border flex items-center justify-center bg-lifemate-purple">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span>Flashlight and extra batteries</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded border flex items-center justify-center bg-lifemate-purple">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span>First aid kit</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded border border-dashed">
                    </div>
                    <span className="text-muted-foreground">Hand-crank or battery-powered radio</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded border border-dashed">
                    </div>
                    <span className="text-muted-foreground">Whistle to signal for help</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded border border-dashed">
                    </div>
                    <span className="text-muted-foreground">Dust mask, plastic sheeting and duct tape</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded border flex items-center justify-center bg-lifemate-purple">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span>Local maps</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => {
                toast({
                  title: "Checklist Updated",
                  description: "Your emergency checklist has been updated",
                });
                setPrepProgress(Math.min(100, prepProgress + 5));
              }}>
                Update Checklist
              </Button>
              <Button className="flex-1" onClick={() => {
                toast({
                  title: "Preparedness Guide",
                  description: "Comprehensive emergency guide has been opened",
                });
              }}>
                View Full Guide
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Emergency Plans</CardTitle>
              <CardDescription>Pre-defined action plans for different scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-3 bg-secondary/50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Home Evacuation Plan</h3>
                      <p className="text-sm text-muted-foreground">Routes, meeting points, and emergency contacts</p>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </li>
                
                <li className="p-3 bg-secondary/50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Flood Response</h3>
                      <p className="text-sm text-muted-foreground">Actions to take during flash floods</p>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </li>
                
                <li className="p-3 bg-secondary/50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Family Communication Plan</h3>
                      <p className="text-sm text-muted-foreground">How to contact and reunite with family members</p>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => {
                toast({
                  title: "Create Plan",
                  description: "New emergency plan creation form has been opened",
                });
              }}>
                Create New Plan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Location Sharing</CardTitle>
              <CardDescription>Share your location with trusted emergency contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/50 h-56 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-lifemate-purple mx-auto mb-2" />
                  <p className="text-muted-foreground">{currentLocation}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Location Sharing</h3>
                  <p className="text-sm text-muted-foreground">Share your real-time location</p>
                </div>
                <div className="flex items-center h-6 w-12 rounded-full bg-lifemate-purple cursor-pointer" onClick={() => {
                  toast({
                    title: "Location Sharing",
                    description: "Location sharing has been disabled",
                  });
                }}>
                  <div className="h-5 w-5 rounded-full bg-white ml-auto mr-0.5"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Emergency Mode</h3>
                  <p className="text-sm text-muted-foreground">Continuous location updates</p>
                </div>
                <div className="flex items-center h-6 w-12 rounded-full bg-secondary cursor-pointer" onClick={() => {
                  toast({
                    title: "Emergency Mode",
                    description: "Emergency mode has been enabled",
                  });
                }}>
                  <div className="h-5 w-5 rounded-full bg-white ml-0.5"></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => {
                toast({
                  title: "Location Updated",
                  description: "Your location has been updated",
                });
              }}>
                Update Location
              </Button>
              <Button className="flex-1" onClick={() => {
                toast({
                  title: "Location Shared",
                  description: "Your location has been shared with emergency contacts",
                });
              }}>
                <Users className="h-4 w-4 mr-2" /> Share with Contacts
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Safe Zones</CardTitle>
              <CardDescription>Pre-defined safe meeting locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-3 bg-secondary/50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Home</h3>
                      <p className="text-sm text-muted-foreground">Primary residence</p>
                    </div>
                    <Badge className="bg-green-500">Primary</Badge>
                  </div>
                </li>
                
                <li className="p-3 bg-secondary/50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">City Community Center</h3>
                      <p className="text-sm text-muted-foreground">Official evacuation shelter</p>
                    </div>
                    <Badge variant="outline">Secondary</Badge>
                  </div>
                </li>
                
                <li className="p-3 bg-secondary/50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Hill Park</h3>
                      <p className="text-sm text-muted-foreground">Outdoor meeting point</p>
                    </div>
                    <Badge variant="outline">Tertiary</Badge>
                  </div>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => {
                toast({
                  title: "Safe Zone",
                  description: "New safe zone has been added to your list",
                });
              }}>
                Add Safe Zone
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Emergency Alert Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Trigger Emergency Alert</DialogTitle>
            <DialogDescription>
              This will notify your emergency contacts and share your current location
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="bg-red-500/10 p-4 rounded-md">
              <p className="text-sm">
                By triggering this alert, all contacts with "Notify on emergency" enabled will receive:
              </p>
              <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                <li>An emergency SMS notification</li>
                <li>Your current location</li>
                <li>A notification via this app if they use LifeMate X</li>
              </ul>
            </div>
            
            <div className="bg-secondary/50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Emergency Contacts to Notify:</h3>
              <div className="space-y-2">
                {emergencyContacts
                  .filter(contact => contact.notifyOnEmergency)
                  .map(contact => (
                    <div key={contact.id} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{contact.name}</span>
                      <span className="text-xs text-muted-foreground">{contact.phone}</span>
                    </div>
                  ))}
                
                {emergencyContacts.filter(contact => contact.notifyOnEmergency).length === 0 && (
                  <p className="text-sm text-muted-foreground">No emergency contacts enabled for notification</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEmergencyDialog(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleSendEmergencyAlert}
              disabled={emergencyContacts.filter(contact => contact.notifyOnEmergency).length === 0}
            >
              Send Emergency Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Emergency Contact</DialogTitle>
            <DialogDescription>
              Manage contact details and preferences
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input 
                    type="text" 
                    value={selectedContact.name}
                    className="w-full px-3 py-2 border rounded-md bg-secondary/50"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Relationship</label>
                  <input 
                    type="text" 
                    value={selectedContact.relationship}
                    className="w-full px-3 py-2 border rounded-md bg-secondary/50"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input 
                    type="text" 
                    value={selectedContact.phone}
                    className="w-full px-3 py-2 border rounded-md bg-secondary/50"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input 
                    type="text" 
                    value={selectedContact.email}
                    className="w-full px-3 py-2 border rounded-md bg-secondary/50"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Notify on emergency</span>
                  <div 
                    className={`h-6 w-12 rounded-full ${selectedContact.notifyOnEmergency ? 'bg-lifemate-purple' : 'bg-secondary'} cursor-pointer flex items-center`}
                    onClick={() => handleToggleContact(selectedContact.id, 'notifyOnEmergency')}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-all ${selectedContact.notifyOnEmergency ? 'ml-auto mr-0.5' : 'ml-0.5'}`}></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Share location</span>
                  <div 
                    className={`h-6 w-12 rounded-full ${selectedContact.shareLocationWith ? 'bg-lifemate-purple' : 'bg-secondary'} cursor-pointer flex items-center`}
                    onClick={() => handleToggleContact(selectedContact.id, 'shareLocationWith')}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-all ${selectedContact.shareLocationWith ? 'ml-auto mr-0.5' : 'ml-0.5'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => {
              setSelectedContact(null);
              setShowContactDialog(false);
            }}>Cancel</Button>
            <Button onClick={() => {
              toast({
                title: "Contact Updated",
                description: "Emergency contact has been updated",
              });
              setShowContactDialog(false);
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Contact Dialog */}
      <Dialog open={showAddContactDialog} onOpenChange={setShowAddContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Emergency Contact</DialogTitle>
            <DialogDescription>
              Add a new emergency contact
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Relationship</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Family</option>
                  <option>Friend</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Notify on emergency</span>
                <div className="h-6 w-12 rounded-full bg-lifemate-purple cursor-pointer flex items-center">
                  <div className="h-5 w-5 rounded-full bg-white ml-auto mr-0.5"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Share location</span>
                <div className="h-6 w-12 rounded-full bg-lifemate-purple cursor-pointer flex items-center">
                  <div className="h-5 w-5 rounded-full bg-white ml-auto mr-0.5"></div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddContactDialog(false)}>Cancel</Button>
            <Button onClick={handleAddContact}>Add Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyAlert;
