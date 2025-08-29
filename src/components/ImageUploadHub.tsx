import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageUploader } from './ImageUploader';
import { 
  Camera, 
  Sparkles, 
  Zap, 
  Download, 
  Share2,
  Layers,
  Palette
} from 'lucide-react';

export const ImageUploadHub = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI Background Removal",
      description: "Remove backgrounds with advanced AI technology"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Image Editing",
      description: "Edit and enhance your images with built-in tools"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Processing",
      description: "Fast, real-time image processing in your browser"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "High Quality Export",
      description: "Download processed images in high resolution"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
          <Camera className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Image Upload & Processing Hub
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Upload, edit, and enhance your images with powerful AI-driven tools. 
          Remove backgrounds, apply filters, and create stunning visuals for your events.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="text-center hover-lift shadow-card border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-secondary rounded-full mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Upload Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <ImageUploader
            maxImages={10}
            onImagesChange={setUploadedImages}
            existingImages={uploadedImages}
            title="Upload Your Images"
            description="Upload up to 10 images to process with our advanced tools"
            allowBackgroundRemoval={true}
            allowCropping={true}
          />
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Processing Stats */}
          <Card className="shadow-card border-0 bg-gradient-accent text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                Processing Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Images Uploaded</span>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {uploadedImages.length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Processing Available</span>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Unlimited
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Export Format</span>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    PNG/JPG
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips & Tricks */}
          <Card className="shadow-card border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm">Better Background Removal</h4>
                  <p className="text-xs text-muted-foreground">
                    Use images with clear subject-background contrast for best results
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Optimal Image Size</h4>
                  <p className="text-xs text-muted-foreground">
                    Images are automatically resized to 1024px max dimension for processing
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Export Quality</h4>
                  <p className="text-xs text-muted-foreground">
                    Use PNG format for images with transparency, JPG for others
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full hover-lift"
              disabled={uploadedImages.length === 0}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Gallery
            </Button>
            <Button 
              variant="outline" 
              className="w-full hover-lift"
              disabled={uploadedImages.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>

          {/* Usage Guide */}
          <Card className="shadow-card border-0 bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">How to Use</h4>
              <ol className="text-xs text-muted-foreground space-y-1">
                <li>1. Upload your images using the upload area</li>
                <li>2. Click "Remove BG" to remove backgrounds</li>
                <li>3. Use "Edit" for additional processing</li>
                <li>4. Download processed images in high quality</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};