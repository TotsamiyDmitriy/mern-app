export interface ListingType {
	imageURLs: string[];
	name: string;
	description: string;
	address: string;
	regularPrice: number;
	discountPrice: number;
	bedrooms: number;
	bathrooms: number;
	furnished: boolean;
	parking: boolean;
	type: string;
	offer: boolean;
	userRef: string;
	_id?: string;
  }