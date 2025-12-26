/**
 * Product Queries Hook
 * 
 * Custom React Query hooks for managing product-related API operations.
 * Implements comprehensive product CRUD operations with caching, pagination,
 * and search functionality.
 * 
 * Features:
 * - Pagination and search support
 * - Image upload handling
 * - Review management
 * - Admin product CRUD operations
 * - Automatic cache synchronization
 * 
 * @module hooks/useProductQueries
 * @requires @tanstack/react-query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL, PRODUCTS_URL } from '../constants';

// Configure axios instance with authentication credentials
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include JWT cookies in requests
});

/**
 * Fetch Products Query with Pagination and Search
 * 
 * Retrieves paginated product list with optional keyword search.
 * Query key includes search term and page number for granular caching.
 * 
 * @param {string} keyword - Optional search keyword for filtering
 * @param {number} pageNumber - Page number for pagination (default: 1)
 * @returns {UseQueryResult} Query with products array and pagination metadata
 * 
 * @example
 * const { data, isLoading } = useProducts('laptop', 2);
 * // data: { products: [...], page: 2, pages: 10 }
 */
export const useProducts = (keyword = '', pageNumber = 1) => {
  return useQuery({
    queryKey: ['products', keyword, pageNumber], // Unique key per search/page combo
    queryFn: async () => {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (pageNumber) params.pageNumber = pageNumber;
      
      const { data } = await api.get(PRODUCTS_URL, { params });
      return data;
    },
  });
};

/**
 * Fetch Single Product Details Query
 * 
 * Retrieves comprehensive details for a specific product including
 * reviews, ratings, and inventory information.
 * 
 * @param {string} productId - The unique identifier of the product
 * @returns {UseQueryResult} Query object with product data
 * 
 * @example
 * const { data: product, isLoading, refetch } = useProductDetails(id);
 */
export const useProductDetails = (productId) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await api.get(`${PRODUCTS_URL}/${productId}`);
      return data;
    },
    enabled: !!productId, // Only run query when productId is truthy
  });
};

/**
 * Fetch Top Rated Products Query
 * 
 * Retrieves the highest-rated products for homepage carousel.
 * Ideal for showcasing featured/popular items.
 * 
 * @returns {UseQueryResult} Query object with top products array
 */
export const useTopProducts = () => {
  return useQuery({
    queryKey: ['products', 'top'],
    queryFn: async () => {
      const { data } = await api.get(`${PRODUCTS_URL}/top`);
      return data;
    },
  });
};

/**
 * Create Product Review Mutation
 * 
 * Allows authenticated users to submit reviews with ratings and comments.
 * Automatically invalidates product cache to display new review immediately.
 * 
 * @returns {UseMutationResult} Mutation object for submitting reviews
 * 
 * @example
 * const { mutate: createReview } = useCreateReview();
 * createReview({ productId, rating: 5, comment: 'Great!' });
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, rating, comment }) => {
      const { data } = await api.post(`${PRODUCTS_URL}/${productId}/reviews`, {
        rating,
        comment,
      });
      return data;
    },
    // Invalidate product and list to show new review and updated rating
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['product', variables.productId]);
      queryClient.invalidateQueries(['products']);
    },
  });
};

/**
 * Create Product Mutation (Admin)
 * 
 * Creates a new product with sample/placeholder data. Admin can then
 * edit the product to add actual details.
 * 
 * @returns {UseMutationResult} Mutation for product creation
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product) => {
      const { data } = await api.post(PRODUCTS_URL, product);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });
};

/**
 * Update Product Mutation (Admin)
 * 
 * Updates existing product information including name, price, description,
 * inventory, and category.
 * 
 * @returns {UseMutationResult} Mutation for product updates
 * 
 * @example
 * const { mutate: updateProduct } = useUpdateProduct();
 * updateProduct({ productId, name, price, description });
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, ...product }) => {
      const { data } = await api.put(`${PRODUCTS_URL}/${productId}`, product);
      return data;
    },
    // Update both specific product and product list caches
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['product', variables.productId]);
      queryClient.invalidateQueries(['products']);
    },
  });
};

/**
 * Delete Product Mutation (Admin)
 * 
 * Permanently removes a product from the system.
 * 
 * @returns {UseMutationResult} Mutation for product deletion
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId) => {
      const { data } = await api.delete(`${PRODUCTS_URL}/${productId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });
};

/**
 * Upload Product Image Mutation (Admin)
 * 
 * Handles multipart form data upload for product images.
 * Returns the image URL for updating product record.
 * 
 * @returns {UseMutationResult} Mutation for image upload
 * 
 * @example
 * const { mutate: uploadImage } = useUploadProductImage();
 * const formData = new FormData();
 * formData.append('image', file);
 * uploadImage(formData, {
 *   onSuccess: (res) => setImage(res.image)
 * });
 */
export const useUploadProductImage = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
  });
};
