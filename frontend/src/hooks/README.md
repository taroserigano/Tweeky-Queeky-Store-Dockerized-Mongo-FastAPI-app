# React Query Custom Hooks

This directory contains all React Query hooks for managing server state in the application. Each hook follows React Query best practices and includes comprehensive documentation.

## 📚 Hook Files

### [`useOrderQueries.js`](./useOrderQueries.js)
Manages all order-related operations including creation, payment processing, and delivery status.

**Hooks:**
- `useCreateOrder` - Create new order
- `useOrderDetails` - Fetch order details
- `usePayOrder` - Process PayPal payment
- `usePayPalClientId` - Get PayPal configuration
- `useMyOrders` - Get current user's orders
- `useOrders` - Admin: Get all orders
- `useDeliverOrder` - Admin: Mark order delivered

### [`useProductQueries.js`](./useProductQueries.js)
Handles product catalog operations, reviews, and admin CRUD functionality.

**Hooks:**
- `useProducts` - Fetch products (with pagination & search)
- `useProductDetails` - Fetch single product
- `useTopProducts` - Get top-rated products
- `useCreateReview` - Submit product review
- `useCreateProduct` - Admin: Create product
- `useUpdateProduct` - Admin: Update product
- `useDeleteProduct` - Admin: Delete product
- `useUploadProductImage` - Admin: Upload image

### [`useUserQueries.js`](./useUserQueries.js)
Manages authentication and user account operations.

**Hooks:**
- `useLogin` - User authentication
- `useRegister` - User registration
- `useLogout` - User logout (with cache clearing)
- `useUpdateProfile` - Update user profile
- `useUsers` - Admin: Get all users
- `useUserDetails` - Admin: Get user details
- `useDeleteUser` - Admin: Delete user
- `useUpdateUser` - Admin: Update user

### [`index.js`](./index.js)
Barrel export file for clean imports throughout the application.

## 🎯 Usage Examples

### Simple Query

```javascript
import { useProducts } from '../hooks';

function ProductList() {
  const { data, isLoading, error } = useProducts('laptop', 1);
  
  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.message}</Message>;
  
  return <div>{data.products.map(product => ...)}</div>;
}
```

### Mutation with Callbacks

```javascript
import { useCreateOrder } from '../hooks';

function Checkout() {
  const { mutate: createOrder, isPending } = useCreateOrder();
  
  const handleSubmit = () => {
    createOrder(orderData, {
      onSuccess: (order) => {
        navigate(`/order/${order._id}`);
        toast.success('Order created!');
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };
  
  return <Button onClick={handleSubmit} disabled={isPending}>Place Order</Button>;
}
```

### Multiple Hooks

```javascript
import { useProductDetails, useCreateReview } from '../hooks';

function ProductScreen({ id }) {
  const { data: product, refetch } = useProductDetails(id);
  const { mutate: createReview } = useCreateReview();
  
  const handleReview = (rating, comment) => {
    createReview({ productId: id, rating, comment }, {
      onSuccess: () => refetch(),
    });
  };
  
  // ...
}
```

## 🔧 Configuration

All hooks use a shared axios instance configured in each file:

```javascript
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // Important for JWT cookies
});
```

## 📖 Documentation

Each hook includes:
- **JSDoc comments** - Full parameter and return type documentation
- **Usage examples** - Real-world implementation patterns
- **Error handling** - Proper error management examples
- **Cache strategies** - Explanation of invalidation logic

## 🎨 Patterns

### Query Keys
```javascript
['products']              // All products
['products', keyword]     // Filtered products
['product', id]           // Single product
['orders', 'mine']        // User's orders
['orders', 'all']         // All orders (admin)
```

### Cache Invalidation
```javascript
// After mutation, invalidate affected queries
onSuccess: () => {
  queryClient.invalidateQueries(['products']);
}
```

### Conditional Queries
```javascript
// Only fetch when ID is available
queryKey: ['product', productId],
enabled: !!productId,
```

## 🚀 Performance Tips

1. **Use specific query keys** - Enables granular caching
2. **Invalidate strategically** - Only affected queries
3. **Leverage staleTime** - Reduce unnecessary refetches
4. **Enable when ready** - Prevent premature queries

## 🐛 Debugging

Use React Query DevTools (available in development):
- View all active queries
- Inspect cached data
- Monitor refetch behavior
- See loading states

## 📝 Contributing

When adding new hooks:
1. Follow existing patterns
2. Add comprehensive JSDoc comments
3. Include usage examples
4. Export from `index.js`
5. Test with DevTools

---

**Built with React Query v5** - [Documentation](https://tanstack.com/query/latest)
