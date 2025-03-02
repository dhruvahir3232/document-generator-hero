import { useState } from "react";
import { Link } from "react-router-dom";
import { Student } from "@/components/StudentCard";
import { StudentSearch } from "@/components/StudentSearch";
import { DocumentTypeSelector } from "@/components/DocumentTypeSelector";
import { StudentResultsList } from "@/components/StudentResultsList";
import { DocumentPreview } from "@/components/DocumentPreview";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (name: string) => {
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .ilike('name', `%${name}%`);
      
      if (error) {
        throw error;
      }
      
      const students: Student[] = data.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        class: student.class,
        photo_url: student.picture
      }));
      
      setSearchResults(students);
      
      if (students.length === 1) {
        setSelectedStudent(students[0]);
      } else {
        setSelectedStudent(null);
      }
      
      if (students.length === 0) {
        toast.info("No students found with that name.");
      } else {
        toast.success(`Found ${students.length} student(s).`);
      }
      
    } catch (error) {
      console.error("Error searching for students:", error);
      toast.error("Failed to search for students. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleSelectDocumentType = (docType: string) => {
    setSelectedDocumentType(docType);
  };

  return (
    <div className="min-h-screen bg-background">
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

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-6 gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/manage-students">
                <Users className="mr-2 h-4 w-4" />
                Manage Students
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/manage-students">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            
            <div className="lg:col-span-2 space-y-6">
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
