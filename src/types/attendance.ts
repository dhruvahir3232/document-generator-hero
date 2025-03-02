
export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CourseAttendance {
  id: string;
  name: string;
  totalClasses: number;
  attended: number;
  percentage: number;
}

export interface DailyAttendanceItem {
  day: number;
  date: string;
  status: string;
  isWeekend: boolean;
}
