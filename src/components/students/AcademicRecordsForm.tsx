
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AcademicRecord } from "@/components/marksheets/StandardTenMarksheet";
import { StandardTenMarksheet } from "@/components/marksheets/StandardTenMarksheet";
import { StandardTwelveMarksheet } from "@/components/marksheets/StandardTwelveMarksheet";

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
      <StandardTenMarksheet 
        marksheet={marksheet10th}
        onChange={onMarksheet10thChange}
      />
      
      {/* 12th Standard Marksheet */}
      <StandardTwelveMarksheet 
        marksheet={marksheet12th}
        onChange={onMarksheet12thChange}
      />
      
      <div className="flex justify-end">
        <Button type="submit" className="w-40" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Records" : "Save Records"}
        </Button>
      </div>
    </form>
  );
}
