
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NavigationActions } from "@/components/layout/NavigationActions";
import { Student } from "@/components/StudentCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DailyAttendanceMarkingSheet } from "@/components/attendance/DailyAttendanceMarkingSheet";
import { AttendanceSheet } from "@/components/documents/AttendanceSheet";

const Attendance = () => {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, email, class, picture, marksheet_10th, marksheet_12th')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      const mappedStudents: Student[] = data.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        class: student.class,
        photo_url: student.picture,
        has_academic_records: Boolean(student.marksheet_10th || student.marksheet_12th)
      }));

      setStudents(mappedStudents);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <NavigationActions />
          
          <Tabs defaultValue="daily" className="mb-6">
            <TabsList>
              <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
              <TabsTrigger value="student">Student Records</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <h3 className="text-lg font-medium">Select Date</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="border rounded-md max-w-[300px]"
                      />
                    </div>
                    <div className="mt-4 text-center text-sm">
                      <p>Selected: <span className="font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span></p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="lg:col-span-3">
                  <DailyAttendanceMarkingSheet 
                    students={students} 
                    selectedDate={formattedDate} 
                    isLoading={loading}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="student" className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <h3 className="font-medium">Students</h3>
                    </CardHeader>
                    <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                      <ul className="divide-y">
                        {students.map((student) => (
                          <li key={student.id}>
                            <button
                              onClick={() => handleSelectStudent(student)}
                              className={`w-full text-left px-4 py-3 hover:bg-secondary/50 transition-colors ${
                                selectedStudent?.id === student.id ? 'bg-secondary' : ''
                              }`}
                            >
                              {student.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                  {selectedStudent ? (
                    <AttendanceSheet student={selectedStudent} />
                  ) : (
                    <Card className="bg-secondary/30 border-dashed">
                      <CardContent className="p-12 text-center">
                        <div className="space-y-3 max-w-md mx-auto">
                          <h3 className="text-xl font-medium">No Student Selected</h3>
                          <p className="text-muted-foreground">
                            Select a student from the list to view attendance records.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Attendance;
