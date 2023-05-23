export interface Store {
  businessName: string;
  businessPhone: string;
  businessType: string;
  description: string;
  image: string;
  city: string;
  country: string;
  id: any;
  currentRating: string;
  ratingCount: number;
}

export interface storeFront {
  id: any;
  description: string;
  currentRating: number;
  ratingCount: number;
  didCustomerRateStore: boolean;
  customerRating: number;
  coords: { type: string; coordinates: number[] };
  businessPhone: string;
  businessName: string;
  image: string[];
  collections: any[];
}
