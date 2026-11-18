# SweetCrumb Bakery - Refactoring Plan

## Overview
Comprehensive code quality improvements and reorganization based on full codebase analysis.

## Key Issues Identified

### 1. **Mock Data Duplication** (Critical)
- Orders mock data duplicated in: `src/pages/admin/Orders.tsx`, `src/pages/customer/Orders.tsx`, `src/pages/customer/OrderDetail.tsx`, `src/pages/customer/OrderSuccess.tsx`
- Categories mock data duplicated in: `src/pages/admin/Categories.tsx`, `src/pages/admin/ProductForm.tsx`
- Products mock data scattered across: `src/pages/customer/Catalog.tsx`, `src/pages/customer/ProductDetail.tsx`, `src/pages/admin/Products.tsx`, `src/pages/admin/ProductForm.tsx`
- Pickup schedules duplicated in: `src/pages/admin/PickupSchedule.tsx`, `src/pages/customer/Checkout.tsx`

### 2. **Inconsistent Import Patterns**
- Mixed `@/` alias vs relative imports
- Some components import from `./ui` while others from `@/components/ui`
- Missing centralized exports

### 3. **Large Page Components** (Code Organization)
- Pages contain 400-700+ lines with inline mock data, types, and logic
- Business logic mixed with presentation
- No custom hooks for data fetching/filtering

### 4. **Type Safety Gaps**
- `any` types used extensively in page components
- Missing proper TypeScript interfaces for mock data
- Utility functions duplicated (formatTime in 5+ files)

### 5. **Missing Infrastructure**
- No Error Boundaries
- No central API service layer
- No React Query / SWR for data fetching
- No centralized notification/toast service usage (mixed sonner + custom)

### 6. **Component Quality Issues**
- Inline SVG icons scattered (should use Lucide consistently)
- Some components have encoding issues (weird characters in Orders.tsx)
- Inconsistent prop interfaces

### 7. **Database Layer**
- Repository interfaces defined but no implementations
- InMemoryAdapter is good but not used anywhere
- No connection to actual state management

---

## Refactoring Phases

### Phase 1: Foundation & Shared Utilities ✅ HIGH PRIORITY
1. Create centralized mock data service (`src/data/mockData.ts`)
2. Create shared constants & utilities (`src/lib/`)
3. Fix encoding issues in files
4. Create proper TypeScript interfaces for all mock data
5. Centralize formatTime, formatCurrency utilities

### Phase 2: Custom Hooks & Data Layer ✅ HIGH PRIORITY
1. Create custom hooks for:
   - `useOrders` - filtering, sorting, pagination
   - `useProducts` - filtering, search, categories
   - `useCategories` - CRUD operations
   - `usePickupSchedules` - calendar/list views
2. Create repository implementations using InMemoryAdapter
3. Connect Zustand stores to repository layer

### Phase 3: Component Refactoring ✅ HIGH PRIORITY
1. Extract inline components from pages (StatSummary, OrderDetailModal, StatusUpdateModal, etc.)
2. Create reusable table column factories
3. Standardize modal patterns
4. Fix inline SVG → Lucide icons

### Phase 4: Page Simplification ✅ MEDIUM PRIORITY
1. Reduce page components to <200 lines each
2. Move all mock data to centralized service
3. Use custom hooks for all data logic
4. Add proper loading/error states

### Phase 5: Developer Experience ✅ MEDIUM PRIORITY
1. Add Error Boundaries
2. Centralize API service layer
3. Add proper barrel exports
4. Improve TypeScript strictness
5. Add component documentation

---

## File Structure After Refactoring

```
src/
├── data/
│   ├── mockData.ts           # All mock data centralized
│   ├── mockData.types.ts     # TypeScript interfaces for mock data
│   └── index.ts
├── lib/
│   ├── utils.ts              # Shared utilities (formatTime, etc.)
│   ├── constants.ts          # Re-export from utils/constants
│   ├── api.ts                # Central API service
│   └── validators.ts         # Shared Zod schemas
├── hooks/
│   ├── useOrders.ts
│   ├── useProducts.ts
│   ├── useCategories.ts
│   ├── usePickupSchedules.ts
│   ├── useCart.ts
│   ├── useAuth.ts
│   └── index.ts
├── repositories/
│   ├── CustomerRepository.ts
│   ├── ProductRepository.ts
│   ├── OrderRepository.ts
│   ├── CategoryRepository.ts
│   ├── PickupScheduleRepository.ts
│   └── index.ts
├── components/
│   ├── ui/                   # Existing - keep
│   ├── charts/               # Existing - keep
│   ├── forms/                # Existing - keep
│   ├── layout/               # Existing - keep
│   ├── orders/               # NEW - OrderDetailModal, OrderTable, etc.
│   ├── products/             # NEW - ProductCard, ProductTable, etc.
│   ├── categories/           # NEW - CategoryTable, CategoryForm
│   ├── pickup/               # NEW - PickupCalendar, PickupList
│   └── common/               # NEW - StatCard, DataTable, EmptyState
├── pages/
│   ├── customer/             # Simplified pages
│   └── admin/                # Simplified pages
└── context/                  # Existing - enhance with repository integration
```

---

## Implementation Order

1. **Fix encoding issues** in Orders.tsx and any other files
2. **Create mockData service** with all mock data + TypeScript types
3. **Create shared utilities** (lib/utils.ts)
4. **Create custom hooks** for data operations
5. **Create repository implementations** using InMemoryAdapter
6. **Extract components** from large pages
7. **Simplify pages** using hooks + components
8. **Add Error Boundaries** and API layer
9. **Verify** all pages still work correctly