
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Student } from "../StudentCard";
import { getInitials } from "@/lib/utils";

interface ExamReceiptProps {
  student: Student;
}

export function ExamReceipt({ student }: ExamReceiptProps) {
  // Mock exam data
  const examDate = new Date();
  examDate.setDate(examDate.getDate() + 14); // Set exam date to 14 days from now
  
  const examDetails = [
    { 
      subject: "Introduction to Computer Science",
      code: "CS101",
      date: new Date(examDate.getTime() + 0 * 24 * 60 * 60 * 1000),
      time: "10:00 AM - 1:00 PM",
      venue: "Examination Hall A"
    },
    { 
      subject: "Data Structures and Algorithms",
      code: "CS201",
      date: new Date(examDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      time: "2:00 PM - 5:00 PM",
      venue: "Examination Hall B"
    },
    { 
      subject: "Calculus I",
      code: "MATH101",
      date: new Date(examDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      time: "10:00 AM - 1:00 PM",
      venue: "Examination Hall C"
    },
    { 
      subject: "Technical Writing",
      code: "ENG201",
      date: new Date(examDate.getTime() + 6 * 24 * 60 * 60 * 1000),
      time: "2:00 PM - 4:00 PM",
      venue: "Examination Hall A"
    }
  ];
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock QR code (in a real app, we would generate this with a library)
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + 
    encodeURIComponent(`STUDENT: ${student.name}, ID: ${student.id || "ST-" + Math.floor(10000 + Math.random() * 90000)}`);

  return (
    <div className="document-preview animate-scale-in">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">EXAM HALL TICKET</CardTitle>
                <p className="opacity-90">Semester End Examination</p>
              </div>
              <div className="text-right">
                <p>University of Excellence</p>
                <p className="text-sm opacity-80">Academic Year 2023-2024</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Student Details with QR Code */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6 p-4 bg-secondary/40 rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 border">
                  {student.photo_url ? (
                    <AvatarImage src={student.photo_url} alt={student.name} />
                  ) : (
                    <AvatarFallback className="text-2xl">
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
              
              <div className="flex flex-col items-center">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-24 h-24 border border-border rounded"
                />
                <p className="text-xs text-muted-foreground mt-1">Hall Ticket Verification</p>
              </div>
            </div>
            
            {/* Exam Schedule */}
            <h3 className="font-semibold text-lg mb-4">Examination Schedule</h3>
            <div className="space-y-4">
              {examDetails.map((exam, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{exam.subject}</h4>
                        <p className="text-sm text-muted-foreground">Course Code: {exam.code}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Date:</span> {formatDate(exam.date)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span> {exam.time}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Venue:</span> {exam.venue}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            {/* Instructions */}
            <div>
              <h3 className="font-semibold mb-3">Important Instructions:</h3>
              <ul className="text-sm space-y-2 pl-5 list-disc">
                <li>Students must carry this hall ticket and university ID to the examination.</li>
                <li>Students should reach the examination venue 30 minutes before the scheduled time.</li>
                <li>No electronic devices are allowed in the examination hall except approved calculators.</li>
                <li>Students will not be permitted to enter the examination hall 30 minutes after the commencement of the exam.</li>
                <li>Violating examination rules may result in disciplinary action.</li>
              </ul>
            </div>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>This is a computer-generated hall ticket and does not require a signature.</p>
              <p>For any queries regarding examinations, please contact the Examination Department.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
