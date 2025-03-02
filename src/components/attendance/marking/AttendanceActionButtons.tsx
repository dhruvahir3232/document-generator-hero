
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface AttendanceActionButtonsProps {
  studentId: string;
  currentStatus: "present" | "absent" | "late" | "excused" | null;
  isSaving: boolean;
  onMarkAttendance: (studentId: string, status: "present" | "absent" | "late" | "excused") => void;
}

export function AttendanceActionButtons({ 
  studentId, 
  currentStatus, 
  isSaving,
  onMarkAttendance 
}: AttendanceActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <Button 
        variant={currentStatus === "present" ? "default" : "outline"} 
        size="sm"
        onClick={() => onMarkAttendance(studentId, "present")}
        disabled={isSaving}
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        Present
      </Button>
      <Button 
        variant={currentStatus === "absent" ? "default" : "outline"} 
        size="sm"
        onClick={() => onMarkAttendance(studentId, "absent")}
        disabled={isSaving}
      >
        <XCircle className="h-4 w-4 mr-1" />
        Absent
      </Button>
      <Button 
        variant={currentStatus === "late" ? "default" : "outline"} 
        size="sm"
        onClick={() => onMarkAttendance(studentId, "late")}
        disabled={isSaving}
      >
        <Clock className="h-4 w-4 mr-1" />
        Late
      </Button>
      <Button 
        variant={currentStatus === "excused" ? "default" : "outline"} 
        size="sm"
        onClick={() => onMarkAttendance(studentId, "excused")}
        disabled={isSaving}
      >
        <AlertCircle className="h-4 w-4 mr-1" />
        Excused
      </Button>
      {isSaving && (
        <span className="ml-2 text-xs text-muted-foreground animate-pulse">
          Saving...
        </span>
      )}
    </div>
  );
}
