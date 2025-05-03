
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { YogaRoutine } from '@/types/yoga';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

interface CustomRoutinesProps {
  routines: YogaRoutine[];
  onAddRoutine: (routine: Omit<YogaRoutine, 'id'>) => YogaRoutine;
  onDeleteRoutine: (routineId: string) => void;
  onUpdateRoutine: (routine: YogaRoutine) => void;
}

// Form schema using Zod
const routineSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  days: z.array(z.string()).min(1, 'Select at least one day'),
  timeOfDay: z.enum(['Morning', 'Evening', 'Both']),
  category: z.array(z.string()).min(1, 'Select at least one category'),
  duration: z.string().min(1, 'Duration is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  poses: z.array(z.string()).default([]),
});

type RoutineFormValues = z.infer<typeof routineSchema>;

const CustomRoutines: React.FC<CustomRoutinesProps> = ({
  routines,
  onAddRoutine,
  onDeleteRoutine,
  onUpdateRoutine
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState<YogaRoutine | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories = ['Flexibility', 'Strength', 'Balance', 'Relaxation', 'Core', 'Meditation', 'Energy'];

  // Create form
  const createForm = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      name: '',
      description: '',
      days: [],
      timeOfDay: 'Morning',
      category: [],
      duration: '15 min',
      level: 'Beginner',
      poses: [],
    },
  });

  // Edit form
  const editForm = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      name: '',
      description: '',
      days: [],
      timeOfDay: 'Morning',
      category: [],
      duration: '15 min',
      level: 'Beginner',
      poses: [],
    },
  });

  const handleCreateRoutine = (values: RoutineFormValues) => {
    const newRoutine = onAddRoutine(values);
    setIsCreateDialogOpen(false);
    createForm.reset();
    
    toast({
      title: "Routine Created",
      description: `${newRoutine.name} has been added to your routines.`,
    });
    
    // Set reminder notifications
    if (window.Notification && Notification.permission === 'granted') {
      // Schedule notifications for selected days
      values.days.forEach(day => {
        const dayIndex = days.indexOf(day);
        if (dayIndex !== -1) {
          scheduleNotification(values.name, dayIndex, values.timeOfDay);
        }
      });
    } else if (window.Notification && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          values.days.forEach(day => {
            const dayIndex = days.indexOf(day);
            if (dayIndex !== -1) {
              scheduleNotification(values.name, dayIndex, values.timeOfDay);
            }
          });
        }
      });
    }
  };

  const handleEditRoutine = (values: RoutineFormValues) => {
    if (!currentRoutine) return;
    
    const updatedRoutine = {
      ...currentRoutine,
      ...values,
    };
    
    onUpdateRoutine(updatedRoutine);
    setIsEditDialogOpen(false);
    setCurrentRoutine(null);
    
    toast({
      title: "Routine Updated",
      description: `${updatedRoutine.name} has been updated.`,
    });
  };

  const openEditDialog = (routine: YogaRoutine) => {
    setCurrentRoutine(routine);
    editForm.reset({
      name: routine.name,
      description: routine.description,
      days: routine.days,
      timeOfDay: routine.timeOfDay,
      category: routine.category,
      duration: routine.duration,
      level: routine.level,
      poses: routine.poses,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteRoutine = (routineId: string, routineName: string) => {
    onDeleteRoutine(routineId);
    
    toast({
      title: "Routine Deleted",
      description: `${routineName} has been removed from your routines.`,
    });
  };

  // Helper function to schedule notifications
  const scheduleNotification = (routineName: string, dayIndex: number, timeOfDay: string) => {
    // Simple demo implementation - would need a proper scheduler in production
    const now = new Date();
    const currentDay = now.getDay();
    const daysUntilTarget = (dayIndex + 1 - currentDay + 7) % 7; // Add 1 because JS days are 0-6 but our days are 1-7
    
    // Calculate notification time
    const notificationTime = new Date();
    notificationTime.setDate(now.getDate() + daysUntilTarget);
    
    if (timeOfDay === 'Morning' || timeOfDay === 'Both') {
      notificationTime.setHours(8, 0, 0); // 8:00 AM for morning
    } else {
      notificationTime.setHours(17, 0, 0); // 5:00 PM for evening
    }
    
    const timeUntilNotification = notificationTime.getTime() - now.getTime();
    if (timeUntilNotification > 0) {
      setTimeout(() => {
        new Notification('Yoga Routine Reminder', {
          body: `Time for your ${routineName} routine!`,
          icon: '/favicon.ico'
        });
      }, timeUntilNotification);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Custom Routines</h2>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Create New Routine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Yoga Routine</DialogTitle>
              <DialogDescription>
                Design your own custom yoga routine to follow on a regular schedule.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateRoutine)} className="space-y-6 py-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routine Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Morning Energizer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A short description of your routine..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="days"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Practice Days</FormLabel>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {days.map((day) => (
                          <FormField
                            key={day}
                            control={createForm.control}
                            name="days"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={day}
                                  className="flex flex-row items-center space-x-2"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(day)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, day])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== day
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {day}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="timeOfDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time of Day</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="Morning">Morning</option>
                          <option value="Evening">Evening</option>
                          <option value="Both">Both</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="category"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Categories</FormLabel>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {categories.map((category) => (
                          <FormField
                            key={category}
                            control={createForm.control}
                            name="category"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={category}
                                  className="flex flex-row items-center space-x-2"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(category)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, category])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== category
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {category}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 border rounded-md"
                            {...field}
                          >
                            <option value="5 min">5 minutes</option>
                            <option value="10 min">10 minutes</option>
                            <option value="15 min">15 minutes</option>
                            <option value="20 min">20 minutes</option>
                            <option value="30 min">30 minutes</option>
                            <option value="45 min">45 minutes</option>
                            <option value="60 min">60 minutes</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 border rounded-md"
                            {...field}
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">Create Routine</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-muted-foreground mb-4">
            <Calendar className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">No custom routines yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your own yoga routines to practice regularly and build a consistent habit.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Routine
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {routines.map((routine) => (
            <Card key={routine.id}>
              <CardHeader>
                <CardTitle>{routine.name}</CardTitle>
                <CardDescription>{routine.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{routine.duration}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Level</span>
                      <span>{routine.level}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time of Day</span>
                      <span>{routine.timeOfDay}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm">Practice Days</p>
                      <div className="flex gap-1 flex-wrap">
                        {routine.days.map((day) => (
                          <Badge key={day} variant="outline">{day}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm">Focus areas</p>
                      <div className="flex gap-1 flex-wrap">
                        {routine.category.map((cat) => (
                          <Badge key={cat} variant="outline">{cat}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-secondary/40">
                <Button 
                  variant="outline"
                  onClick={() => openEditDialog(routine)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Routine
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDeleteRoutine(routine.id, routine.name)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button>Start Practice</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Routine Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Yoga Routine</DialogTitle>
            <DialogDescription>
              Update your custom yoga routine details.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditRoutine)} className="space-y-6 py-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Routine Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Morning Energizer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A short description of your routine..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="days"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Practice Days</FormLabel>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {days.map((day) => (
                        <FormField
                          key={day}
                          control={editForm.control}
                          name="days"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day}
                                className="flex flex-row items-center space-x-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, day])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== day
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {day}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="timeOfDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time of Day</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                      >
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Both">Both</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="category"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Categories</FormLabel>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {categories.map((category) => (
                        <FormField
                          key={category}
                          control={editForm.control}
                          name="category"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={category}
                                className="flex flex-row items-center space-x-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, category])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== category
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {category}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="5 min">5 minutes</option>
                          <option value="10 min">10 minutes</option>
                          <option value="15 min">15 minutes</option>
                          <option value="20 min">20 minutes</option>
                          <option value="30 min">30 minutes</option>
                          <option value="45 min">45 minutes</option>
                          <option value="60 min">60 minutes</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Routine</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomRoutines;
