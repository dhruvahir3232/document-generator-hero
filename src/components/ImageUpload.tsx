
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  initialImage?: string;
  onImageUploaded: (url: string) => void;
}

export function ImageUpload({ initialImage, onImageUploaded }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(initialImage);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // size in MB
    
    // Check file size (limit to 2MB)
    if (fileSize > 2) {
      toast.error("Image is too large. Please upload an image smaller than 2MB.");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    
    try {
      setUploading(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // First check if the bucket exists and create it if it doesn't
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('student_pictures');
        
      if (bucketError && bucketError.message.includes('The resource was not found')) {
        await supabase
          .storage
          .createBucket('student_pictures', {
            public: true,
            fileSizeLimit: 2097152, // 2MB in bytes
          });
      }
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('student_pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('student_pictures')
        .getPublicUrl(filePath);
        
      // Update the preview
      setPreview(publicUrl);
      
      // Call the callback with the URL
      onImageUploaded(publicUrl);
      
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const openFileSelector = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation to parent elements
    document.getElementById('image-upload')?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div 
        className="relative aspect-square w-full bg-muted/25 rounded-md overflow-hidden cursor-pointer"
        onClick={openFileSelector}
      >
        {preview ? (
          <img 
            src={preview} 
            alt="Student preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
      
      <div className="w-full">
        <label htmlFor="image-upload" className="w-full">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <Button 
            type="button" 
            variant="outline" 
            disabled={uploading} 
            className="w-full"
            onClick={openFileSelector}
          >
            <Upload className="h-4 w-4 mr-2" />
            {preview ? "Change Image" : "Upload Image"}
          </Button>
        </label>
      </div>
    </div>
  );
}
