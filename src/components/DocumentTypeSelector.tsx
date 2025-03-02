
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileTextIcon, 
  CreditCardIcon, 
  ReceiptIcon, 
  ListIcon,
  FileCheckIcon,
  CalendarCheckIcon
} from "lucide-react";

export interface DocumentType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface DocumentTypeSelectorProps {
  selectedType: string | null;
  onSelect: (documentType: string) => void;
}

export const documentTypes: DocumentType[] = [
  {
    id: "id-card",
    name: "Student ID Card",
    icon: <CreditCardIcon size={24} />,
    description: "Identity card with student photo and details"
  },
  {
    id: "fee-receipt",
    name: "Fee Payment Receipt",
    icon: <ReceiptIcon size={24} />,
    description: "Payment confirmation for tuition fees"
  },
  {
    id: "course-list",
    name: "Course Student List",
    icon: <ListIcon size={24} />,
    description: "List of enrolled courses and details"
  },
  {
    id: "exam-receipt",
    name: "Exam Receipt",
    icon: <FileTextIcon size={24} />,
    description: "Exam confirmation with QR code"
  },
  {
    id: "marksheet",
    name: "Result Marksheet",
    icon: <FileCheckIcon size={24} />,
    description: "Academic performance results"
  },
  {
    id: "attendance",
    name: "Attendance Sheet",
    icon: <CalendarCheckIcon size={24} />,
    description: "Student attendance record"
  }
];

export function DocumentTypeSelector({ selectedType, onSelect }: DocumentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up">
      {documentTypes.map((docType) => (
        <Card 
          key={docType.id}
          className={`cursor-pointer transition-all duration-200 overflow-hidden ${
            selectedType === docType.id 
              ? "ring-2 ring-primary shadow-medium" 
              : "hover:shadow-medium hover:-translate-y-1"
          }`}
          onClick={() => onSelect(docType.id)}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className={`rounded-full p-3 mb-4 ${
              selectedType === docType.id 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-muted-foreground"
            }`}>
              {docType.icon}
            </div>
            <h3 className="font-medium mb-1">{docType.name}</h3>
            <p className="text-sm text-muted-foreground">{docType.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
