/**
 * Product Query Functions
 * React Query hooks for product data
 *
 * Feature-owned query keys - products feature only
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  CreateProductRequest,
  ProductsQueryParams,
  UpdateProductRequest,
} from './models/product.api.model';
import type { Product, Script } from './models/product.ui.model';
import { productService } from './product.service';

// Query keys - centralized and exported
export const PRODUCTS_QUERY_KEY = ['products'] as const;
export const PRODUCT_DETAIL_QUERY_KEY = (id: number) => ['products', 'detail', id] as const;
export const PRODUCTS_SEARCH_QUERY_KEY = (query: string) => ['products', 'search', query] as const;

export const SCRIPTS_QUERY_KEY = ['scripts'] as const;

// Query keys factory
export const productKeys = {
  all: () => PRODUCTS_QUERY_KEY,
  lists: () => [...PRODUCTS_QUERY_KEY, 'list'] as const,
  list: (params?: ProductsQueryParams) => [...PRODUCTS_QUERY_KEY, 'list', params] as const,
  details: () => [...PRODUCTS_QUERY_KEY, 'detail'] as const,
  detail: (id: number) => PRODUCT_DETAIL_QUERY_KEY(id),
  search: (query: string) => PRODUCTS_SEARCH_QUERY_KEY(query),
};

export const scriptKeys = {
  all: () => SCRIPTS_QUERY_KEY,
};

// Product list query
export function useProducts(params?: ProductsQueryParams) {
  return useQuery<Product[]>({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Script list query
export function useScripts() {
  return useQuery<Script[]>({
    queryKey: scriptKeys.all(),
    queryFn: () => productService.getScripts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Single product query
export function useProduct(id: number) {
  return useQuery<Product>({
    queryKey: PRODUCT_DETAIL_QUERY_KEY(id),
    queryFn: () => productService.getProduct(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, unknown, CreateProductRequest>({
    // Lambda for correct `this` context
    mutationFn: (input) => productService.createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, unknown, UpdateProductRequest>({
    mutationFn: (input) => productService.updateProduct(input),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.setQueryData(PRODUCT_DETAIL_QUERY_KEY(updatedProduct.id), updatedProduct);
    },
  });
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, number>({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: PRODUCT_DETAIL_QUERY_KEY(deletedId) });
    },
  });
}

// (If you wish, add a search hook for quick product search)
export function useProductSearch(query: string) {
  return useQuery<Product[]>({
    queryKey: PRODUCTS_SEARCH_QUERY_KEY(query),
    queryFn: () => productService.searchProducts(query),
    enabled: !!query,
    staleTime: 2 * 60 * 1000,
  });
}

// Additional hooks for other product-related operations can be added here
// useAutomationScrip
