
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, Bluetooth, AlertCircle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface DeviceConnectionProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceConnected: () => void;
}

export const DeviceConnection = ({ isOpen, onClose, onDeviceConnected }: DeviceConnectionProps) => {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Simulate device scanning
  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setDevices([
          "HealthMate BP Monitor",
          "Glucose Tracker Pro",
          "CardioSense HR Monitor"
        ]);
        setScanning(false);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [scanning]);

  const handleScan = () => {
    setScanning(true);
    setDevices([]);
  };

  const handleConnect = () => {
    if (!selectedDevice) return;
    
    setConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      toast({
        title: "Device Connected",
        description: `Successfully connected to ${selectedDevice}`,
      });
      onDeviceConnected();
      onClose();
    }, 2000);
  };

  const handleSelectDevice = (device: string) => {
    setSelectedDevice(device);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5 text-blue-500" />
            Connect Health Device
          </DialogTitle>
          <DialogDescription>
            Connect your health monitoring device to automatically track your vitals.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {!devices.length ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-6">No devices found nearby</p>
              <Button 
                onClick={handleScan}
                disabled={scanning}
                className="mx-auto"
              >
                {scanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Scan for Devices"
                )}
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-2">Available devices:</p>
              <div className="space-y-2">
                {devices.map((device) => (
                  <div
                    key={device}
                    className={`
                      p-3 rounded-md cursor-pointer flex items-center justify-between border
                      ${selectedDevice === device 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:bg-secondary/50"
                      }
                    `}
                    onClick={() => handleSelectDevice(device)}
                  >
                    <div className="flex items-center gap-3">
                      <Bluetooth className="h-4 w-4 text-blue-500" />
                      <span>{device}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConnect}
            disabled={!selectedDevice || connecting}
          >
            {connecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
