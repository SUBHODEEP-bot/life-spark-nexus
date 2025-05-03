
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, X, Edit, Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  startDate: Date;
  notes?: string;
}

const symptomFormSchema = z.object({
  name: z.string().min(2, { message: "Symptom name must be at least 2 characters." }),
  severity: z.enum(["mild", "moderate", "severe"], {
    required_error: "Please select a severity level.",
  }),
  startDate: z.date({
    required_error: "Please select a date.",
  }),
  notes: z.string().optional(),
});

type SymptomFormValues = z.infer<typeof symptomFormSchema>;

interface SymptomManagerProps {
  initialSymptoms?: Symptom[];
}

export const SymptomManager = ({ initialSymptoms = [] }: SymptomManagerProps) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>(initialSymptoms);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);
  
  // Load symptoms from localStorage on mount
  useEffect(() => {
    const savedSymptoms = localStorage.getItem('symptoms');
    if (savedSymptoms) {
      try {
        // We need to convert the ISO strings back to Date objects
        const parsed = JSON.parse(savedSymptoms);
        const withDates = parsed.map((s: any) => ({
          ...s,
          startDate: new Date(s.startDate)
        }));
        setSymptoms(withDates);
      } catch (error) {
        console.error("Error parsing saved symptoms:", error);
      }
    }
  }, []);
  
  // Save symptoms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('symptoms', JSON.stringify(symptoms));
  }, [symptoms]);

  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(symptomFormSchema),
    defaultValues: {
      name: "",
      severity: "mild",
      startDate: new Date(),
      notes: "",
    },
  });

  const openDialog = (symptom?: Symptom) => {
    if (symptom) {
      setEditingSymptom(symptom);
      form.reset({
        name: symptom.name,
        severity: symptom.severity,
        startDate: symptom.startDate,
        notes: symptom.notes || "",
      });
    } else {
      setEditingSymptom(null);
      form.reset({
        name: "",
        severity: "mild",
        startDate: new Date(),
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingSymptom(null);
  };

  const onSubmit = (data: SymptomFormValues) => {
    if (editingSymptom) {
      // Update existing symptom
      setSymptoms(prev => 
        prev.map(s => s.id === editingSymptom.id ? { ...data, id: editingSymptom.id } : s)
      );
      toast({
        title: "Symptom Updated",
        description: `${data.name} has been updated.`,
      });
    } else {
      // Add new symptom
      const newSymptom = {
        ...data,
        id: Date.now().toString(),
      };
      setSymptoms(prev => [...prev, newSymptom]);
      toast({
        title: "Symptom Added",
        description: `${data.name} has been added to your symptoms list.`,
      });
    }
    closeDialog();
  };

  const deleteSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Symptom Removed",
      description: "The symptom has been removed from your list.",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "bg-yellow-600";
      case "moderate": return "bg-orange-600";
      case "severe": return "bg-red-600";
      default: return "bg-yellow-600";
    }
  };

  return (
    <>
      <Card className="bg-secondary/40">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Symptom Tracker
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Current Symptoms</p>
            
            {symptoms.length === 0 ? (
              <p className="text-sm text-muted-foreground">No symptoms reported</p>
            ) : (
              <div className="space-y-2">
                {symptoms.map((symptom) => (
                  <div 
                    key={symptom.id} 
                    className="bg-secondary/70 rounded-md p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{symptom.name}</span>
                        <Badge className={cn(getSeverityColor(symptom.severity))}>
                          {symptom.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Since {format(symptom.startDate, "MMM d")}
                        {symptom.notes && ` • ${symptom.notes}`}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openDialog(symptom)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteSymptom(symptom.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button className="w-full" onClick={() => openDialog()}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Report New Symptom
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSymptom ? "Edit Symptom" : "Report New Symptom"}
            </DialogTitle>
            <DialogDescription>
              {editingSymptom 
                ? "Update the information about your symptom below."
                : "Enter details about the symptom you're experiencing."
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptom Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Headache, Fever" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>When did it start?</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional details about your symptom..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSymptom ? "Update Symptom" : "Add Symptom"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
