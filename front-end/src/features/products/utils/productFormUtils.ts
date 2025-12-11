import { Product, ProductFormData } from '../models/product.ui.model';

// Default blank form state
export function getDefaultFormData(): ProductFormData {
  return {
    cron: '',
    name: '',
    debug: false,
    vendor: '',
    enabled: true,
    lastRanAt: '',
    lastRanStatus: '',
    automationScripts: [],
    needsNiniteCheck: false,
    niniteProductName: '',
    needsFileSizeCheck: false,
    fileSizeUrl: '',
    needsVendorWebsiteCheck: false,
    vendorWebsiteRegex: '',
    vendorWebsiteUrl: '',
  };
}

// From a saved product (for editing)
export function productToFormData(product: Product): ProductFormData {
  return { ...product.metadata };
}
