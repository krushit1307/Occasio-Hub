import { useState, useMemo } from 'react';
import { Vendor, FilterState } from '@/types/vendor';
import { VendorCard } from './VendorCard';
import { VendorModal } from './VendorModal';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

interface VendorGridProps {
  vendors: Vendor[];
  filters: FilterState;
  searchLocation: string;
}

export const VendorGrid = ({ vendors, filters, searchLocation }: VendorGridProps) => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredVendors = useMemo(() => {
    let filtered = vendors;

    // Search by location
    if (searchLocation.trim()) {
      filtered = filtered.filter(vendor =>
        vendor.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(vendor => vendor.category === filters.category);
    }

    // Services filter
    if (filters.services && filters.services.length > 0) {
      filtered = filtered.filter(vendor =>
        filters.services!.some(service => vendor.services.includes(service))
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(vendor => vendor.location === filters.location);
    }

    // Event type filter
    if (filters.eventType) {
      filtered = filtered.filter(vendor =>
        vendor.specialties.includes(filters.eventType!)
      );
    }

    // Price range filter
    if (filters.maxPrice) {
      filtered = filtered.filter(vendor => vendor.priceRange.min <= filters.maxPrice!);
    }

    // Rating filter
    if (filters.minRating) {
      filtered = filtered.filter(vendor => vendor.rating >= filters.minRating!);
    }

    // Sort: ascending price, descending rating
    filtered = filtered.sort((a, b) => {
      const priceDiff = a.priceRange.min - b.priceRange.min;
      if (priceDiff !== 0) return priceDiff;
      return b.rating - a.rating;
    });

    return filtered;
  }, [vendors, filters, searchLocation]);

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  if (filteredVendors.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-2">No vendors found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search criteria to find vendors
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle and Results Count */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Showing {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''}
            {searchLocation && ` in ${searchLocation}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Vendor Cards */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }
      >
        {filteredVendors.map((vendor, index) => (
          <div
            key={vendor.id}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="animate-fade-in"
          >
            <VendorCard vendor={vendor} onViewDetails={handleViewDetails} />
          </div>
        ))}
      </div>

      {/* Vendor Modal */}
      <VendorModal
        vendor={selectedVendor}
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
      />
    </div>
  );
};