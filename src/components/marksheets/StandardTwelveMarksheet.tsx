
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { AcademicRecord, Mark } from "./StandardTenMarksheet";

interface StandardTwelveMarksheetProps {
  marksheet: AcademicRecord;
  onChange: (marksheet: AcademicRecord) => void;
}

export function StandardTwelveMarksheet({ marksheet, onChange }: StandardTwelveMarksheetProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...marksheet, [name]: value });
  };
  
  const handleMarksChange = (index: number, field: 'subject' | 'marks' | 'maxMarks', value: string) => {
    const updatedMarks = [...marksheet.marks];
    updatedMarks[index] = { ...updatedMarks[index], [field]: value };
    onChange({ ...marksheet, marks: updatedMarks });
  };
  
  const addSubject = () => {
    onChange({
      ...marksheet,
      marks: [...marksheet.marks, { subject: "", marks: "", maxMarks: "100" }]
    });
  };
  
  const removeSubject = (index: number) => {
    const updatedMarks = [...marksheet.marks];
    updatedMarks.splice(index, 1);
    onChange({ ...marksheet, marks: updatedMarks });
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-medium">12th Standard Marksheet</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="year12" className="text-sm font-medium">Year</label>
            <Input
              id="year12"
              name="year"
              value={marksheet.year}
              onChange={handleChange}
              placeholder="Year of completion"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="board12" className="text-sm font-medium">Board/University</label>
            <Input
              id="board12"
              name="board"
              value={marksheet.board}
              onChange={handleChange}
              placeholder="CBSE, ICSE, State board, etc."
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="school12" className="text-sm font-medium">School/Institution</label>
            <Input
              id="school12"
              name="school"
              value={marksheet.school}
              onChange={handleChange}
              placeholder="School name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="percentage12" className="text-sm font-medium">Overall Percentage</label>
            <Input
              id="percentage12"
              name="percentage"
              value={marksheet.percentage}
              onChange={handleChange}
              placeholder="Overall percentage"
            />
          </div>
        </div>
        
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Subject-wise Marks</h4>
          
          {marksheet.marks.map((mark, index) => (
            <div key={`12th-${index}`} className="grid grid-cols-12 gap-2 mb-2 items-center">
              <div className="col-span-5">
                <Input
                  placeholder="Subject name"
                  value={mark.subject}
                  onChange={(e) => handleMarksChange(index, 'subject', e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <Input
                  placeholder="Marks"
                  value={mark.marks}
                  onChange={(e) => handleMarksChange(index, 'marks', e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <Input
                  placeholder="Max marks"
                  value={mark.maxMarks}
                  onChange={(e) => handleMarksChange(index, 'maxMarks', e.target.value)}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {marksheet.marks.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeSubject(index)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addSubject}
            className="mt-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
