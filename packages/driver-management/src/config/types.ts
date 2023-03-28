import { ReactNode } from "react";

export type Store = {
  storeName: string;
  storePhone: string;
  storeType: string[];
  description: string;
  image?: string;
  imageObj?: any;
  city: string;
  country: string;
  coords: string;
  address?: string;
};

export interface ReactProps {
  children?: ReactNode;
}
