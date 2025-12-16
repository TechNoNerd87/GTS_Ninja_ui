/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Client } from './client';
import { ServiceBank } from './service-bank';

export type ContractType =
  | 'warranty'
  | 'service_agreement'
  | 'maintenance'
  | 'support'
  | 'sla';

export type ContractStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'expired'
  | 'cancelled';

export type BillingFrequency =
  | 'monthly'
  | 'quarterly'
  | 'semi_annual'
  | 'annual';

export interface ContractItem {
  id: string;
  contract_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
  created_at: number;
  updated_at: number;
}

export interface ContractRenewal {
  id: string;
  contract_id: string;
  renewal_date: string;
  previous_end_date: string;
  new_end_date: string;
  notes: string;
  created_at: number;
}

export interface Contract {
  id: string;
  user_id: string;
  assigned_user_id: string;
  client_id: string;
  name: string;
  contract_number: string;
  contract_type: ContractType;
  status: ContractStatus;
  start_date: string;
  end_date: string;
  signed_date: string;
  cancelled_date: string;
  contract_value: number;
  recurring_amount: number;
  billing_frequency: BillingFrequency;
  next_billing_date: string;
  last_billing_date: string;
  // SLA - Hours tracking
  included_hours: number;
  used_hours: number;
  hourly_rate: number;
  // SLA - Response times
  response_time_hours: number;
  resolution_time_hours: number;
  // SLA - Coverage
  covers_parts: boolean;
  covers_labor: boolean;
  covers_travel: boolean;
  covers_emergency: boolean;
  // SLA - Discounts
  parts_discount_percent: number;
  labor_discount_percent: number;
  // Renewal settings
  auto_renew: boolean;
  renewal_notice_days: number;
  renewal_term_months: number;
  // Service Bank
  default_service_bank_id: string;
  // Notes
  description: string;
  terms_and_conditions: string;
  private_notes: string;
  public_notes: string;
  // Custom fields
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  client?: Client;
  items?: ContractItem[];
  renewals?: ContractRenewal[];
  service_banks?: ServiceBank[];
  default_service_bank?: ServiceBank;
  documents?: any[];
}
