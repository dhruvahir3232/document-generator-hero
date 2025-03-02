
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Student } from "../StudentCard";

interface StudentIdCardProps {
  student: Student;
}

export function StudentIdCard({ student }: StudentIdCardProps) {
  const currentDate = new Date();
  const expiryDate = new Date(currentDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="document-preview animate-scale-in">
      <div className="max-w-md mx-auto">
        <Card className="overflow-hidden border border-border">
          {/* Card Header */}
          <div className="bg-primary p-4 text-primary-foreground text-center">
            <h2 className="text-xl font-semibold">STUDENT IDENTIFICATION CARD</h2>
            <p className="text-sm opacity-90">University of Excellence</p>
          </div>
          
          {/* Card Content */}
          <div className="p-6 flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-primary">
              {student.photo_url ? (
                <AvatarImage src={student.photo_url} alt={student.name} />
              ) : (
                <AvatarFallback className="text-4xl">
                  {getInitials(student.name)}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-semibold">{student.name}</h3>
              <p className="text-muted-foreground">{student.class || "Computer Science"}</p>
              <p className="text-sm">ID: {student.id || "ST-" + Math.floor(10000 + Math.random() * 90000)}</p>
            </div>
            
            <div className="w-full grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Issue Date</p>
                <p className="font-medium">{formatDate(currentDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Valid Until</p>
                <p className="font-medium">{formatDate(expiryDate)}</p>
              </div>
            </div>
          </div>
          
          {/* Card Footer */}
          <div className="bg-secondary p-4 text-center text-xs text-muted-foreground">
            <p>This card is the property of University of Excellence</p>
            <p>If found, please return to the University Administration Office</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
