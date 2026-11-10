# Security Specification - HEAVENS WELLNESS

## Data Invariants
- A Product must have a name, price, and stock.
- An Order must be linked to a valid User ID.
- Only Admins can create, update, or delete products.
- Customers can only read their own orders.
- Only the user with the `saifalimansuri92@gmail.com` email is the initial Admin.

## The Dirty Dozen Payloads
1. **Unauthorized Product Create**: A non-admin trying to add a new chocolate.
2. **Product Price Hijack**: A non-admin trying to change the price of a product.
3. **Order Spoofing**: User A trying to create an order for User B.
4. **Order Read Leak**: User A trying to read User B's order.
5. **Role Escalation**: A customer trying to change their role to 'admin' in their profile.
6. **Stock Manipulation**: A customer trying to decrease stock directly without an order.
7. **Invalid Pincode**: Shipping address with a 20-character pincode (should be limited).
8. **Negative Price**: Creating a product with a negative price.
9. **Orphaned Order**: Creating an order for a product ID that doesn't exist.
10. **Admin Bypass**: Trying to delete a product by guessing the ID.
11. **Massive Payload**: Sending a 1MB string in the product description.
12. **Status Skipping**: A customer trying to mark their order as 'Delivered' manually.

## Test Runner (Draft)
The tests will verify that all the above payloads return PERMISSION_DENIED.
