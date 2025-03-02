
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Student } from "../StudentCard";
import { getInitials } from "@/lib/utils";

interface CourseStudentListProps {
  student: Student;
}

export function CourseStudentList({ student }: CourseStudentListProps) {
  // Mock data for courses
  const courses = [
    { 
      id: "CS101",
      name: "Introduction to Computer Science",
      instructor: "Dr. Alan Turing",
      credits: 4,
      schedule: "Mon, Wed 10:00-11:30 AM"
    },
    { 
      id: "CS201",
      name: "Data Structures and Algorithms",
      instructor: "Dr. Ada Lovelace",
      credits: 4,
      schedule: "Tue, Thu 1:00-2:30 PM"
    },
    { 
      id: "MATH101",
      name: "Calculus I",
      instructor: "Dr. Isaac Newton",
      credits: 3,
      schedule: "Mon, Wed, Fri 9:00-10:00 AM"
    },
    { 
      id: "ENG201",
      name: "Technical Writing",
      instructor: "Prof. Jane Smith",
      credits: 2,
      schedule: "Fri 3:00-5:00 PM"
    }
  ];

  return (
    <div className="document-preview animate-scale-in">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Course Enrollment List</CardTitle>
                <p className="opacity-90">Academic Year 2023-2024</p>
              </div>
              <div className="text-right">
                <p>University of Excellence</p>
                <p className="text-sm opacity-80">Department of Computer Science</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Student Information */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-secondary/40 rounded-lg">
              <Avatar className="h-16 w-16 border">
                {student.photo_url ? (
                  <AvatarImage src={student.photo_url} alt={student.name} />
                ) : (
                  <AvatarFallback className="text-xl">
                    {getInitials(student.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{student.name}</h3>
                <p className="text-muted-foreground">
                  ID: {student.id || "ST-" + Math.floor(10000 + Math.random() * 90000)}
                </p>
                <p className="text-muted-foreground">
                  Program: {student.class || "Bachelor of Science in Computer Science"}
                </p>
              </div>
            </div>
            
            {/* Course List */}
            <h3 className="font-semibold text-lg mb-4">Enrolled Courses</h3>
            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{course.name}</h4>
                        <p className="text-sm text-muted-foreground">Course Code: {course.id}</p>
                      </div>
                      <div className="bg-secondary py-1 px-3 rounded-full text-xs font-medium">
                        {course.credits} Credits
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Instructor:</span> {course.instructor}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Schedule:</span> {course.schedule}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Total Credits */}
            <div className="mt-6 p-4 bg-secondary/40 rounded-lg text-right">
              <p className="font-medium">
                Total Credits: {courses.reduce((sum, course) => sum + course.credits, 0)}
              </p>
            </div>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>This document verifies the student's enrollment in the listed courses.</p>
              <p>For any changes to course registration, please contact the Academic Office.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
