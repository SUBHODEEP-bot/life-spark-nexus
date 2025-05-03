
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CalendarIcon, Clock, Edit, Plus, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define the Symptom interface
export interface Symptom {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
  startDate: Date;
  notes?: string;
}

export const SymptomManager = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isAddSymptomOpen, setIsAddSymptomOpen] = useState(false);
  const [isEditSymptomOpen, setIsEditSymptomOpen] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState<Symptom | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    severity: "mild" | "moderate" | "severe";
    notes: string;
  }>({
    name: "",
    severity: "mild",
    notes: "",
  });
  
  // Load symptoms from localStorage on component mount
  useEffect(() => {
    const savedSymptoms = localStorage.getItem('symptoms');
    if (savedSymptoms) {
      // Convert string dates back to Date objects
      const parsedSymptoms = JSON.parse(savedSymptoms).map((symptom: any) => ({
        ...symptom,
        startDate: new Date(symptom.startDate)
      }));
      setSymptoms(parsedSymptoms);
    }
  }, []);
  
  // Save symptoms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('symptoms', JSON.stringify(symptoms));
  }, [symptoms]);
  
  const handleAddSymptom = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a symptom name",
        variant: "destructive",
      });
      return;
    }
    
    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: formData.name,
      severity: formData.severity,
      startDate: new Date(),
      notes: formData.notes,
    };
    
    setSymptoms([...symptoms, newSymptom]);
    resetForm();
    setIsAddSymptomOpen(false);
    
    toast({
      title: "Symptom Added",
      description: "Your symptom has been recorded successfully.",
    });
  };
  
  const handleEditSymptom = () => {
    if (!currentSymptom) return;
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a symptom name",
        variant: "destructive",
      });
      return;
    }
    
    setSymptoms((prev) => prev.map((symptom) => 
      symptom.id === currentSymptom.id 
        ? { 
            ...symptom,
            name: formData.name,
            severity: formData.severity,
            notes: formData.notes
          } 
        : symptom
    ));
    
    resetForm();
    setIsEditSymptomOpen(false);
    setCurrentSymptom(null);
    
    toast({
      title: "Symptom Updated",
      description: "Your symptom has been updated successfully.",
    });
  };
  
  const handleDeleteSymptom = (id: string) => {
    setSymptoms((prev) => prev.filter((symptom) => symptom.id !== id));
    toast({
      title: "Symptom Removed",
      description: "Your symptom has been removed successfully.",
    });
  };
  
  const openEditSymptomDialog = (symptom: Symptom) => {
    setCurrentSymptom(symptom);
    setFormData({
      name: symptom.name,
      severity: symptom.severity,
      notes: symptom.notes || "",
    });
    setIsEditSymptomOpen(true);
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      severity: "mild",
      notes: "",
    });
  };
  
  const getSeverityColor = (severity: "mild" | "moderate" | "severe") => {
    switch (severity) {
      case "mild": return "bg-yellow-500/80";
      case "moderate": return "bg-orange-500";
      case "severe": return "bg-red-600";
      default: return "bg-yellow-500/80";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Symptom Tracker
        </CardTitle>
        <CardDescription>
          Track and monitor your symptoms over time
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {symptoms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-1">No symptoms recorded</p>
            <p className="text-sm text-muted-foreground mb-4">Start tracking your symptoms to monitor your health</p>
          </div>
        ) : (
          <div className="space-y-4">
            {symptoms.map((symptom) => (
              <div key={symptom.id} className="flex justify-between items-start p-3 border rounded-md">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{symptom.name}</h3>
                    <Badge className={getSeverityColor(symptom.severity)}>
                      {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}
                    </Badge>
                  </div>
                  
                  {symptom.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{symptom.notes}</p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      {format(symptom.startDate, "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(symptom.startDate, "h:mm a")}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => openEditSymptomDialog(symptom)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-600"
                    onClick={() => handleDeleteSymptom(symptom.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Dialog open={isAddSymptomOpen} onOpenChange={setIsAddSymptomOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Symptom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Symptom</DialogTitle>
              <DialogDescription>
                Record a new symptom to track your health concerns.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <Label htmlFor="symptom-name">Symptom Name *</Label>
                <Input 
                  id="symptom-name" 
                  placeholder="Enter symptom name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Severity Level *</Label>
                <RadioGroup 
                  value={formData.severity} 
                  onValueChange={(value: "mild" | "moderate" | "severe") => 
                    setFormData({...formData, severity: value})
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="mild" />
                    <Label htmlFor="mild">Mild</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="severe" />
                    <Label htmlFor="severe">Severe</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="symptom-notes">Additional Notes</Label>
                <Textarea 
                  id="symptom-notes" 
                  placeholder="Add any details or notes about this symptom"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSymptomOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSymptom}>Save Symptom</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Symptom Dialog */}
        <Dialog open={isEditSymptomOpen} onOpenChange={setIsEditSymptomOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Symptom</DialogTitle>
              <DialogDescription>
                Update your recorded symptom details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <Label htmlFor="edit-symptom-name">Symptom Name *</Label>
                <Input 
                  id="edit-symptom-name" 
                  placeholder="Enter symptom name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Severity Level *</Label>
                <RadioGroup 
                  value={formData.severity} 
                  onValueChange={(value: "mild" | "moderate" | "severe") => 
                    setFormData({...formData, severity: value})
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="edit-mild" />
                    <Label htmlFor="edit-mild">Mild</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="edit-moderate" />
                    <Label htmlFor="edit-moderate">Moderate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="edit-severe" />
                    <Label htmlFor="edit-severe">Severe</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-symptom-notes">Additional Notes</Label>
                <Textarea 
                  id="edit-symptom-notes" 
                  placeholder="Add any details or notes about this symptom"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditSymptomOpen(false)}>Cancel</Button>
              <Button onClick={handleEditSymptom}>Update Symptom</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
