# 📖 Foodie Bar - User Manual

Welcome to **Foodie Bar**! This guide will help you navigate the app and place your first order.

---

## 🎯 Table of Contents
1. [Getting Started](#getting-started)
2. [Creating an Account](#creating-an-account)
3. [Logging In](#logging-in)
4. [Browsing the Menu](#browsing-the-menu)
5. [Adding Items to Cart](#adding-items-to-cart)
6. [Managing Your Cart](#managing-your-cart)
7. [Placing an Order](#placing-an-order)
8. [Viewing Order History](#viewing-order-history)
9. [Logging Out](#logging-out)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Accessing the App
- Open your web browser
- Navigate to: **[Your Vercel URL]** or **http://localhost:3000** (for local)
- You'll see the home page with a beautiful carousel and food categories

---

## 👤 Creating an Account

1. Click the **SignUp** button in the top-right corner
2. Fill in the registration form:
   - **Name**: Enter your full name (minimum 5 characters)
   - **Email**: Enter a valid email address
   - **Password**: Create a strong password (minimum 5 characters)
   - **Address**: Enter your delivery address
3. Click **Submit**
4. You'll see a confirmation message: "User created successfully"
5. Click **Already a User** to go to the login page

---

## 🔐 Logging In

1. Click the **Login** button in the navigation bar
2. Enter your credentials:
   - **Email**: The email you registered with
   - **Password**: Your password
3. Click **Submit**
4. If successful, you'll be redirected to the home page
5. You'll now see additional menu items: **My Orders** and **Cart**

**Note**: If you see "Enter Valid credentials", double-check your email and password.

---

## 🍕 Browsing the Menu

### View Categories
Scroll down to see all food categories:
- 🍔 Gourmet Burgers
- 🍕 Artisan Pizza
- 🥗 Vegetarian Creations
- 🥙 Refined Salads
- 🥩 Low Carb Plates
- 🍤 Elegant Appetizers
- 🍝 Chef's Signature Mains
- 🍰 Signature Desserts
- 🥤 Premium Beverages

### Search for Food
1. Use the search bar at the top of the carousel
2. Type the name of a dish (e.g., "burger", "pizza", "salad")
3. Results will filter automatically as you type

### View Item Details
Each food card shows:
- **Image**: High-quality photo of the dish
- **Name**: Dish title
- **Description**: Brief description
- **Price**: Varies by size
- **Quantity selector**: Choose how many portions
- **Size selector**: Select your preferred size

---

## 🛒 Adding Items to Cart

1. Find an item you want to order
2. **Select Quantity**: Use the dropdown (1-6 portions)
3. **Select Size**: Choose from available sizes (e.g., Small, Large, Regular)
4. **View Price**: Price updates based on quantity and size
5. Click **Add to Cart**
6. A badge on the **Cart** icon will show total items

**Example:**
- Select "2" portions
- Select "Large" size
- Price shows: R249
- Click "Add to Cart"
- Cart badge updates from 0 to 1

---

## 🧺 Managing Your Cart

### View Cart
1. Click the **Cart** button in the navigation bar
2. You'll see all items you've added

### Cart Page Features
- **Item List**: All items with images, names, sizes
- **Quantity**: Number of portions per item
- **Price**: Individual and total prices
- **Order Summary**: 
  - Total items count
  - Grand total in Rands (R)
- **Delete Items**: Click the trash icon to remove items

### Edit Items
To change quantity or size:
1. Remove the item from cart (trash icon)
2. Go back to menu
3. Add the item again with new settings

---

## 💳 Placing an Order

1. Click **Proceed to Checkout** in your cart
2. Review your order on the Payment page:
   - All items listed with quantities
   - Total amount displayed
3. Click **Pay Now**
4. Wait for processing (mock payment, 1-2 seconds)
5. You'll be redirected to the **Receipt** page showing:
   - Order confirmation
   - Order date
   - Total paid
6. Click **Back to Home** to continue shopping

**Note**: This is a mock payment system. In production, this would integrate with Stripe, PayPal, or other payment gateways.

---

## 📦 Viewing Order History

1. Click **My Orders** in the navigation bar
2. You'll see all your past orders organized by date
3. Each order shows:
   - **Order Date**: When the order was placed
   - **Items Ordered**: 
     - Name of each dish
     - Quantity
     - Size
     - Price
   - **Item Images**: Photos of each dish

### Understanding Your Order History
- Orders are displayed in **reverse chronological order** (newest first)
- Each order is grouped by date
- Multiple items from the same order are shown together

---

## 🚪 Logging Out

1. Click the **Logout** button in the navigation bar (top-right)
2. You'll be redirected to the login page
3. Your cart will be cleared
4. You'll need to log in again to access protected features

---

## 🛠️ Troubleshooting

### Can't Log In
- ✅ Check your email and password are correct
- ✅ Ensure you've created an account first
- ✅ Try resetting your password (contact admin)

### Items Not Loading
- ✅ Refresh the page
- ✅ Check your internet connection
- ✅ Clear browser cache and cookies

### Cart Is Empty After Adding Items
- ✅ Ensure you're logged in
- ✅ Make sure you selected a size before clicking "Add to Cart"
- ✅ Check browser console for errors (F12 → Console tab)

### Payment Not Working
- ✅ Ensure cart has items
- ✅ Check that backend server is running
- ✅ Verify you're logged in

### Orders Not Showing
- ✅ Make sure you completed the checkout process
- ✅ Check that you're viewing the correct account
- ✅ Refresh the My Orders page

### Images Not Loading
- ✅ Check your internet connection
- ✅ Images are loaded from Unsplash CDN
- ✅ Try a different browser

---

## 📱 Mobile Usage

The app is fully responsive:
- **Navigation**: Tap the hamburger menu (☰) for navigation on small screens
- **Carousel**: Swipe left/right to view slides
- **Cart**: Scrollable on mobile devices
- **Forms**: Optimized for mobile keyboards

---

## 🔒 Security & Privacy

- **Passwords**: Securely hashed using bcrypt
- **Authentication**: JWT tokens stored in browser localStorage
- **Data**: Your orders and profile are private
- **HTTPS**: Always use secure connections in production

---

## 💡 Pro Tips

1. **Search Smart**: Use the search bar to find dishes quickly
2. **Compare Prices**: Different sizes have different value propositions
3. **Add Multiple Items**: Build your cart before checkout to save time
4. **Save Favorites**: Remember dishes you like for faster reordering
5. **Check Order History**: Review past orders to reorder favorites

---

## 📞 Support

Need help? Contact us:
- **Email**: support@foodiebar.com
- **GitHub Issues**: [Report a Bug](https://github.com/yonelajongola/codespaces-react/issues)

---

## 🎉 Enjoy Your Meal!

Thank you for choosing **Foodie Bar**. We hope you enjoy your dining experience!

**Happy Ordering! 🍽️**

---

*Last Updated: February 2026*
