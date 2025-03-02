
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";

interface BasicInfoFormProps {
  formData: {
    name: string;
    email: string;
    class: string;
    picture: string;
  };
  onChange: (formData: any) => void;
  onImageUploaded: (url: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export function BasicInfoForm({ 
  formData, 
  onChange, 
  onImageUploaded, 
  loading, 
  onSubmit,
  isEditing
}: BasicInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const openFileSelector = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop the event from propagating
    document.getElementById('image-upload')?.click();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          <Card className="cursor-pointer" onClick={openFileSelector}>
            <CardContent className="p-4">
              <div className="aspect-square overflow-hidden rounded-md mb-4">
                <ImageUpload 
                  initialImage={formData.picture} 
                  onImageUploaded={onImageUploaded} 
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Upload a student photo here
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Student Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter student email (optional)"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="class" className="text-sm font-medium">
              Class / Grade
            </label>
            <Input
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              placeholder="Enter class or grade (optional)"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update Student" : "Add Student"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
