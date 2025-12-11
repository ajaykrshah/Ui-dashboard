export interface ApiProductMetadata {
  cron: string;
  name: string;
  debug: boolean;
  vendor: string;
  enabled: boolean;
  last_ran_at: string;
  last_ran_status: string;
  automation_scripts: string[];
  needs_ninite_check: boolean;
  ninite_product_name: string;
  needs_file_size_check: boolean;
  file_size_url: string;
  needs_vendor_website_check: boolean;
  vendor_website_regex: string;
  vendor_website_url: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  last_updated: string;
  last_modified_by: string;
  metadata: ApiProductMetadata;
}

export interface ProductsQueryParams {
  [key: string]: string | number | boolean | undefined;
}
export interface CreateProductRequest {
  name: string;
  metadata: ApiProductMetadata;
}
export interface UpdateProductRequest {
  id: number;
  data: Partial<Omit<ApiProduct, 'id'>>;
}

export interface ApiScript {
  name: string;
  path: string;
}
