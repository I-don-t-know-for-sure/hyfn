export interface ProductInfo {
  textInfo: {
    title: string;
    description: string;
  };
  measurementSystem: "Kilo" | "Liter" | "Unit" | "Gram" | "Milliliter";

  deletedImages?: any[];
  weightInKilo: string;

  tags: { label: string; value: string }[];
  barcode: string;
  images: string[];
  files: any[];
  brand: string;
}

export interface Option {
  optionName: string;
  numberOfOptionsForUserToSelect: number;
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
