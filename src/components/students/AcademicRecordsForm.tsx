
import { Button } from "@/components/ui/button";
import { AcademicRecord } from "@/components/marksheets/StandardTenMarksheet";
import { AcademicMarksheet } from "@/components/marksheets/AcademicMarksheet";

interface AcademicRecordsFormProps {
  marksheet10th: AcademicRecord;
  marksheet12th: AcademicRecord;
  onMarksheet10thChange: (marksheet: AcademicRecord) => void;
  onMarksheet12thChange: (marksheet: AcademicRecord) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export function AcademicRecordsForm({
  marksheet10th,
  marksheet12th,
  onMarksheet10thChange,
  onMarksheet12thChange,
  loading,
  onSubmit,
  isEditing
}: AcademicRecordsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* 10th Standard Marksheet */}
      <AcademicMarksheet 
        marksheet={marksheet10th}
        onChange={onMarksheet10thChange}
        standard="10th"
      />
      
      {/* 12th Standard Marksheet */}
      <AcademicMarksheet 
        marksheet={marksheet12th}
        onChange={onMarksheet12thChange}
        standard="12th"
      />
      
      <div className="flex justify-end">
        <Button type="submit" className="w-40" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Records" : "Save Records"}
        </Button>
      </div>
    </form>
  );
}
