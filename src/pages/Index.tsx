import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { VendorGrid } from '@/components/VendorGrid';
import { FilterPanel } from '@/components/FilterPanel';
import { VendorRegistration } from '@/components/VendorRegistration';
import { CustomCursor } from '@/components/CustomCursor';
import { CityGallery } from '@/components/CityGallery';
import { ImageUploadHub } from '@/components/ImageUploadHub';
import { FilterState } from '@/types/vendor';
import { allVendors } from '@/data/mockVendors';

const Index = () => {
  const [currentTab, setCurrentTab] = useState<'vendors' | 'registration' | 'imageUpload'>('vendors');
  const [searchLocation, setSearchLocation] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  // Calculate vendor counts by city
  const vendorCounts = useMemo(() => {
    return allVendors.reduce((counts, vendor) => {
      counts[vendor.location] = (counts[vendor.location] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }, []);

  // Initialize with all vendors showing
  useEffect(() => {
    // Add fade-in animation to body
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.6s ease-out';
      document.body.style.opacity = '1';
    });

    return () => {
      document.body.style.transition = '';
      document.body.style.opacity = '';
    };
  }, []);

  const handleClearFilters = () => {
    setFilters({});
    setSearchLocation('');
    setSelectedCity('');
  };

  const handleLocationSearch = (location: string) => {
    setSearchLocation(location);
    setSelectedCity(''); // Clear city selection when typing in search
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setSearchLocation(city); // Update search location to match selected city
    // Update filters to match the selected city
    setFilters(prev => ({
      ...prev,
      location: city || undefined
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <CustomCursor />
      
      {/* Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        searchLocation={searchLocation}
        onLocationSearch={handleLocationSearch}
      />

      {/* Main Content */}
      <main className="min-h-screen">
        {currentTab === 'vendors' ? (
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filter Sidebar */}
              <div className="lg:w-80 flex-shrink-0">
                {isFilterOpen || window.innerWidth >= 1024 ? (
                  <div className="sticky top-24">
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClearFilters={handleClearFilters}
                      isOpen={true}
                      onToggle={() => setIsFilterOpen(false)}
                    />
                  </div>
                ) : (
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClearFilters={handleClearFilters}
                    isOpen={false}
                    onToggle={() => setIsFilterOpen(true)}
                  />
                )}
              </div>

              {/* Vendor Grid */}
              <div className="flex-1">
                {/* Hero Section */}
                <div className="text-center py-12 mb-8 bg-gradient-primary rounded-2xl text-white shadow-elegant">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                    Find Perfect Event Vendors
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto animate-slide-up">
                    Discover amazing event planners, photographers, caterers, and more across Gujarat. 
                    Make your special occasions unforgettable.
                  </p>
                  <div className="flex justify-center space-x-4 mt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{allVendors.length}+</div>
                      <div className="text-sm text-white/80">Verified Vendors</div>
                    </div>
                    <div className="w-px bg-white/30"></div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">18</div>
                      <div className="text-sm text-white/80">Cities Covered</div>
                    </div>
                    <div className="w-px bg-white/30"></div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">1000+</div>
                      <div className="text-sm text-white/80">Happy Customers</div>
                    </div>
                  </div>
                </div>

                {/* City Gallery */}
                <div className="mb-12">
                  <CityGallery
                    onCitySelect={handleCitySelect}
                    selectedCity={selectedCity}
                    vendorCounts={vendorCounts}
                  />
                </div>

                {/* Vendor Listings */}
                <VendorGrid
                  vendors={allVendors}
                  filters={filters}
                  searchLocation={searchLocation}
                />
              </div>
            </div>
          </div>
        ) : currentTab === 'registration' ? (
          /* Vendor Registration */
          <VendorRegistration />
        ) : (
          /* Image Upload Hub */
          <ImageUploadHub />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card/50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">O</span>
                </div>
                <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Occassio
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting event organizers with the best vendors across Gujarat. 
                Making every occasion special and memorable.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Event Planning</li>
                <li>Photography</li>
                <li>Videography</li>
                <li>Catering</li>
                <li>Sound Systems</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Event Types</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Weddings</li>
                <li>Corporate Events</li>
                <li>Birthday Parties</li>
                <li>Conferences</li>
                <li>Exhibitions</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: hello@occassio.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Address: Ahmedabad, Gujarat</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-muted-foreground">
                © 2024 Occassio. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;