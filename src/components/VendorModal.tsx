import { useState } from 'react';
import { Vendor } from '@/types/vendor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface VendorModalProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VendorModal = ({ vendor, isOpen, onClose }: VendorModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!vendor) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vendor.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vendor.images.length) % vendor.images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-gradient-secondary">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {vendor.name}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Image Gallery */}
          <div className="relative h-80 mb-6 rounded-xl overflow-hidden shadow-card">
            <img
              src={vendor.images[currentImageIndex]}
              alt={`${vendor.name} portfolio ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {vendor.images.length}
            </div>

            {/* Category Badge */}
            <Badge
              variant={vendor.category === 'Professional' ? 'default' : 'secondary'}
              className="absolute top-4 left-4"
            >
              {vendor.category}
            </Badge>
          </div>

          {/* Image Thumbnails */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {vendor.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  currentImageIndex === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Rating */}
              <div className="bg-card/80 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex">{getRatingStars(vendor.rating)}</div>
                    <span className="text-lg font-semibold">({vendor.rating}/5.0)</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-card/80 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{vendor.contact.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>{vendor.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>{vendor.contact.email}</span>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-gradient-accent rounded-lg p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Price Range</h3>
                </div>
                <div className="text-2xl font-bold">
                  {formatPrice(vendor.priceRange.min)} - {formatPrice(vendor.priceRange.max)}
                </div>
              </div>
            </div>

            {/* Right Column - Services & Specialties */}
            <div className="space-y-6">
              {/* Services */}
              <div className="bg-card/80 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Services Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.map((service) => (
                    <Badge key={service} variant="outline" className="px-3 py-1">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="bg-card/80 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Event Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {vendor.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="px-3 py-1">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              {vendor.description && (
                <div className="bg-card/80 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-4">About Us</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {vendor.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full bg-gradient-primary hover-lift" size="lg">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline" className="w-full hover-lift" size="lg">
                  <Mail className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full hover-lift" size="lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Check Availability
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};