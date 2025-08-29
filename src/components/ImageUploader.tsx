import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  X, 
  Edit3, 
  Scissors, 
  Download, 
  Loader2, 
  Image as ImageIcon,
  Camera,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  maxImages?: number;
  onImagesChange: (images: File[]) => void;
  existingImages?: File[];
  title?: string;
  description?: string;
  allowBackgroundRemoval?: boolean;
  allowCropping?: boolean;
}

interface ProcessedImage {
  file: File;
  preview: string;
  isProcessing: boolean;
  processedFile?: File;
}

export const ImageUploader = ({
  maxImages = 5,
  onImagesChange,
  existingImages = [],
  title = "Upload Images",
  description = "Upload and edit your images",
  allowBackgroundRemoval = true,
  allowCropping = true
}: ImageUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ProcessedImage[]>(
    existingImages.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isProcessing: false,
      processedFile: undefined
    }))
  );
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (images.length + files.length > maxImages) {
      toast({
        title: "Upload Limit",
        description: `You can upload maximum ${maxImages} images`,
        variant: "destructive"
      });
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isProcessing: false,
      processedFile: undefined
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages.map(img => img.processedFile || img.file));

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages.map(img => img.processedFile || img.file));
  };

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const removeBackground = async (imageIndex: number) => {
    const image = images[imageIndex];
    if (!image) return;

    try {
      // Update processing state
      const updatedImages = [...images];
      updatedImages[imageIndex] = { ...image, isProcessing: true };
      setImages(updatedImages);
      setProcessingProgress(10);

      toast({
        title: "Processing Image",
        description: "Removing background, this may take a moment...",
      });

      // Dynamic import of transformers
      setProcessingProgress(30);
      const { pipeline, env } = await import('@huggingface/transformers');
      
      // Configure transformers.js
      env.allowLocalModels = false;
      env.useBrowserCache = true;
      
      setProcessingProgress(50);
      
      // Load the image
      const imgElement = await loadImage(image.file);
      
      // Create segmentation pipeline
      const segmenter = await pipeline(
        'image-segmentation', 
        'Xenova/segformer-b0-finetuned-ade-512-512',
        { device: 'auto' } // Use auto to let it choose the best available device
      );
      
      setProcessingProgress(70);
      
      // Convert to canvas and resize if needed
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      const MAX_DIMENSION = 1024;
      let { width, height } = imgElement;
      
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = (height * MAX_DIMENSION) / width;
          width = MAX_DIMENSION;
        } else {
          width = (width * MAX_DIMENSION) / height;
          height = MAX_DIMENSION;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(imgElement, 0, 0, width, height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      setProcessingProgress(85);
      
      // Process with segmentation
      const result = await segmenter(imageData);
      
      setProcessingProgress(95);
      
      if (!result || !Array.isArray(result) || result.length === 0) {
        throw new Error('Invalid segmentation result');
      }

      // Create output canvas with transparency
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = width;
      outputCanvas.height = height;
      const outputCtx = outputCanvas.getContext('2d')!;
      
      outputCtx.drawImage(canvas, 0, 0);
      
      const outputImageData = outputCtx.getImageData(0, 0, width, height);
      const data = outputImageData.data;
      
      // Apply mask (invert to keep subject, remove background)
      const mask = result[0].mask;
      for (let i = 0; i < mask.data.length; i++) {
        const alpha = Math.round((1 - mask.data[i]) * 255);
        data[i * 4 + 3] = alpha; // Set alpha channel
      }
      
      outputCtx.putImageData(outputImageData, 0, 0);
      
      // Convert to blob and create file
      const processedBlob = await new Promise<Blob>((resolve, reject) => {
        outputCanvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
          'image/png',
          1.0
        );
      });
      
      const processedFile = new File([processedBlob], `processed_${image.file.name}`, {
        type: 'image/png'
      });
      
      // Update the image with processed version
      const finalImages = [...images];
      finalImages[imageIndex] = {
        ...image,
        isProcessing: false,
        processedFile,
        preview: URL.createObjectURL(processedFile)
      };
      
      setImages(finalImages);
      onImagesChange(finalImages.map(img => img.processedFile || img.file));
      setProcessingProgress(100);
      
      toast({
        title: "Background Removed!",
        description: "Image processed successfully",
      });
      
    } catch (error) {
      console.error('Error removing background:', error);
      
      // Reset processing state
      const resetImages = [...images];
      resetImages[imageIndex] = { ...images[imageIndex], isProcessing: false };
      setImages(resetImages);
      
      toast({
        title: "Processing Failed",
        description: "Failed to remove background. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingProgress(0);
    }
  };

  const openEditor = (image: ProcessedImage) => {
    setSelectedImage(image);
    setIsEditorOpen(true);
  };

  const downloadImage = (image: ProcessedImage) => {
    const link = document.createElement('a');
    link.download = image.processedFile?.name || image.file.name;
    link.href = image.preview;
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </CardTitle>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors group"
            >
              <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                Click to upload images ({images.length}/{maxImages})
              </span>
            </div>

            {/* Processing Progress */}
            {processingProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Processing image... {processingProgress}%
                  </span>
                </div>
                <Progress value={processingProgress} className="w-full" />
              </div>
            )}
          </div>

          {/* Image Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                    <img
                      src={image.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    
                    {/* Processing Overlay */}
                    {image.isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}
                    
                    {/* Processed Badge */}
                    {image.processedFile && (
                      <Badge className="absolute top-2 left-2 bg-success text-white">
                        Processed
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Edit Actions */}
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      {allowBackgroundRemoval && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => removeBackground(index)}
                          disabled={image.isProcessing}
                        >
                          <Scissors className="h-3 w-3 mr-1" />
                          Remove BG
                        </Button>
                      )}
                      
                      {allowCropping && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => openEditor(image)}
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => downloadImage(image)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-primary" />
              <span>Edit Image</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={selectedImage.preview}
                  alt="Selected for editing"
                  className="max-h-96 object-contain rounded-lg"
                />
              </div>
              
              <div className="flex space-x-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => removeBackground(images.indexOf(selectedImage))}
                  disabled={selectedImage.isProcessing}
                >
                  <Scissors className="h-4 w-4 mr-2" />
                  Remove Background
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => downloadImage(selectedImage)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
