import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { EVENT_TYPES, SERVICE_TYPES, GUJARAT_CITIES } from '@/types/vendor';
import { Upload, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUploader } from './ImageUploader';

export const VendorRegistration = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<'Personal' | 'Professional' | ''>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const toggleEventType = (eventType: string) => {
    setSelectedEventTypes(prev =>
      prev.includes(eventType)
        ? prev.filter(e => e !== eventType)
        : [...prev, eventType]
    );
  };

  // Remove the old image upload functions since ImageUploader handles everything
  // const handleImageUpload = ... (removed)
  // const removeImage = ... (removed)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validation
    if (!selectedCategory) {
      toast({
        title: "Category Required",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    if (selectedServices.length === 0) {
      toast({
        title: "Services Required",
        description: "Please select at least one service",
        variant: "destructive"
      });
      return;
    }

    if (selectedEventTypes.length === 0) {
      toast({
        title: "Event Types Required",
        description: "Please select at least one event type",
        variant: "destructive"
      });
      return;
    }

    if (uploadedImages.length < 5) {
      toast({
        title: "Images Required",
        description: "Please upload exactly 5 images of your work",
        variant: "destructive"
      });
      return;
    }

    // Simulate successful registration
    toast({
      title: "Registration Successful!",
      description: "Your vendor profile has been created successfully. You will receive a confirmation email shortly.",
    });

    // Reset form
    setSelectedCategory('');
    setSelectedServices([]);
    setSelectedEventTypes([]);
    setUploadedImages([]);
    (event.target as HTMLFormElement).reset();
  };

  const availableEventTypes = selectedCategory 
    ? EVENT_TYPES[selectedCategory.toLowerCase() as keyof typeof EVENT_TYPES]
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Become a Vendor
          </CardTitle>
          <p className="text-muted-foreground">
            Join Occassio and showcase your event services to customers across Gujarat
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor-name">Vendor Name *</Label>
                <Input id="vendor-name" name="vendorName" required />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" placeholder="+91" required />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Select name="location" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City in Gujarat" />
                  </SelectTrigger>
                  <SelectContent>
                    {GUJARAT_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <Label>Category *</Label>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as 'Personal' | 'Professional' | '')}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal">Personal Events</SelectItem>
                  <SelectItem value="Professional">Professional Events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Event Types */}
            {selectedCategory && (
              <div>
                <Label>Event Types * (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {availableEventTypes.map((eventType) => (
                    <div key={eventType} className="flex items-center space-x-2">
                      <Checkbox
                        id={eventType}
                        checked={selectedEventTypes.includes(eventType)}
                        onCheckedChange={() => toggleEventType(eventType)}
                      />
                      <Label htmlFor={eventType} className="cursor-pointer">
                        {eventType}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedEventTypes.map((eventType) => (
                    <Badge key={eventType} variant="secondary">
                      {eventType}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => toggleEventType(eventType)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            <div>
              <Label>Services Provided * (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {SERVICE_TYPES.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={selectedServices.includes(service)}
                      onCheckedChange={() => toggleService(service)}
                    />
                    <Label htmlFor={service} className="cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedServices.map((service) => (
                  <Badge key={service} variant="secondary">
                    {service}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => toggleService(service)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-price">Minimum Price (₹) *</Label>
                <Input
                  id="min-price"
                  name="minPrice"
                  type="number"
                  min="5000"
                  step="1000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="max-price">Maximum Price (₹) *</Label>
                <Input
                  id="max-price"
                  name="maxPrice"
                  type="number"
                  min="10000"
                  step="1000"
                  required
                />
              </div>
            </div>

            {/* Business Description */}
            <div>
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell customers about your services and what makes you special..."
                rows={4}
                className="mt-2"
              />
            </div>

            {/* Portfolio Images with Advanced Upload */}
            <ImageUploader
              maxImages={5}
              onImagesChange={setUploadedImages}
              existingImages={uploadedImages}
              title="Portfolio Images"
              description="Upload exactly 5 images showcasing your work. You can remove backgrounds and edit images."
              allowBackgroundRemoval={true}
              allowCropping={true}
            />

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-gradient-primary px-8 py-3 text-lg hover-lift"
                size="lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Create Vendor Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};