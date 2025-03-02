
import { AttendanceRecord, CourseAttendance, DailyAttendanceItem } from "@/types/attendance";

export const generateAttendanceStats = (records: AttendanceRecord[]): CourseAttendance[] => {
  // Mock courses data (in a real app, this would come from the database)
  const mockCourses = [
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
  
  // Count attendance for each course (simplified for now)
  const presentDays = records.filter(r => r.status === 'present').length;
  
  // Distribute the present days across courses proportionally
  mockCourses.forEach(course => {
    // This is a simplified approach - in a real app you'd have course-specific attendance
    const coursePresentDays = Math.floor(presentDays * (course.totalClasses / 96));
    course.attended = Math.min(coursePresentDays, course.totalClasses);
    course.percentage = (course.attended / course.totalClasses) * 100;
  });
  
  return mockCourses;
};

export const generateDailyAttendance = (records: AttendanceRecord[]): DailyAttendanceItem[] => {
  const daysInMonth = 30;
  const today = new Date();
  
  // Create a map of date -> status for quick lookup
  const dateStatusMap = new Map<string, string>();
  records.forEach(record => {
    const recordDate = new Date(record.date);
    // Only include records from the current month
    if (recordDate.getMonth() === today.getMonth() && 
        recordDate.getFullYear() === today.getFullYear()) {
      const day = recordDate.getDate();
      const status = record.status === 'present' ? 'P' : 
                    record.status === 'absent' ? 'A' : 
                    record.status === 'late' ? 'L' : 'E'; // E for excused
      dateStatusMap.set(day.toString(), status);
    }
  });
  
  // Generate daily attendance array
  const attendance = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date();
    date.setDate(day);
    
    // Weekend check - make weekends non-teaching days
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    // For days in the future, no status yet
    if (day > new Date().getDate()) {
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
