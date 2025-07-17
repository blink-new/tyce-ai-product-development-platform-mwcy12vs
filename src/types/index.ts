export interface User {
  id: string
  email: string
  displayName?: string
  role: 'admin' | 'user' | 'certifying_body'
  createdAt: string
}

export interface Project {
  id: string
  name: string
  description?: string
  userId: string
  ingredients: Ingredient[]
  properties?: ProductProperties
  visualOutput?: VisualOutput
  suppliers?: SupplierInfo[]
  costAnalysis?: CostAnalysis
  certifications?: CertificationRequirement[]
  createdAt: string
  updatedAt: string
}

export interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  casNumber?: string
  function: string
}

export interface ProductProperties {
  viscosity: number
  color: string
  texture: string
  thickness: number
  expiryDate: string
  stability: number
  performance: number
  safetyScore: number
}

export interface VisualOutput {
  colorPreview: string
  textureImage?: string
  packagingMockup?: string
  videoPreview?: string
}

export interface SupplierInfo {
  id: string
  name: string
  location: string
  type: 'local' | 'international'
  ingredientId: string
  pricePerUnit: number
  currency: string
  minimumOrder: number
  leadTime: string
  rating: number
}

export interface CostAnalysis {
  totalProductionCost: number
  costPerUnit: number
  recommendedRetailPrice: number
  profitMargin: number
  currency: string
}

export interface CertificationRequirement {
  country: string
  authority: string
  requirements: string[]
  estimatedCost: number
  timeframe: string
  status: 'pending' | 'in_progress' | 'completed' | 'not_required'
}