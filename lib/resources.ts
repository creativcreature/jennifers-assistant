export interface Resource {
  id: string;
  name: string;
  type: 'food' | 'healthcare' | 'shelter' | 'services' | 'transportation';
  phone?: string;
  address?: string;
  hours?: string;
  description: string;
  notes?: string;
  website?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const RESOURCES: Resource[] = [
  // Food Resources
  {
    id: 'food-hosea',
    name: 'Hosea Helps',
    type: 'food',
    phone: '4047553353',
    address: '930 Joseph E Boone Blvd NW, Atlanta, GA 30314',
    hours: 'Tuesday-Thursday, 11am-5pm',
    description: 'Food pantry and support services',
    notes: 'Bring ID if you have one',
    coordinates: { lat: 33.7537, lng: -84.4229 },
  },
  {
    id: 'food-central-methodist',
    name: 'Central United Methodist',
    type: 'food',
    phone: '4046591322',
    address: '503 Peachtree St NE, Atlanta, GA 30308',
    hours: 'Daily lunch 12pm-1pm',
    description: 'Free hot lunch every day',
    notes: 'Downtown location, no ID needed',
    coordinates: { lat: 33.7680, lng: -84.3853 },
  },
  {
    id: 'food-community-bank',
    name: 'Atlanta Community Food Bank',
    type: 'food',
    phone: '4048929822',
    address: '3400 N Desert Dr, East Point, GA 30344',
    hours: 'Call for locations and hours',
    description: 'Can help you find food pantries near you',
    website: 'https://www.acfb.org',
    coordinates: { lat: 33.6373, lng: -84.4697 },
  },
  {
    id: 'food-midtown-mac',
    name: 'Midtown Assistance Center',
    type: 'food',
    phone: '4048750381',
    address: '30 Porter Place NE, Atlanta, GA 30308',
    hours: 'Monday-Friday 9am-4pm',
    description: 'Food pantry and emergency assistance',
    notes: 'Serves residents of certain zip codes - call to check',
    coordinates: { lat: 33.7731, lng: -84.3725 },
  },
  {
    id: 'food-action-ministries',
    name: 'Action Ministries',
    type: 'food',
    phone: '4048819990',
    address: '2385 Lakewood Ave SW, Atlanta, GA 30315',
    hours: 'Varies by location',
    description: 'Food and clothing assistance',
    coordinates: { lat: 33.6997, lng: -84.3893 },
  },
  {
    id: 'food-gateway-meals',
    name: 'Gateway Center Meals',
    type: 'food',
    phone: '4042156600',
    address: '275 Pryor St SW, Atlanta, GA 30303',
    hours: 'Breakfast, Lunch, Dinner daily',
    description: 'Free meals for homeless individuals',
    notes: 'No ID required',
    coordinates: { lat: 33.7490, lng: -84.3915 },
  },

  // Healthcare Resources
  {
    id: 'health-grady',
    name: 'Grady Memorial Hospital',
    type: 'healthcare',
    phone: '4046161000',
    address: '80 Jesse Hill Jr Dr SE, Atlanta, GA 30303',
    hours: 'Emergency: 24/7, Clinics: Varies',
    description: 'Free/low-cost care with Grady Card',
    notes: 'Get a Grady Card for free care. ER always open.',
    coordinates: { lat: 33.7527, lng: -84.3830 },
  },
  {
    id: 'health-mercy-care',
    name: 'Mercy Care Atlanta',
    type: 'healthcare',
    phone: '6788438600',
    address: '424 Decatur St SE, Atlanta, GA 30312',
    hours: 'Monday-Friday, varies by location',
    description: 'Free primary care, dental, vision for uninsured',
    notes: 'Has case managers who can help with benefits too',
    coordinates: { lat: 33.7516, lng: -84.3763 },
  },
  {
    id: 'health-good-sam',
    name: 'Good Samaritan Health Center',
    type: 'healthcare',
    phone: '4045230900',
    address: '1015 Donald Lee Hollowell Pkwy NW, Atlanta, GA 30318',
    hours: 'Monday-Friday 8am-5pm',
    description: 'Sliding scale medical and dental care',
    coordinates: { lat: 33.7679, lng: -84.4341 },
  },
  {
    id: 'health-hope-atlanta',
    name: 'HOPE Atlanta Healthcare',
    type: 'healthcare',
    phone: '4048175000',
    address: '34 Peachtree St NW, Atlanta, GA 30303',
    hours: 'Monday-Friday 9am-5pm',
    description: 'Healthcare navigation for homeless individuals',
    coordinates: { lat: 33.7545, lng: -84.3897 },
  },

  // Services / Benefits Help
  {
    id: 'services-211',
    name: '211 United Way',
    type: 'services',
    phone: '211',
    description: 'Connects you to all social services: SOAR workers, shelters, food, benefits help',
    notes: 'Call anytime - they can connect you to a SOAR worker',
  },
  {
    id: 'services-gateway',
    name: 'Gateway Center',
    type: 'services',
    phone: '4042156600',
    address: '275 Pryor St SW, Atlanta, GA 30303',
    hours: 'Monday-Friday 8am-5pm',
    description: 'Homeless services hub: case managers, meals, shelter',
    notes: 'Has staff who help with SSI applications',
    coordinates: { lat: 33.7490, lng: -84.3915 },
  },
  {
    id: 'services-salvation-army',
    name: 'Salvation Army',
    type: 'services',
    phone: '4048862681',
    address: '409 Marietta St NW, Atlanta, GA 30313',
    hours: 'Monday-Friday 9am-5pm',
    description: 'Emergency assistance, food, shelter resources',
    coordinates: { lat: 33.7594, lng: -84.3984 },
  },
  {
    id: 'services-dfcs',
    name: 'DFCS Fulton County',
    type: 'services',
    phone: '4042061000',
    address: '2099 MLK Jr Drive SW, Atlanta, GA 30310',
    hours: 'Monday-Friday 8am-5pm',
    description: 'SNAP, Medicaid, and other state benefits',
    coordinates: { lat: 33.7317, lng: -84.4317 },
  },
  {
    id: 'services-frontline',
    name: 'Frontline Response',
    type: 'services',
    phone: '6787050560',
    address: '830 Boulevard SE, Atlanta, GA 30312',
    hours: 'Open 24/7',
    description: 'Emergency shelter and support services',
    notes: 'Jennifer\'s current shelter',
    coordinates: { lat: 33.7374, lng: -84.3678 },
  },

  // Transportation
  {
    id: 'transport-marta',
    name: 'MARTA Reduced Fare',
    type: 'transportation',
    phone: '4048484800',
    address: 'Five Points Station, Atlanta, GA 30303',
    description: 'Half-price transit for seniors (65+) and people with disabilities',
    notes: 'You qualify as a senior! Apply at MARTA station with ID.',
    coordinates: { lat: 33.7539, lng: -84.3916 },
  },
];

export function getResourcesByType(type: Resource['type']): Resource[] {
  return RESOURCES.filter(r => r.type === type);
}

export function getFoodResources(): Resource[] {
  return getResourcesByType('food');
}

export function getHealthcareResources(): Resource[] {
  return getResourcesByType('healthcare');
}

export function getServicesResources(): Resource[] {
  return getResourcesByType('services');
}

export function getResourceById(id: string): Resource | undefined {
  return RESOURCES.find(r => r.id === id);
}

// Sort resources by distance from a location
export function sortResourcesByDistance(
  resources: Resource[],
  userLat: number,
  userLng: number
): (Resource & { distance?: number })[] {
  return resources
    .map(resource => {
      if (resource.coordinates) {
        const distance = calculateDistanceMiles(
          userLat,
          userLng,
          resource.coordinates.lat,
          resource.coordinates.lng
        );
        return { ...resource, distance };
      }
      return { ...resource, distance: undefined };
    })
    .sort((a, b) => {
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      return a.distance - b.distance;
    });
}

function calculateDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
