
import { useState, useEffect } from "react";
import { DailyAttendanceItem } from "@/types/attendance";
import { useAttendanceRecords } from "@/hooks/use-attendance-records";
import { generateDailyAttendance } from "@/utils/attendanceUtils";

interface DailyAttendanceGridProps {
  studentId: string;
}

export function DailyAttendanceGrid({ studentId }: DailyAttendanceGridProps) {
  const [dailyAttendance, setDailyAttendance] = useState<DailyAttendanceItem[]>([]);
  const { attendanceRecords, loading } = useAttendanceRecords({ studentId });
  
  useEffect(() => {
    if (attendanceRecords.length > 0) {
      const attendance = generateDailyAttendance(attendanceRecords);
      setDailyAttendance(attendance);
    } else {
      // If no records, generate empty attendance grid
      const emptyAttendance = generateDailyAttendance([]);
      setDailyAttendance(emptyAttendance);
    }
  }, [attendanceRecords]);

  return (
    <>
      <h3 className="font-semibold text-lg mb-4">Daily Attendance</h3>
      <div className="grid grid-cols-6 gap-2 mb-4">
        {dailyAttendance.map((day) => (
          <div 
            key={day.day} 
            className={`p-2 text-center rounded-md ${
              day.isWeekend 
                ? 'bg-secondary/30 text-muted-foreground' 
                : day.status === 'P' 
                  ? 'bg-green-100 text-green-800' 
                  : day.status === 'A' 
                    ? 'bg-red-100 text-red-800' 
                    : day.status === 'L' 
                      ? 'bg-blue-100 text-blue-800'
                      : day.status === 'E'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-secondary/50'
            }`}
          >
            <div className="text-xs">{day.date}</div>
            <div className="font-medium">{day.status}</div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm mb-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 rounded-sm mr-2"></div>
          <span>P: Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 rounded-sm mr-2"></div>
          <span>A: Absent</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 rounded-sm mr-2"></div>
          <span>L: Late</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-100 rounded-sm mr-2"></div>
          <span>E: Excused</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-secondary/30 rounded-sm mr-2"></div>
          <span>-: Non-teaching day</span>
        </div>
      </div>
    </>
  );
}
