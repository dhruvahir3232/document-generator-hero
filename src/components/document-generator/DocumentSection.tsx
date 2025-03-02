
import { Card, CardContent } from "@/components/ui/card";
import { DocumentTypeSelector } from "@/components/DocumentTypeSelector";
import { DocumentPreview } from "@/components/DocumentPreview";
import { Student } from "@/components/StudentCard";

interface DocumentSectionProps {
  selectedStudent: Student | null;
  selectedDocumentType: string | null;
  onSelectDocumentType: (docType: string) => void;
}

export const DocumentSection = ({
  selectedStudent,
  selectedDocumentType,
  onSelectDocumentType
}: DocumentSectionProps) => {
  if (!selectedStudent) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-secondary/50 p-4 border-b">
          <h2 className="text-lg font-medium">Select Document Type</h2>
        </div>
        <CardContent className="p-4">
          <DocumentTypeSelector 
            selectedType={selectedDocumentType} 
            onSelect={onSelectDocumentType} 
          />
        </CardContent>
      </Card>
      
      {selectedDocumentType ? (
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
      ) : (
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
  );
};
