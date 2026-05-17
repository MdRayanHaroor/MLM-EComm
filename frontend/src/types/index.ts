export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  role: 'super_admin' | 'admin' | 'distributor' | 'customer'
  referral_code: string
  sponsor_id: string | null
  status: 'active' | 'suspended' | 'pending'
  created_at: string
}

export interface Profile {
  user_id: string
  pv_balance: number
  current_rank: string
  total_earnings: number
  wallet_balance: number
  joined_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  gst_rate: number
  shipping_rate: number
  image: string | null
  is_active: boolean
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string
  size: string | null
  color: string | null
  other_attributes: Record<string, unknown> | null
  price: number
  mrp: number
  pv: number
  stock_quantity: number
  is_active: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category_id: string
  base_price: number
  base_mrp: number
  base_pv: number
  has_variants: boolean
  images: string[]
  is_active: boolean
  categories?: Category
  variants?: ProductVariant[]
}

export interface CartItem {
  id: string
  product_id: string
  variant_id: string | null
  quantity: number
  product_name: string | null
  price: number | null
  pv: number | null
  image: string | null
}

export interface Address {
  id: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  pincode: string
  is_default: boolean
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  subtotal: number
  gst_amount: number
  shipping_amount: number
  total_amount: number
  status: string
  payment_status: string
  payment_method: string | null
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  shipping_address_id: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  product_id: string
  variant_id: string | null
  quantity: number
  unit_price: number
  mrp: number
  pv: number
  gst_rate: number
  gst_amount: number
  total: number
  variant_details: Record<string, unknown> | null
}

export interface Commission {
  id: string
  user_id: string
  from_order_id: string
  type: string
  amount: number
  pv_earned: number
  status: string
  created_at: string
}

export interface WalletTransaction {
  id: string
  type: string
  amount: number
  balance_before: number
  balance_after: number
  reference_id: string | null
  status: string
  created_at: string
}

export interface Withdrawal {
  id: string
  user_id: string
  amount: number
  method: string
  status: string
  requested_at: string
}

export interface MatrixNode {
  user_id: string
  position: number
  level: number
  full_name: string | null
  referral_code: string | null
  status: string | null
  pv_balance: number
  current_rank: string
  children: MatrixNode[]
}

export interface CommissionSettings {
  direct_referral_percent: number
  level_1_percent: number
  level_2_percent: number
  level_3_percent: number
  level_4_percent: number
}

export interface RankSettings {
  id: string
  rank_name: string
  required_pv: number
  required_direct_referrals: number
  commission_multiplier: number
  is_active: boolean
}
