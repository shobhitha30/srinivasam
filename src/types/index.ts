// ─── Core User Types ─────────────────────────────────────────────────────────

export type UserRole = 'public' | 'donor' | 'shelter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  pan?: string;
  address?: string;
  createdAt: string;
}

// ─── Orphanage / NGO Types ────────────────────────────────────────────────────

export type ShelterStatus = 'pending' | 'verified' | 'suspended' | 'rejected';

export interface KYCDocument {
  id: string;
  type: 'trust_deed' | '12a' | '80g' | 'fcra' | 'registration';
  label: string;
  status: 'uploaded' | 'verified' | 'pending' | 'expired';
  uploadedAt?: string;
  verifiedAt?: string;
  expiryDate?: string;
  fileUrl?: string;
}

export interface Orphanage {
  id: string;
  name: string;
  registrationNumber: string;
  city: string;
  state: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  childrenCount: number;
  staffCount: number;
  status: ShelterStatus;
  kycDocuments: KYCDocument[];
  totalFundingReceived: number;
  activeRequirementsCount: number;
  avatar?: string;
  description?: string;
  foundedYear?: number;
  createdAt: string;
  verifiedAt?: string;
}

// ─── Requirement / Need Types ─────────────────────────────────────────────────

export type RequirementCategory =
  | 'Groceries'
  | 'Education'
  | 'Medicines'
  | 'Hygiene'
  | 'Clothing'
  | 'Infrastructure'
  | 'Stationery'
  | 'Other';

export type RequirementPriority = 'urgent' | 'recurring' | 'standard';

export type RequirementStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'partially_funded'
  | 'fully_funded'
  | 'delivered'
  | 'rejected';

export interface RequirementItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  estimatedTotal: number;
}

export interface Requirement {
  id: string;
  orphanageId: string;
  orphanageName: string;
  orphanageCity: string;
  orphanageState: string;
  category: RequirementCategory;
  title: string;
  description?: string;
  items: RequirementItem[];
  totalAmount: number;
  fundedAmount: number;
  priority: RequirementPriority;
  status: RequirementStatus;
  deadline?: string;
  createdAt: string;
  approvedAt?: string;
  fulfilledAt?: string;
  aiSanityCheck?: {
    passed: boolean;
    message: string;
    expectedRange: { min: number; max: number };
  };
}

// ─── Donation Types ───────────────────────────────────────────────────────────

export type PaymentMode = 'upi' | 'card' | 'netbanking' | 'recurring';

export type DeliveryStatus =
  | 'payment_confirmed'
  | 'order_placed'
  | 'out_for_delivery'
  | 'delivered_verified';

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  requirementId: string;
  requirementTitle: string;
  orphanageId: string;
  orphanageName: string;
  amount: number;
  currency: 'INR';
  paymentMode: PaymentMode;
  transactionId: string;
  deliveryStatus: DeliveryStatus;
  requires80G: boolean;
  pan?: string;
  receiptUrl?: string;
  tipAmount?: number;
  processingFee: number;
  createdAt: string;
  updatedAt: string;
  deliveryProofId?: string;
}

// ─── Delivery Proof Types ─────────────────────────────────────────────────────

export interface GeoTag {
  lat: number;
  lng: number;
  accuracy: number;
  address: string;
}

export interface DeliveryProof {
  id: string;
  donationId: string;
  requirementId: string;
  orphanageId: string;
  beforePhotoUrl?: string;
  afterPhotoUrl: string;
  invoiceUrl?: string;
  geoTag: GeoTag;
  timestamp: string;
  verifiedByStaff: boolean;
  staffName?: string;
  thankYouNote?: string;
  vendorName?: string;
  vendorInvoiceNumber?: string;
}

// ─── Vendor / Dispatch Types ──────────────────────────────────────────────────

export type VendorType = 'blinkit' | 'zepto' | 'amazon' | 'local_grocer' | 'pharma';
export type DispatchStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'failed';

export interface VendorOrder {
  id: string;
  requirementId: string;
  orphanageName: string;
  vendorType: VendorType;
  vendorOrderId: string;
  items: RequirementItem[];
  totalAmount: number;
  status: DispatchStatus;
  estimatedDelivery?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Admin / Verification Types ───────────────────────────────────────────────

export type VerificationStage =
  | 'application_received'
  | 'documents_review'
  | 'verification_call'
  | 'headcount_audit'
  | 'approved'
  | 'rejected';

export interface VerificationRecord {
  id: string;
  orphanageId: string;
  orphanageName: string;
  stage: VerificationStage;
  assignedTo?: string;
  callScheduledAt?: string;
  notes?: string;
  submittedAt: string;
  updatedAt: string;
}

// ─── Filter / UI Types ────────────────────────────────────────────────────────

export interface FilterState {
  category: RequirementCategory | 'All';
  city: string;
  status: 'All' | 'active' | 'partially_funded' | 'fully_funded';
  search: string;
}

// ─── Stats Types ──────────────────────────────────────────────────────────────

export interface PlatformStats {
  totalRaised: number;
  verifiedShelters: number;
  childrenSupported: number;
  donationsCount: number;
  volunteersCount: number;
  successRate: number;
}
