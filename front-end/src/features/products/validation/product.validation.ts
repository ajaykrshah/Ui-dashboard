import { z } from 'zod';

export const ProductMetadataSchema = z
  .object({
    cron: z.string().min(1, 'Cron schedule is required.'),
    name: z.string().min(1, 'Product name is required.'),
    debug: z.boolean(),
    vendor: z.string().min(1, 'Vendor is required.'),
    enabled: z.boolean(),
    lastRanAt: z.string(),
    lastRanStatus: z.string(),
    automationScripts: z.array(z.string()),
    needsNiniteCheck: z.boolean(),
    niniteProductName: z.string().optional().or(z.literal('')),
    needsFileSizeCheck: z.boolean(),
    fileSizeUrl: z.string().optional().or(z.literal('')),
    needsVendorWebsiteCheck: z.boolean(),
    vendorWebsiteRegex: z.string().optional().or(z.literal('')),
    vendorWebsiteUrl: z.string().optional().or(z.literal('')),
  })
  .superRefine((m, ctx) => {
    if (m.needsFileSizeCheck && !m.fileSizeUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fileSizeUrl'],
        message: 'File Size URL is required if file size check is enabled.',
      });
    }
    if (m.needsNiniteCheck && !m.niniteProductName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['niniteProductName'],
        message: 'Ninite product name is required if Ninite check is enabled.',
      });
    }
    if (m.needsVendorWebsiteCheck && (!m.vendorWebsiteUrl || !m.vendorWebsiteRegex)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['vendorWebsiteUrl'],
        message: 'Vendor website URL and regex are required if check is enabled.',
      });
    }
  });

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Product name is required.'),
  lastUpdated: z.string(),
  lastModifiedBy: z.string(),
  metadata: ProductMetadataSchema,
});

export const CreateProductRequestSchema = z.object({
  name: z.string().min(1, 'Product name is required.'),
  metadata: ProductMetadataSchema,
});

export const UpdateProductRequestSchema = z.object({
  id: z.number(),
  data: ProductSchema.omit({ id: true }).partial(),
});

export function validateProductMetadata(metadata: unknown) {
  return ProductMetadataSchema.safeParse(metadata);
}
export function validateProduct(product: unknown) {
  return ProductSchema.safeParse(product);
}
export function validateCreateProductRequest(request: unknown) {
  return CreateProductRequestSchema.safeParse(request);
}
export function validateUpdateProductRequest(request: unknown) {
  return UpdateProductRequestSchema.safeParse(request);
}
