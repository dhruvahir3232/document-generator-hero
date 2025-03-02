
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Student } from "../StudentCard";

interface ResultMarksheetProps {
  student: Student;
}

export function ResultMarksheet({ student }: ResultMarksheetProps) {
  // Mock data for 10th and 12th marksheet
  const tenthMarks = [
    { subject: "English", marks: 85, maxMarks: 100, grade: "A" },
    { subject: "Mathematics", marks: 92, maxMarks: 100, grade: "A+" },
    { subject: "Science", marks: 88, maxMarks: 100, grade: "A" },
    { subject: "Social Studies", marks: 78, maxMarks: 100, grade: "B+" },
    { subject: "Hindi", marks: 82, maxMarks: 100, grade: "A" }
  ];
  
  const twelfthMarks = [
    { subject: "English", marks: 88, maxMarks: 100, grade: "A" },
    { subject: "Physics", marks: 85, maxMarks: 100, grade: "A" },
    { subject: "Chemistry", marks: 90, maxMarks: 100, grade: "A+" },
    { subject: "Mathematics", marks: 95, maxMarks: 100, grade: "A+" },
    { subject: "Computer Science", marks: 92, maxMarks: 100, grade: "A+" }
  ];
  
  const calculatePercentage = (marks: any[]) => {
    const totalMarks = marks.reduce((sum, subject) => sum + subject.marks, 0);
    const totalMaxMarks = marks.reduce((sum, subject) => sum + subject.maxMarks, 0);
    return ((totalMarks / totalMaxMarks) * 100).toFixed(2);
  };
  
  const tenthPercentage = calculatePercentage(tenthMarks);
  const twelfthPercentage = calculatePercentage(twelfthMarks);

  return (
    <div className="document-preview animate-scale-in">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Academic Result Marksheet</CardTitle>
                <p className="opacity-90">10th & 12th Standard Records</p>
              </div>
              <div className="text-right">
                <p>University of Excellence</p>
                <p className="text-sm opacity-80">Student Records Department</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Student Information */}
            <div className="mb-6 p-4 bg-secondary/40 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">STUDENT NAME</h3>
                  <p className="font-medium">{student.name}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">STUDENT ID</h3>
                  <p className="font-medium">{student.id || "ST-" + Math.floor(10000 + Math.random() * 90000)}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">CURRENT PROGRAM</h3>
                  <p className="font-medium">{student.class || "Bachelor of Science in Computer Science"}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">DATE OF ISSUE</h3>
                  <p className="font-medium">{new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            </div>
            
            {/* 10th Standard Marksheet */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">10th Standard Marksheet</h3>
              <Card>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Board of Education:</p>
                      <p className="font-medium">Central Board of Secondary Education</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Year of Passing:</p>
                      <p className="font-medium">{(new Date().getFullYear() - 7)}</p>
                    </div>
                  </div>
                  
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="p-2 text-left">Subject</th>
                        <th className="p-2 text-center">Marks Obtained</th>
                        <th className="p-2 text-center">Maximum Marks</th>
                        <th className="p-2 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenthMarks.map((subject, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{subject.subject}</td>
                          <td className="p-2 text-center">{subject.marks}</td>
                          <td className="p-2 text-center">{subject.maxMarks}</td>
                          <td className="p-2 text-center font-medium">{subject.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="mt-4 p-3 bg-secondary/40 rounded-lg text-right">
                    <p className="font-medium">Total Percentage: {tenthPercentage}%</p>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* 12th Standard Marksheet */}
            <div>
              <h3 className="font-semibold text-lg mb-4">12th Standard Marksheet</h3>
              <Card>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Board of Education:</p>
                      <p className="font-medium">Central Board of Secondary Education</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Year of Passing:</p>
                      <p className="font-medium">{(new Date().getFullYear() - 5)}</p>
                    </div>
                  </div>
                  
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="p-2 text-left">Subject</th>
                        <th className="p-2 text-center">Marks Obtained</th>
                        <th className="p-2 text-center">Maximum Marks</th>
                        <th className="p-2 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {twelfthMarks.map((subject, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{subject.subject}</td>
                          <td className="p-2 text-center">{subject.marks}</td>
                          <td className="p-2 text-center">{subject.maxMarks}</td>
                          <td className="p-2 text-center font-medium">{subject.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="mt-4 p-3 bg-secondary/40 rounded-lg text-right">
                    <p className="font-medium">Total Percentage: {twelfthPercentage}%</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>This is a computer-generated statement of academic records and does not require a signature.</p>
              <p>For verification or any queries regarding marks, please contact the Academic Records Department.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
