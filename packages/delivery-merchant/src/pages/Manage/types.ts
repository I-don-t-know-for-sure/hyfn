export interface ProductInfo {
  textInfo: {
    title: string;
    description: string;
  };
  productLibraryImages?: [];
  measurementSystem: "Kilo" | "Liter" | "Unit" | "Gram" | "Milliliter";
  pricing: {
    price: string;
    currency: "LYD";

    prevPrice: string;
    costPerItem: string;
  };
  deletedImages?: any[];
  weightInKilo: string;
  options: {
    hasOptions: boolean;

    options: Option[];
  };
  isActive: boolean;
  tags: { label: string; value: string }[];
  collections: { label: string; value: string }[];
  images: string[];
  files: any[];
  barcode?: string;
  removeBackgroundImages?: string[];
}

export interface Option {
  optionName: string;
  maximumNumberOfOptionsForUserToSelect: number;
  minimumNumberOfOptionsForUserToSelect: number;
  isRequired: boolean;

  key: string;
  optionValues: { value: string; key: string; price: number }[];
}

export interface ProductsCard {
  onChangeHandler: (
    value: any,
    firstChangedKey: string,
    changedKey?: string
  ) => void;
  productInfo: ProductInfo;
  isLoading?: boolean;
}
