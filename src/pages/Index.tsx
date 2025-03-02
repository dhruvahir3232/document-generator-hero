
import { useState } from "react";
import { Student } from "@/components/StudentCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NavigationActions } from "@/components/layout/NavigationActions";
import { SearchSection } from "@/components/document-generator/SearchSection";
import { DocumentSection } from "@/components/document-generator/DocumentSection";

const Index = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    // Reset document type when selecting a new student
    setSelectedDocumentType(null);
  };

  const handleSelectDocumentType = (docType: string) => {
    setSelectedDocumentType(docType);
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
              <DocumentSection 
                selectedStudent={selectedStudent}
                selectedDocumentType={selectedDocumentType}
                onSelectDocumentType={handleSelectDocumentType}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
