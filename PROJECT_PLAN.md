# MLM Ecommerce Platform - Project Plan

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| State Management | Zustand + TanStack Query (React Query) |
| Backend | FastAPI (Python 3.11+) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | Razorpay (Test Mode → Live) |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |
| File Storage | Supabase Storage |

---

## Project Structure

```
MLM-EComm/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI entry point
│   │   ├── config.py          # Settings & env vars
│   │   ├── database.py        # Supabase client setup
│   │   ├── models/            # Pydantic schemas
│   │   ├── routers/           # API route handlers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Auth, CORS, rate limiting
│   │   └── utils/             # Helpers (commission calc, matrix)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API client functions
│   │   ├── store/             # Zustand stores
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
└── supabase/
    ├── migrations/            # SQL migration files
    └── seed.sql               # Initial data
```

---

## Database Schema (Supabase)

### Core Tables

**1. users** (extends Supabase auth.users)
```
id (uuid, PK) - references auth.users
email
phone
full_name
role (enum: super_admin, admin, distributor, customer)
sponsor_id (uuid, FK -> users) - who referred this user
referral_code (varchar, unique)
status (enum: active, suspended, pending)
created_at
updated_at
```

**2. profiles**
```
user_id (uuid, PK, FK -> users)
pv_balance (decimal)
current_rank (varchar)
total_earnings (decimal)
wallet_balance (decimal)
joined_at
```

**3. matrix_positions**
```
id (uuid, PK)
user_id (uuid, FK -> users)
sponsor_id (uuid, FK -> users)
level (int) - 0 to 4
position (int) - 1 to 4 (slot in parent's 4 slots)
parent_id (uuid, FK -> matrix_positions)
created_at
```

**4. ranks**
```
id (uuid, PK)
name (varchar)
required_pv (decimal)
required_direct_referrals (int)
benefits (jsonb)
is_active (boolean)
```

**5. categories**
```
id (uuid, PK)
name
slug (unique)
parent_id (FK -> categories) - for subcategories
image
gst_rate (decimal) - e.g., 0, 5, 12, 18, 28
shipping_rate (decimal) - per category shipping cost
is_active (boolean)
created_at
```

**6. products**
```
id (uuid, PK)
name
slug (unique)
description
category_id (FK -> categories)
base_price (decimal) - default price if no variants
base_mrp (decimal)
base_pv (decimal) - Point Value
has_variants (boolean) - true if product has size/color variants
images (text[])
is_active (boolean)
created_at
updated_at
```

**7. product_variants**
```
id (uuid, PK)
product_id (FK -> products)
sku (varchar, unique)
size (varchar) - e.g., S, M, L, XL, or null
color (varchar) - e.g., Red, Blue, or null
other_attributes (jsonb) - e.g., {"storage": "128GB", "ram": "8GB"}
price (decimal) - variant-specific price (overrides base_price)
mrp (decimal) - variant-specific MRP
pv (decimal) - variant-specific PV
stock_quantity (int) - variant-specific stock
is_active (boolean)
created_at
```

**8. cart_items**
```
id (uuid, PK)
user_id (FK -> users)
product_id (FK -> products)
variant_id (FK -> product_variants, nullable) - null if product has no variants
quantity (int)
created_at
```

**9. orders**
```
id (uuid, PK)
user_id (FK -> users)
order_number (varchar, unique)
subtotal (decimal)
gst_amount (decimal)
shipping_amount (decimal)
total_amount (decimal)
status (enum: pending, confirmed, processing, shipped, delivered, cancelled, returned)
payment_status (enum: pending, paid, failed, refunded)
payment_method (varchar)
razorpay_order_id
razorpay_payment_id
shipping_address_id (FK -> addresses)
created_at
updated_at
```

**10. order_items**
```
id (uuid, PK)
order_id (FK -> orders)
product_id (FK -> products)
variant_id (FK -> product_variants, nullable)
quantity (int)
unit_price (decimal)
mrp (decimal)
pv (decimal)
gst_rate (decimal) - from category at time of order
gst_amount (decimal)
total (decimal)
variant_details (jsonb) - snapshot of size/color at purchase
```

**11. addresses**
```
id (uuid, PK)
user_id (FK -> users)
full_name
phone
address_line1
address_line2
city
state
pincode
is_default (boolean)
created_at
```

**12. commissions**
```
id (uuid, PK)
user_id (FK -> users) - recipient
from_order_id (FK -> orders)
type (enum: direct_referral, level_1, level_2, level_3, level_4)
amount (decimal)
pv_earned (decimal)
status (enum: pending, credited, reversed)
created_at
credited_at
```

**12. commission_settings**
```
id (uuid, PK)
direct_referral_percent (decimal) - default: 10
level_1_percent (decimal) - default: 5
level_2_percent (decimal) - default: 3
level_3_percent (decimal) - default: 2
level_4_percent (decimal) - default: 1
updated_by (FK -> users)
updated_at
```

**14. wallet_transactions**
```
id (uuid, PK)
user_id (FK -> users)
type (enum: commission_credit, withdrawal, reversal, bonus)
amount (decimal)
balance_before (decimal)
balance_after (decimal)
reference_id (varchar) - order/commission ID
status (enum: pending, completed, failed)
created_at
```

**15. withdrawals**
```
id (uuid, PK)
user_id (FK -> users)
amount (decimal)
method (enum: bank_transfer, upi)
bank_name
account_number
ifsc_code
upi_id
status (enum: pending, approved, rejected, completed)
admin_notes
requested_at
processed_at
```

**16. rank_settings**
```
id (uuid, PK)
rank_name
required_pv
required_direct_referrals
commission_multiplier (decimal)
is_active
```

---

## Commission Structure (Default - Admin Configurable)

| Type | Percentage | Description |
|------|-----------|-------------|
| Direct Referral | 10% | On direct referral's order value |
| Level 1 | 5% | On sponsor's sponsor's order |
| Level 2 | 3% | On 3rd level upline |
| Level 3 | 2% | On 4th level upline |
| Level 4 | 1% | On 5th level upline |

**Commission triggers:** On order payment confirmation (status = paid)
**PV earned:** Equal to product PV on qualifying orders

---

## Rank System (Default - Admin Configurable)

| Rank | Required PV | Direct Referrals | Benefit |
|------|------------|------------------|---------|
| Starter | 0 | 0 | Base commissions |
| Bronze | 500 | 3 | 1.1x commission multiplier |
| Silver | 2000 | 5 | 1.25x commission multiplier |
| Gold | 5000 | 10 | 1.5x commission multiplier |
| Diamond | 15000 | 15 | 2x commission multiplier + pool bonus |

---

## Product Categories (with GST & Shipping)

| Category | GST Rate | Shipping Rate | Variants |
|----------|----------|---------------|----------|
| Mobile & Electronics | 18% | ₹50 | Storage/Color |
| Clothes | 5-12% | ₹40 | Size/Color |
| Shoes & Footwear | 12% | ₹50 | Size/Color |
| Groceries | 0-5% | ₹30 | Weight/Unit |
| Cleaning Products | 18% | ₹40 | Size/Pack |
| Home Products | 18% | ₹60 | Size/Color |

*All rates configurable by superadmin*

---

## Matrix Logic (4x4, 4 Levels Deep)

```
Level 0: Sponsor (root)
Level 1: 4 slots (positions 1-4)
Level 2: 16 slots (4 per L1 user)
Level 3: 64 slots (4 per L2 user)
Level 4: 256 slots (4 per L3 user)
Total per tree: 285 positions
```

**Placement Algorithm:**
1. New user placed under sponsor's tree
2. BFS (breadth-first) search for first empty slot
3. Fills left-to-right, top-to-bottom
4. If sponsor's tree is full → spillover to sponsor's upline
5. Spillover finds nearest upline with empty slot

---

## API Endpoints

### Auth
- `POST /auth/register` - Register with optional referral code
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/forgot-password` - Password reset
- `GET /auth/me` - Get current user

### Users
- `GET /users/profile` - Get own profile
- `PUT /users/profile` - Update profile
- `GET /users/referrals` - Get direct referrals list
- `GET /users/downline` - Get full downline tree
- `GET /users/matrix` - Get matrix position view

### Products
- `GET /products` - List products (with filters, pagination, category)
- `GET /products/{id}` - Product detail (with variants)
- `POST /products` - Create (admin)
- `PUT /products/{id}` - Update (admin)
- `DELETE /products/{id}` - Delete (admin)

### Product Variants
- `GET /products/{id}/variants` - List variants
- `POST /products/{id}/variants` - Create variant (admin)
- `PUT /variants/{id}` - Update variant (admin)
- `DELETE /variants/{id}` - Delete variant (admin)

### Categories
- `GET /categories` - List categories (with GST & shipping rates)
- `POST /categories` - Create (admin)
- `PUT /categories/{id}` - Update (admin)
- `PUT /categories/{id}/gst` - Update GST rate (admin)
- `PUT /categories/{id}/shipping` - Update shipping rate (admin)

### Cart
- `GET /cart` - Get cart
- `POST /cart/items` - Add to cart
- `PUT /cart/items/{id}` - Update quantity
- `DELETE /cart/items/{id}` - Remove from cart
- `DELETE /cart` - Clear cart

### Orders
- `POST /orders` - Create order (checkout)
- `GET /orders` - List user orders
- `GET /orders/{id}` - Order detail
- `POST /orders/{id}/cancel` - Cancel order
- `GET /orders/admin` - List all orders (admin)
- `PUT /orders/{id}/status` - Update status (admin)

### Payments
- `POST /payments/create-order` - Create Razorpay order
- `POST /payments/verify` - Verify payment
- `POST /payments/webhook` - Razorpay webhook handler

### Wallet
- `GET /wallet/balance` - Get wallet balance
- `GET /wallet/transactions` - Transaction history
- `POST /wallet/withdraw` - Request withdrawal
- `GET /wallet/withdrawals` - List withdrawals
- `GET /wallet/withdrawals/admin` - List all (admin)
- `PUT /wallet/withdrawals/{id}/approve` - Approve (admin)
- `PUT /wallet/withdrawals/{id}/reject` - Reject (admin)

### Commissions
- `GET /commissions` - User's commission history
- `GET /commissions/admin` - All commissions (admin)

### Admin
- `GET /admin/dashboard` - Dashboard stats
- `GET /admin/users` - List all users
- `PUT /admin/users/{id}/role` - Change role
- `PUT /admin/users/{id}/status` - Suspend/activate
- `GET /admin/settings` - Get settings
- `PUT /admin/settings/commissions` - Update commission %
- `PUT /admin/settings/ranks` - Update rank settings
- `GET /admin/reports/sales` - Sales report
- `GET /admin/reports/commissions` - Commission report

---

## Frontend Pages

### Public
- `/` - Home (featured products, about MLM plan)
- `/products` - Product listing
- `/products/:slug` - Product detail
- `/cart` - Shopping cart
- `/login` - Login
- `/register` - Registration (with referral code)
- `/forgot-password` - Password reset

### User Dashboard (Distributor/Customer)
- `/dashboard` - Overview (PV, rank, wallet balance)
- `/dashboard/orders` - Order history
- `/dashboard/orders/:id` - Order detail
- `/dashboard/wallet` - Wallet balance & transactions
- `/dashboard/wallet/withdraw` - Request withdrawal
- `/dashboard/downline` - Matrix view (tree visualization)
- `/dashboard/referrals` - Direct referrals list
- `/dashboard/commissions` - Commission history
- `/dashboard/profile` - Profile settings
- `/dashboard/addresses` - Address management

### Admin Dashboard
- `/admin` - Dashboard (stats, charts)
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/withdrawals` - Withdrawal approvals
- `/admin/settings` - Commission & rank settings
- `/admin/reports` - Reports & analytics

---

## Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Set up project structure
- [ ] Configure Supabase (project, tables, RLS policies)
- [ ] Set up FastAPI with basic routes
- [ ] Set up React + Vite + Tailwind
- [ ] Implement Supabase Auth integration
- [ ] Role-based access control middleware

### Phase 2: Products & Catalog (Week 2-3)
- [ ] Product CRUD APIs
- [ ] Category management
- [ ] Product listing with filters
- [ ] Product detail page
- [ ] Admin product management UI

### Phase 3: Cart & Checkout (Week 3-4)
- [ ] Cart management APIs
- [ ] Cart UI (add, update, remove)
- [ ] Address management
- [ ] Order creation flow
- [ ] GST calculation
- [ ] Order confirmation

### Phase 4: Payment Integration (Week 4)
- [ ] Razorpay integration (test mode)
- [ ] Payment verification
- [ ] Webhook handling
- [ ] Order status updates on payment

### Phase 5: MLM System (Week 5-6)
- [ ] Matrix placement algorithm
- [ ] Registration with referral code
- [ ] Auto-fill + spillover logic
- [ ] Downline tree API
- [ ] Matrix visualization UI

### Phase 6: Commissions & Wallet (Week 6-7)
- [ ] Commission calculation engine
- [ ] Commission distribution on payment
- [ ] Wallet system
- [ ] Withdrawal requests
- [ ] Admin withdrawal approval
- [ ] Commission & rank settings (admin)

### Phase 7: Dashboards & Polish (Week 7-8)
- [ ] User dashboard
- [ ] Admin dashboard
- [ ] Reports (minimal)
- [ ] Mobile responsive testing
- [ ] Error handling & loading states
- [ ] Deployment (Vercel + Railway)

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=supabase_connection_string
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
JWT_SECRET=
ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_RAZORPAY_KEY_ID=
```

---

## Key Business Rules

1. **Registration:** Open signup, optional referral code. If referral code provided, user placed in referrer's matrix tree.
2. **Commission Eligibility:** Only users with role = "distributor" earn commissions.
3. **Commission Trigger:** Only on paid orders (not cancelled/refunded).
4. **Reversal:** If order cancelled/refunded, commissions reversed.
5. **GST:** Configurable per category (e.g., groceries 0/5%, clothes 5/12%, electronics 18%). Applied at checkout from category rate.
6. **Shipping:** Configurable per category. Total shipping = sum of (category shipping rate × items from that category).
7. **Product Variants:** Products like clothes/shoes have size/color variants with separate stock, price, PV. Simple products (groceries, electronics) may have no variants.
8. **Withdrawal:** Min withdrawal amount (configurable), admin approval required. Bank transfer or UPI.
9. **PV:** Earned on own purchases + qualifying downline purchases. Used for rank qualification.
10. **Rank Auto-Update:** Checked periodically or on PV-earning events.
11. **Inventory:** Tracked per variant (if applicable) or per product (if no variants). Stock reduced on order confirmation.

---

## Security Considerations

- Supabase RLS policies on all tables
- JWT validation on all API routes
- Role-based middleware for admin routes
- Razorpay webhook signature verification
- Rate limiting on auth endpoints
- Input validation with Pydantic
- CORS configuration for Vercel domain
