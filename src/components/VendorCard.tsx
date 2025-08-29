import { useState } from 'react';
import { Vendor } from '@/types/vendor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Star, MapPin, Phone, Mail, Eye } from 'lucide-react';

interface VendorCardProps {
  vendor: Vendor;
  onViewDetails: (vendor: Vendor) => void;
}

export const VendorCard = ({ vendor, onViewDetails }: VendorCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="hover-lift animate-fade-in shadow-card border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={vendor.images[currentImageIndex]}
            alt={`${vendor.name} portfolio ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {/* Image Navigation */}
          <div className="absolute inset-0 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              className="ml-2 rounded-full"
              onClick={prevImage}
            >
              ←
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="mr-2 rounded-full"
              onClick={nextImage}
            >
              →
            </Button>
          </div>

          {/* Image Indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {vendor.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Category Badge */}
          <Badge
            variant={vendor.category === 'Professional' ? 'default' : 'secondary'}
            className="absolute top-2 right-2"
          >
            {vendor.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{vendor.name}</h3>
          <div className="flex items-center space-x-1 mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{vendor.location}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex">{getRatingStars(vendor.rating)}</div>
          <span className="text-sm font-medium">({vendor.rating}/5.0)</span>
        </div>

        {/* Services */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Services:</h4>
          <div className="flex flex-wrap gap-1">
            {vendor.services.map((service) => (
              <Badge key={service} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Specialties:</h4>
          <div className="flex flex-wrap gap-1">
            {vendor.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="bg-gradient-secondary rounded-lg p-3">
          <h4 className="text-sm font-medium text-foreground mb-1">Price Range:</h4>
          <p className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
            {formatPrice(vendor.priceRange.min)} - {formatPrice(vendor.priceRange.max)}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Phone className="h-3 w-3" />
            <span>{vendor.contact.phone}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="h-3 w-3" />
            <span>{vendor.contact.email}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onViewDetails(vendor)}
          className="w-full bg-gradient-primary hover-lift"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Full Portfolio
        </Button>
      </CardFooter>
    </Card>
  );
};