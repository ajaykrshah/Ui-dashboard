'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
  ProductActions,
  ProductEmptyState,
  ProductFilters,
  ProductForm,
  ProductHeader,
  ProductTable,
} from '@/features/products/components';
import { toApiProductMetadata } from '@/features/products/mapping';
import { Product, ProductFormData } from '@/features/products/models/product.ui.model';
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useScripts,
  useUpdateProduct,
} from '@/features/products/product.query';
import { getDefaultFormData, productToFormData } from '@/features/products/utils/productFormUtils';
import { ProductMetadataSchema } from '@/features/products/validation/product.validation';
import { useToast } from '@/hooks/use-toast';

export default function ProductsPage() {
  // Data/state hooks
  const { data: products = [], isLoading: loading, error, refetch } = useProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // const { scripts, loading: scriptsLoading, error: scriptsError } = useScripts();
  const { data: scripts = [], isLoading: scriptsLoading, error: scriptsError } = useScripts();

  // Filters/state/UI
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [enabledFilter, setEnabledFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Modal/editing/rows state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Product form state (always set for create/edit)
  const [formData, setFormData] = useState<ProductFormData>(getDefaultFormData());

  // Filtering
  const baseFilteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const s = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(s) ||
      product.metadata.vendor.toLowerCase().includes(s) ||
      String(product.id).includes(s)
    );
  });

  // const filteredProducts = baseFilteredProducts.filter(product => {
  //   const matchesStatus = !statusFilter ||
  //     getStatusText(product.metadata.lastRanStatus).toLowerCase().includes(statusFilter.toLowerCase());
  //   const matchesEnabled = !enabledFilter ||
  //     (enabledFilter === "enabled" ? product.metadata.enabled : !product.metadata.enabled);
  //   const matchesVendor = !vendorFilter || product.metadata.vendor === vendorFilter;
  //   return matchesStatus && matchesEnabled && matchesVendor;
  // });

  const filteredProducts = baseFilteredProducts.filter((product) => {
    const statusVal = String(product.metadata.lastRanStatus ?? '')
      .toLowerCase()
      .trim();
    const filterVal = String(statusFilter ?? '')
      .toLowerCase()
      .trim();

    const matchesStatus = !filterVal || (statusVal && statusVal.includes(filterVal));
    const matchesEnabled =
      !enabledFilter ||
      (enabledFilter === 'enabled' ? product.metadata.enabled : !product.metadata.enabled);
    const matchesVendor = !vendorFilter || product.metadata.vendor === vendorFilter;

    return matchesStatus && matchesEnabled && matchesVendor;
  });

  // Pagination logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // On filter/search change, reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, enabledFilter, vendorFilter]);
  const toggleRowExpansion = (productId: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const handleReload = async () => {
    await queryClient.invalidateQueries({ queryKey: ['products'] });
    await refetch();
  };

  // Form/modal logic
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData(getDefaultFormData());
    setShowForm(true);
  };
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData(productToFormData(product));
    setShowForm(true);
  };
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };
  const handleCreateProduct = () => handleAddProduct();

  // Product save/update
  const handleSaveProduct = async () => {
    // 1) Validate
    const validateResult = ProductMetadataSchema.safeParse(formData);
    if (!validateResult.success) {
      toast({
        title: 'Validation Error',
        description: validateResult.error.issues.map((i) => i.message).join(', '),
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingProduct) {
        // 2) Update (send PATCH/PUT with id and data)
        await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          data: {
            name: formData.name,
            metadata: toApiProductMetadata(formData), // always snake_case
          },
        });
        toast({
          title: 'Success',
          description: 'Product updated successfully',
          variant: 'default',
        });
      } else {
        // 3) Create (send POST)
        await createProductMutation.mutateAsync({
          name: formData.name,
          metadata: toApiProductMetadata(formData),
        });
        toast({
          title: 'Success',
          description: 'Product created successfully',
          variant: 'default',
        });
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      let errorMessage = 'Unknown error occurred';
      if (err instanceof Error) errorMessage = err.message;
      else if (typeof err === 'string') errorMessage = err;
      else if (err && typeof err === 'object') {
        errorMessage =
          (err as any)?.response?.data?.message ||
          (err as any)?.message ||
          JSON.stringify(err, null, 2);
      }
      toast({
        title: 'Save Failed',
        description: `Failed to save product: ${errorMessage}`,
        variant: 'destructive',
      });
    }
  };
  // Delete/product/script logic
  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProductMutation.mutateAsync(product.id);
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
          variant: 'default',
        });
      } catch (err) {
        toast({
          title: 'Delete Failed',
          description: 'Failed to delete product. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleRunScript = async (product: Product) => {
    if (!product.metadata.enabled) {
      toast({
        title: 'Cannot Run Script',
        description: 'Product is disabled',
        variant: 'destructive',
      });
      return;
    }
    if (!product.metadata.automationScripts?.length) {
      toast({
        title: 'No Scripts Available',
        description: 'No automation scripts available for this product',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Scripts Started',
      description: `Running automation scripts for "${product.name}"\n\nScripts: ${product.metadata.automationScripts.join(', ')}`,
      variant: 'default',
    });
  };

  if (showForm) {
    return (
      <ProductForm
        formData={formData}
        setFormData={setFormData}
        editingProduct={editingProduct}
        loading={loading}
        scripts={scripts?.map((script) => script.path) || []}
        scriptsLoading={scriptsLoading}
        scriptsError={scriptsError?.message ?? null}
        onSave={handleSaveProduct}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <>
      <ProductHeader loading={loading} error={error} onReload={handleReload} />
      <div className='flex flex-col gap-4 mb-6'>
        <ProductFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          enabledFilter={enabledFilter}
          setEnabledFilter={setEnabledFilter}
          vendorFilter={vendorFilter}
          setVendorFilter={setVendorFilter}
          products={products}
        />
        <ProductActions
          onAddProduct={handleAddProduct}
          onReload={handleReload}
          loading={loading}
          products={products}
          updateProductMutation={updateProductMutation}
        />
      </div>
      {loading || filteredProducts.length > 0 ? (
        <ProductTable
          products={paginatedProducts}
          loading={loading}
          itemsPerPage={itemsPerPage}
          expandedRows={expandedRows}
          onToggleRowExpansion={toggleRowExpansion}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onRunScript={handleRunScript}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
        />
      ) : (
        <ProductEmptyState searchQuery={searchQuery} onCreateProduct={handleCreateProduct} />
      )}
    </>
  );
}
