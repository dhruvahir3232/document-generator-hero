
import { StudentIdCard } from "./documents/StudentIdCard";
import { FeePaymentReceipt } from "./documents/FeePaymentReceipt";
import { CourseStudentList } from "./documents/CourseStudentList";
import { ExamReceipt } from "./documents/ExamReceipt";
import { ResultMarksheet } from "./documents/ResultMarksheet";
import { AttendanceSheet } from "./documents/AttendanceSheet";
import { Student } from "./StudentCard";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DocumentPreviewProps {
  documentType: string;
  student: Student;
}

export function DocumentPreview({ documentType, student }: DocumentPreviewProps) {
  // Function to render the appropriate document based on documentType
  const renderDocument = () => {
    switch (documentType) {
      case "id-card":
        return <StudentIdCard student={student} />;
      case "fee-receipt":
        return <FeePaymentReceipt student={student} />;
      case "course-list":
        return <CourseStudentList student={student} />;
      case "exam-receipt":
        return <ExamReceipt student={student} />;
      case "marksheet":
        return <ResultMarksheet student={student} />;
      case "attendance":
        return <AttendanceSheet student={student} />;
      default:
        return <div className="text-center p-8">Select a document type to preview</div>;
    }
  };

  // In a real app, this would generate and download the document
  const handleDownload = () => {
    // Mock function - in a real app, this would use a library like pdfmake or jsPDF
    console.log(`Downloading ${documentType} for student ${student.name}`);
    alert(`In a real application, this would download the ${documentType} document for ${student.name}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Document Preview</h2>
        <Button 
          onClick={handleDownload}
          className="flex items-center space-x-2"
        >
          <Download size={16} />
          <span>Download</span>
        </Button>
      </div>
      
      {renderDocument()}
    </div>
  );
}
