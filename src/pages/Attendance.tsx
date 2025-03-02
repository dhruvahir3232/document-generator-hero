
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NavigationActions } from "@/components/layout/NavigationActions";
import { Student } from "@/components/StudentCard";
import { SearchSection } from "@/components/document-generator/SearchSection";
import { Card, CardContent } from "@/components/ui/card";
import { AttendanceSheet } from "@/components/documents/AttendanceSheet";

const Attendance = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <NavigationActions />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <SearchSection 
                onSelectStudent={handleSelectStudent} 
                selectedStudent={selectedStudent} 
              />
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
                        Search for a student by name and select from the results to view attendance records.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Attendance;
