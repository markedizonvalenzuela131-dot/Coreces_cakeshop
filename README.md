# SweetCrumb Bakery - Cake Ordering System

A modern, full-featured cake ordering system built with React 18, TypeScript, Tailwind CSS, and ShadCN-inspired components.

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3 with custom design system
- **State Management**: Zustand with persistence
- **Routing**: React Router DOM 6
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts with custom theming
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **Date Handling**: date-fns

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Input, Card, Modal, Table, etc.)
│   ├── forms/           # Form components with React Hook Form integration
│   ├── layout/          # Layout components (Header, Footer, AdminLayout)
│   └── charts/          # Chart components (Line, Bar, Pie, Sparkline)
├── context/
│   ├── AuthContext.tsx  # Authentication state
│   ├── CartContext.tsx  # Shopping cart state
│   ├── NotificationContext.tsx # Toast & in-app notifications
│   └── UIContext.tsx    # Global UI state (modals, drawers, theme)
├── pages/
│   ├── customer/        # Customer-facing pages
│   │   ├── Home.tsx
│   │   ├── Catalog.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderSuccess.tsx
│   │   ├── Orders.tsx
│   │   ├── OrderDetail.tsx
│   │   └── Profile.tsx
│   ├── admin/           # Admin dashboard pages
│   │   ├── Dashboard.tsx
│   │   ├── Products.tsx
│   │   ├── ProductForm.tsx
│   │   ├── Orders.tsx
│   │   ├── Categories.tsx
│   │   ├── PickupSchedule.tsx
│   │   └── Analytics.tsx
│   └── auth/            # Authentication pages
│       ├── Login.tsx
│       └── Register.tsx
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions & constants
├── database/
│   ├── adapters/        # Database adapter interface & implementations
│   └── schemas/         # Database schemas & migrations
└── styles/              # Global styles & Tailwind imports
```

## 🎨 Design System

### Color Palette
- **Primary**: Warm coral/orange (`#EC7A4E`) - CTAs, highlights
- **Secondary**: Sage green (`#4D854D`) - Success, secondary actions
- **Accent**: Rose pink (`#FF4A6F`) - Promotions, accents
- **Neutral**: Cream/warm grays for backgrounds
- **Dark Mode**: Fully supported with tailored palette

### Typography
- **Display**: Playfair Display (elegant serif for headlines)
- **Body**: DM Sans (clean, readable sans-serif)
- **Mono**: JetBrains Mono (code, prices)

### Spacing & Layout
- Consistent 4px base unit
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Container max-width: 80rem (1280px)

## ✨ Features

### Customer Features
- 🏠 **Home Page**: Hero, features, categories, featured products, testimonials, newsletter
- 🛍️ **Product Catalog**: Search, filter by category/availability, sort, grid/list view, pagination
- 🎂 **Product Detail**: Image gallery, specs, reviews, add to cart, quantity selector
- 🛒 **Shopping Cart**: Persistent cart, quantity updates, promo codes, order summary
- 💳 **Checkout**: Multi-step (Contact → Pickup → Address → Review), form validation
- ✅ **Order Success**: Confirmation, details, pickup info, share, reorder
- 📦 **My Orders**: Order history, filtering, status tracking, detail view
- 👤 **Profile**: Personal info, password change, notifications, saved addresses

### Admin Features
- 📊 **Dashboard**: Revenue stats, recent orders, top products, low stock alerts, pending pickups
- 🎂 **Products Management**: CRUD, search/filter, grid/table view, image upload preview
- 📝 **Product Form**: Create/edit with validation, image upload, SEO fields, live preview
- 📋 **Orders Management**: Table with sorting/filtering, status updates, detail modal
- 🏷️ **Categories**: CRUD, drag-to-reorder, product counts
- 📅 **Pickup Schedule**: Calendar & list views, bulk create, capacity tracking
- 📈 **Analytics**: Revenue trends, orders by status, category breakdown, top products, weekly comparison

### Technical Features
- 🔐 **Authentication**: Login/register with demo credentials, role-based routing
- 🛒 **Persistent Cart**: Zustand + localStorage persistence
- 🔔 **Notifications**: Toast system (Sonner) + in-app notification center
- 🌙 **Dark Mode**: System-aware with manual toggle, persisted preference
- ♿ **Accessibility**: ARIA labels, keyboard navigation, focus management, color contrast
- 📱 **Responsive**: Mobile-first, works on all screen sizes
- 🎭 **Animations**: Smooth transitions, reduced motion support
- 📦 **Code Splitting**: Lazy-loaded pages with Suspense boundaries

## 🗄️ Database Integration

The project includes a complete database abstraction layer in `src/database/`:

- **Adapters**: Interface for PostgreSQL, MySQL, SQLite, Supabase, Firebase, Prisma, Drizzle
- **Schemas**: Complete table definitions with relationships, indexes, seed data
- **Migrations**: Ready-to-run SQL for PostgreSQL, MySQL, SQLite
- **Repositories**: Type-safe repository pattern for all entities

To connect your database:
1. Choose your database type
2. Implement the `DatabaseAdapter` interface
3. Configure in `src/config/database.ts`
4. Create repository implementations in `src/database/repositories/`

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

### Demo Credentials
- **Customer**: `demo` / `demo123`
- **Admin**: `admin` / `admin123`

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| react, react-dom | Core React |
| react-router-dom | Routing |
| zustand | State management |
| react-hook-form | Form handling |
| @hookform/resolvers/zod | Zod validation |
| tailwindcss | Styling |
| recharts | Charts |
| lucide-react | Icons |
| sonner | Toast notifications |
| date-fns | Date formatting |
| clsx, tailwind-merge | Class utilities |

## 🎯 Customization

### Adding New Pages
1. Create page component in `src/pages/customer/` or `src/pages/admin/`
2. Add route in `src/App.tsx`
3. Export from respective index.ts

### Extending Database
1. Add types to `src/types/index.ts`
2. Update schemas in `src/database/schemas/index.ts`
3. Create repository in `src/database/repositories/`
4. Implement adapter methods

### Theming
Modify `tailwind.config.js`:
- Colors: `theme.extend.colors`
- Fonts: `theme.extend.fontFamily`
- Spacing: `theme.extend.spacing`
- Breakpoints: `theme.screens`

## 📝 License

MIT License - Feel free to use for your bakery business!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

Built with ❤️ for SweetCrumb Bakery