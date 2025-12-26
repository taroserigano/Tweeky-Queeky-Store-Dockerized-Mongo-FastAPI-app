/**
 * Order Queries Hook
 * 
 * Custom React Query hooks for managing order-related API operations.
 * Implements the query/mutation pattern with automatic cache management,
 * optimistic updates, and proper error handling.
 * 
 * Features:
 * - Automatic cache invalidation on mutations
 * - Server state synchronization
 * - Built-in loading and error states
 * - Optimized refetching strategies
 * 
 * @module hooks/useOrderQueries
 * @requires @tanstack/react-query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL, ORDERS_URL, PAYPAL_URL } from '../constants';

// Configure axios instance with credentials for authenticated requests
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enable cookies for JWT authentication
});

/**
 * Create Order Mutation
 * 
 * Creates a new order in the system. On success, automatically invalidates
 * the orders cache to ensure the orders list is up-to-date.
 * 
 * @returns {UseMutationResult} Mutation object with mutate function and status
 * 
 * @example
 * const { mutate: createOrder, isPending } = useCreateOrder();
 * createOrder(orderData, {
 *   onSuccess: (order) => navigate(`/order/${order._id}`),
 *   onError: (err) => toast.error(err.message)
 * });
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (order) => {
      const { data } = await api.post(ORDERS_URL, order);
      return data;
    },
    // Invalidate orders cache to trigger refetch of order lists
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    },
  });
};

/**
 * Get Order Details Query
 * 
 * Fetches detailed information for a specific order. Uses React Query's
 * intelligent caching to avoid redundant API calls. Query is disabled
 * until a valid orderId is provided.
 * 
 * @param {string} orderId - The unique identifier of the order
 * @returns {UseQueryResult} Query object with data, loading, and error states
 * 
 * @example
 * const { data: order, isLoading, refetch } = useOrderDetails(orderId);
 */
export const useOrderDetails = (orderId) => {
  return useQuery({
    queryKey: ['order', orderId], // Unique cache key per order
    queryFn: async () => {
      const { data } = await api.get(`${ORDERS_URL}/${orderId}`);
      return data;
    },
    enabled: !!orderId, // Only fetch if orderId exists (prevents unnecessary calls)
  });
};

/**
 * Pay Order Mutation
 * 
 * Processes payment for an order via PayPal. Invalidates both the specific
 * order cache and the orders list to reflect updated payment status.
 * 
 * @returns {UseMutationResult} Mutation object with mutate function
 * 
 * @example
 * const { mutate: payOrder } = usePayOrder();
 * payOrder({ orderId, details: paypalDetails });
 */
export const usePayOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, details }) => {
      const { data } = await api.put(`${ORDERS_URL}/${orderId}/pay`, details);
      return data;
    },
    // Update both specific order and orders list after payment
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['order', variables.orderId]);
      queryClient.invalidateQueries(['orders']);
    },
  });
};

/**
 * Get PayPal Client ID Query
 * 
 * Fetches the PayPal client ID for payment processing. Uses infinite
 * staleTime since this configuration value rarely changes, optimizing
 * performance by avoiding unnecessary refetches.
 * 
 * @returns {UseQueryResult} Query object with PayPal configuration
 * 
 * @example
 * const { data: paypal, isLoading } = usePayPalClientId();
 * // paypal.clientId available after loading
 */
export const usePayPalClientId = () => {
  return useQuery({
    queryKey: ['paypal', 'clientId'],
    queryFn: async () => {
      const { data } = await api.get(PAYPAL_URL);
      return data;
    },
    staleTime: Infinity, // Never mark as stale - config doesn't change
  });
};

/**
 * Get My Orders Query
 * 
 * Fetches all orders for the currently authenticated user.
 * Automatically refetches when orders are created or updated.
 * 
 * @returns {UseQueryResult} Query object with user's orders array
 */
export const useMyOrders = () => {
  return useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: async () => {
      const { data } = await api.get(`${ORDERS_URL}/mine`);
      return data;
    },
  });
};

/**
 * Get All Orders Query (Admin)
 * 
 * Fetches all orders in the system. Restricted to admin users.
 * Used in the admin dashboard for order management.
 * 
 * @returns {UseQueryResult} Query object with all orders array
 */
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: async () => {
      const { data } = await api.get(ORDERS_URL);
      return data;
    },
  });
};

/**
 * Deliver Order Mutation (Admin)
 * 
 * Marks an order as delivered. Admin-only operation that updates
 * the order status and triggers cache invalidation.
 * 
 * @returns {UseMutationResult} Mutation object for marking delivery
 * 
 * @example
 * const { mutate: deliverOrder } = useDeliverOrder();
 * deliverOrder(orderId, {
 *   onSuccess: () => toast.success('Order marked as delivered')
 * });
 */
export const useDeliverOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderId) => {
      const { data } = await api.put(`${ORDERS_URL}/${orderId}/deliver`, {});
      return data;
    },
    // Invalidate affected caches to reflect delivery status
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries(['order', orderId]);
      queryClient.invalidateQueries(['orders']);
    },
  });
};
