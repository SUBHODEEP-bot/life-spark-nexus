
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, Bluetooth, AlertCircle, Loader2 } from "lucide-react";
import { DeviceConnection } from "./DeviceConnection";

export interface Vital {
  name: string;
  value: string;
  status: "normal" | "warning" | "critical";
}

interface VitalMonitorProps {
  initialVitals?: Vital[];
}

export const VitalMonitor = ({ initialVitals = [] }: VitalMonitorProps) => {
  const [isDeviceDialogOpen, setIsDeviceDialogOpen] = useState(false);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [vitals, setVitals] = useState<Vital[]>(initialVitals.length > 0 ? initialVitals : [
    { name: "Blood Pressure", value: "120/80", status: "normal" },
    { name: "Heart Rate", value: "72 bpm", status: "normal" },
    { name: "Blood Glucose", value: "110 mg/dL", status: "normal" },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isDeviceConnected && isMonitoring) {
      interval = setInterval(() => {
        // Simulate vital updates
        setVitals(currentVitals => currentVitals.map(vital => {
          // Generate slight variations for realistic monitoring
          if (vital.name === "Blood Pressure") {
            const sys = Math.floor(Math.random() * 20) + 115;
            const dia = Math.floor(Math.random() * 10) + 75;
            const status = sys > 130 || dia > 85 ? "warning" : "normal";
            return { ...vital, value: `${sys}/${dia}`, status };
          } 
          else if (vital.name === "Heart Rate") {
            const rate = Math.floor(Math.random() * 15) + 65;
            const status = rate > 90 ? "warning" : (rate < 60 ? "warning" : "normal");
            return { ...vital, value: `${rate} bpm`, status };
          }
          else if (vital.name === "Blood Glucose") {
            const glucose = Math.floor(Math.random() * 30) + 100;
            const status = glucose > 125 ? "warning" : (glucose < 70 ? "warning" : "normal");
            return { ...vital, value: `${glucose} mg/dL`, status };
          }
          return vital;
        }));
      }, 3000); // Update every 3 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDeviceConnected, isMonitoring]);

  const handleDeviceConnected = () => {
    setIsDeviceConnected(true);
    setIsMonitoring(true);
  };

  const handleToggleMonitoring = () => {
    if (!isDeviceConnected) {
      setIsDeviceDialogOpen(true);
    } else {
      setIsMonitoring(prev => !prev);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "bg-green-600";
      case "warning": return "bg-yellow-600";
      case "critical": return "bg-red-600";
      default: return "bg-green-600";
    }
  };

  return (
    <>
      <Card className="bg-secondary/40">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Health Vitals
            {isDeviceConnected && (
              <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-600 border-blue-200">
                <Bluetooth className="h-3 w-3 mr-1" />
                Device Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="grid gap-4">
          {vitals.map((vital, index) => (
            <div key={index}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{vital.name}</p>
                  <p className="text-xl font-semibold">{vital.value}</p>
                </div>
                <Badge className={`${getStatusColor(vital.status)}`}>
                  {vital.status.charAt(0).toUpperCase() + vital.status.slice(1)}
                </Badge>
              </div>
              {index < vitals.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}

          {isDeviceConnected && isMonitoring && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Monitoring in real-time</span>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            variant={isDeviceConnected ? "outline" : "default"}
            className="w-full"
            onClick={handleToggleMonitoring}
          >
            {!isDeviceConnected ? (
              <>Connect Device</>
            ) : isMonitoring ? (
              <>Pause Monitoring</>
            ) : (
              <>Resume Monitoring</>
            )}
          </Button>
        </CardFooter>
      </Card>

      <DeviceConnection 
        isOpen={isDeviceDialogOpen}
        onClose={() => setIsDeviceDialogOpen(false)}
        onDeviceConnected={handleDeviceConnected}
      />
    </>
  );
};
