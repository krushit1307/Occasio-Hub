import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';

// Import city images
import ahmedabadImg from '@/assets/city-ahmedabad.jpg';
import suratImg from '@/assets/city-surat.jpg';
import vadodaraImg from '@/assets/city-vadodara.jpg';
import rajkotImg from '@/assets/city-rajkot.jpg';
import gandhiNagarImg from '@/assets/city-gandhinagar.jpg';
import bhavnagarImg from '@/assets/city-bhavnagar.jpg';

interface CityGalleryProps {
  onCitySelect: (city: string) => void;
  selectedCity: string;
  vendorCounts: Record<string, number>;
}

const FEATURED_CITIES = [
  {
    name: 'Ahmedabad',
    image: ahmedabadImg,
    description: 'Commercial Capital of Gujarat',
    highlights: ['Wedding Venues', 'Corporate Events', 'Photography']
  },
  {
    name: 'Surat',
    image: suratImg,
    description: 'Diamond City',
    highlights: ['Luxury Events', 'Fashion Shows', 'Business Conferences']
  },
  {
    name: 'Vadodara',
    image: vadodaraImg,
    description: 'Cultural City',
    highlights: ['Royal Weddings', 'Heritage Venues', 'Traditional Events']
  },
  {
    name: 'Rajkot',
    image: rajkotImg,
    description: 'Industrial Hub',
    highlights: ['Corporate Events', 'Trade Shows', 'Celebrations']
  },
  {
    name: 'Gandhinagar',
    image: gandhiNagarImg,
    description: 'Capital City',
    highlights: ['Government Events', 'Official Functions', 'Conferences']
  },
  {
    name: 'Bhavnagar',
    image: bhavnagarImg,
    description: 'Port City',
    highlights: ['Coastal Weddings', 'Business Meetings', 'Cultural Events']
  }
];

export const CityGallery = ({ onCitySelect, selectedCity, vendorCounts }: CityGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_CITIES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + FEATURED_CITIES.length) % FEATURED_CITIES.length);
  };

  const getVisibleCities = () => {
    if (isExpanded) return FEATURED_CITIES;
    return FEATURED_CITIES.slice(currentIndex, currentIndex + 3);
  };

  const handleCityClick = (cityName: string) => {
    onCitySelect(cityName);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Browse Vendors by City
        </h2>
        <p className="text-muted-foreground">
          Discover amazing event vendors in Gujarat's major cities
        </p>
      </div>

      {/* City Cards */}
      <div className="relative">
        {!isExpanded && (
          <>
            {/* Navigation Arrows for Carousel */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-elegant"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-elegant"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* City Grid */}
        <div className={`grid gap-6 ${isExpanded ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3'} px-12`}>
          {getVisibleCities().map((city) => {
            const vendorCount = vendorCounts[city.name] || 0;
            const isSelected = selectedCity === city.name;

            return (
              <Card
                key={city.name}
                className={`group cursor-pointer hover-lift transition-all duration-300 overflow-hidden border-2 ${
                  isSelected 
                    ? 'border-primary shadow-glow scale-105' 
                    : 'border-transparent shadow-card hover:shadow-elegant'
                }`}
                onClick={() => handleCityClick(city.name)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* City Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{city.name}</h3>
                      {isSelected && (
                        <Badge className="bg-primary text-white">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-white/90 mb-2">{city.description}</p>
                    
                    {/* Vendor Count */}
                    <div className="flex items-center space-x-1 mb-3">
                      <Users className="h-4 w-4 text-primary-glow" />
                      <span className="text-sm font-medium">
                        {vendorCount} Vendor{vendorCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1">
                      {city.highlights.slice(0, 2).map((highlight) => (
                        <Badge
                          key={highlight}
                          variant="secondary"
                          className="text-xs bg-white/20 text-white border-0"
                        >
                          {highlight}
                        </Badge>
                      ))}
                      {city.highlights.length > 2 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-white/20 text-white border-0"
                        >
                          +{city.highlights.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Location Icon */}
                  <div className="absolute top-4 right-4">
                    <MapPin className="h-5 w-5 text-white drop-shadow-lg" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Carousel Indicators */}
        {!isExpanded && (
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: FEATURED_CITIES.length - 2 }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* View All/Less Toggle */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover-lift"
        >
          {isExpanded ? 'View Less Cities' : 'View All Cities'}
        </Button>
      </div>

      {/* Clear Selection */}
      {selectedCity && (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => onCitySelect('')}
            className="text-muted-foreground hover:text-primary"
          >
            Clear City Selection
          </Button>
        </div>
      )}
    </div>
  );
};