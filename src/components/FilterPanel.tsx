import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { FilterState, EVENT_TYPES, SERVICE_TYPES, GUJARAT_CITIES } from '@/types/vendor';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const FilterPanel = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle
}: FilterPanelProps) => {
  const [maxPrice, setMaxPrice] = useState([filters.maxPrice || 500000]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleService = (service: string) => {
    const currentServices = filters.services || [];
    const updatedServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service];
    updateFilter('services', updatedServices);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed top-20 left-4 z-40 bg-gradient-primary shadow-elegant hover-lift"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
    );
  }

  return (
    <Card className="w-80 shadow-card border-0 bg-card/95 backdrop-blur-sm animate-slide-up">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Filters</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Category</Label>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => updateFilter('category', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Event Type Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Event Type</Label>
          <Select
            value={filters.eventType || 'all'}
            onValueChange={(value) => updateFilter('eventType', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Event Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Event Types</SelectItem>
              {Object.entries(EVENT_TYPES).map(([category, types]) => (
                <div key={category}>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Services Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Services</Label>
          <div className="space-y-2">
            {SERVICE_TYPES.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={(filters.services || []).includes(service)}
                  onCheckedChange={() => toggleService(service)}
                />
                <Label
                  htmlFor={service}
                  className="text-sm font-normal cursor-pointer"
                >
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Location</Label>
          <Select
            value={filters.location || 'all'}
            onValueChange={(value) => updateFilter('location', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {GUJARAT_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Maximum Budget: {formatPrice(maxPrice[0])}
          </Label>
          <Slider
            value={maxPrice}
            onValueChange={(value) => {
              setMaxPrice(value);
              updateFilter('maxPrice', value[0]);
            }}
            max={500000}
            min={10000}
            step={5000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹10,000</span>
            <span>₹5,00,000</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Minimum Rating</Label>
          <Select
            value={filters.minRating?.toString() || 'any'}
            onValueChange={(value) => updateFilter('minRating', value === 'any' ? undefined : parseFloat(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Rating</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
              <SelectItem value="4.0">4.0+ Stars</SelectItem>
              <SelectItem value="3.5">3.5+ Stars</SelectItem>
              <SelectItem value="3.0">3.0+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};