// Sample property tour replay videos
export interface ReplayVideo {
  id: string;
  title: string;
  propertyName: string;
  developer: string;
  sector: string;
  thumbnail: string;
  videoUrl: string; // YouTube embed URL
  duration: string;
  liveDate: string;
  liveViewers: number;
  replayViews: number;
  highlights: string[];
  propertyType: string;
  priceRange: string;
}

export const REPLAY_VIDEOS: ReplayVideo[] = [
  {
    id: "1",
    title: "DLF The Camellias Gurgaon | Ultra Luxury 4BHK Apartment Tour",
    propertyName: "DLF The Camellias",
    developer: "DLF Limited",
    sector: "Golf Course Road, Gurgaon",
    thumbnail: "https://img.youtube.com/vi/cGDbHLdLX1M/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/cGDbHLdLX1M",
    duration: "21:42",
    liveDate: "2 days ago",
    liveViewers: 4218,
    replayViews: 12840,
    highlights: [
      "Ultra luxury 4 BHK residences",
      "Golf course facing balconies",
      "Imported marble interiors",
      "Private elevator lobby",
      "Luxury clubhouse and spa",
      "Detailed pricing & possession info"
    ],
    propertyType: "4 BHK Apartment",
    priceRange: "₹18 Cr - ₹25 Cr"
  },
  {
    id: "2",
    title: "M3M Golf Estate Sector 65 Gurgaon | Full Property Walkthrough",
    propertyName: "M3M Golf Estate",
    developer: "M3M India",
    sector: "Sector 65, Gurgaon",
    thumbnail: "https://img.youtube.com/vi/6dp-bvQ7RWo/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/6dp-bvQ7RWo",
    duration: "18:15",
    liveDate: "5 days ago",
    liveViewers: 3567,
    replayViews: 9634,
    highlights: [
      "Luxury golf resort residences",
      "3 & 4 BHK apartment layouts",
      "9-hole executive golf course",
      "Clubhouse and infinity pool",
      "Investment and rental analysis"
    ],
    propertyType: "3/4 BHK Apartments",
    priceRange: "₹2.5 Cr - ₹6 Cr"
  },
  {
    id: "3",
    title: "Sobha City Gurgaon | Ready To Move 2 & 3 BHK Apartment Tour",
    propertyName: "Sobha City",
    developer: "Sobha Limited",
    sector: "Sector 108, Gurgaon",
    thumbnail: "https://img.youtube.com/vi/ysz5S6PUM-U/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    duration: "16:52",
    liveDate: "3 days ago",
    liveViewers: 2845,
    replayViews: 7621,
    highlights: [
      "Ready-to-move apartments",
      "Large central greens",
      "Premium sports facilities",
      "Modern modular kitchen",
      "Dwarka Expressway connectivity"
    ],
    propertyType: "2/3 BHK Apartments",
    priceRange: "₹1.4 Cr - ₹2.3 Cr"
  }
];