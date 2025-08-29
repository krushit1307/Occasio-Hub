export interface Vendor {
  id: string;
  name: string;
  category: 'Personal' | 'Professional';
  services: string[];
  specialties: string[];
  location: string;
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  images: string[];
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface FilterState {
  category?: string;
  services?: string[];
  location?: string;
  maxPrice?: number;
  minRating?: number;
  eventType?: string;
}

export const EVENT_TYPES = {
  personal: ['Birthdays', 'Weddings', 'Housewarmings', 'Casual Gatherings'],
  professional: ['Corporate Events', 'Conferences', 'Exhibitions']
} as const;

export const SERVICE_TYPES = ['Videography', 'Photography', 'Catering', 'Sound System'] as const;

export const GUJARAT_CITIES = [
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar',
  'Gandhinagar', 'Anand', 'Mehsana', 'Bharuch', 'Vapi', 'Morbi',
  'Palanpur', 'Surendranagar', 'Godhra', 'Patan', 'Veraval', 'Botad'
] as const;