/*
add the collection id
*/

export interface CollectionInfo {
  id?: string;

  title: string;
  description: string;

  collectionType: "manual" | "automated";
  conditions?: {
    mustMatch: "$and" | "$or";
    conditionArray: Condition[];
  };

  isActive?: boolean;
}

export interface Condition {
  conditions: "$gt" | "$lt" | "$eq" | "$ne";

  objectKey: "pricing.price" | "textInfo.title" | "tag" | "weight";
  value: string | number;
  key: string;
}

export interface CollectionCard {
  onChangeHandler: (value: any, firstKey: string, changedKey?: string) => void;
  collectionInfo: CollectionInfo;
  setCollectionInfo?: any;
  isLoading?: boolean;
}
