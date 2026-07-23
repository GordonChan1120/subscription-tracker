export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export interface Subscription {
  id: string
  name: string
  service: string
  logo?: string
  price: number
  currency: string
  billingCycle: BillingCycle
  startDate: string
  nextPaymentDate: string
  category: string
  notes?: string
}

export interface EmailSubscription {
  id: string
  serviceName: string
  amount: number
  currency: string
  date: string
  sender: string
  subject: string
}

export const CATEGORIES = [
  'Streaming',
  'Music',
  'Productivity',
  'Cloud Storage',
  'Design',
  'Development',
  'News',
  'Fitness',
  'Gaming',
  'Other',
] as const

export const BILLING_CYCLES: BillingCycle[] = [
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
]
