// ==================== PRODUCT & INVENTORY ====================
export interface Product {
  id: string
  code: string
  name: string
  unit: string
  price: number
  costPrice: number // Giá nhập
  sellingPrice: number // Giá bán
  category?: string
  description?: string
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface InventoryItem {
  id: string
  productId: string
  productCode: string
  productName: string
  unit: string
  currentStock: number
  minStockLevel: number // Mức tồn kho tối thiểu - cảnh báo
  maxStockLevel: number // Mức tồn kho tối đa
  costPrice: number
  sellingPrice: number
  lastUpdated: string
  // Thông tin lô hàng
  batches?: InventoryBatch[]
}

export interface InventoryBatch {
  id: string
  batchNumber: string
  productId: string
  quantity: number
  manufactureDate?: string
  expiryDate?: string // Hạn sử dụng
  importDate: string
  importReceiptCode: string
  remainingQuantity: number
}

// ==================== SUPPLIER ====================
export interface Supplier {
  id: string
  code: string
  name: string
  address: string
  phone: string
  email?: string
  contactPerson?: string
  taxCode?: string
  status: 'active' | 'inactive'
  createdAt: string
}

// ==================== AGENCY ====================
export interface Agency {
  id: string
  code: string
  name: string
  address: string
  phone: string
  email?: string
  owner: string
  agencyType: 'level_1' | 'level_2'
  debtLimit: number
  currentDebt: number
  status: 'active' | 'inactive'
  // Thông tin vị trí
  district?: string
  city?: string
  latitude?: number
  longitude?: number
  deliveryZone?: string
  // Nhân viên phụ trách
  assignedStaffId?: string
  assignedStaffName?: string
  createdAt: string
}

// ==================== IMPORT (PHIẾU NHẬP KHO) ====================
export interface ImportReceipt {
  id: string
  code: string
  date: string
  supplierId: string
  supplierName: string
  purchaseOrderCode?: string // Mã đơn đặt hàng (nếu có)
  items: ImportReceiptItem[]
  totalAmount: number
  status: 'pending' | 'completed' | 'cancelled'
  note?: string
  createdBy: string
  createdAt: string
}

export interface ImportReceiptItem {
  id: string
  productId: string
  productCode: string
  productName: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
  batchNumber?: string
  expiryDate?: string
}

// ==================== EXPORT (PHIẾU XUẤT KHO) ====================
export interface ExportSlip {
  id: string
  code: string
  date: string
  agencyId: string
  agencyName: string
  agencyType: 'level_1' | 'level_2'
  items: ExportSlipItem[]
  totalAmount: number
  amountPaid: number
  remainingAmount: number
  status: 'pending' | 'approved' | 'delivering' | 'delivered' | 'cancelled'
  // Thông tin giao hàng
  deliveryAddress: string
  driverId?: string
  driverName?: string
  deliveryDate?: string
  deliveredAt?: string
  note?: string
  createdBy: string
  createdAt: string
}

export interface ExportSlipItem {
  id: string
  productId: string
  productCode: string
  productName: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
  // Kiểm tra tồn kho
  availableStock?: number
  batchNumber?: string
}

// ==================== PAYMENT (PHIẾU THU) ====================
export interface PaymentReceipt {
  id: string
  code: string
  date: string
  agencyId: string
  agencyName: string
  amount: number
  paymentMethod: 'cash' | 'bank_transfer' | 'other'
  status: 'pending' | 'completed' | 'cancelled'
  note?: string
  // Liên kết với phiếu xuất (nếu có)
  relatedExportSlipCodes?: string[]
  createdBy: string
  createdAt: string
}

// ==================== RETURN (PHIẾU TRẢ HÀNG) ====================
export interface ReturnSlip {
  id: string
  code: string
  date: string
  agencyId: string
  agencyName: string
  items: ReturnSlipItem[]
  totalAmount: number
  reason: 'damaged' | 'expired' | 'wrong_product' | 'quality_issue' | 'other'
  reasonDetail?: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  refundMethod?: 'cash' | 'credit' | 'exchange'
  refundAmount?: number
  // Phiếu xuất gốc
  originalExportSlipCode?: string
  createdBy: string
  createdAt: string
}

export interface ReturnSlipItem {
  id: string
  productId: string
  productCode: string
  productName: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
  condition: 'good' | 'damaged' | 'expired'
}

// ==================== DELIVERY (GIAO HÀNG) ====================
export interface Driver {
  id: string
  code: string
  fullName: string
  phone: string
  idCard: string
  vehicleType: 'motorcycle' | 'truck_small' | 'truck_medium' | 'truck_large'
  vehicleTypeLabel: string
  licensePlate: string
  areas: string[]
  status: 'available' | 'delivering' | 'off'
  statusLabel: string
  totalDeliveries: number
  createdAt: string
}

export interface DeliveryAssignment {
  id: string
  exportSlipId: string
  exportSlipCode: string
  driverId: string
  driverName: string
  driverPhone: string
  agencyId: string
  agencyName: string
  deliveryAddress: string
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed'
  assignedAt: string
  pickedUpAt?: string
  deliveredAt?: string
  failedReason?: string
  note?: string
}

// ==================== REGULATION ====================
export interface Regulation {
  id: string
  code: string
  value: number
  description: string
  lastUpdated: string
}

// ==================== PRICING POLICY ====================
export interface PricingPolicy {
  id: string
  productId: string
  productName: string
  agencyType: 'level_1' | 'level_2'
  basePrice: number
  discountPercent: number
  finalPrice: number
  minQuantityForDiscount?: number
  validFrom: string
  validTo?: string
  isActive: boolean
}

// ==================== REPORT ====================
export interface Report {
  id: string
  code: string
  title: string
  type: 'revenue' | 'debt' | 'inventory' | 'sales'
  typeLabel: string
  periodFrom: string
  periodTo: string
  status: 'draft' | 'completed'
  createdBy: string
  createdAt: string
}

// ==================== USER & ACCOUNT ====================
export interface User {
  id: string
  code: string
  username: string
  fullName: string
  email: string
  phone: string
  role: 'admin' | 'staff' | 'agency'
  status: 'active' | 'inactive' | 'pending'
  // Nếu là staff
  assignedAgencies?: string[]
  // Nếu là agency
  agencyId?: string
  createdAt: string
}

// ==================== STOCK ALERT ====================
export interface StockAlert {
  id: string
  productId: string
  productCode: string
  productName: string
  currentStock: number
  minStockLevel: number
  alertType: 'low_stock' | 'out_of_stock' | 'near_expiry' | 'expired' | 'expiring_soon'
  alertMessage: string
  isRead: boolean
  createdAt: string
  // Thông tin hạn sử dụng
  batchNumber?: string
  expiryDate?: string
  daysUntilExpiry?: number
}

// ==================== COMMON TYPES ====================
export type StatusType = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'

export interface PaginationParams {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: PaginationParams
}
