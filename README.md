# Health E-Commerce Frontend

A modern, full-featured e-commerce frontend application for health products built with Vue 3, Vite, and Pinia.

## Features

### Customer Features
- User registration and authentication
- Browse and search products by category
- Product detail pages with customer reviews
- Shopping cart management
- Secure checkout with multiple payment methods
- Order history and tracking
- Submit product reviews and ratings

### Admin Features
- Admin dashboard with comprehensive management tools
- Product management (create, update, delete)
- Order management and status updates
- User management
- Generate reports (PDF/CSV) with date filtering

## Tech Stack

- Vue 3 with Composition API
- Vue Router for navigation
- Pinia for state management
- Vite for build tooling
- Modern CSS with gradients and animations

## Project Setup

```sh
npm install
```

### Environment Configuration

The backend API URL is configured in `.env`:

```
VITE_API_BASE_URL=http://localhost:8080
```

Make sure your backend server is running on port 8080.

### Development

```sh
npm run dev
```

The dev server will start on `http://localhost:5173` with API proxy configured.

### Production Build

```sh
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable components
│   └── AppHeader.vue # Main navigation header
├── services/         # API service layer
│   └── api.js        # Backend communication
├── stores/           # Pinia state management
│   ├── auth.js       # Authentication state
│   ├── cart.js       # Shopping cart state
│   └── products.js   # Products and categories state
├── views/            # Page components
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── ProductsView.vue
│   ├── ProductDetailView.vue
│   ├── CartView.vue
│   ├── CheckoutView.vue
│   ├── OrdersView.vue
│   └── AdminView.vue
├── router/           # Route configuration
│   └── index.js
├── App.vue           # Root component
└── main.js           # Application entry point
```

## User Roles

### Customer
- Browse and purchase products
- Manage shopping cart
- Place and track orders
- Submit product reviews

### Admin
- Full access to customer features
- Product and category management
- Order status management
- User management
- Report generation

## API Integration

The application integrates with a Go backend API. See `api.md` for complete API documentation.

Key endpoints:
- `/auth/*` - Authentication
- `/api/products` - Product catalog
- `/cart/*` - Shopping cart
- `/orders/*` - Order management
- `/admin/*` - Admin operations
- `/feedback/*` - Product reviews

## Authentication

- JWT-based authentication
- Token stored in localStorage
- Route guards for protected pages
- Auto-redirect based on user role

## Design Features

- Clean, modern UI with gradient accents
- Responsive design for all screen sizes
- Smooth transitions and hover effects
- Professional color scheme
- Intuitive navigation
- Loading states and error handling
