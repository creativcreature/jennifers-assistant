// Comprehensive Atlanta resources database for search

export interface Resource {
  name: string;
  type: 'food' | 'shelter' | 'healthcare' | 'benefits' | 'transportation' | 'other';
  phone?: string;
  address?: string;
  hours?: string;
  description: string;
  website?: string;
  notes?: string;
}

export const ATLANTA_RESOURCES: Resource[] = [
  // FOOD
  {
    name: "Hosea Helps",
    type: "food",
    phone: "404-755-3353",
    address: "930 Joseph E Boone Blvd NW, Atlanta, GA 30314",
    hours: "Tuesday-Thursday 11am-5pm",
    description: "Free food pantry and assistance services",
    website: "https://hoseahelps.org",
  },
  {
    name: "Atlanta Community Food Bank",
    type: "food",
    phone: "404-892-9822",
    address: "3400 N Desert Dr, East Point, GA 30344",
    hours: "Monday-Friday 8am-5pm",
    description: "Food bank with multiple distribution sites across Atlanta",
    website: "https://acfb.org",
  },
  {
    name: "Open Hand Atlanta",
    type: "food",
    phone: "404-872-6947",
    address: "181 Armour Dr NE, Atlanta, GA 30324",
    hours: "Monday-Friday 8:30am-5pm",
    description: "Delivers meals to homebound individuals, also has community meals",
    website: "https://openhandatlanta.org",
  },
  {
    name: "Central United Methodist Church",
    type: "food",
    phone: "404-659-1322",
    address: "503 Mitchell St SW, Atlanta, GA 30314",
    hours: "Daily lunch 12pm-1pm",
    description: "Free daily lunch program in downtown Atlanta",
  },
  {
    name: "Salvation Army - Red Shield Services",
    type: "food",
    phone: "404-486-2900",
    address: "400 Luckie St NW, Atlanta, GA 30313",
    hours: "Monday-Friday, call for times",
    description: "Food assistance and social services",
  },
  {
    name: "Must Ministries",
    type: "food",
    phone: "770-427-9862",
    address: "1407 Cobb Pkwy S, Marietta, GA 30060",
    hours: "Monday-Friday 9am-12pm",
    description: "Food pantry serving Cobb County area",
  },
  {
    name: "Midtown Assistance Center",
    type: "food",
    phone: "404-681-5777",
    address: "30 Porter Pl NE, Atlanta, GA 30308",
    hours: "Monday-Thursday 9am-12pm",
    description: "Food pantry and financial assistance for midtown Atlanta residents",
  },

  // SHELTERS
  {
    name: "Gateway Center",
    type: "shelter",
    phone: "404-215-6600",
    address: "275 Pryor St SW, Atlanta, GA 30303",
    hours: "24/7",
    description: "Emergency shelter with case management, job training, and housing assistance",
    website: "https://gatewayctr.org",
  },
  {
    name: "Atlanta Mission - My Sister's House",
    type: "shelter",
    phone: "404-588-4000",
    address: "921 Howell Mill Rd NW, Atlanta, GA 30318",
    hours: "24/7",
    description: "Women's shelter with recovery programs and housing assistance",
    website: "https://atlantamission.org",
  },
  {
    name: "Atlanta Mission - Shepherd's Inn",
    type: "shelter",
    phone: "404-588-4000",
    address: "165 Alexander St NW, Atlanta, GA 30313",
    hours: "24/7",
    description: "Men's emergency shelter and recovery program",
  },
  {
    name: "Frontline Response",
    type: "shelter",
    phone: "404-920-5556",
    address: "830 Boulevard SE, Atlanta, GA 30312",
    hours: "24/7",
    description: "Emergency shelter serving individuals and families",
  },
  {
    name: "Nicholas House",
    type: "shelter",
    phone: "404-223-1750",
    address: "830 Boulevard SE, Atlanta, GA 30312",
    hours: "Call for intake hours",
    description: "Family shelter and transitional housing program",
  },
  {
    name: "Union Mission",
    type: "shelter",
    phone: "404-367-2493",
    address: "25 Ellis St NE, Atlanta, GA 30303",
    hours: "Intake 4pm-6pm daily",
    description: "Men's emergency shelter in downtown Atlanta",
  },

  // HEALTHCARE
  {
    name: "Grady Memorial Hospital",
    type: "healthcare",
    phone: "404-616-1000",
    address: "80 Jesse Hill Jr Dr SE, Atlanta, GA 30303",
    hours: "24/7 Emergency, Clinics vary",
    description: "Public hospital with Grady Card program for uninsured. Free/low-cost care.",
    website: "https://gradyhealth.org",
    notes: "Apply for Grady Card for free healthcare",
  },
  {
    name: "Mercy Care Atlanta",
    type: "healthcare",
    phone: "678-843-8600",
    address: "424 Decatur St SE, Atlanta, GA 30312",
    hours: "Monday-Friday 8am-5pm",
    description: "Free primary care, dental, vision, and behavioral health for uninsured",
    website: "https://mercyatlanta.org",
  },
  {
    name: "Good Samaritan Health Center",
    type: "healthcare",
    phone: "404-523-6571",
    address: "1015 Donald Lee Hollowell Pkwy NW, Atlanta, GA 30318",
    hours: "Monday-Friday 8am-5pm",
    description: "Low-cost primary care and pharmacy services",
  },
  {
    name: "St. Joseph's Mercy Care",
    type: "healthcare",
    phone: "404-527-5601",
    address: "Multiple locations - mobile health",
    hours: "Varies by location",
    description: "Mobile health services for homeless individuals",
  },
  {
    name: "PadSplit Health",
    type: "healthcare",
    phone: "404-947-7472",
    address: "Mobile services",
    hours: "By appointment",
    description: "Mobile health clinic serving homeless communities",
  },

  // BENEFITS
  {
    name: "211 United Way",
    type: "benefits",
    phone: "211",
    hours: "24/7",
    description: "Connects to SOAR workers, social services, and all community resources. First call for benefits help.",
    website: "https://211online.unitedwayatlanta.org",
    notes: "Ask for SOAR worker for SSI help",
  },
  {
    name: "Social Security Administration - Downtown Atlanta",
    type: "benefits",
    phone: "1-800-772-1213",
    address: "401 W Peachtree St NW, Atlanta, GA 30308",
    hours: "Monday-Friday 9am-4pm",
    description: "Apply for SSI, SSDI, Social Security retirement benefits",
    website: "https://ssa.gov",
  },
  {
    name: "Georgia DFCS - Fulton County",
    type: "benefits",
    phone: "404-206-5700",
    address: "2083 Martin Luther King Jr Dr SW, Atlanta, GA 30310",
    hours: "Monday-Friday 8am-5pm",
    description: "SNAP (food stamps), Medicaid, TANF applications",
    website: "https://dfcs.georgia.gov",
    notes: "Apply online at gateway.ga.gov",
  },
  {
    name: "Georgia Gateway",
    type: "benefits",
    phone: "1-877-423-4746",
    website: "https://gateway.ga.gov",
    hours: "Online 24/7, Phone Monday-Friday 8am-5pm",
    description: "Online portal for SNAP, Medicaid, TANF applications",
  },
  {
    name: "Atlanta Legal Aid",
    type: "benefits",
    phone: "404-524-5811",
    address: "54 Ellis St NE, Atlanta, GA 30303",
    hours: "Monday-Friday 9am-5pm",
    description: "Free legal help for low-income individuals including benefits appeals",
    website: "https://atlantalegalaid.org",
  },

  // TRANSPORTATION
  {
    name: "MARTA Reduced Fare Program",
    type: "transportation",
    phone: "404-848-4800",
    address: "2424 Piedmont Rd NE, Atlanta, GA 30324",
    hours: "Monday-Friday 8am-5pm",
    description: "Half-price transit fares for seniors (65+) and disabled individuals",
    website: "https://itsmarta.com",
    notes: "Bring ID and proof of age or disability",
  },
  {
    name: "ITN Atlanta",
    type: "transportation",
    phone: "678-298-8772",
    hours: "Monday-Friday 8am-5pm",
    description: "Transportation for seniors 60+ and visually impaired adults",
  },

  // OTHER SERVICES
  {
    name: "Atlanta Day Shelter for Women",
    type: "other",
    phone: "404-588-4008",
    address: "655 Ethel St NW, Atlanta, GA 30318",
    hours: "Monday-Friday 7am-3pm",
    description: "Daytime services for women including showers, laundry, case management",
  },
  {
    name: "Crossroads Community Ministries",
    type: "other",
    phone: "404-873-7652",
    address: "425 Ponce de Leon Ave NE, Atlanta, GA 30308",
    hours: "Monday-Friday 8:30am-2pm",
    description: "Day services, mail, phone, showers, job assistance",
  },
  {
    name: "Coordinated Entry (via 211)",
    type: "other",
    phone: "211",
    hours: "24/7",
    description: "Required entry point for housing vouchers and permanent supportive housing",
    notes: "Must complete assessment to get on housing waitlist",
  },
];

// Search function - searches each word separately for better matching
export function searchResources(query: string, type?: Resource['type']): Resource[] {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  return ATLANTA_RESOURCES.filter(r => {
    // Filter by type if specified
    if (type && r.type !== type) return false;

    // Search in name, description, notes, address
    const searchText = `${r.name} ${r.description} ${r.notes || ''} ${r.address || ''} ${r.type}`.toLowerCase();

    // Match if ANY word is found
    return words.some(word => searchText.includes(word));
  }).sort((a, b) => {
    // Sort by number of matching words (more matches = higher rank)
    const aMatches = words.filter(w => `${a.name} ${a.description}`.toLowerCase().includes(w)).length;
    const bMatches = words.filter(w => `${b.name} ${b.description}`.toLowerCase().includes(w)).length;
    return bMatches - aMatches;
  });
}

// Get resources by type
export function getResourcesByType(type: Resource['type']): Resource[] {
  return ATLANTA_RESOURCES.filter(r => r.type === type);
}

// Format resource for display
export function formatResource(r: Resource): string {
  let result = `**${r.name}**`;
  if (r.phone) result += `\nPhone: ${r.phone}`;
  if (r.address) result += `\nAddress: ${r.address}`;
  if (r.hours) result += `\nHours: ${r.hours}`;
  result += `\n${r.description}`;
  if (r.notes) result += `\n*${r.notes}*`;
  return result;
}
