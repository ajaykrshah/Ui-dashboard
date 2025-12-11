/**
 * Product Service
 * Handles product-related API calls and business logic
 */

import { mapProduct, mapProducts, mapScripts } from './mapping';
import {
  ApiProduct,
  ApiScript,
  CreateProductRequest,
  ProductsQueryParams,
  UpdateProductRequest,
} from './models/product.api.model';
import type { Product, Script } from './models/product.ui.model';

import { apiClient } from '@/shared/lib/api';

class ProductService {
  private readonly baseUrl = '/products';

  /**
   * Get all products with optional filters
   */
  async getProducts(params?: ProductsQueryParams): Promise<Product[]> {
    try {
      const response = await apiClient.get<ApiProduct[]>(this.baseUrl, { params });
      return mapProducts(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: number): Promise<Product> {
    try {
      const response = await apiClient.get<ApiProduct>(`${this.baseUrl}/${id}`);
      return mapProduct(response.data);
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw new Error(`Product ${id} not found`);
    }
  }

  /**
   * Create a new product
   */
  async createProduct(product: CreateProductRequest): Promise<Product> {
    try {
      const response = await apiClient.post<ApiProduct>(this.baseUrl, product);
      return mapProduct(response.data);
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(product: UpdateProductRequest): Promise<Product> {
    try {
      // Only send the `data` (partial) object as body, not full request type
      const response = await apiClient.put<ApiProduct>(
        `${this.baseUrl}/${product.id}`,
        product.data
      );
      return mapProduct(response.data);
    } catch (error) {
      console.error(`Failed to update product ${product.id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<ApiProduct[]>(`${this.baseUrl}/search`, {
        params: { q: query },
      });
      return mapProducts(response.data);
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  }

  /**
   * Get all Scripts with optional filters
   */
  async getScripts(params?: any): Promise<Script[]> {
    try {
      const response = await apiClient.get<ApiScript[]>('github_scripts', { params });
      return mapScripts(response.data);
    } catch (error) {
      throw error;
    }
  }
}

export const productService = new ProductService();
