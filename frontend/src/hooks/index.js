/**
 * React Query Hooks - Central Export Module
 * 
 * Provides a unified import point for all React Query hooks used throughout
 * the application. This barrel export pattern improves code organization and
 * makes imports cleaner.
 * 
 * Architecture:
 * - Separates concerns: Orders, Products, and Users each have dedicated files
 * - Consistent naming: use[Action][Resource] pattern (e.g., useCreateOrder)
 * - Type-safe: All hooks properly typed with JSDoc comments
 * 
 * Usage:
 * import { useProducts, useLogin, useCreateOrder } from '../hooks';
 * 
 * @module hooks
 */

// ============================================================================
// ORDER HOOKS
// ============================================================================
// Handles all order-related operations including creation, payment, and delivery

export {
  useCreateOrder,      // Create new order
  useOrderDetails,     // Fetch single order
  usePayOrder,         // Process order payment
  usePayPalClientId,   // Get PayPal configuration
  useMyOrders,         // Fetch user's orders
  useOrders,           // Admin: Fetch all orders
  useDeliverOrder,     // Admin: Mark order delivered
} from './useOrderQueries';

// ============================================================================
// PRODUCT HOOKS
// ============================================================================
// Manages product catalog, reviews, and admin CRUD operations

export {
  useProducts,          // Fetch products with pagination/search
  useProductDetails,    // Fetch single product
  useTopProducts,       // Fetch top-rated products
  useCreateReview,      // Submit product review
  useCreateProduct,     // Admin: Create product
  useUpdateProduct,     // Admin: Update product
  useDeleteProduct,     // Admin: Delete product
  useUploadProductImage,// Admin: Upload product image
} from './useProductQueries';

// ============================================================================
// USER & AUTHENTICATION HOOKS
// ============================================================================
// Handles authentication flow and user management

export {
  useLogin,            // User login
  useRegister,         // User registration
  useLogout,           // User logout
  useUpdateProfile,    // Update user profile
  useUsers,            // Admin: Fetch all users
  useUserDetails,      // Admin: Fetch user details
  useDeleteUser,       // Admin: Delete user
  useUpdateUser,       // Admin: Update user
} from './useUserQueries';
