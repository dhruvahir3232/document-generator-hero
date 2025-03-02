
import { useState } from "react";
import { Student } from "@/components/StudentCard";
import { StudentSearch } from "@/components/StudentSearch";
import { DocumentTypeSelector } from "@/components/DocumentTypeSelector";
import { StudentResultsList } from "@/components/StudentResultsList";
import { DocumentPreview } from "@/components/DocumentPreview";
import { generateMockStudents, findStudentsByName } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // This would be replaced with a real API call to fetch student data
  const handleSearch = (name: string) => {
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const mockStudents = generateMockStudents();
      const results = findStudentsByName(mockStudents, name);
      setSearchResults(results);
      setIsSearching(false);
      
      // Auto-select if only one result
      if (results.length === 1) {
        setSelectedStudent(results[0]);
      } else {
        setSelectedStudent(null);
      }
    }, 800);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleSelectDocumentType = (docType: string) => {
    setSelectedDocumentType(docType);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in">Student Document Generator</h1>
            <p className="text-lg opacity-90 animate-fade-up">
              Generate various documents based on student information
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Student Search & Selection */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="overflow-hidden">
                <div className="bg-secondary/50 p-4 border-b">
                  <h2 className="text-lg font-medium">Search Student</h2>
                </div>
                <CardContent className="p-4">
                  <ScrollArea className="h-[calc(100vh-320px)]">
                    <div className="space-y-6 pr-4">
                      <StudentSearch onSearch={handleSearch} isLoading={isSearching} />
                      
                      {hasSearched && !isSearching && (
                        <>
                          {searchResults.length > 0 ? (
                            <StudentResultsList 
                              students={searchResults} 
                              selectedStudent={selectedStudent} 
                              onSelectStudent={handleSelectStudent} 
                            />
                          ) : (
                            <div className="text-center py-6 text-muted-foreground">
                              No students found. Try a different name.
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Document Type Selection */}
              {selectedStudent && (
                <Card className="overflow-hidden">
                  <div className="bg-secondary/50 p-4 border-b">
                    <h2 className="text-lg font-medium">Select Document Type</h2>
                  </div>
                  <CardContent className="p-4">
                    <DocumentTypeSelector 
                      selectedType={selectedDocumentType} 
                      onSelect={handleSelectDocumentType} 
                    />
                  </CardContent>
                </Card>
              )}
              
              {/* Document Preview */}
              {selectedStudent && selectedDocumentType && (
                <Card className="overflow-hidden">
                  <div className="bg-secondary/50 p-4 border-b">
                    <h2 className="text-lg font-medium">Document Preview</h2>
                  </div>
                  <CardContent className="p-6">
                    <DocumentPreview 
                      documentType={selectedDocumentType} 
                      student={selectedStudent} 
                    />
                  </CardContent>
                </Card>
              )}
              
              {/* No Student Selected */}
              {!selectedStudent && (
                <Card className="bg-secondary/30 border-dashed">
                  <CardContent className="p-12 text-center">
                    <div className="space-y-3 max-w-md mx-auto">
                      <h3 className="text-xl font-medium">No Student Selected</h3>
                      <p className="text-muted-foreground">
                        Search for a student by name and select from the results to generate documents.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Student Selected but No Document Type */}
              {selectedStudent && !selectedDocumentType && (
                <Card className="bg-secondary/30 border-dashed">
                  <CardContent className="p-12 text-center">
                    <div className="space-y-3 max-w-md mx-auto">
                      <h3 className="text-xl font-medium">Select a Document Type</h3>
                      <p className="text-muted-foreground">
                        Choose a document type from the options above to generate and preview.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary/50 py-6 border-t mt-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Student Document Generator</p>
            <p className="mt-1">Designed for educational institutions to manage student documentation efficiently.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
