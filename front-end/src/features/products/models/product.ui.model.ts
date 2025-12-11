export interface ProductMetadata {
  cron: string;
  name: string;
  debug: boolean;
  vendor: string;
  enabled: boolean;
  lastRanAt: string;
  lastRanStatus: string;
  automationScripts: string[];
  needsNiniteCheck: boolean;
  niniteProductName: string;
  needsFileSizeCheck: boolean;
  fileSizeUrl: string;
  needsVendorWebsiteCheck: boolean;
  vendorWebsiteRegex: string;
  vendorWebsiteUrl: string;
}

export interface Product {
  id: number;
  name: string;
  lastUpdated: string;
  lastModifiedBy: string;
  metadata: ProductMetadata;
}

// form can use this directly unless need extra fields:
export type ProductFormData = ProductMetadata;

export interface Script {
  name: string;
  path: string;
}
