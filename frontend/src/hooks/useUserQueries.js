/**
 * User & Authentication Queries Hook
 * 
 * Custom React Query hooks for managing user authentication and user
 * management operations. Implements secure authentication flow with
 * JWT cookies and comprehensive admin user management.
 * 
 * Features:
 * - JWT-based authentication (stored in HTTP-only cookies)
 * - User registration and login
 * - Profile management
 * - Admin user CRUD operations
 * - Automatic cache clearing on logout
 * 
 * Security:
 * - Credentials sent via HTTP-only cookies (not localStorage)
 * - CSRF protection through same-origin policy
 * - Admin-only operations properly restricted
 * 
 * @module hooks/useUserQueries
 * @requires @tanstack/react-query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL, USERS_URL } from '../constants';

// Configure axios with credentials for secure authentication
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Critical for JWT cookie authentication
});

/**
 * Login Mutation
 * 
 * Authenticates user with email and password. On success, server sets
 * HTTP-only JWT cookie. User info should be stored in Redux for client state.
 * 
 * @returns {UseMutationResult} Mutation object for login operation
 * 
 * @example
 * const { mutate: login, isPending } = useLogin();
 * login({ email, password }, {
 *   onSuccess: (userData) => {
 *     dispatch(setCredentials(userData));
 *     navigate('/');
 *   },
 *   onError: (err) => toast.error(err.message)
 * });
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post(`${USERS_URL}/auth`, { email, password });
      return data;
    },
    onSuccess: () => {
      // Invalidate user profile cache to ensure fresh data
      queryClient.invalidateQueries(['user', 'profile']);
    },
  });
};

/**
 * Register Mutation
 * 
 * Creates a new user account. Automatically logs in the user upon
 * successful registration by setting JWT cookie.
 * 
 * @returns {UseMutationResult} Mutation object for registration
 * 
 * @example
 * const { mutate: register } = useRegister();
 * register({ name, email, password });
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      const { data } = await api.post(USERS_URL, { name, email, password });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user', 'profile']);
    },
  });
};

/**
 * Logout Mutation
 * 
 * Logs out the current user by clearing the JWT cookie on the server.
 * Clears ALL React Query caches to prevent data leakage between users.
 * 
 * IMPORTANT: Also clear Redux state and localStorage after calling this.
 * 
 * @returns {UseMutationResult} Mutation object for logout
 * 
 * @example
 * const { mutate: logout } = useLogout();
 * logout({}, {
 *   onSuccess: () => {
 *     dispatch(clearAuth());
 *     dispatch(clearCart());
 *     navigate('/login');
 *   }
 * });
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`${USERS_URL}/logout`);
      return data;
    },
    onSuccess: () => {
      // Critical: Clear all cached data to prevent data leakage
      queryClient.clear();
    },
  });
};

/**
 * Update User Profile Mutation
 * 
 * Allows authenticated users to update their profile information
 * including name, email, and password.
 * 
 * @returns {UseMutationResult} Mutation object for profile updates
 * 
 * @example
 * const { mutate: updateProfile } = useUpdateProfile();
 * updateProfile({ name, email, password });
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await api.put(`${USERS_URL}/profile`, userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user', 'profile']);
    },
  });
};

/**
 * Get All Users Query (Admin)
 * 
 * Fetches complete list of all users in the system.
 * Restricted to admin users only.
 * 
 * @returns {UseQueryResult} Query object with users array
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get(USERS_URL);
      return data;
    },
  });
};

/**
 * Get User Details Query (Admin)
 * 
 * Fetches detailed information for a specific user.
 * Used in admin panel for user editing.
 * 
 * @param {string} userId - The unique identifier of the user
 * @returns {UseQueryResult} Query object with user data
 */
export const useUserDetails = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await api.get(`${USERS_URL}/${userId}`);
      return data;
    },
    enabled: !!userId, // Only fetch when userId is provided
  });
};

/**
 * Delete User Mutation (Admin)
 * 
 * Permanently removes a user from the system.
 * Use with caution - this operation cannot be undone.
 * 
 * @returns {UseMutationResult} Mutation object for user deletion
 * 
 * @example
 * const { mutate: deleteUser } = useDeleteUser();
 * deleteUser(userId, {
 *   onSuccess: () => toast.success('User deleted')
 * });
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await api.delete(`${USERS_URL}/${userId}`);
      return data;
    },
    onSuccess: () => {
      // Refresh users list after deletion
      queryClient.invalidateQueries(['users']);
    },
  });
};

/**
 * Update User Mutation (Admin)
 * 
 * Allows admins to update user information including name, email,
 * and admin status. Cannot be used by non-admin users.
 * 
 * @returns {UseMutationResult} Mutation object for user updates
 * 
 * @example
 * const { mutate: updateUser } = useUpdateUser();
 * updateUser({ userId, name, email, isAdmin: true });
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, ...userData }) => {
      const { data } = await api.put(`${USERS_URL}/${userId}`, userData);
      return data;
    },
    // Update both the specific user and the users list
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['user', variables.userId]);
      queryClient.invalidateQueries(['users']);
    },
  });
};
