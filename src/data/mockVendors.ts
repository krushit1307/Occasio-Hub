import { Vendor } from '@/types/vendor';

// Import images
import vendor11 from '@/assets/vendor-1-1.jpg';
import vendor12 from '@/assets/vendor-1-2.jpg';
import vendor13 from '@/assets/vendor-1-3.jpg';
import vendor14 from '@/assets/vendor-1-4.jpg';
import vendor15 from '@/assets/vendor-1-5.jpg';
import vendor21 from '@/assets/vendor-2-1.jpg';
import vendor22 from '@/assets/vendor-2-2.jpg';
import vendor23 from '@/assets/vendor-2-3.jpg';
import vendor24 from '@/assets/vendor-2-4.jpg';
import vendor25 from '@/assets/vendor-2-5.jpg';
import vendor31 from '@/assets/vendor-3-1.jpg';
import vendor32 from '@/assets/vendor-3-2.jpg';

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Royal Events Gujarat',
    category: 'Personal',
    services: ['Photography', 'Videography', 'Catering'],
    specialties: ['Weddings', 'Birthdays', 'Housewarmings'],
    location: 'Ahmedabad',
    priceRange: { min: 50000, max: 200000 },
    rating: 4.8,
    contact: {
      phone: '+91 98765 43210',
      email: 'contact@royalevents.com',
      address: 'Satellite, Ahmedabad, Gujarat'
    },
    images: [vendor11, vendor12, vendor13, vendor14, vendor15],
    description: 'Premium event planning with exquisite attention to detail'
  },
  {
    id: '2',
    name: 'Elite Celebrations',
    category: 'Professional',
    services: ['Sound System', 'Photography', 'Catering'],
    specialties: ['Corporate Events', 'Conferences', 'Exhibitions'],
    location: 'Surat',
    priceRange: { min: 75000, max: 300000 },
    rating: 4.6,
    contact: {
      phone: '+91 98765 43211',
      email: 'info@elitecelebrations.com',
      address: 'Adajan, Surat, Gujarat'
    },
    images: [vendor21, vendor22, vendor23, vendor24, vendor25],
    description: 'Professional corporate event solutions with cutting-edge technology'
  },
  {
    id: '3',
    name: 'Dream Makers',
    category: 'Personal',
    services: ['Videography', 'Photography', 'Sound System'],
    specialties: ['Weddings', 'Casual Gatherings'],
    location: 'Vadodara',
    priceRange: { min: 40000, max: 150000 },
    rating: 4.7,
    contact: {
      phone: '+91 98765 43212',
      email: 'hello@dreammakers.com',
      address: 'Alkapuri, Vadodara, Gujarat'
    },
    images: [vendor31, vendor32, vendor11, vendor22, vendor13],
    description: 'Making your dreams come true with creative event solutions'
  },
  {
    id: '4',
    name: 'Sparkle Events',
    category: 'Personal',
    services: ['Catering', 'Photography'],
    specialties: ['Birthdays', 'Housewarmings'],
    location: 'Rajkot',
    priceRange: { min: 25000, max: 80000 },
    rating: 4.3,
    contact: {
      phone: '+91 98765 43213',
      email: 'events@sparkle.com',
      address: 'Race Course, Rajkot, Gujarat'
    },
    images: [vendor13, vendor23, vendor15, vendor21, vendor32],
    description: 'Adding sparkle to your special moments'
  },
  {
    id: '5',
    name: 'Prime Productions',
    category: 'Professional',
    services: ['Videography', 'Sound System'],
    specialties: ['Corporate Events', 'Conferences'],
    location: 'Ahmedabad',
    priceRange: { min: 60000, max: 250000 },
    rating: 4.5,
    contact: {
      phone: '+91 98765 43214',
      email: 'prime@productions.com',
      address: 'Bopal, Ahmedabad, Gujarat'
    },
    images: [vendor22, vendor14, vendor24, vendor31, vendor12],
    description: 'Prime quality production services for corporate events'
  },
  {
    id: '6',
    name: 'Celebration Central',
    category: 'Personal',
    services: ['Photography', 'Catering', 'Sound System'],
    specialties: ['Weddings', 'Birthdays'],
    location: 'Bhavnagar',
    priceRange: { min: 35000, max: 120000 },
    rating: 4.4,
    contact: {
      phone: '+91 98765 43215',
      email: 'central@celebrations.com',
      address: 'Gandhi Nagar, Bhavnagar, Gujarat'
    },
    images: [vendor11, vendor25, vendor13, vendor32, vendor21],
    description: 'Your central hub for all celebration needs'
  },
  {
    id: '7',
    name: 'Elegant Occasions',
    category: 'Professional',
    services: ['Photography', 'Videography', 'Catering'],
    specialties: ['Exhibitions', 'Corporate Events'],
    location: 'Surat',
    priceRange: { min: 80000, max: 350000 },
    rating: 4.9,
    contact: {
      phone: '+91 98765 43216',
      email: 'elegant@occasions.com',
      address: 'Vesu, Surat, Gujarat'
    },
    images: [vendor24, vendor12, vendor23, vendor15, vendor31],
    description: 'Elegance redefined for your professional events'
  },
  {
    id: '8',
    name: 'Festive Vibes',
    category: 'Personal',
    services: ['Sound System', 'Photography'],
    specialties: ['Casual Gatherings', 'Housewarmings'],
    location: 'Jamnagar',
    priceRange: { min: 20000, max: 60000 },
    rating: 4.2,
    contact: {
      phone: '+91 98765 43217',
      email: 'festive@vibes.com',
      address: 'Bedi Bunder, Jamnagar, Gujarat'
    },
    images: [vendor31, vendor22, vendor11, vendor25, vendor14],
    description: 'Creating festive vibes for your gatherings'
  },
  {
    id: '9',
    name: 'Corporate Connect',
    category: 'Professional',
    services: ['Sound System', 'Videography'],
    specialties: ['Conferences', 'Corporate Events'],
    location: 'Gandhinagar',
    priceRange: { min: 45000, max: 180000 },
    rating: 4.6,
    contact: {
      phone: '+91 98765 43218',
      email: 'connect@corporate.com',
      address: 'Sector 21, Gandhinagar, Gujarat'
    },
    images: [vendor32, vendor24, vendor13, vendor21, vendor12],
    description: 'Connecting businesses through exceptional events'
  },
  {
    id: '10',
    name: 'Magical Moments',
    category: 'Personal',
    services: ['Photography', 'Videography', 'Catering'],
    specialties: ['Weddings', 'Birthdays'],
    location: 'Anand',
    priceRange: { min: 55000, max: 190000 },
    rating: 4.8,
    contact: {
      phone: '+91 98765 43219',
      email: 'magical@moments.com',
      address: 'Vallabh Vidyanagar, Anand, Gujarat'
    },
    images: [vendor15, vendor31, vendor22, vendor14, vendor25],
    description: 'Creating magical moments that last forever'
  }
];

// Generate additional vendors programmatically to reach 30
const additionalVendors = Array.from({ length: 20 }, (_, index) => {
  const id = (11 + index).toString();
  const cities = ['Mehsana', 'Bharuch', 'Vapi', 'Morbi', 'Palanpur', 'Surendranagar', 'Godhra', 'Patan'];
  const categories = ['Personal', 'Professional'] as const;
  const personalServices = ['Photography', 'Videography', 'Catering', 'Sound System'];
  const professionalServices = ['Sound System', 'Videography', 'Photography', 'Catering'];
  
  const category = categories[index % 2];
  const city = cities[index % cities.length];
  const services = category === 'Personal' ? 
    personalServices.slice(0, 2 + (index % 3)) : 
    professionalServices.slice(0, 2 + (index % 3));
  
  const basePrice = 20000 + (index * 5000);
  const priceMultiplier = category === 'Professional' ? 1.5 : 1;
  
  return {
    id,
    name: `${['Stellar', 'Premium', 'Golden', 'Silver', 'Diamond', 'Platinum', 'Luxury', 'Grand'][index % 8]} ${category === 'Personal' ? 'Events' : 'Productions'} ${id}`,
    category,
    services,
    specialties: category === 'Personal' 
      ? ['Weddings', 'Birthdays', 'Housewarmings', 'Casual Gatherings'].slice(0, 2 + (index % 3))
      : ['Corporate Events', 'Conferences', 'Exhibitions'].slice(0, 2 + (index % 2)),
    location: city,
    priceRange: { 
      min: Math.round(basePrice * priceMultiplier), 
      max: Math.round((basePrice + 100000) * priceMultiplier) 
    },
    rating: 3.8 + (index % 13) * 0.1,
    contact: {
      phone: `+91 98765 ${43220 + index}`,
      email: `contact@vendor${id}.com`,
      address: `${city}, Gujarat`
    },
    images: [
      [vendor11, vendor12, vendor13, vendor14, vendor15][index % 5],
      [vendor21, vendor22, vendor23, vendor24, vendor25][index % 5],
      [vendor31, vendor32, vendor11, vendor22, vendor13][index % 5],
      [vendor13, vendor23, vendor15, vendor21, vendor32][index % 5],
      [vendor22, vendor14, vendor24, vendor31, vendor12][index % 5]
    ],
    description: `Professional ${category.toLowerCase()} event services in ${city}`
  } as Vendor;
});

export const allVendors: Vendor[] = [...mockVendors, ...additionalVendors];