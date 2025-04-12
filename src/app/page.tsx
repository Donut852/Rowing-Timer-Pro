"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getWorldBestTime } from "@/services/world-rowing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { saveAs } from 'file-saver';


// Define types for boat data
interface BoatData {
  id: number;
  boatClass: string;
  boatName: string;
  splitTimes: number[];
  splitPaces: string[];
  intervalDiffs: string[];
  totalTimes: number[];
  isRunning: boolean;
}

// Default props for BoatCard component
const defaultBoatData: BoatData = {
  id: 0,
  boatClass: "",
  boatName: "",
  splitTimes: [],
  splitPaces: [],
  intervalDiffs: [],
  totalTimes: [],
  isRunning: false,
};

const boatClasses = {
  Male: ['M1X', 'M2X', 'M4+', 'M4-','M8+'],
  Female: ['W1X', 'W2X', 'W4+', 'W4-', 'W8+'],
};

// Component for displaying individual boat timing information
function BoatCard({ boat, onSplit, onUpdate, isRunning, sessionDistance, splitDistance }: { boat: BoatData, onSplit: (id: number) => void, onUpdate: (id: number, key: string, value: string) => void, isRunning: boolean, sessionDistance: number, splitDistance: number }) {
    // Format global time into mm:ss.SSS
    const formatTime = (timeInSeconds: number): string => {
      const date = new Date(timeInSeconds * 1000); // Convert seconds to milliseconds
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');
      const milliseconds = date.getUTCMilliseconds().toString().slice(0, 2).padStart(2, '0');
      return `${minutes}:${seconds}.${milliseconds}`;
    };

  return (
    <Card className="w-full subtle-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Select onValueChange={(value) => onUpdate(boat.id, "boatClass", value)}>
            <SelectTrigger className="w-1/2 text-lg bg-accent text-accent-foreground hover:bg-accent/80">
              <SelectValue placeholder="Boat Class" defaultValue={boat.boatClass} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup label="Male">
                {boatClasses.Male.map((boatClass) => (
                  <SelectItem key={boatClass} value={boatClass}>{boatClass}</SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup label="Female">
                {boatClasses.Female.map((boatClass) => (
                  <SelectItem key={boatClass} value={boatClass}>{boatClass}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="h-5" />
          <Input
            type="text"
            placeholder="Boat Name"
            value={boat.boatName}
            onChange={(e) => onUpdate(boat.id, "boatName", e.target.value)}
            className="w-1/2 text-lg bg-accent text-accent-foreground"
          />
        </CardTitle>
        <CardDescription>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Total Time</TableHead>
              <TableHead>Split Distance</TableHead>
              <TableHead>Split Time</TableHead>
              <TableHead>Split Pace (/500m)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boat.splitTimes.map((time, index) => {
              const splitDistanceDisplay = (index + 1) * splitDistance;
              const totalTimeDisplay = boat.totalTimes[index];

              return (
                <TableRow key={index}>
                  <TableCell>{formatTime(totalTimeDisplay)}</TableCell>
                  <TableCell>{splitDistanceDisplay}m</TableCell>
                  <TableCell>{time.toFixed(2)}s</TableCell>
                  <TableCell>{boat.splitPaces[index]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
          <Button onClick={() => onSplit(boat.id)} disabled={boat.splitTimes.length * splitDistance >= sessionDistance || !isRunning} className="bg-accent text-accent-foreground hover:bg-accent/80">
            Split
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Home component containing the entire app
export default function Home() {
  const [numBoats, setNumBoats] = useState(1);
  const [sessionDistance, setSessionDistance] = useState(2000);
  const [splitDistance, setSplitDistance] = useState(500);
  const [boats, setBoats] = useState<BoatData[]>([]);
  const [globalTime, setGlobalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);


    // Format global time into mm:ss.00
    const formatGlobalTime = (time: number): string => {
      const date = new Date(time);
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');
      const milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
      return `${minutes}:${seconds}.${milliseconds}`;
    };

    // Format global time into mm:ss.SSS
    const formatTime = (timeInSeconds: number): string => {
      const date = new Date(timeInSeconds * 1000); // Convert seconds to milliseconds
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');
      const milliseconds = date.getUTCMilliseconds().toString().slice(0, 2).padStart(2, '0');
      return `${minutes}:${seconds}.${milliseconds}`;
    };

  // Initialize boats based on numBoats
  useEffect(() => {
    const initialBoats = Array.from({ length: numBoats }, (_, i) => ({
      id: i + 1,
      boatClass: 'M1X',
      boatName: `Boat ${i + 1}`,
      splitTimes: [],
      splitPaces: [],
      intervalDiffs: [],
      totalTimes: [],
      isRunning: false,
    }));
    setBoats(initialBoats);
  }, [numBoats]);

  // Update global timer every 10ms when isRunning is true
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setGlobalTime(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, startTime]);

  // Handlers for session configuration changes
  const handleNumBoatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumBoats(parseInt(e.target.value));
  };

  const handleSessionDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionDistance(parseInt(e.target.value));
  };

  const handleSplitDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSplitDistance(parseInt(e.target.value));
  };

  // Handler to start the global timer
  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    setSessionStartTime(new Date());
    setBoats(boats => boats.map(boat => ({ ...boat, isRunning: true })));
  };

  // Handler to stop the global timer
  const handleStop = async () => {
    setIsRunning(false);
    setBoats(boats => boats.map(boat => ({ ...boat, isRunning: false })));
  };

  // Handler to record split time for a specific boat
  const handleSplit = (boatId: number) => {
    const currentTime = (Date.now() - startTime) / 1000; // Convert to seconds
    setBoats((prevBoats) =>
      prevBoats.map((boat) => {
        if (boat.id === boatId) {
          // Calculate the interval time
          const intervalTime = boat.splitTimes.length > 0 ? currentTime - boat.totalTimes[boat.totalTimes.length - 1] : currentTime;
          const newTotalTimes = [...boat.totalTimes, currentTime];
          const newSplitTimes = [...boat.splitTimes, intervalTime];

          // Calculate pace
          const paceInSeconds = (intervalTime / splitDistance) * 500;
          const minutes = Math.floor(paceInSeconds / 60);
          const seconds = (paceInSeconds % 60).toFixed(2);
          const formattedSeconds = seconds.padStart(5, '0'); // Ensure two digits before decimal
          const newSplitPaces = [...boat.splitPaces, `${minutes}:${formattedSeconds}`];

          // Calculate interval difference
          const intervalDifference = boat.splitTimes.length > 0 ? (currentTime - boat.splitTimes[boat.splitTimes.length - 1]).toFixed(2) : "0.00";
          const newIntervalDiffs = [...boat.intervalDiffs, intervalDifference + "s"];

          return {
            ...boat,
            splitTimes: newSplitTimes,
            splitPaces: newSplitPaces,
            intervalDiffs: newIntervalDiffs,
            totalTimes: newTotalTimes,
          };
        }
        return boat;
      })
    );
  };

  // Handler to update boat properties (name, class)
  const handleBoatUpdate = (boatId: number, key: string, value: string) => {
    setBoats((prevBoats) =>
      prevBoats.map((boat) =>
        boat.id === boatId ? { ...boat, [key]: value } : boat
      )
    );
  };

  

  const exportToCSV = async () => {
    if (!sessionStartTime) {
      toast({
        title: "Session not started",
        description: "Please start the session before exporting data.",
      });
      return;
    }

    // Format session datetime according to device locale
    const sessionDate = sessionStartTime.toLocaleDateString();
    const sessionTime = sessionStartTime.toLocaleTimeString();

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Session Date,Session Time,Session Distance,Boat Name,Boat Class,Total Time,Average Pace,WBT (%),";

    // Add split time headers dynamically based on maximum number of splits
    let maxSplits = 0;
    for (const boat of boats) {
        maxSplits = Math.max(maxSplits, boat.splitTimes.length);
    }
    for (let i = 1; i <= maxSplits; i++) {
        csvContent += `Split Time ${i},`;
    }
    csvContent += "\r\n"; // End header row

    for (const boat of boats) {
      const totalTime = boat.totalTimes.length > 0 ? boat.totalTimes[boat.totalTimes.length - 1] : 0;
      const totalTimeFormatted = formatGlobalTime(totalTime * 1000);
      const averagePaceSeconds = totalTime > 0 ? (totalTime / sessionDistance) * 500 : 0;
      const averagePaceMinutes = Math.floor(averagePaceSeconds / 60);
      const averagePaceFormattedSeconds = (averagePaceSeconds % 60).toFixed(2).padStart(5, '0');
      const averagePace = `${averagePaceMinutes}:${averagePaceFormattedSeconds}`;
    
      const worldBestTimeData = await getWorldBestTime(boat.boatClass);
      const worldBestTime = worldBestTimeData.timeInSeconds;
      const wbtPercentage = worldBestTime > 0 ? ((1-(totalTime - worldBestTime) / worldBestTime)*100).toFixed(2) : "0.00";
    
      let boatRow = `${sessionDate},${sessionTime},${sessionDistance},${boat.boatName},${boat.boatClass},${totalTimeFormatted},${averagePace},${wbtPercentage},`;
    
      // Add split times, padding with empty values for shorter sessions
      for (let i = 0; i < maxSplits; i++) {
          if (i < boat.splitTimes.length) {
              boatRow += boat.splitTimes[i].toFixed(2) + ",";
          } else {
              boatRow += ","; // Empty cell for missing split
          }
      }
      csvContent += boatRow + "\r\n"; // End boat row
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rowing_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="container mx-auto p-4 bg-background">
      <Toaster />
      {/* Global Timer and Controls */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Global Timer</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-4xl font-bold">{formatGlobalTime(globalTime)}</div>
          <div className="flex items-center space-x-4">
            {!isRunning ? (
              <Button onClick={handleStart} className="text-black"><Icons.play className="mr-2 h-4 w-4"/>Start</Button>
            ) : (
              <>
                <Button onClick={handleStop} variant="destructive"><Icons.pause className="mr-2 h-4 w-4"/>Stop</Button>
              </>
            )}
               <Button variant="outline" onClick={exportToCSV} className="bg-gold text-accent-foreground hover:bg-accent/80">
              Export CSV <Icons.download className="ml-2 h-4 w-4"/>
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Session Configuration */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Session Configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="numBoats">Number of Boats</Label>
            <Input
              type="number"
              id="numBoats"
              value={numBoats}
              onChange={handleNumBoatsChange}
              min="1"
              className="bg-accent text-accent-foreground"
            />
          </div>
          <div>
            <Label htmlFor="sessionDistance">Session Distance (m)</Label>
            <Input
              type="number"
              id="sessionDistance"
              value={sessionDistance}
              onChange={handleSessionDistanceChange}
              min="100"
              className="bg-accent text-accent-foreground"
            />
          </div>
          <div>
            <Label htmlFor="splitDistance">Split Distance (m)</Label>
            <Input
              type="number"
              id="splitDistance"
              value={splitDistance}
              onChange={handleSplitDistanceChange}
              min="50"
              className="bg-accent text-accent-foreground"
            />
          </div>
        </CardContent>
      </Card>


      {/* Boat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boats.map((boat) => (
          <BoatCard
            key={boat.id}
            boat={boat}
            onSplit={handleSplit}
            onUpdate={handleBoatUpdate}
            isRunning={isRunning}
            sessionDistance={sessionDistance}
            splitDistance={splitDistance}
          />
        ))}
      </div>
    </div>
  );
}






