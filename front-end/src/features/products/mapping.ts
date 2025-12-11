import { ApiProduct, ApiProductMetadata, ApiScript } from './models/product.api.model';
import { Product, ProductFormData, ProductMetadata, Script } from './models/product.ui.model';

/**
 * Maps API-shape (snake_case) to UI shape (camelCase)
 */
export function mapProduct(apiProduct: ApiProduct): Product {
  const m = apiProduct.metadata;
  const metadata: ProductMetadata = {
    cron: m.cron,
    name: m.name,
    debug: m.debug,
    vendor: m.vendor,
    enabled: m.enabled,
    lastRanAt: m.last_ran_at,
    lastRanStatus: m.last_ran_status,
    automationScripts: m.automation_scripts,
    needsNiniteCheck: m.needs_ninite_check,
    niniteProductName: m.ninite_product_name,
    needsFileSizeCheck: m.needs_file_size_check,
    fileSizeUrl: m.file_size_url,
    needsVendorWebsiteCheck: m.needs_vendor_website_check,
    vendorWebsiteRegex: m.vendor_website_regex,
    vendorWebsiteUrl: m.vendor_website_url,
  };
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    lastUpdated: apiProduct.last_updated,
    lastModifiedBy: apiProduct.last_modified_by,
    metadata,
  };
}

export function mapProducts(apiProducts: ApiProduct[]): Product[] {
  return apiProducts.map(mapProduct);
}

export function mapScripts(apiScript: ApiScript): Script[] {
  return apiScript.files as Script[];
}

// Converts UI camelCase form data to snake_case API metadata
export function toApiProductMetadata(form: ProductFormData): ApiProductMetadata {
  return {
    cron: form.cron,
    name: form.name,
    debug: form.debug,
    vendor: form.vendor,
    enabled: form.enabled,
    last_ran_at: form.lastRanAt,
    last_ran_status: form.lastRanStatus,
    automation_scripts: form.automationScripts,
    needs_ninite_check: form.needsNiniteCheck,
    ninite_product_name: form.niniteProductName,
    needs_file_size_check: form.needsFileSizeCheck,
    file_size_url: form.fileSizeUrl,
    needs_vendor_website_check: form.needsVendorWebsiteCheck,
    vendor_website_regex: form.vendorWebsiteRegex,
    vendor_website_url: form.vendorWebsiteUrl,
  };
}
