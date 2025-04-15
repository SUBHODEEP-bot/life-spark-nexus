
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Pill, Clock, Calendar, User, PlusCircle, Activity, X, Heart, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Type definitions
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  takenToday: boolean;
}

interface Appointment {
  id: string;
  doctor: string;
  speciality: string;
  date: Date;
  time: string;
  location: string;
  notes?: string;
}

interface Symptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  startDate: Date;
  notes?: string;
}

const HealthAssistant = () => {
  // Sample data
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Daily',
      time: '8:00 AM',
      takenToday: false,
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      time: '9:00 AM, 9:00 PM',
      takenToday: true,
    },
    {
      id: '3',
      name: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'As needed',
      time: 'When required',
      takenToday: false,
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctor: 'Dr. Sarah Johnson',
      speciality: 'General Physician',
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      time: '10:30 AM',
      location: 'City Medical Center',
      notes: 'Annual checkup',
    },
    {
      id: '2',
      doctor: 'Dr. Michael Chen',
      speciality: 'Dentist',
      date: new Date(new Date().setDate(new Date().getDate() + 10)),
      time: '2:45 PM',
      location: 'Smile Dental Clinic',
      notes: 'Regular cleaning',
    },
  ]);

  const [symptoms] = useState<Symptom[]>([
    {
      name: 'Headache',
      severity: 'mild',
      startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
      notes: 'Mainly in the afternoon',
    },
  ]);
  
  // State for adding new appointments
  const [date, setDate] = useState<Date>();

  // Toggle medication taken status
  const toggleMedicationStatus = (id: string) => {
    setMedications(medications.map(med => 
      med.id === id ? {...med, takenToday: !med.takenToday} : med
    ));
  };

  // Health tips
  const healthTips = [
    "Drink at least 8 glasses of water daily",
    "Aim for 7-9 hours of sleep each night",
    "Include 30 minutes of physical activity in your routine",
    "Practice mindfulness or meditation to reduce stress",
    "Maintain a balanced diet rich in fruits and vegetables"
  ];

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Personal Health Assistant</h1>
        <p className="text-muted-foreground">
          Manage medications, track appointments, and monitor your health
        </p>
      </header>

      <Tabs defaultValue="medications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="health-check">Health Check</TabsTrigger>
        </TabsList>

        {/* Medications Tab */}
        <TabsContent value="medications">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Medications</h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Medication</DialogTitle>
                    <DialogDescription>
                      Enter details about your medication and when you need to take it.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Medication Name</Label>
                      <Input id="name" placeholder="E.g., Vitamin D" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input id="dosage" placeholder="E.g., 1000 IU, 500mg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="twice">Twice Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="as_needed">As Needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Input id="time" placeholder="E.g., 8:00 AM" />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Add Medication</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {medications.length === 0 ? (
                <Card className="bg-secondary/40">
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No medications added yet
                  </CardContent>
                </Card>
              ) : (
                medications.map((medication) => (
                  <Card key={medication.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-start gap-2">
                          <Pill className="h-5 w-5 text-red-400 mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h3 className="font-semibold">{medication.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {medication.dosage} • {medication.frequency}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-secondary/50">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {medication.time}
                                </Badge>
                                <Button
                                  variant={medication.takenToday ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleMedicationStatus(medication.id)}
                                  className={cn(
                                    "h-8",
                                    medication.takenToday && "bg-green-600 hover:bg-green-700"
                                  )}
                                >
                                  {medication.takenToday ? "Taken" : "Mark as Taken"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule an Appointment</DialogTitle>
                    <DialogDescription>
                      Enter details for your medical appointment.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="doctor">Doctor Name</Label>
                        <Input id="doctor" placeholder="Dr. Name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="speciality">Speciality</Label>
                        <Input id="speciality" placeholder="E.g., Cardiology" />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Input id="time" placeholder="E.g., 10:30 AM" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="Clinic/Hospital" />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Input id="notes" placeholder="Any notes about the appointment" />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Schedule</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {appointments.length === 0 ? (
                <Card className="bg-secondary/40">
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No appointments scheduled
                  </CardContent>
                </Card>
              ) : (
                appointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-blue-400 mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div>
                                <h3 className="font-semibold">{appointment.doctor}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.speciality} • {appointment.location}
                                </p>
                                {appointment.notes && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {appointment.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-secondary/50">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  {format(appointment.date, "MMM d")}
                                </Badge>
                                <Badge variant="outline" className="bg-secondary/50">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {appointment.time}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* Health Check Tab */}
        <TabsContent value="health-check">
          <div className="grid gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-secondary/40">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-lifemate-purple" />
                    Health Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Blood Pressure</p>
                      <p className="text-xl font-semibold">120/80</p>
                    </div>
                    <Badge className="bg-green-600">Normal</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Heart Rate</p>
                      <p className="text-xl font-semibold">72 bpm</p>
                    </div>
                    <Badge className="bg-green-600">Normal</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Blood Glucose</p>
                      <p className="text-xl font-semibold">110 mg/dL</p>
                    </div>
                    <Badge className="bg-green-600">Normal</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Track New Measurement</Button>
                </CardFooter>
              </Card>

              <Card className="bg-secondary/40">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-lifemate-purple" />
                    Symptom Checker
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Current Symptoms</p>
                    
                    {symptoms.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No symptoms reported</p>
                    ) : (
                      <div className="space-y-2">
                        {symptoms.map((symptom, index) => (
                          <div 
                            key={index} 
                            className="bg-secondary/70 rounded-md p-3 flex items-center justify-between"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{symptom.name}</span>
                                <Badge className={cn(
                                  symptom.severity === 'mild' && "bg-yellow-600",
                                  symptom.severity === 'moderate' && "bg-orange-600",
                                  symptom.severity === 'severe' && "bg-red-600",
                                )}>
                                  {symptom.severity}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Since {format(symptom.startDate, "MMM d")}
                                {symptom.notes && ` • ${symptom.notes}`}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full">Start Symptom Check</Button>
                  
                  <div className="rounded-md border border-border p-3 mt-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-lifemate-purple" />
                      <span className="font-medium">AI Symptom Analysis</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on your reported headache symptom, this could be related to 
                      dehydration, stress, or eye strain. Consider increasing water intake 
                      and taking short breaks from screens.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-lifemate-purple/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-400" />
                  Daily Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {healthTips.map((tip, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-lifemate-purple">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthAssistant;
