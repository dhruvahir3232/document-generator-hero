
import { AttendanceRecord, CourseAttendance, DailyAttendanceItem } from "@/types/attendance";

export const generateAttendanceStats = (records: AttendanceRecord[]): CourseAttendance[] => {
  // Create courses data
  const courses = [
    { 
      id: "CS101",
      name: "Introduction to Computer Science",
      totalClasses: 24,
      attended: 0,
      percentage: 0
    },
    { 
      id: "CS201",
      name: "Data Structures and Algorithms",
      totalClasses: 24,
      attended: 0,
      percentage: 0
    },
    { 
      id: "MATH101",
      name: "Calculus I",
      totalClasses: 32,
      attended: 0,
      percentage: 0
    },
    { 
      id: "ENG201",
      name: "Technical Writing",
      totalClasses: 16,
      attended: 0,
      percentage: 0
    }
  ];
  
  // Count attendance for each course
  const presentDays = records.filter(r => r.status === 'present').length;
  const totalPossibleAttendance = courses.reduce((sum, course) => sum + course.totalClasses, 0);
  
  // Distribute the present days across courses proportionally
  courses.forEach(course => {
    // Calculate proportional attendance for this course
    const proportionalWeight = course.totalClasses / totalPossibleAttendance;
    const estimatedAttendance = Math.floor(presentDays * proportionalWeight);
    
    course.attended = Math.min(estimatedAttendance, course.totalClasses);
    course.percentage = (course.attended / course.totalClasses) * 100;
  });
  
  return courses;
};

export const generateDailyAttendance = (records: AttendanceRecord[]): DailyAttendanceItem[] => {
  const daysInMonth = 30;
  const today = new Date();
  
  // Create a map of date -> status for quick lookup
  const dateStatusMap = new Map<string, string>();
  records.forEach(record => {
    const recordDate = new Date(record.date);
    const day = recordDate.getDate();
    const status = record.status === 'present' ? 'P' : 
                   record.status === 'absent' ? 'A' : 
                   record.status === 'late' ? 'L' : 'E'; // E for excused
    dateStatusMap.set(day.toString(), status);
  });
  
  // Generate daily attendance array
  const attendance = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date();
    date.setDate(day);
    
    // Weekend check - make weekends non-teaching days
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    // For days in the future, no status yet
    if (day > today.getDate()) {
      return {
        day,
        date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        status: '-',
        isWeekend
      };
    }
    
    // For past days, get status from records or assign default
    let status = dateStatusMap.get(day.toString()) || '-';
    
    if (isWeekend) {
      status = '-'; // Non-teaching day
    }
    
    return {
      day,
      date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      status,
      isWeekend
    };
  });
  
  return attendance;
};
